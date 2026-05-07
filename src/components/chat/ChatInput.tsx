"use client";

import { useEffect, useRef, useState } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (
    message: string,
    options: { thinking_enabled: boolean; search_enabled: boolean },
  ) => void;
  isLoading?: boolean;
  onStop?: () => void;
  thinkingEnabled?: boolean;
  onThinkingChange?: (value: boolean) => void;
  placeholder?: string;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  isLoading = false,
  onStop,
  thinkingEnabled: controlledThinking,
  onThinkingChange,
  placeholder = "给 AI 发送消息",
}: ChatInputProps) {
  const [localThinking, setLocalThinking] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const thinkingEnabled = controlledThinking ?? localThinking;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleSubmit = () => {
    if (!value.trim() || isLoading) return;

    onSend(value.trim(), {
      thinking_enabled: thinkingEnabled,
      search_enabled: searchEnabled,
    });
    onChange("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleThinkingToggle = () => {
    const newValue = !thinkingEnabled;
    if (onThinkingChange) {
      onThinkingChange(newValue);
    } else {
      setLocalThinking(newValue);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 backdrop-blur custom-scroll">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* 输入框容器 */}
        <div
          className="relative 
          bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 
          focus-within:border-amber-500/50 focus-within:ring-2 focus-within:ring-amber-500/20 
          transition-all duration-200 pb-8 shadow-sm"
        >
          {/* 文本输入区 */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            rows={1}
            className="w-full bg-transparent px-4 pt-4 pb-16 text-gray-900 dark:text-gray-100 
            placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none resize-none 
            disabled:opacity-50 text-sm min-h-[56px] max-h-[200px]"
          />

          {/* 底部控制栏 */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2">
            {/* 左侧：功能按钮 */}
            <div className="flex items-center gap-2">
              {/* 深度思考按钮 */}
              <button
                type="button"
                onClick={handleThinkingToggle}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  thinkingEnabled
                    ? "bg-purple-50 dark:bg-purple-600/20 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-600/30"
                    : "bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600/50 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-300"
                }`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                深度思考
              </button>

              {/* 智能搜索按钮 */}
              <button
                type="button"
                onClick={() => setSearchEnabled(!searchEnabled)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  searchEnabled
                    ? "bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-600/30"
                    : "bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600/50 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-300"
                }`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                智能搜索
              </button>
            </div>

            {/* 右侧：附件和发送按钮 */}
            <div className="flex items-center gap-2">
              {/* 附件按钮 */}
              <button
                type="button"
                disabled={isLoading}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 
                hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors 
                disabled:opacity-50 disabled:cursor-not-allowed"
                title="添加附件"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </button>

              {/* 发送/停止按钮 */}
              {isLoading ? (
                <button
                  type="button"
                  onClick={onStop}
                  className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 
                  text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  title="停止生成"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect x="6" y="6" width="12" height="12" strokeWidth={2} />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!value.trim()}
                  className="p-2 bg-amber-500 dark:bg-amber-600 hover:bg-amber-600 dark:hover:bg-amber-700 
                  disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 
                  text-white rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                  title="发送消息"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 提示信息 */}
        <p className="flex items-center justify-center gap-1 text-xs text-gray-400 dark:text-gray-500 text-center mt-3">
          <svg
            className="w-3 h-3 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>AI 生成内容可能存在误差，请谨慎参考</span>
        </p>
      </div>
    </div>
  );
}
