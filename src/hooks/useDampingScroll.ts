import { useEffect } from "react";

/**
 * 为整个 HTML 根元素 (`<html>`) 添加滚动阻尼效果
 * @param dampingFactor 阻尼系数（默认 0.1），用于调整滚动的减速程度
 */
const useDampingScroll = (selector:string|undefined = undefined,dampingFactor = 0.60) => {
    useEffect(() => {
        const container = selector? document.querySelector(selector) : document.documentElement; // 直接作用于 html 根元素
        let lastScrollTop = 0;
        let isScrolling = false;
        if(!container) return;
        const scrollHandler = () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    const currentScrollTop = container.scrollTop;
                    const delta = currentScrollTop - lastScrollTop;

                    if (Math.abs(delta) > 0.1) {
                        const newScrollTop = container.scrollTop - delta * dampingFactor;
                        container.scrollTop = Math.max(0, Math.min(newScrollTop, container.scrollHeight - container.clientHeight));
                    }

                    lastScrollTop = container.scrollTop;
                    isScrolling = false;
                });
                isScrolling = true;
            }
        };

        window.addEventListener("scroll", scrollHandler, { passive: true });
        return () => window.removeEventListener("scroll", scrollHandler);
    }, [dampingFactor,selector]);
};

export default useDampingScroll;
