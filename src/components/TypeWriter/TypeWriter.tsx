// components/TypeWriter/TypeWriter.tsx
"use client";

import { useEffect, useRef } from "react";

const WORDS = [
  "你好！我是",
  "一名开发者",
  "有时候我在想",
  "是不是越长大",
  "就越没有对生活的想象力？",
];

const TypeWriter = () => {
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  // ✅ 用 ref 存储所有可变状态，避免触发渲染
  const stateRef = useRef({
    wordIndex: 0,
    charIndex: 0,
    isDeleting: false,
    timer: null as NodeJS.Timeout | null,
  });

  useEffect(() => {
    const textEl = textRef.current;
    const cursorEl = cursorRef.current;
    if (!textEl || !cursorEl) return;

    const type = () => {
      const currentWord = WORDS[stateRef.current.wordIndex];
      const { charIndex, isDeleting } = stateRef.current;

      // ✅ 直接操作 DOM，不触发 React 更新
      if (!isDeleting) {
        textEl.textContent = currentWord.substring(0, charIndex + 1);
        stateRef.current.charIndex++;

        if (stateRef.current.charIndex === currentWord.length) {
          stateRef.current.isDeleting = true;
          stateRef.current.timer = setTimeout(type, 1500); // 打完停留 1.5s
          return;
        }
      } else {
        textEl.textContent = currentWord.substring(0, charIndex - 1);
        stateRef.current.charIndex--;

        if (stateRef.current.charIndex === 0) {
          stateRef.current.isDeleting = false;
          stateRef.current.wordIndex =
            (stateRef.current.wordIndex + 1) % WORDS.length;
        }
      }

      // ✅ 动态调整速度：删除更快，输入稍慢
      const speed = isDeleting ? 40 : 80;
      stateRef.current.timer = setTimeout(type, speed);
    };

    // ✅ 光标闪烁用 CSS 动画，不占 JS 线程
    cursorEl.classList.add("animate-blink");

    type();

    return () => {
      if (stateRef.current.timer) clearTimeout(stateRef.current.timer);
    };
  }, []);

  return (
    <h2 className="text-5xl font-bold leading-none sm:text-6xl xl:max-w-3xl dark:text-gray-50 min-h-[72px]">
      <div className="h-1 w-full rounded-3xl bg-gradient-to-t from-yellow-300/50 to-transparent" />

      <span className="inline-block min-w-[250px]">
        <span
          ref={textRef}
          className="will-change-transform"
          style={{ transform: "translateZ(0)" }}
        />
        {/* ✅ 光标用 CSS 动画，性能优于 JS 控制 */}
        <span
          ref={cursorRef}
          className="inline-block w-0.5 h-[1.2em] ml-0.5 bg-current align-middle"
        />
      </span>

      <div className="h-1 w-full rounded-3xl bg-gradient-to-t from-yellow-300/50 to-slate-500" />
    </h2>
  );
};

TypeWriter.displayName = "TypeWriter";
export default TypeWriter;
