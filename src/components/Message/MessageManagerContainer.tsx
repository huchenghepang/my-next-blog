"use client"
import React, { useCallback, useMemo, useState } from "react";
import Message from "./Message";
import { MessageItem } from "./MessageManager";
import MessageManagerStyle from "./MessageManager.module.scss";
// React 组件部分，用于状态管理和渲染
const MessageManagerContainer: React.FC<{
  registerCallback: (
    callback: React.Dispatch<React.SetStateAction<MessageItem[]>>,
  ) => void;
}> = ({ registerCallback }) => {
  const [messages, setMessages] = useState<MessageItem[]>([]);

  // 注册消息更新回调
  React.useEffect(() => {
    registerCallback(setMessages);
  }, [registerCallback]);

  const handleRemoveMessage = useCallback(
    (id: number) => {
      setMessages((prevMessages) => {
        if (prevMessages.length === 1) {
          return [];
        }
        return prevMessages.filter((msg) => msg.id !== id);
      });
    },
    [],
  );

  return useMemo(
    () => (
      <div className={MessageManagerStyle["Message-Manager"]}>
        {messages.map((message) => (
          <Message
            key={message.id}
            id={message.id}
            message={message.message}
            style={message.style}
            duration={message.duration}
            Icon={message.Icon}
            onRemove={handleRemoveMessage}
          />
        ))}
      </div>
    ),
    [messages, handleRemoveMessage],
  );
};



export default MessageManagerContainer;