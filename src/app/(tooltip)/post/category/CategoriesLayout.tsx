import { getCachedCategories, getCacheQueryArticles } from "@/api/cache";
import JsonLd from "@/components/JsonLid/JsonLd";
import config from "@/config/config";
import { generateArticleItemListStructuredData } from "@/lib/structuredData";
import logger from "@/utils/logger";
import { Metadata } from "next";
import ArticleGrid from "./ArticleGrid";
import CategoryFilterServer from "./CategoryFilterServer";
import PaginationServer from "./PaginationServer";
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  try {
    const { category: categorySlug } = await params;
    const categories = await getCachedCategories();
    const currentCategory = categories.find((c) => c.slug === categorySlug);

    if (!currentCategory) {
      return {
        title: "分类未找到",
        robots: "noindex, nofollow",
      };
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com";
    const categoryUrl = `${baseUrl}/post/category/${currentCategory.slug}`;

    return {
      title: `${currentCategory.name} - 文章分类 | ${config.siteName}`,
      description: `浏览${currentCategory.name}分类下的所有文章，包含最新内容和精彩分享。`,
      keywords: `${currentCategory.name}, 文章分类, 博客`,

      openGraph: {
        title: `${currentCategory.name} - 文章分类`,
        description: `浏览${currentCategory.name}分类下的所有文章`,
        url: categoryUrl,
        siteName: config.siteName,
        type: "website",
      },

      alternates: {
        canonical: categoryUrl,
      },

      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    logger.error({
      message: "生成分类元数据失败",
      error,
    });
    return {
      title: `分类 - ${config.siteName}`,
      robots: "noindex, follow", // 降级策略
    };
  }
}

export default async function CategoriesLayout({
  params,
  query,
}: {
  params?: { category?: string };
  query?: Awaited<CategoryPageProps["searchParams"]>;
}) {
  const categories = await getCachedCategories();
  const paramsData = params;
  const currentCategory = paramsData?.category
    ? categories.find((c) => c.slug === paramsData.category)
    : null;
  const selectedCategory = currentCategory ? currentCategory.category_id : null;
  const { page, pageSize } = query || { page: 1, pageSize: 3 };

  const {
    items: articles,
    pagination: { total },
  } = await getCacheQueryArticles({
    page: Number(page),
    pageSize: Number(pageSize),
    ...(selectedCategory ? { categoryId: selectedCategory } : {}),
  });
  // 调用生成文章列表结构化数据函数
  const articleItemList = generateArticleItemListStructuredData({
    categoryInfo: currentCategory
      ? {
          name: currentCategory.name,
          id: currentCategory.category_id,
          slug: currentCategory.slug,
        }
      : {
          name: "全部",
          description: "全部文章分类",
          id: 0,
          slug: "",
        },
    articles: articles,
    siteConfig: {
      defaultAuthor: config.defaultAuthor,
      name: config.siteName,
      url: config.siteUrl,
      logo: config.siteLogo,
    },
  });
  return (
    <div className="min-h-screen w-full overflow-y-auto [scrollbar-gutter:stable] bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <JsonLd data={articleItemList} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* 标题 */}
        <header className="text-center mb-10 lg:mb-14">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent mb-3">
            文章分类
          </h1>
          <p
            className="text-lg text-gray-400 dark:text-gray-500 italic tracking-wide 
          before:content-['“'] before:text-2xl before:text-purple-400 before:mr-1
          after:content-['”'] after:text-2xl after:text-purple-400 after:ml-1
          hover:tracking-wider transition-all duration-300"
          >
            杂七杂八的归纳，就像人生一样乱七八糟
          </p>
        </header>

        <CategoryFilterServer
          categories={categories}
          selectedCategory={selectedCategory}
        />

        {/* 文章列表 */}
        <ArticleGrid articles={articles} categories={categories}></ArticleGrid>
        <PaginationServer
          total={total}
          page={Number(page || 1)}
          pageSize={Number(pageSize || 3)}
          categorySlug={paramsData?.category}
        />
      </div>
    </div>
  );
}
