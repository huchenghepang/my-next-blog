"use client";

import {
  reqConversationsList,
  reqCreateConversation,
  reqDeleteConversation,
  reqGenerateConversationTitle,
  reqHistoryMessageAndConversation,
} from "@/api/chat/conversation";
import LoginModal from "@/components/auth/LoginModal";
import ChatInput from "@/components/chat/ChatInput";
import ConversationList from "@/components/chat/ConversationList";
import ThemeMuiToggle from "@/components/ThemeMuiToggle";
import { useAuthStore } from "@/store/authStore";
import "@/styles/scrollbar.css";
import { useConfirm } from "material-ui-confirm";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Message, useSSEChat } from "./chat";

function ChatPage() {
  const [input, setInput] = useState("");
  const [showThinking, setShowThinking] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentConvId, setCurrentConvId] = useState<string | null>(null);
  const [tempConvId, setTempConvId] = useState<string | null>(null); // 用于临时会话
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0); // 用于强制刷新会话列表

  const {
    isAuthenticated,
    userInfo: user,
    logout,
  } = useAuthStore((state) => state);

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    stopGeneration,
    clearMessages,
    newSession,
    setMessages,
  } = useSSEChat("/api/chat/completion");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 监听消息变化，当AI回复达到3的倍数但小于15次时，自动生成标题
  useEffect(() => {
    if (!currentConvId || !isAuthenticated) return;

    // 计算AI回复的数量（assistant角色的消息）
    const aiMessageCount = messages.filter(
      (msg) => msg.role === "assistant",
    ).length;

    // 当AI回复数量达到3的倍数且小于15时，生成标题
    if (
      aiMessageCount >= 3 &&
      aiMessageCount < 15 &&
      aiMessageCount % 3 === 0
    ) {
      // 检查是否已经为当前会话生成过这个数量级别的标题
      const titleGeneratedKey = `${currentConvId}_${aiMessageCount}`;
      if (!localStorage.getItem(titleGeneratedKey)) {
        // 延迟执行，确保消息完全接收后再生成标题
        const timer = setTimeout(() => {
          generateConversationTitle();
          // 标记当前会话的这个数量级别标题已生成
          localStorage.setItem(titleGeneratedKey, "true");
        }, 1000);

        return () => clearTimeout(timer);
      }
    }
  }, [messages, currentConvId, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // 检查是否是第一次发送消息，如果是则创建新会话
    let sessionId = currentConvId;
    if (!sessionId) {
      // 这是第一次发送消息，需要创建会话
      try {
        const conversation = await reqCreateConversation({
          title: input.substring(0, 30) + (input.length > 30 ? "..." : ""), // 使用第一条消息的前30个字符作为标题
        });
        sessionId = conversation.id;
        setCurrentConvId(sessionId); // 更新当前会话ID
        // 如果存在临时会话ID，则清除它
        if (tempConvId) {
          setTempConvId(null);
        }
      } catch (error) {
        console.error("创建会话失败:", error);
        return; // 如果创建会话失败，则不发送消息
      }
    }

    sendMessage(input, {
      model: "deepseek-v4-flash",
      chat_session_id: sessionId ?? undefined,
      thinking_enabled: showThinking,
      search_enabled: false,
    });
    setInput("");
  };

  // Markdown 渲染组件
  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      const codeString = String(children).replace(/\n$/, "");

      const handleCopyCode = () => {
        navigator.clipboard
          .writeText(codeString)
          .then(() => {
            // 使用 react-toastify 显示成功通知
            if (typeof window !== "undefined") {
              import("react-toastify").then((module) => {
                module.toast.success("代码已复制到剪贴板");
              });
            }
          })
          .catch((err) => {
            console.error("代码复制失败:", err);
            if (typeof window !== "undefined") {
              import("react-toastify").then((module) => {
                module.toast.error("代码复制失败");
              });
            }
          });
      };

      return !inline && match ? (
        <div className="relative group">
          {/* 语言标签显示 */}
          <div className="absolute top-1.5 left-2 text-xs px-2 py-1 rounded-md bg-gray-700 text-gray-200">
            {match[1]}
          </div>
          <div className="absolute top-1.5 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopyCode}
              className="p-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md text-xs transition-colors"
              title="复制代码"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
            className="rounded-md text-sm mt-6" /* 添加上边距为标签留出空间 */
            {...props}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code
          className={`${className} bg-gray-300/80 dark:bg-gray-700/80 px-1 py-0.5 rounded text-sm`}
          {...props}
        >
          {children}
        </code>
      );
    },
  };

  // 创建新会话 - 匿名用户也可使用（临时会话）
  const handleNewConversation = async () => {
    // 清理当前会话的标题生成标记
    if (currentConvId) {
      for (let i = 3; i < 15; i += 3) {
        const titleGeneratedKey = `${currentConvId}_${i}`;
        localStorage.removeItem(titleGeneratedKey);
      }
    }

    clearMessages();
    // 创建一个临时会话ID，用于前端标识
    const newTempId = `temp_${Date.now()}`;
    setTempConvId(newTempId);
    setCurrentConvId(null); // 实际会话ID设为null，直到发送第一条消息
    newSession();
  };

  // 生成对话标题
  const generateConversationTitle = async () => {
    if (!currentConvId || !isAuthenticated) return;

    try {
      // 获取最近的几条消息作为上下文
      const recentMessages = messages.slice(-6); // 获取最近6条消息
      if (recentMessages.length === 0) return;

      // 提取对话的主要主题，优先考虑用户问题
      let title = "";
      const userMessages = recentMessages.filter((msg) => msg.role === "user");

      if (userMessages.length > 0) {
        // 使用最后一个用户问题的前几个词作为标题基础
        const lastUserMessage = userMessages[userMessages.length - 1].content;
        title = lastUserMessage.substring(0, 30).trim();

        // 如果标题太短，尝试找到更长的相关片段
        if (title.length < 10) {
          const firstUserMessage = userMessages[0].content;
          title = firstUserMessage.substring(0, 30).trim();
        }
      } else {
        // 如果没有用户消息，使用AI回复的片段
        const aiMessages = recentMessages.filter(
          (msg) => msg.role === "assistant",
        );
        if (aiMessages.length > 0) {
          title = aiMessages[0].content.substring(0, 30).trim();
        }
      }

      // 确保标题不为空
      if (!title) {
        title = "新对话";
      } else if (title.length >= 30) {
        title = title + "...";
      }

      // 由于标题生成可能需要一些时间，我们使用setTimeout在后台执行
      // 这样即使请求超时也不会影响用户体验
      setTimeout(async () => {
        try {
          await reqGenerateConversationTitle(currentConvId, {
            title: title,
            isAiGenerated: true,
          });

          console.log(`会话 ${currentConvId} 的标题已更新为: "${title}"`);

          // 更新浏览器标签页标题
          document.title = `${title} - World AI`;

          // 刷新会话列表以显示新标题
          refreshConversations();
        } catch (error) {
          console.error("更新会话标题失败:", error);
          // 标题更新失败不影响主要功能
        }
      }, 100); // 延迟100毫秒执行，避免阻塞主线程
    } catch (error) {
      console.error("更新会话标题失败:", error);
      // 即使更新失败，也要继续，不要影响主要功能
    }
  };

  // 刷新会话列表
  const refreshConversations = async () => {
    if (isAuthenticated) {
      try {
        const res = await reqConversationsList({ page: 1, pageSize: 50 });
        // 更新刷新触发器，强制 ConversationList 重新获取数据
        setRefreshTrigger((prev) => prev + 1);
        console.log("会话列表已刷新");
      } catch (err) {
        console.warn("刷新会话列表失败", err);
      }
    }
  };

  // 复制单条消息
  const copyMessage = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        // 使用 react-toastify 显示成功通知
        if (typeof window !== "undefined") {
          // 动态导入 toast 以避免服务端渲染问题
          import("react-toastify").then((module) => {
            module.toast.success("消息已复制到剪贴板");
          });
        }
      })
      .catch((err) => {
        console.error("复制失败:", err);
        // 降级处理：使用老式方法
        try {
          const textArea = document.createElement("textarea");
          textArea.value = content;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);

          // 使用 react-toastify 显示成功通知
          if (typeof window !== "undefined") {
            import("react-toastify").then((module) => {
              module.toast.success("消息已复制到剪贴板");
            });
          }
        } catch (fallbackErr) {
          console.error("降级复制也失败:", fallbackErr);
          if (typeof window !== "undefined") {
            import("react-toastify").then((module) => {
              module.toast.error("复制失败，请手动选择文本进行复制");
            });
          }
        }
      });
  };

  // 复制整个对话内容
  const copyConversation = () => {
    if (messages.length === 0) {
      if (typeof window !== "undefined") {
        import("react-toastify").then((module) => {
          module.toast.warn("没有内容可复制");
        });
      }
      return;
    }

    // 格式化对话内容
    const conversationText = messages
      .map((msg) => {
        const role = msg.role === "user" ? "用户" : "AI";
        return `${role}: ${msg.content}`;
      })
      .join("\n\n");

    navigator.clipboard
      .writeText(conversationText)
      .then(() => {
        // 使用 react-toastify 显示成功通知
        if (typeof window !== "undefined") {
          // 动态导入 toast 以避免服务端渲染问题
          import("react-toastify").then((module) => {
            module.toast.success("对话内容已复制到剪贴板");
          });
        }
      })
      .catch((err) => {
        console.error("复制失败:", err);
        // 降级处理：使用老式方法
        try {
          const textArea = document.createElement("textarea");
          textArea.value = conversationText;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);

          // 使用 react-toastify 显示成功通知
          if (typeof window !== "undefined") {
            import("react-toastify").then((module) => {
              module.toast.success("对话内容已复制到剪贴板");
            });
          }
        } catch (fallbackErr) {
          console.error("降级复制也失败:", fallbackErr);
          if (typeof window !== "undefined") {
            import("react-toastify").then((module) => {
              module.toast.error("复制失败，请手动选择文本进行复制");
            });
          }
        }
      });
  };

  // 选择会话 - 匿名用户可切换（需后端支持匿名历史或临时存储）
  const handleSelectConversation = async (id: string) => {
    setCurrentConvId(id);

    // 清理之前的会话相关本地存储标记
    const previousConvId = currentConvId;
    if (previousConvId) {
      // 清理之前会话的所有标题生成标记
      for (let i = 3; i < 15; i += 3) {
        const titleGeneratedKey = `${previousConvId}_${i}`;
        localStorage.removeItem(titleGeneratedKey);
      }
    }

    // 加载该会话的历史消息（匿名/登录态通用逻辑）
    try {
      const { messages } = await reqHistoryMessageAndConversation({
        conversation_id: id,
      });
      const chatMessages: Message[] = messages.map((message) => {
        return {
          id: message.id,
          content: message.content,
          reasoningContent: message.reasoningContent,
          role: message.role.toLowerCase() as Message["role"],
          timestamp: new Date(message.updatedAt).getTime(), // 修复：使用 getTime() 而不是 getMilliseconds()
        };
      });
      setMessages(chatMessages);
    } catch (error) {
      console.error("加载会话历史失败:", error);
    }
  };
  const confirm = useConfirm();
  // 删除会话 - 仅登录用户可操作持久化会话，匿名用户仅清空本地
  const handleDeleteConversation = async (id: string) => {
    const frag = await confirm({
      title: "确认删除会话吗？",
      description: "删除之后无法恢复",
      confirmationText: "确认删除",
      cancellationText: "取消",
    });
    if (!frag.confirmed) return;

    // 检查是否是临时会话（尚未创建到后端）
    if (id.startsWith("temp_")) {
      // 这是临时会话，只需清空本地状态
      if (id === tempConvId) {
        handleNewConversation();
      }
      return;
    }

    if (!isAuthenticated) {
      // 匿名用户仅清空本地状态
      if (id === currentConvId) {
        handleNewConversation();
      }
      return;
    }
    try {
      await reqDeleteConversation(id); // 登录用户调用后端删除
      if (id === currentConvId) {
        handleNewConversation();
      }
    } catch (err) {
      console.error("删除会话失败", err);
    }
  };

  return (
    <div className="flex h-screen ">
      {/* ✅ 登录模态框 - 按需弹出，非强制 */}
      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          // 登录成功后可刷新会话列表、合并匿名历史等
        }}
      />

      {/* ✅ 侧边栏 - 匿名用户显示简化版 */}
      <ConversationList
        onSelect={handleSelectConversation}
        onCreateNew={handleNewConversation}
        onDelete={handleDeleteConversation}
        isAuthenticated={isAuthenticated}
        currentUser={user}
        tempConversations={
          tempConvId
            ? [
                {
                  id: tempConvId,
                  title: "新会话",
                  createdAt: new Date().toISOString(),
                },
              ]
            : []
        }
        onRefresh={refreshConversations}
        refreshTrigger={refreshTrigger}
      />

      {/* ✅ 主聊天区 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部导航栏 */}
        <header className=" sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">WA</span>
              </div>
              <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                World AI
              </h1>
              <span className="text-xs  px-2 py-0.5 rounded-full">Beta</span>
            </div>

            <div className="flex items-center gap-2">
              <ThemeMuiToggle />

              {/* 复制对话按钮 - 仅在有消息时显示 */}
              {messages.length > 0 && (
                <button
                  onClick={copyConversation}
                  className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-400 hover:bg-gray-800 rounded-lg transition-colors"
                  title="复制对话"
                >
                  📋
                </button>
              )}

              {/* 登录状态按钮 */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 hidden sm:inline">
                    👋 {user?.username || user?.account}
                  </span>
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    退出
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-4 py-1.5 text-sm bg-sky-500 hover:bg-sky-300 text-white  rounded-lg transition-colors"
                  title="登录可同步历史记录"
                >
                  登录
                </button>
              )}

              {/* 其他操作按钮 */}
              <button
                onClick={handleNewConversation}
                className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-400 hover:bg-gray-800 rounded-lg transition-colors"
                title="新会话"
              >
                ✨
              </button>
            </div>
          </div>
        </header>

        {/* 消息区域 */}
        <div className="flex-1 overflow-y-auto custom-scroll">
          <div className="max-w-3xl mx-auto px-4 py-6">
            {messages.length === 0 ? (
              // 欢迎界面
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">🤖</span>
                </div>
                <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  World AI
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  由AI创造World，随时为您解答问题
                </p>

                {/* 未登录时显示轻量引导，非强制 */}
                {!isAuthenticated && (
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="px-5 py-2 bg-sky-500 hover:bg-sky-300 text-white rounded-xl text-sm font-medium transition-colors"
                    >
                      🔐 登录
                    </button>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      或直接在下方开始对话
                    </span>
                  </div>
                )}

                {/* 建议问题 - 匿名用户可直接点击使用 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg">
                  {[
                    "帮我解释量子计算的基本原理",
                    "写一篇关于人工智能的短文",
                    "分析这段代码的性能问题",
                    "推荐几本经典的技术书籍",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setInput(suggestion);
                        // 直接触发发送逻辑
                        setTimeout(() => {
                          handleSubmit(new Event("submit") as any);
                        }, 0);
                      }}
                      className="text-left px-4 py-3 rounded-xl text-sm transition-colors border bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // 消息列表
              <div className="space-y-6 ">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} relative group/message`}
                  >
                    <div
                      className={`max-w-[85%] ${
                        msg.role === "user"
                          ? "bg-[#99b1dd] text-[#0f1115]  backdrop-blur-sm rounded-2xl rounded-br-md"
                          : " dark:bg-gray-800/90 dark:text-slate-50 backdrop-blur-sm rounded-2xl rounded-tl-md shadow-sm"
                      } px-4 py-3`}
                    >
                      {/* 消息操作按钮 - 仅在悬停时显示 */}
                      <div className="absolute -top-6 right-2 opacity-0 group-hover/message:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={() => copyMessage(msg.content)}
                          className="p-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md text-xs transition-colors"
                          title="复制消息"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="9"
                              y="9"
                              width="13"
                              height="13"
                              rx="2"
                              ry="2"
                            ></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                        </button>
                      </div>

                      {/* 思考过程 */}
                      {msg.role === "assistant" &&
                        msg.reasoningContent &&
                        showThinking && (
                          <details className="mb-3 text-sm">
                            <summary className="cursor-pointer  font-medium text-xs uppercase tracking-wide dark:text-slate-300">
                              📝 思考过程
                            </summary>
                            <div className="mt-2 p-3 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg  dark:text-gray-300 text-xs whitespace-pre-wrap border border-gray-300/50 dark:border-gray-700/50">
                              {msg.reasoningContent}
                            </div>
                          </details>
                        )}

                      {/* 消息内容 */}
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown components={MarkdownComponents}>
                            {msg.content ||
                              (isLoading && !msg.content ? "▊" : "")}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {msg.content}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {/* 打字指示器 */}
                {isLoading &&
                  messages[messages.length - 1]?.role === "assistant" && (
                    <div className="flex justify-start">
                      <div className="  backdrop-blur-sm rounded-2xl rounded-tl-md px-4 py-3">
                        <div className="flex gap-1">
                          {[0, 150, 300].map((delay) => (
                            <span
                              key={delay}
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: `${delay}ms` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                {/* 错误提示 */}
                {error && (
                  <div className=" border border-red-200 dark:border-red-500/30 rounded-xl p-4 text-center">
                    <p className=" dark:text-red-400 text-sm">
                      ⚠️ {error.message}
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-2 text-sm text-red-500 dark:text-red-400 underline hover:text-red-600 dark:hover:text-red-300"
                    >
                      重试
                    </button>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* 输入区域 */}
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={(msg, options) => {
            // 统一走 handleSubmit，不再检查登录状态
            handleSubmit(new Event("submit") as any);
          }}
          onStop={stopGeneration}
          thinkingEnabled={showThinking}
          onThinkingChange={setShowThinking}
          isLoading={isLoading}
          placeholder={
            isAuthenticated ? "输入消息..." : "未登录模式 · 输入消息开始对话"
          }
        />

        {/* 底部匿名提示 */}
        {!isAuthenticated && messages.length > 0 && (
          <div className="px-4 py-2 text-center">
            <span className="text-xs text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-800/50 px-3 py-1 rounded-full">
              💡 未登录状态下，对话记录仅保存在当前设备，刷新页面后可能丢失
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;