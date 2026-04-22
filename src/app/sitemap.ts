import { getArticleSlugs, getCategorySlugs } from "@/utils/sitemapUtils";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes = ["", "/post", "/post/category"];

  const articleSlugs = await getArticleSlugs();
  const categorySlugs = await getCategorySlugs();

  const allUrls = [
    ...staticRoutes.map((route) => `${siteUrl}${route}`),

    // 动态文章路由
    ...articleSlugs.map((slug) => `${siteUrl}/post/${slug}`),

    // 动态分类路由
    ...categorySlugs.map((slug) => `${siteUrl}/post/category/${slug}`),
  ];

  return allUrls.map((url) => ({
    url,
    lastModified: new Date(),
    changeFrequency: url.includes("/post/")
      ? ("weekly" as const)
      : ("monthly" as const),
    priority: url === `${siteUrl}/` ? 1 : url.includes("/post/") ? 0.8 : 0.7,
  }));
}
