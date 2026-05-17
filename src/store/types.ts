import { LoginEntity } from "@/schema/auth";

export interface AuthState {
  // 状态
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  userInfo: LoginEntity["userInfo"] | null;
  isLoading: boolean;
  error: string | null;

  // 方法
  login: (data: LoginEntity) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateUserInfo: (userInfo: LoginEntity["userInfo"]) => void;
  refreshTokens: () => Promise<{ accessToken: string; refreshToken: string }>;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}
