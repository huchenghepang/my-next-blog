"use client";
import { useCallback, useRef, useState } from "react";
import * as z from "zod";

// ============ 类型定义 ============
const ModelSchema = z.enum([
  "deepseek-chat",
  "deepseek-coder",
  "deepseek-math",
  "deepseek-r1",
  "deepseek-reasoner",
  "deepseek-v2",
  "deepseek-v3",
  "deepseek-v4-flash",
  "deepseek-v4-pro",
  "deepseek-vision",
]);
type Model = z.infer<typeof ModelSchema>;

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  reasoningContent?: string | null; // DeepSeek 思考链
  timestamp: number;
}

// ============ 自定义 SSE Hook ============
export function useSSEChat(apiUrl: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  // 生成临时 ID（等待后端返回真实 ID 后替换）
  const generateTempId = () =>
    `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  // 发送消息
  // 发送消息
  const sendMessage = useCallback(
    async (
      prompt: string,
      options?: {
        model?: Model;
        thinking_enabled?: boolean;
        search_enabled?: boolean;
        chat_session_id?: string | null;
      },
    ) => {
      if (!prompt.trim() || isLoading) return;

      // 生成临时用户消息 ID
      const tempUserId = generateTempId();

      // 添加用户消息
      const userMessage: Message = {
        id: tempUserId,
        role: "user",
        content: prompt,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMessage]);

      setIsLoading(true);
      setError(null);

      // 取消之前的请求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        // 构建请求体（符合你的 RequestSchema）
        const requestBody = {
          prompt: prompt,
          chat_session_id:
            options?.chat_session_id || sessionIdRef.current || undefined,
          model: options?.model || "deepseek-v4-flash",
          thinking_enabled: options?.thinking_enabled || false,
          search_enabled: options?.search_enabled || false,
          preempt: false,
          parent_message_id: null,
          ref_file_ids: null,
          service_id: null,
        };

        console.log("发送请求:", requestBody);

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream", // ✅ 关键：告诉后端期望流式响应
            "Cache-Control": "no-cache", // ✅ 禁用缓存
            Connection: "keep-alive", // ✅ 保持连接
          },
          body: JSON.stringify(requestBody),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // 检查响应类型
        const contentType = response.headers.get("Content-Type");
        console.log("响应 Content-Type:", contentType);

        // 更新 session_id（如果后端在响应头中返回）
        const newSessionId = response.headers.get("X-Session-Id");
        if (newSessionId) {
          sessionIdRef.current = newSessionId;
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error("无法读取响应流");

        let fullContent = "";
        let fullReasoning = "";
        let buffer = "";
        let assistantMessageId: string | null = null;
        let userMessageIdUpdated = false;
        let aiMessageCreated = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            // 跳过空行
            if (!line.trim()) continue;

            // SSE 格式：data: {...}
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") {
                console.log("流式响应结束");
                continue;
              }

              try {
                const chunk = JSON.parse(data);
                console.log("收到 chunk:", chunk);

                // ========== 处理元数据消息（后端自定义的 meta chunk） ==========
                if (chunk.object === "chat.completion.meta") {
                  // 获取消息 ID
                  if (chunk.message_id && !assistantMessageId) {
                    assistantMessageId = chunk.message_id;
                    console.log("获取到消息 ID:", assistantMessageId);
                  }

                  // 如果后端返回了用户消息的 ID，更新用户消息
                  if (chunk.user_message_id && !userMessageIdUpdated) {
                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === tempUserId
                          ? { ...msg, id: chunk.user_message_id }
                          : msg,
                      ),
                    );
                    userMessageIdUpdated = true;
                  }

                  // 更新 session_id
                  if (chunk.chat_session_id) {
                    sessionIdRef.current = chunk.chat_session_id;
                    console.log("更新 session_id:", chunk.chat_session_id);
                  }
                  continue;
                }

                // ========== 处理标准的 OpenAI chunk ==========
                const delta = chunk.choices?.[0]?.delta;
                const contentDelta = delta?.content;
                const reasoningDelta = delta?.reasoning_content;
                const chunkId = chunk.id;

                // 创建 AI 消息（第一次收到内容时）
                if (
                  !aiMessageCreated &&
                  (contentDelta !== undefined || reasoningDelta !== undefined)
                ) {
                  // 优先使用后端返回的 message_id，否则用 chunk.id，最后用临时 ID
                  const finalMessageId =
                    assistantMessageId || chunkId || generateTempId();

                  setMessages((prev) => [
                    ...prev,
                    {
                      id: finalMessageId,
                      role: "assistant",
                      content: "",
                      reasoningContent: "",
                      timestamp: Date.now(),
                    },
                  ]);
                  aiMessageCreated = true;
                  console.log("创建 AI 消息, ID:", finalMessageId);

                  // 更新 assistantMessageId
                  if (!assistantMessageId && finalMessageId) {
                    assistantMessageId = finalMessageId;
                  }
                }

                // 累积内容
                if (contentDelta) {
                  fullContent += contentDelta;
                  // 实时更新 UI
                  if (assistantMessageId) {
                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === assistantMessageId
                          ? { ...msg, content: fullContent }
                          : msg,
                      ),
                    );
                  }
                }

                if (reasoningDelta) {
                  fullReasoning += reasoningDelta;
                  if (assistantMessageId) {
                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === assistantMessageId
                          ? { ...msg, reasoningContent: fullReasoning }
                          : msg,
                      ),
                    );
                  }
                }
              } catch (e) {
                console.error("解析 chunk 失败:", e, data);
              }
            } else if (line.startsWith(": ")) {
              // SSE 注释行（心跳），忽略
              console.log("SSE 心跳:", line);
            } else {
              // 其他格式，打印以便调试
              console.log("其他格式:", line);
            }
          }
        }

        console.log("流式完成，完整内容长度:", fullContent.length);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          console.log("请求已取消");
        } else {
          const errorObj = err instanceof Error ? err : new Error(String(err));
          setError(errorObj);
          console.error("请求失败:", errorObj);
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [apiUrl, isLoading],
  );

  // 停止生成
  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  }, []);

  // 清空消息
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    sessionIdRef.current = null;
  }, []);

  // 创建新会话
  const newSession = useCallback(() => {
    sessionIdRef.current = null;
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    stopGeneration,
    clearMessages,
    newSession,
    setMessages,
  };
}
