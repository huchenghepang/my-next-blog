import Link from "next/link";
import React from "react";
import "./NoFound.scss";

// 根据文件名生成组件
const NoFound: React.FC = () => {
  return (
    <div className="not-found">
      <div className="not-found-container">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">
          🧑‍🌾同学，你真的很优秀，找到了不存在的事物👍
        </p>
        <p className="not-found-message">🤦‍♂️抱歉！您要找的页面不存在🫣</p>
        <Link href="/" className="not-found-button">
          返回首页
        </Link>
      </div>
    </div>
  );
};

export default NoFound;
