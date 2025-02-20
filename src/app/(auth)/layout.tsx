import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  /* 如果用户已经登录则禁止其显示登录页面而是跳转到指定*/
  return <>{ children }</>;
}
