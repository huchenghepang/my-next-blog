"use client";
import useSlidePage from "@/hooks/useSlidePage";
import { HeadList } from "@/types/custom-editor";
import debounce from "@/utils/normal/debounce";
import { useEffect, useRef, useState } from "react";
import "./TocWithContent.scss";

interface TableOfContentsProps {
  toc: HeadList[];
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeLine, setActiveLine] = useState<number | null>(
    toc[0]?.line || null
  );
  const [isVisible, setIsVisible] = useState(true);
  const tocRef = useRef<HTMLElement>(null);
  const startX = useRef(0);
  /** 监听滚动，设置当前高亮的目录项 */
  useEffect(() => {
    const handleScroll = debounce(() => {
      const sections = toc
        .map((tocItem) => document.getElementById(`header-${tocItem.line}`))
        .filter(Boolean) as HTMLElement[];

      if (sections.length === 0) return;

      let currentSection: HTMLElement | null = null;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.getBoundingClientRect().top < window.innerHeight / 2) {
          currentSection = section;
          break;
        }
      }

      if (currentSection) {
        const sectionLine = currentSection.id.replace("header-", "");
        const matchedItem = toc.find(
          (item) => String(item.line) === sectionLine
        );

        if (matchedItem) {
          setActiveLine(matchedItem.line);
        }
      }
    }, 1000);

    window.addEventListener("scroll", handleScroll);
    
    handleScroll(); // 初始触发一次

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [toc]);

  /** 监听 activeLine 变化，滚动 TOC 高亮项至可视区域 */
  useEffect(() => {
    if (activeLine !== null) {
      const activeItem = document.querySelector(
        `[data-toc-line="${activeLine}"]`
      );
      if (activeItem && tocRef.current) {
        const tocContainer = tocRef.current;
        const itemOffsetTop = (activeItem as HTMLElement).offsetTop;

        // 如果当前高亮项超出可视区域，则滚动 TOC
        if (
          itemOffsetTop < tocContainer.scrollTop ||
          itemOffsetTop >
            tocContainer.scrollTop + tocContainer.clientHeight - 100
        ) {
          tocContainer.scrollTo({
            top: itemOffsetTop - 30,
            behavior: "smooth",
          });
        }
      }
    }
  }, [activeLine]);

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

  /** 滚动到指定目录 */
  const handleScrollToSection = (line: number) => {
    const section = document.getElementById(`header-${line}`);
    setActiveLine(line);
    if (section) {
      window.scrollTo({ top: section.offsetTop - 60, behavior: "smooth"});
    }
  };

  useSlidePage(() => {
    setIsVisible(true);
  });

  return (
    <nav
      ref={tocRef}
      className={`fixed min-w-52 custom-scrollbar left-0  bg-white shadow-lg rounded-lg max-md:pb-4 border border-gray-300 dark:bg-[#1e1e1e] dark:border-gray-700 z-10 h-screen overflow-auto transition-transform duration-300 ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      } md:block`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        目录
      </h2>
      <ul className="max-md:pb-6 space-y-2 text-sm">
        {toc.map((item) => (
          <li
            key={item.line}
            data-toc-line={item.line}
            className={`cursor-pointer transition-all ${
              activeLine === item.line
                ? "text-blue-600 font-bold"
                : "text-gray-600 dark:text-gray-400"
            }`}
            onClick={() => handleScrollToSection(item.line)}
          >
            <span
              className={`block py-1 rounded-md ${
                activeLine === item.line
                  ? "bg-blue-100 dark:bg-slate-200 dark:text-zinc-600"
                  : "hover:bg-blue-50 dark:hover:bg-slate-300 dark:text-zinc-600"
              }`}
              style={{ paddingLeft: `${Math.min(item.level - 1, 4) * 12}px` }} // 只允许最多 4 级缩进
            >
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
