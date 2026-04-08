"use client";
import useSlidePage from "@/hooks/useSlidePage";
import { HeadList } from "@/types/custom-editor";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TocWithContentStyle from "./TocWithContent.module.scss";

interface TableOfContentsProps {
  toc: HeadList[];
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeLine, setActiveLine] = useState<number | null>(
    toc[0]?.line || null,
  );
  const [isVisible, setIsVisible] = useState(true);
  const tocRef = useRef<HTMLElement>(null);
  const startX = useRef(0);
  const scrollingRef = useRef(false); // 防止滚动时重复触发
  const activeLineRef = useRef(activeLine); // 用于防抖函数中获取最新值

  // 同步 ref
  useEffect(() => {
    activeLineRef.current = activeLine;
  }, [activeLine]);

  // 缓存 sections 映射，避免每次滚动都重新查找
  const sectionMap = useMemo(() => {
    const map = new Map<number, HTMLElement>();
    toc.forEach((item) => {
      const element = document.getElementById(`header-${item.line}`);
      if (element) map.set(item.line, element);
    });
    return map;
  }, [toc]);

  /**
   * 优化1：使用 IntersectionObserver 替代 scroll 事件
   * 性能更好，不会造成滚动卡顿
   */
  useEffect(() => {
    if (toc.length === 0) return;

    // 收集所有标题元素
    const sections = toc
      .map((item) => document.getElementById(`header-${item.line}`))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 找到当前在视口中的标题
        const visibleEntry = entries.find((entry) => entry.isIntersecting);

        if (visibleEntry) {
          const sectionId = visibleEntry.target.id;
          const sectionLine = parseInt(sectionId.replace("header-", ""));
          const matchedItem = toc.find((item) => item.line === sectionLine);

          if (matchedItem && matchedItem.line !== activeLineRef.current) {
            setActiveLine(matchedItem.line);
          }
        } else {
          // 如果没有标题在视口，找最接近顶部的
          let closestSection: HTMLElement | null = null;
          let closestDistance = Infinity;

          for (const section of sections) {
            const rect = section.getBoundingClientRect();
            const distance = Math.abs(rect.top);
            if (
              distance < closestDistance &&
              rect.top < window.innerHeight / 2
            ) {
              closestDistance = distance;
              closestSection = section;
            }
          }

          if (closestSection) {
            const sectionLine = parseInt(
              closestSection.id.replace("header-", ""),
            );
            const matchedItem = toc.find((item) => item.line === sectionLine);
            if (matchedItem && matchedItem.line !== activeLineRef.current) {
              setActiveLine(matchedItem.line);
            }
          }
        }
      },
      {
        // 优化2：调整阈值，更灵敏地检测
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: "-80px 0px -60% 0px", // 顶部偏移80px，底部留60%
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [toc]);

  /**
   * 优化3：滚动 TOC 高亮项至可视区域（使用 ref 避免重复查询）
   */
  useEffect(() => {
    if (activeLine === null || scrollingRef.current) return;

    // 使用 requestAnimationFrame 优化滚动性能
    requestAnimationFrame(() => {
      const activeItem = document.querySelector(
        `[data-toc-line="${activeLine}"]`,
      );
      if (activeItem && tocRef.current) {
        const tocContainer = tocRef.current;
        const itemOffsetTop = (activeItem as HTMLElement).offsetTop;
        const itemHeight = (activeItem as HTMLElement).offsetHeight;
        const containerTop = tocContainer.scrollTop;
        const containerBottom = containerTop + tocContainer.clientHeight;

        // 优化4：更精确的边界判断
        const isAbove = itemOffsetTop < containerTop + 20;
        const isBelow = itemOffsetTop + itemHeight > containerBottom - 20;

        if (isAbove || isBelow) {
          scrollingRef.current = true;
          tocContainer.scrollTo({
            top: itemOffsetTop - 60,
            behavior: "smooth",
          });
          // 滚动完成后重置标志
          setTimeout(() => {
            scrollingRef.current = false;
          }, 500);
        }
      }
    });
  }, [activeLine]);

  /**
   * 优化5：滚动到指定目录（增加防抖和动画完成回调）
   */
  const handleScrollToSection = useCallback(
    (line: number) => {
      const section = sectionMap.get(line);
      if (!section) return;

      setActiveLine(line);

      // 优化6：使用 scrollIntoView 更简洁
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // 修正滚动偏移（因为固定头部）
      const offset = 80;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    },
    [sectionMap],
  );

  /** 触摸滑动显示/隐藏 TOC（移动端） */
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;

    if (diff > 50) {
      setIsVisible(true);
    } else if (diff < -50) {
      setIsVisible(false);
    }
  };

  const handleTouchEnd = () => {
    startX.current = 0;
  };

  useSlidePage(() => {
    setIsVisible(true);
  });

  return (
    <nav
      ref={tocRef}
      className={`fixed min-w-64 max-w-96  left-0 bg-white shadow-lg rounded-lg max-md:pb-4 border border-gray-300 dark:bg-[#1e1e1e] dark:border-gray-700 overflow-x-visible z-10 h-full transition-transform duration-300 ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      } md:block`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white px-4 pt-4 border-b-2">
        目录
      </h2>
      <ul
        className={`max-md:pb-6  space-y-2 text-sm px-4 h-full overflow-auto ${TocWithContentStyle["custom-scrollbar"]}`}
      >
        {toc.map((item) => (
          <li
            key={item.line}
            data-toc-line={item.line}
            className={`cursor-pointer transition-all ${
              activeLine === item.line
                ? "text-blue-600 font-bold"
                : "text-gray-600 dark:text-gray-400 hover:text-blue-500"
            }`}
            onClick={() => handleScrollToSection(item.line)}
          >
            <span
              className={`block py-1 rounded-md transition-colors ${
                activeLine === item.line
                  ? "bg-blue-100 dark:bg-slate-200 dark:text-zinc-600"
                  : "hover:bg-blue-50 dark:hover:bg-slate-300"
              }`}
              style={{ paddingLeft: `${Math.min(item.level - 1, 4) * 12}px` }}
            >
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
