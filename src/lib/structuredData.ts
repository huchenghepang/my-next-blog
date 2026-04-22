import type { Article as ArticleType } from "@/types/api/article.d";
// lib/structuredData.ts
import { Article, WithContext } from "schema-dts";

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
