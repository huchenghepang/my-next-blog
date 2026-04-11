import dynamic from "next/dynamic";

// ✅ 动态导入实际组件 + 样式，避免预加载
const NoFoundContent = dynamic(
  () => import("@/components/NoFound/NoFoundContent"),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">加载中...</div>
      </div>
    ),
    ssr: true, // ✅ 404 页面建议保留 SSR，利于 SEO
  },
);

export default function NotFound() {
  return <NoFoundContent />;
}

export const metadata = {
  title: "404 - 页面未找到 | 护城河的天空之城",
  description: "抱歉，您访问的页面不存在。",
  robots: { index: false, follow: false },
};
