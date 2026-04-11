// components/share/SmoothScroll.tsx
"use client";

import Lenis, { type LenisOptions } from "lenis";
import { ReactNode, useEffect, useMemo, useRef } from "react";

// 🎯 预设配置：开箱即用的现代滚动体验
export const LENIS_PRESETS = {
  /** 丝滑电影感：适合展示型网站 */
  cinematic: { lerp: 0.06, duration: 1.2, wheelMultiplier: 0.9 } as const,

  /** 自然跟手：适合内容型/博客网站 */
  natural: { lerp: 0.1, duration: 0.8, wheelMultiplier: 1.0 } as const,

  /** 快速响应：适合后台/工具型应用 */
  fast: { lerp: 0.15, duration: 0.5, wheelMultiplier: 1.2 } as const,
  /** 阅读友好：中等平滑+自然阻尼 */
  reading: { lerp: 0.1, wheelMultiplier: 1.0, damping: 0.75 },
  /** 工具型：快速响应+低延迟 */
  utility: { lerp: 0.2, wheelMultiplier: 1.3, immediate: true },
  /** 自定义：透传所有参数 */
  custom: {} as LenisOptions,
} as const;

export type ScrollPreset = keyof typeof LENIS_PRESETS;

export interface SmoothScrollProps extends Partial<LenisOptions> {
  children: ReactNode;
  /** 预设模式，优先级低于手动传入的参数 */
  preset?: ScrollPreset;
  /** 是否启用根实例（全局可访问） */
  root?: boolean;
  /** 滚动回调 */
  onScroll?: (lenis: Lenis) => void;
}

const SmoothScroll = ({
  children,
  preset = "natural",
  root = true,
  onScroll,
  ...userOptions
}: SmoothScrollProps) => {
  const lenisRef = useRef<Lenis | null>(null);

  const options = useMemo(() => {
    const base = preset !== "custom" ? LENIS_PRESETS[preset] : {};
    return {
      smoothWheel: true,
      syncTouch: true, // 移动端跟手
      autoResize: true, // 内容变化时自动更新
      ...base,
      ...userOptions,
    } satisfies LenisOptions;
  }, [preset, userOptions]);

  useEffect(() => {
    // 🚀 初始化 Lenis
    const lenis = new Lenis(options);
    lenisRef.current = lenis;

    // 🔄 滚动动画循环（使用 requestAnimationFrame）
    function raf(time: number) {
      lenis.raf(time);
      onScroll?.(lenis);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    // ♿️ 可选：添加键盘导航支持
    const handleKey = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName))
        return;
      if (e.key === "PageUp" || e.key === "PageDown") {
        e.preventDefault();
        lenis.scrollTo(
          lenis.scroll +
            (e.key === "PageUp" ? -1 : 1) * window.innerHeight * 0.8,
        );
      }
    };
    window.addEventListener("keydown", handleKey);

    // 🧹 清理
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("keydown", handleKey);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [options, onScroll]);

  // 🌐 Next.js SSR 兼容：避免 hydration mismatch
  useEffect(() => {
    document.documentElement.classList.add("lenis");
    document.documentElement.classList.add("lenis-smooth");
    return () => {
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };
  }, []);

  return root ? (
    <>
      {/* 📦 根实例：接管 <html> 滚动 */}
      {children}
    </>
  ) : (
    <div data-lenis-container className="h-full overflow-hidden">
      {children}
    </div>
  );
};

export default SmoothScroll;
