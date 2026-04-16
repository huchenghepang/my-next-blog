import { RefObject, useEffect, useRef } from "react";

export type SlideDirection = "up" | "down" | "left" | "right";

export interface SlideInOptions {
  /** 滑入方向，默认 'up' */
  direction?: SlideDirection;
  /** 滑动距离（px），默认 150 */
  distance?: number;
  /** 动画时长（ms），默认 500 */
  duration?: number;
  /** 缓动函数，默认 'ease-in-out' */
  easing?: string;
  /** 初始透明度，默认 0.5 */
  startOpacity?: number;
  /** 是否禁用动画，默认 false */
  disabled?: boolean;
  /** 元素进入视口时的回调 */
  onSlideIn?: () => void;
  /** 是否只播放一次，默认 true */
  once?: boolean;
  /** 触发阈值（0-1），默认 0（刚进入时触发） */
  threshold?: number;
}

interface UseSlideInReturn {
  ref: RefObject<HTMLElement | null>;
  /** 手动播放动画 */
  play: () => void;
  /** 重置动画（需要配合 once: false 使用） */
  reset: () => void;
}

// 获取变换方向对应的 translate 值
const getTranslateValue = (
  direction: SlideDirection,
  distance: number,
): string => {
  switch (direction) {
    case "up":
      return `translateY(${distance}px)`;
    case "down":
      return `translateY(-${distance}px)`;
    case "left":
      return `translateX(${distance}px)`;
    case "right":
      return `translateX(-${distance}px)`;
    default:
      return `translateY(${distance}px)`;
  }
};

export const useSlideIn = (options: SlideInOptions = {}): UseSlideInReturn => {
  const {
    direction = "up",
    distance = 150,
    duration = 500,
    easing = "ease-in-out",
    startOpacity = 0.5,
    disabled = false,
    onSlideIn,
    once = true,
    threshold = 0,
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const hasPlayedRef = useRef(false);

  // 创建动画
  const createAnimation = (element: HTMLElement): Animation => {
    const translateValue = getTranslateValue(direction, distance);

    return element.animate(
      [
        {
          transform: translateValue,
          opacity: startOpacity,
        },
        {
          transform: "translate(0, 0)",
          opacity: 1,
        },
      ],
      {
        duration,
        easing,
        fill: "forwards",
      },
    );
  };

  // 播放动画
  const play = () => {
    if (disabled) return;
    if (!elementRef.current) return;
    if (once && hasPlayedRef.current) return;

    if (!animationRef.current) {
      animationRef.current = createAnimation(elementRef.current);
      animationRef.current.pause();
    }

    animationRef.current.play();
    hasPlayedRef.current = true;
    onSlideIn?.();
  };

  // 重置动画
  const reset = () => {
    if (!elementRef.current || !animationRef.current) return;
    animationRef.current.cancel();
    animationRef.current = createAnimation(elementRef.current);
    animationRef.current.pause();
    hasPlayedRef.current = false;
  };

  // 检查元素是否在视口下方
  const isBelowViewPort = (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    switch (direction) {
      case "up":
        return rect.top - distance > viewportHeight;
      case "down":
        return rect.bottom + distance < 0;
      case "left":
        return rect.left - distance > window.innerWidth;
      case "right":
        return rect.right + distance < 0;
      default:
        return rect.top - distance > viewportHeight;
    }
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element || disabled) return;

    // 检查是否已经在视口内
    if (!isBelowViewPort(element)) {
      play();
      return;
    }

    // 创建 IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            play();
            if (once) {
              observer.unobserve(element);
            }
          } else if (!once) {
            // 元素离开视口时重置（可选，需要配合 once: false）
            reset();
          }
        }
      },
      {
        threshold,
        rootMargin: direction === "up" || direction === "left" ? "0px" : "0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        animationRef.current.cancel();
      }
    };
  }, [direction, distance, duration, easing, disabled, once, threshold]);

  return {
    ref: elementRef as RefObject<HTMLElement | null>,
    play,
    reset,
  };
};
