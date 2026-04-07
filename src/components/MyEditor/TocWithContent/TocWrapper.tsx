"use client";

import type { HeadList } from "@/types/custom-editor";
import { useEffect, useState } from "react";
import TableOfContents from "./TocWithContent";

interface TocWrapperProps {
  /** 要解析的 HTML 容器的 ID */
  containerId: string;
  /** 最小标题层级，默认从 h2 开始 */
  minLevel?: number;
  /** 自定义渲染 */
  children?: (toc: HeadList[]) => React.ReactNode;
}

/**
 * 从 HTML 元素中提取目录结构
 */
function extractHeadingsFromContainer(
  containerId: string,
  minLevel: number = 2,
): HeadList[] {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`TocWrapper: 未找到 ID 为 "${containerId}" 的元素`);
    return [];
  }

  const headings: HeadList[] = [];
  const elements = container.querySelectorAll("h1, h2, h3, h4, h5, h6");

  let lineCounter = 1;

  elements.forEach((el) => {
    const tagName = el.tagName.toLowerCase();
    const level = parseInt(tagName[1]) as 1 | 2 | 3 | 4 | 5 | 6;

    // 过滤低于最小层级的标题
    if (level < minLevel) return;

    // 获取文本内容
    const text = el.textContent?.trim() || "";
    if (!text) return;

    // 确保元素有 id，如果没有则生成一个
    if (!el.id) {
      const id = generateHeaderId(lineCounter);
      el.id = id;
    }

    headings.push({
      text,
      level,
      line: lineCounter++,
    });
  });

  return headings;
}

/**
 * 生成标题 ID
 */
function generateHeaderId(line: number): string {
  // 如果 slug 不为空，使用 slug，否则使用 line
  return `header-${line}`;
}

/**
 * 目录包装组件
 * 从指定的 HTML 容器中提取目录结构，并传递给 TableOfContents
 *
 * @example
 * // 基础用法
 * <TocWrapper containerId="article-content" />
 *
 * @example
 * // 配合 ReactMarkdown 使用
 * <div>
 *   <TocWrapper containerId="article-preview" minLevel={2} />
 *   <div id="article-preview">
 *     <ReactMarkdown>{content}</ReactMarkdown>
 *   </div>
 * </div>
 *
 * @example
 * // 自定义渲染
 * <TocWrapper containerId="article-content">
 *   {(toc) => <CustomToc toc={toc} />}
 * </TocWrapper>
 */
export default function TocWrapper({
  containerId,
  minLevel = 2,
  children,
}: TocWrapperProps) {
  const [toc, setToc] = useState<HeadList[]>([]);
  const [isReady, setIsReady] = useState(false);

  const extractToc = () => {
    const extracted = extractHeadingsFromContainer(containerId, minLevel);
    setToc(extracted);
    setIsReady(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      extractToc();
    }, 100);

    return () => clearTimeout(timer);
  }, [containerId, minLevel]);

  if (children) {
    return <>{children(toc)}</>;
  }

  if (!isReady || toc.length === 0) {
    return (
      <div className="fixed min-w-64 left-0 bg-white shadow-lg rounded-lg border border-gray-300 dark:bg-[#1e1e1e] dark:border-gray-700 z-10 h-screen overflow-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white px-4 pt-4">
          目录
        </h2>
        <div className="text-gray-400 text-sm px-4">加载中...</div>
      </div>
    );
  }

  return <TableOfContents toc={toc} />;
}
