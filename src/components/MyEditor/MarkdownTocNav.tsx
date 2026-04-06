"use client";

import MarkdownNavbar from "markdown-navbar";
import { useState } from "react";
export function MarkdownTocNav({ context }: { context?: string }) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div
      className={`fixed min-w-52 custom-scrollbar left-0  bg-white shadow-lg rounded-lg max-md:pb-4 border border-gray-300 dark:bg-[#1e1e1e] dark:border-gray-700 z-10 h-screen overflow-auto transition-transform duration-300 ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      } md:block`}
    >
      {context ? (
        <MarkdownNavbar ordered={false} source={context} />
      ) : (
        <div>暂无目录</div>
      )}
    </div>
  );
}
