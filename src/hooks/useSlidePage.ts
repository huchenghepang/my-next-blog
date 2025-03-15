import { useEffect, useState } from "react";

/* 方向枚举 */
type Direction = "down" | "up" | "left" | "right";
type AllowedSelectors = 'div' | 'body';

/* 滑动页面触发事件 */
const useSlidePage = (callback: () => void, selectors: keyof HTMLElementTagNameMap = "body", diff = 50, direction: Direction = "right") => {
    const [current, setCurrent] = useState({
        x: 0,
        y: 0,
    });

    // 提取滑动方向判断逻辑到单独的函数
    const checkSlideDirection = (touchX: number, touchY: number) => {
        switch (direction) {
            case "up":
                return current.y - touchY > diff;
            case "down":
                return touchY - current.y > diff;
            case "left":
                return current.x - touchX > diff;
            case "right":
                return touchX - current.x > diff;
            default:
                return false;
        }
    };

    useEffect(() => {
        const target = document.querySelector(selectors);
        if (!target) return;

        const handleTouchStart = (e: Event) => {
            const touchEvent = e as TouchEvent;
            const touch = touchEvent.touches[0];
            setCurrent({
                x: touch.clientX,
                y: touch.clientY
            });
        };

        const handleTouchMove = (e: Event) => {
            const touchEvent = e as TouchEvent;
            const touch = touchEvent.touches;
            if (touch.length > 0 && checkSlideDirection(touch[0].clientX, touch[0].clientY)) {
                callback();
            }
        };

        const handleTouchEnd = () => { setCurrent({ x: 0, y: 0 }); };

        target.addEventListener("touchstart", handleTouchStart);
        target.addEventListener("touchmove", handleTouchMove);
        target.addEventListener("touchend", handleTouchEnd);
        return () => {
            target.removeEventListener("touchstart", handleTouchStart);
            target.removeEventListener("touchmove", handleTouchMove);
            target.removeEventListener("touchend", handleTouchEnd)
        };
    }, [setCurrent, callback, diff, direction]);

    return;
};

export default useSlidePage;