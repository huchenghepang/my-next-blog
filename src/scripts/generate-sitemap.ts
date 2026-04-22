import { writeFile } from "fs/promises";
import { join } from "path";
import { getArticleSlugs, getCategorySlugs } from "../utils/sitemapUtils";

// 定义站点地图项接口
interface SitemapItem {
  url: string;
  lastModified?: string;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}

// 生成XML格式的站点地图
function generateSitemapXml(items: SitemapItem[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetStart =
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetEnd = "</urlset>";

  const urls = items
    .map((item) => {
      return `
  <url>
    <loc>${item.url}</loc>
    ${item.lastModified ? `<lastmod>${item.lastModified}</lastmod>` : ""}
    ${item.changeFrequency ? `<changefreq>${item.changeFrequency}</changefreq>` : ""}
    ${item.priority !== undefined ? `<priority>${item.priority.toFixed(1)}</priority>` : ""}
  </url>`;
    })
    .join("");

  return `${xmlHeader}\n${urlsetStart}${urls}\n${urlsetEnd}`;
}

// 主函数用于生成站点地图
export async function generateSitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // 获取静态路由
  const staticRoutes = ["", "/post", "/post/category"];

  // 获取动态路由
  const articleSlugs = await getArticleSlugs();
  const categorySlugs = await getCategorySlugs();

  // 创建站点地图项目
  const sitemapItems: SitemapItem[] = [
    // 静态路由
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: (route === ""
        ? "daily"
        : "weekly") as string as SitemapItem["changeFrequency"], // ✅ 添加 as const
      priority: route === "" ? 1.0 : 0.8,
    })),

    // 动态文章路由
    ...articleSlugs.map((slug) => ({
      url: `${siteUrl}/post/${slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const, // ✅ 添加 as const
      priority: 0.7,
    })),

    // 动态分类路由
    ...categorySlugs.map((slug) => ({
      url: `${siteUrl}/post/category/${slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const, // ✅ 添加 as const
      priority: 0.6,
    })),
  ];

  // 生成XML
  const sitemapXml = generateSitemapXml(sitemapItems);

  // 确定输出路径（通常在public目录下）
  const outputPath = join(process.cwd(), "public", "sitemap.xml");

  // 写入文件
  await writeFile(outputPath, sitemapXml);

  console.log(`✅ Sitemap generated successfully at ${outputPath}`);
  console.log(`📈 Total URLs: ${sitemapItems.length}`);
}

// 如果直接运行此脚本
if (require.main === module) {
  generateSitemap().catch((error) => {
    console.error("❌ Error generating sitemap:", error);
    process.exit(1);
  });
}
