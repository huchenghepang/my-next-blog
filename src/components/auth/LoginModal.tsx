"use client";

import { useLogin } from "@/hooks/useLogin";
import { AccountType, type LoginRequest } from "@/schema/auth";
import { useState } from "react";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function LoginModal({
  open,
  onClose,
  onSuccess,
}: LoginModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState<LoginRequest>({
    account: "",
    password: "",
    loginType: AccountType.Email,
  });

  const { handleLogin, isLoading, error, formErrors } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await handleLogin(formData);

    if (success) {
      onSuccess?.();
      onClose();
      // 重置表单
      setFormData({
        account: "",
        password: "",
        loginType: AccountType.Email,
      });
    }
  };

  const updateField = (
    field: keyof LoginRequest,
    value: string | AccountType,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700">
        {/* 标题 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-100">
            {isRegister ? "创建账户" : "登录"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 账号输入 */}
          <div>
            <input
              type="text"
              placeholder="邮箱 / 手机号"
              value={formData.account}
              onChange={(e) => updateField("account", e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              required
              disabled={isLoading}
            />
            {formErrors.account && (
              <p className="mt-1 text-sm text-red-400">{formErrors.account}</p>
            )}
          </div>

          {/* 登录方式选择（可选） */}
          <div>
            <select
              value={formData.loginType}
              onChange={(e) =>
                updateField("loginType", e.target.value as AccountType)
              }
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isLoading}
            >
              <option value={AccountType.Email}>邮箱登录</option>
              <option value={AccountType.Phone}>手机号登录</option>
              <option value={AccountType.User}>用户名登录</option>
              <option value={AccountType.Wechat}>微信登录</option>
              <option value={AccountType.QQ}>QQ登录</option>
              <option value={AccountType.Google}>Google登录</option>
              <option value={AccountType.Github}>Github登录</option>
            </select>
          </div>

          {/* 密码输入 */}
          <div>
            <input
              type="password"
              placeholder="密码"
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              required
              disabled={isLoading}
            />
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-400">{formErrors.password}</p>
            )}
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {isLoading ? "登录中..." : isRegister ? "注册" : "登录"}
          </button>
        </form>

        {/* 切换登录/注册 */}
        <p className="text-center text-gray-400 text-sm mt-4">
          {isRegister ? "已有账户？" : "没有账户？"}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              // 切换时清空错误
              setFormData({
                account: "",
                password: "",
                loginType: AccountType.Email,
              });
            }}
            className="text-blue-400 hover:text-blue-300 ml-1 transition-colors"
          >
            {isRegister ? "去登录" : "去注册"}
          </button>
        </p>

        {/* 演示账号提示（可选） */}
        {!isRegister && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              演示账号: demo@example.com / 123456
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
