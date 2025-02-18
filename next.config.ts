import type { NextConfig } from "next";
// 目标后端 API 地址
const API_TARGET = process.env.API_TARGET;
const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,  // 保证开发时一些问题暴露
  productionBrowserSourceMaps: false,  // 禁用生产环境中的源代码映射
  async rewrites() {
      return [
        {
          source: '/api/proxy/:path*', // 匹配所有以 /api 开头的请求
          destination: API_TARGET + "/:path*", // 转发到目标服务器
        },
      ];
    },
  };

  export default nextConfig;
