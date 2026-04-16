"use client";

import { SlideDirection, useSlideIn } from "@/hooks/animation/useSlideIn";
import React, { ReactNode } from "react";

export interface SlideInProps {
  /** 子元素 */
  children: ReactNode;
  /** 滑入方向 */
  direction?: SlideDirection;
  /** 滑动距离（px） */
  distance?: number;
  /** 动画时长（ms） */
  duration?: number;
  /** 缓动函数 */
  easing?: string;
  /** 初始透明度 */
  startOpacity?: number;
  /** 是否禁用动画 */
  disabled?: boolean;
  /** 元素进入视口时的回调 */
  onSlideIn?: () => void;
  /** 是否只播放一次 */
  once?: boolean;
  /** 触发阈值（0-1） */
  threshold?: number;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = "up",
  distance = 150,
  duration = 500,
  easing = "ease-in-out",
  startOpacity = 0.5,
  disabled = false,
  onSlideIn,
  once = true,
  threshold = 0,
  className,
  style,
}) => {
  const { ref } = useSlideIn({
    direction,
    distance,
    duration,
    easing,
    startOpacity,
    disabled,
    onSlideIn,
    once,
    threshold,
  });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      style={{
        willChange: "transform, opacity",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default SlideIn;
