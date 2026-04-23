import type {
  ArticleCategory,
  Article as ArticleType,
} from "@/types/api/article.d";
// lib/structuredData.ts
import { Article, ItemList, WithContext } from "schema-dts";

interface GenerateArticleStructuredDataParams {
  article: ArticleType;
  siteConfig?: {
    name?: string;
    url?: string;
    logo?: string;
    defaultAuthor?: string;
  };
}

export function generateArticleStructuredData({
  article,
  siteConfig = {},
}: GenerateArticleStructuredDataParams): WithContext<Article> {
  // 获取配置，优先使用传入的配置，否则使用环境变量
  const siteName =
    siteConfig.name || process.env.NEXT_PUBLIC_SITE_NAME || "我的博客";
  const siteUrl =
    siteConfig.url ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://localhost:3000";
  const siteLogo =
    siteConfig.logo ||
    process.env.NEXT_PUBLIC_SITE_LOGO_URL ||
    `${siteUrl}/logo.png`;
  const defaultAuthor =
    siteConfig.defaultAuthor ||
    process.env.NEXT_PUBLIC_DEFAULT_AUTHOR ||
    "未知作者";

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description || `${article.title} - 详细内容介绍`,
    image: article.thumbnail || undefined,
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at || article.created_at,
    author: {
      "@type": "Person",
      name:
        article.external_author || article.creator?.userName || defaultAuthor,
      url: article.external_url || siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: {
        "@type": "ImageObject",
        url: siteLogo,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/post/${article.slug}`,
    },
    keywords: article.tags?.map((tag) => tag.name).join(", "),
    articleSection: article.article_categories?.name,
    isAccessibleForFree: true,
  };
}

interface GenerateArticleItemListStructuredDataParams {
  categoryInfo: ArticleCategory & { description?: string; name: string };
  articles: ArticleType[];
  siteConfig?: {
    name?: string;
    url?: string;
    logo?: string;
    defaultAuthor?: string;
  };
}

/**
 * 生成分类文章ItemList的结构化数据
 * 方便seo
 */
export function generateArticleItemListStructuredData({
  categoryInfo,
  articles,
  siteConfig = {},
}: GenerateArticleItemListStructuredDataParams): WithContext<ItemList> {
  // 获取配置，优先使用传入的配置，否则使用环境变量
  const siteName =
    siteConfig.name || process.env.NEXT_PUBLIC_SITE_NAME || "我的博客";
  const siteUrl =
    siteConfig.url ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://localhost:3000";

  // 处理分类 slug，避免 undefined
  const categorySlug = categoryInfo.slug || "";
  const categoryUrl = categorySlug
    ? `${siteUrl}/post/category/${categorySlug}`
    : `${siteUrl}/post/category`;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${categoryInfo.name} - ${siteName}`, // 更有意义的名称
    description:
      categoryInfo.description || `${categoryInfo.name}分类下的文章列表`,
    url: categoryUrl,
    numberOfItems: articles.length,
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      // ✅ 推荐格式：使用 item 包裹
      item: {
        "@type": "Article",
        name: article.title,
        url: `${siteUrl}/post/${article.slug}`,
        headline: article.title,
      },
    })),
  };
}
