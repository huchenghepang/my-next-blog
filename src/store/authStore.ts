import { LoginEntity } from "@/schema/auth";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_STORAGE_KEY,
  AUTH_TOKEN_UPDATE,
} from "./constant";
import { AuthState } from "./types";

const initialState = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  userInfo: null,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: (data: LoginEntity) => {
        set({
          isAuthenticated: true,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          userInfo: data.userInfo,
          error: null,
        });
        window.dispatchEvent(
          new CustomEvent(AUTH_TOKEN_UPDATE, {
            detail: {
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            },
          }),
        );
        window.dispatchEvent(new CustomEvent(AUTH_LOGIN));
      },

      logout: () => {
        set(initialState);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        // 触发登出事件
        window.dispatchEvent(new CustomEvent(AUTH_LOGOUT));
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      updateUserInfo: (userInfo: LoginEntity["userInfo"]) => {
        set((state) => ({
          userInfo: userInfo,
        }));
      },

      // 刷新 token
      refreshTokens: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          get().logout();
          throw new Error("No refresh token available");
        }

        try {
          const response = await fetch("/api/proxy/api/auth/refresh", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshToken}`,
            },
          });

          const data = await response.json();

          if (data.code === 200 && data.data) {
            set({
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
            });

            window.dispatchEvent(
              new CustomEvent("auth:tokens-updated", {
                detail: {
                  accessToken: data.data.accessToken,
                  refreshToken: data.data.refreshToken,
                },
              }),
            );

            return {
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
            };
          } else {
            get().logout();
            throw new Error("Refresh failed");
          }
        } catch (error) {
          get().logout();
          throw error;
        }
      },

      getAccessToken: () => get().accessToken,
      getRefreshToken: () => get().refreshToken,
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        userInfo: state.userInfo,
      }),
    },
  ),
);
