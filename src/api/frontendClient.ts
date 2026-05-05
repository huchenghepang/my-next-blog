"use client";

import { useAuthStore } from "@/store/authStore";
import {
  configureClient,
  configureRefreshToken,
  initClient,
} from "@/utils/fetcher/request";
import { toast } from "react-toastify";

let isConfigured = false;

export function setupFetcher() {
  if (typeof window === "undefined") return;
  if (isConfigured) return;

  // 1. 配置 token 管理函数（从 Zustand store 读取）
  configureClient({
    getToken: () => useAuthStore.getState().getAccessToken(),
    getRefresh: () => useAuthStore.getState().getRefreshToken(),

    setToken: (token) => {
      if (token) {
        const { refreshToken } = useAuthStore.getState();
        useAuthStore.getState().login({
          accessToken: token,
          refreshToken: refreshToken || "",
          userInfo: useAuthStore.getState().userInfo!,
        });
      }
    },

    setRefresh: (token) => {
      if (token) {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
          useAuthStore.getState().login({
            accessToken: accessToken,
            refreshToken: token,
            userInfo: useAuthStore.getState().userInfo!,
          });
        }
      }
    },

    onLogout: () => {
      useAuthStore.getState().logout();
    },

    onMessage: (msg, type) => {
      if (type && type in toast) {
        toast[type](msg);
      }
    },
  });

  // 2. 配置刷新 token 的函数（使用 Zustand 的 refreshTokens 方法）
  configureRefreshToken(async () => {
    try {
      const result = await useAuthStore.getState().refreshTokens();
      return {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      };
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw error;
    }
  });

  isConfigured = true;
}

export const browserAPI = initClient(
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.huchenghe.site",
  {
    timeout: 10000,
    headers: {
      "X-App-Version": "1.0.0",
    },
  },
);

browserAPI.addResponseInterceptor(async (response) => {
  const json = await response.json();
  if (json.code === 200 || json.code === 201) {
    return json.data || json;
  }

  if (response.status === 401) {
    useAuthStore.getState().logout();
  }

  throw new Error(json.message || "Request failed");
});
