"use client";
import { signOut } from "next-auth/react";
import Button from "./Button/Button";

async function LoginOut() {
  /* 请求删除数据 */
  try {
    await fetch("/api/proxy/auth/loginout");
    signOut({ callbackUrl: "/login" });
  } catch (error) {
    console.log(error);
  }
}

export default function LogoutButton() {
  return (
    <Button type="primary" onClick={LoginOut}>
      退出登录
    </Button>
  );
}
