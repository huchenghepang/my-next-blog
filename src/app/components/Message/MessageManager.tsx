"use client";
import { MessageComponentIcon } from "@/types/iconfont";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import IconFont from "../Iconfont/Iconfont";
import MessageManagerContainer from "./MessageManagerContainer";

// 定义 MessageItem 类型
export interface MessageItem {
  id: number;
  message: string;
  duration: number;
  Icon?: React.ReactNode;
  style: React.CSSProperties;
}

class MessageManager {
  private idCounter = 0;
  container: HTMLDivElement | null = null;
  private root: Root | null = null;
  private messageQueue: Omit<MessageItem, "id">[] = []; // 临时队列

  // 用于在 React 中管理消息状态
  private addMessageCallback: React.Dispatch<
    React.SetStateAction<MessageItem[]>
  > | null = null;

  constructor() {
    this.initContainer();
  }

  private initContainer() {
    const container = document.createElement("div");
    container.id = "message-container";
    document.body.appendChild(container);
    this.container = container;

    // 初始化 React 渲染
    this.root = createRoot(container);
    this.root.render(
      <MessageManagerContainer
        registerCallback={this.registerAddMessageCallback}
      />
    );
  }

  private registerAddMessageCallback = (
    callback: React.Dispatch<React.SetStateAction<MessageItem[]>>
  ) => {
    this.addMessageCallback = callback;

    // 如果有消息在队列中，立即处理
    if (this.messageQueue.length > 0) {
      this.messageQueue.forEach((message) => this.addMessage(message));
      this.messageQueue = []; // 清空队列
    }
  };

  public addMessage(message: Omit<MessageItem, "id">) {
    const id = this.idCounter++;
    const newMessage = { ...message, id };

    // 如果回调已注册，直接添加消息
    if (this.addMessageCallback) {
      this.addMessageCallback((prevMessages) => [...prevMessages, newMessage]);
    } else {
      // 如果回调尚未注册，暂存到队列
      this.messageQueue.push(message);
    }
  }
}

// 单例导出
let messageManager: MessageManager | null = null;

export const showMessage = ({
  type,
  text,
  duration = 3000,
}: {
  type: "success" | "error" | "info" | "tip";
  text: string;
  duration?: number;
}) => {
  if (!messageManager) {
    messageManager = new MessageManager(); // 重新初始化
  }

  let style: React.CSSProperties = {};
  let iconName: MessageComponentIcon;
  switch (type) {
    case "success":
      style = { backgroundColor: "#4CAF50", color: "#fff" };
      iconName = "icon-success";
      break;
    case "error":
      style = { backgroundColor: "#F44336", color: "#fff" };
      iconName = "icon-error";
      break;
    case "info":
      style = { backgroundColor: "#2196F3", color: "#fff" };
      iconName = "icon-tixing";
      break;
    case "tip":
      style = { backgroundColor: "#FFC107", color: "#fff" };
      iconName = "icon-tips";
      break;
  }

  messageManager.addMessage({
    message: text,
    duration,
    style,
    Icon: <IconFont name={iconName}></IconFont>,
  });
};

export default messageManager;
