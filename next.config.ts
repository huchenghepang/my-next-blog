import type { NextConfig } from "next";
// 目标后端 API 地址
const API_TARGET = process.env.API_TARGET;
const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*', // 匹配所有以 /api 开头的请求
        destination:API_TARGET+"/:path*", // 转发到目标服务器
      },
    ];
  },
};

export default nextConfig;
