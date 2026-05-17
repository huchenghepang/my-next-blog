"use client";

import { toast } from "react-toastify";
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_TOKEN_UPDATE } from "./constant";
let isSetup = false;
export function setupTokenListener() {
  if (typeof window === "undefined") return;
  if (isSetup) return;
  window.addEventListener(AUTH_TOKEN_UPDATE, ((event: CustomEvent) => {
    console.log("Tokens updated:", event.detail);
  }) as EventListener);

  window.addEventListener(AUTH_LOGOUT, () => {
    toast.success("退出登录成功");
  });
  window.addEventListener(AUTH_LOGIN, () => {
    toast.success("欢迎！登录成功");
  });
  isSetup = true;
}
