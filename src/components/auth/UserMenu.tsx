"use client";

import { useAuthStore } from "@/store/authStore";

export default function UserMenu() {
  const { userInfo, logout } = useAuthStore();

  if (!userInfo) return null;

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 hover:bg-gray-800 px-3 py-1.5 rounded-lg transition-colors">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {userInfo.username?.[0]?.toUpperCase() || "U"}
        </div>
        <span className="text-sm text-gray-200 hidden sm:inline">
          {userInfo.username}
        </span>
      </button>

      {/* 下拉菜单 */}
      <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-xl border border-gray-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-2">
          <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg">
            ⚙️ 账户设置
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg">
            🔑 API Keys
          </button>
          <hr className="my-2 border-gray-700" />
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-lg"
          >
            🚪 退出登录
          </button>
        </div>
      </div>
    </div>
  );
}
