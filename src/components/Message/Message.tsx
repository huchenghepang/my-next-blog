"use client";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import "./message-transition.scss";
import MessageStyle from "./Message.module.scss";

interface MessageProps {
  id: number;
  message: string;
  style?: React.CSSProperties;
  duration?: number;
  Icon?:  React.ReactNode;
  onRemove: (id: number) => void; // 用于触发父组件移除消息
}

const MessageMemo: React.FC<MessageProps> = ({
  id,
  message,
  style,
  onRemove,
  duration,
  Icon,
}) => {
  const [animationClass, setAnimationClass] = useState("message-item-enter");
  const refDiv = useRef<HTMLDivElement | null>(null);

  // 触发退出动画
  const handleExit = () => {
    setAnimationClass("message-item-exit");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleExit();
    }, duration || 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [duration]);

  // 当退出动画结束时，通知父组件移除
  useEffect(() => {
    const div = refDiv.current;
    const handleAnimationEnd = (event: AnimationEvent) => {
      if (event.animationName === "message-exit-animation") {
        onRemove(id);
      }
    };
    div?.addEventListener("animationend", handleAnimationEnd);
    return () => {
      div?.removeEventListener("animationend", handleAnimationEnd);
    };
  }, [id, onRemove]);



  return useMemo(
    () => (
      <div
        ref={refDiv}
        key={id}
        className={`${MessageStyle["Message-Item"]} ${animationClass}`}
        style={{ ...style }}
      >
        {Icon && (
          <div
            className={MessageStyle["Message-Icon"]}
            style={{ width: "24px", height: "24px" }}
          >
            {Icon} {/* 直接渲染传入的 Icon JSX 元素 */}
          </div>
        )}
        <span>{message}</span>
      </div>
    ),
    [id, style, message, refDiv, animationClass, Icon],
  );
};

const Message=  memo(MessageMemo);

export default Message;
