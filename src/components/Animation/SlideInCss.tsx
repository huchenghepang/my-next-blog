"use client";
import "@/styles/slide-in.css";
import React, { useEffect, useRef, useState } from "react";
export type SlideDirection = "up" | "down" | "left" | "right";
export type SlideDistance = "sm" | "md" | "lg";
export type SlideDuration = "fast" | "normal" | "slow";
export type SlideEasing =
  | "linear"
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "bounce";

export interface SlideInProps {
  /** 子元素 */
  children: React.ReactNode;
  /** 滑入方向 */
  direction?: SlideDirection;
  /** 滑动距离: sm=50px, md=150px, lg=300px */
  distance?: SlideDistance;
  /** 动画时长 */
  duration?: SlideDuration;
  /** 缓动函数 */
  easing?: SlideEasing;
  /** 延迟时间 (ms) */
  delay?: number;
  /** 触发阈值 (0-1) */
  threshold?: number;
  /** 是否只触发一次 */
  once?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 元素进入视口时的回调 */
  onVisible?: () => void;
  /** 动画结束回调 */
  onAnimationEnd?: () => void;
}

export const SlideInCss: React.FC<SlideInProps> = ({
  children,
  direction = "up",
  distance = "md",
  duration = "normal",
  easing = "ease-in-out",
  delay = 0,
  threshold = 0.1,
  once = true,
  className = "",
  style,
  onVisible,
  onAnimationEnd,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // 如果已经在视口内，直接显示
    const checkImmediateVisible = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight && rect.bottom > 0) {
        setIsVisible(true);
        onVisible?.();
        return true;
      }
      return false;
    };

    if (checkImmediateVisible() && once) return;

    // 创建 IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            onVisible?.();
            if (once) {
              observer.unobserve(element);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin: "0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once, onVisible]);

  const classes = [
    "slide-in",
    direction,
    `distance-${distance}`,
    `duration-${duration}`,
    `easing-${easing}`,
    isVisible ? "visible" : "",
    delay > 0 ? `delay-${delay}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const customStyle = {
    ...style,
    ...(delay > 0 && !className.includes("delay-")
      ? { transitionDelay: `${delay}ms` }
      : {}),
  };

  return (
    <div
      ref={ref}
      className={classes}
      style={customStyle}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  );
};

export default SlideInCss;
