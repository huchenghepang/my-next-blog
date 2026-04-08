import { getArticleDetailBySlug } from "@/api/article";
import JsonLd from "@/components/JsonLid/JsonLd";
import PreViewArticle from "@/components/MyEditor/PreViewArticle";
import TocWrapper from "@/components/MyEditor/TocWithContent/TocWrapper";
import config from "@/config/config";
import { generateArticleStructuredData } from "@/lib/structuredData";
import logger from "@/utils/logger";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Article, WithContext } from "schema-dts";
type PostPageProps = {
  params: Promise<{ slug: string }>;
};


export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  try {
    const rawParams = await params;
    const { slug } = rawParams;

    if (!slug) {
      return {
        title: "文章不存在",
        robots: "noindex, nofollow",
      };
    }

    const article = await getArticleDetailBySlug(String(slug));

    if (!article) {
      return {
        title: "文章不存在",
        robots: "noindex, nofollow",
      };
    }

    // 获取 SEO 标题（优先使用自定义 SEO 标题）
    const seoTitle = article.seo_title || article.title;
    const seoDescription =
      article.seo_description ||
      article.description ||
      `${article.title} - 详细内容介绍`;
    const seoKeywords =
      article.seo_keywords ||
      article.tags?.map((tag) => tag.name).join(",") ||
      "";

    // 构建完整的 URL
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com";
    const currentUrl = `${baseUrl}/post/${article.slug}`;

    // 处理发布时间
    const publishedTime = article.published_at || article.created_at;
    const modifiedTime = article.updated_at || article.created_at;

    // 获取作者名称
    const authorName =
      article.external_author || article.creator?.userName || "Jeff";

    return {
      title: config.siteName + " | " + seoTitle,
      description: seoDescription,
      keywords: seoKeywords,

      openGraph: {
        title: seoTitle,
        description: seoDescription,
        url: currentUrl,
        siteName: config.siteName,
        type: "article",
        publishedTime: publishedTime,
        modifiedTime: modifiedTime,
        authors: [authorName],
        tags: article.tags?.map((tag) => tag.name),
        images: article.thumbnail
          ? [
              {
                url: article.thumbnail,
                width: 1200,
                height: 630,
                alt: article.title,
              },
            ]
          : undefined,
      },

      // Twitter Card
      twitter: {
        card: "summary_large_image",
        title: seoTitle,
        description: seoDescription,
        images: article.thumbnail ? [article.thumbnail] : undefined,
        creator: authorName,
      },

      robots: {
        index: article.is_published !== false,
        follow: article.is_published !== false,
        googleBot: {
          index: article.is_published !== false,
          follow: article.is_published !== false,
        },
      },

      alternates: {
        canonical: currentUrl,
      },

      authors: [{ name: authorName }],

      category: article.article_categories?.name,

      ...(article.is_external && {
        metadataBase: new URL(currentUrl),
        other: {
          "original-source": article.external_url || "",
        },
      }),
    };
  } catch (error) {
    logger.error({
      error: error as Error,
      message: "生成文章 SEO 元数据失败",
    });

    return {
      title: "文章",
      description: "查看文章详情",
    };
  }
}




async function getArticleInfoBySlug(slug: string) {
  if (!slug) return;
  const article = await getArticleDetailBySlug(slug);
  return article;
}

export default async function PostPage({ params }: PostPageProps) {
  let redirectPath: string | null = null;
  try {
    const rawParams = await params;
    const { slug } = rawParams;

    if (!slug) {
      redirectPath = "/404";
      throw Error(`无效的文章 slug: ${slug}`);
    }

    const article = await getArticleInfoBySlug(String(slug));

    if (!article) {
      redirectPath = "/404";
      throw Error(`访问slug为:${slug}的文章不存在`);
    }

    const content = article.content;
    const toc = article.toc;

    const structuredData: WithContext<Article> = generateArticleStructuredData({
      article,
      siteConfig: {
        defaultAuthor: config.defaultAuthor,
        name: config.siteName,
        url: config.siteUrl,
        logo: config.siteLogo,
      },
    });

    return (
      <>
        {/* 添加 JSON-LD 结构化数据 */}
        <JsonLd data={structuredData}></JsonLd>
        <div className="flex">
          <TocWrapper containerId={slug} />
          <div className="w-full flex">
            <PreViewArticle
              slug={String(article.slug)}
              text={content || ""}
              title={article.title}
            />
          </div>
        </div>
      </>
    );
  } catch (error) {
    logger.error({
      error: error as Error,
      message: (error as Error).message || "博客页面访问出错",
    });
    redirectPath = "/404";
  } finally {
    if (redirectPath) redirect(redirectPath);
  }
}
