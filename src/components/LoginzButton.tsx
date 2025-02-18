"use client";

import { CustomResponse } from "@/types/customResponse";
import Button from "./Button/Button";
import { showMessage } from "./Message/MessageManager";

async function LoginOut() {
  /* 请求删除数据 */
  try {
    const res = await fetch("/api/auth/loginout");
    const { success, message, errorMessage } =
      (await res.json()) as CustomResponse;
    if (!success)
      return showMessage({
        type: "error",
        text: errorMessage || "退出登录失败",
      });

    showMessage({ type: "success", text: message || "退出登录成功",duration:2000 });
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  } catch (error) {
    console.log(error);
    showMessage({ type: "error", text: "退出登录出错" });
  }
}

export default function LogoutButton() {
  return (
    <Button type="primary" onClick={LoginOut}>
      退出登录
    </Button>
  );
}
