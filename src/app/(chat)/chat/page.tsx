"use client";

import {
  reqCreateConversation,
  reqDeleteConversation,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    sendMessage(input, {
      model: "deepseek-v4-flash",
      chat_session_id: currentConvId ?? undefined,
      thinking_enabled: showThinking,
      search_enabled: false,
    });
    setInput("");
  };

  // Markdown 渲染组件
  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          className="rounded-md text-sm"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
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
    clearMessages();
    if (!isAuthenticated) {
      setCurrentConvId(null);
    }
    {
      try {
        const conversation = await reqCreateConversation({
          title: "新会话",
        });
        setCurrentConvId(conversation.id);
      } catch (error) {
        setCurrentConvId(null);
      }
    }
    newSession();
  };

  // 选择会话 - 匿名用户可切换（需后端支持匿名历史或临时存储）
  const handleSelectConversation = async (id: string) => {
    setCurrentConvId(id);
    // TODO: 加载该会话的历史消息（匿名/登录态通用逻辑）
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
          timestamp: new Date(message.updatedAt).getMilliseconds(),
        };
      });
      setMessages(chatMessages);
    } catch (error) {}
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
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] ${
                        msg.role === "user"
                          ? "bg-[#99b1dd] text-[#0f1115]  backdrop-blur-sm rounded-2xl rounded-br-md"
                          : " dark:bg-gray-800/90 dark:text-slate-50 backdrop-blur-sm rounded-2xl rounded-tl-md shadow-sm"
                      } px-4 py-3`}
                    >
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
