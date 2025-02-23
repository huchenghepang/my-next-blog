"use client";

import { useState } from "react";
import { BiCheck, BiChevronDown, BiChevronUp, BiCopy } from "react-icons/bi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import './codeblock.scss';
interface CodeBlockProps {
  className?: string;
  inline?: boolean;
  children: React.ReactNode;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  className,
  inline,
  children,
}) => {
  const match = /language-(\w+)/.exec(className || "");
  const [isShowCode, setIsShowCode] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  return !inline && match ? (
    <div className="relative custom-scrollbar my-4 rounded-lg overflow-hidden border border-gray-700">
      {/* 代码块工具栏 */}
      <div className="flex items-center justify-between px-4 py-1 bg-gray-800 text-white text-sm rounded-t-lg">
        <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          {match[1]}
        </span>
        <div className="flex items-center gap-0.5">
          {/* 折叠代码按钮 */}
          <button
            onClick={() => setIsShowCode(!isShowCode)}
            className="flex items-center gap-1 px-3  text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-md transition-all duration-200 ease-in-out"
          >
            {isShowCode ? (
              <BiChevronUp size={16} />
            ) : (
              <BiChevronDown size={16} />
            )}
            <span className="text-sm bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              {isShowCode ? "折叠" : "展开"}
            </span>
          </button>

          {/* 复制代码按钮 */}
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 px-3  text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-md transition-all duration-200 ease-in-out"
          >
            {isCopied ? (
              <BiCheck size={16} className="text-green-400" />
            ) : (
              <BiCopy size={16} />
            )}
            <span className="text-sm bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              {isCopied ? "已复制" : "复制"}
            </span>
          </button>
        </div>
      </div>

      {/* 代码块 */}
      {isShowCode && (
        <SyntaxHighlighter
          style={dracula}
          showLineNumbers
          language={match[1]}
          className="!m-0 !p-4 !rounded-none"
        >
          {String(children).replace(/\n$/, "")} 
        </SyntaxHighlighter>
      )}
    </div>
  ) : (
    <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
      {children} 
    </code>
  );
};

export default CodeBlock;
