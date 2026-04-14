// next.config.ts (或 .js)
import type { NextConfig } from "next";

// 目标后端 API 地址
const API_TARGET = process.env.API_TARGET;

const nextConfig: NextConfig = {
  reactStrictMode: true, // 开发时暴露潜在问题
  productionBrowserSourceMaps: false, // 生产环境禁用 sourcemap

  // 🔁 代理配置：保持原有逻辑
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${API_TARGET}/:path*`,
      },
    ];
  },

  // 🖼️ 图片优化配置（关键修复）
  images: {
    // ✅ 1. 添加自定义 quality 值（默认只有 [75]）
    qualities: [75, 80, 90], // 👈 必须包含你代码中使用的 80

    // ✅ 2. 远程图片域名配置
    remotePatterns: [
      // 方案 A：精确匹配（推荐生产环境）
      {
        protocol: "https",
        hostname: "s3.yunzhongshu.cn",
        pathname: "/yunzhongshu/image/**",
      },
      // 方案 B：通配符（开发调试用，⚠️ 生产慎用）
      // { protocol: 'https', hostname: '**' },
    ],

    // ✅ 3. 输出格式（注释修正 + 建议）
    formats: ["image/webp", "image/avif"], // 👈 现代格式，自动降级
    // ⚠️ 注意：SVG 不支持压缩优化，如需支持 SVG 请额外添加 deviceSizes

    // ✅ 4. 可选：缓存策略（减少重复请求）
    minimumCacheTTL: 60, // 秒
  },
};

export default nextConfig;
