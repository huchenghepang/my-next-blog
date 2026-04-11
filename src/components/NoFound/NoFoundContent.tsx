"use client";

import Link from "next/link";
import { memo, useEffect, useRef } from "react";
import "./NoFound.scss";

const NoFoundContent = memo(() => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  return (
    <main className="not-found" role="main" aria-labelledby="not-found-title">
      <div className="not-found-container">
        {/* ✅ 语义化 + 可访问性 */}
        <h1
          id="not-found-title"
          ref={titleRef}
          tabIndex={-1} // ✅ 允许 JS 聚焦
          className="not-found-title"
        >
          404
        </h1>

        <p className="not-found-message" aria-live="polite">
          🧑‍🌾 同学，你真的很优秀，找到了不存在的事物 👍
        </p>
        <p className="not-found-message">🤦‍♂️ 抱歉！您要找的页面不存在 🫣</p>

        {/* ✅ 添加键盘导航提示 + 预取禁用（404 页面无需预取首页） */}
        <Link
          href="/"
          className="not-found-button"
          prefetch={false} // ✅ 关键：避免反向预加载首页资源
        >
          <span className="sr-only">返回</span>
          返回首页
        </Link>
      </div>
    </main>
  );
});

NoFoundContent.displayName = "NoFoundContent";
export default NoFoundContent;
