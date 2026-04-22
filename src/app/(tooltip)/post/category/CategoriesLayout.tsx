import { getCachedCategories, getCacheQueryArticles } from "@/api/cache";
import ArticleGrid from "./ArticleGrid";
import CategoryFilterServer from "./CategoryFilterServer";
import PaginationServer from "./PaginationServer";
export default async function CategoriesLayout({
  params,
  query,
}: {
  params?: { category?: string };
  query?: Awaited<CategoryPageProps["searchParams"]>;
}) {
  const categories = await getCachedCategories();
  const paramsData = params;
  const selectedCategory = paramsData?.category
    ? categories.find((c) => c.slug === paramsData.category)?.category_id ||
      null
    : null;
  const { page, pageSize } = query || { page: 1, pageSize: 3 };
  const {
    items: articles,
    pagination: { total },
  } = await getCacheQueryArticles({
    page: Number(page),
    pageSize: Number(pageSize),
    ...(selectedCategory ? { categoryId: selectedCategory } : {}),
  });
  return (
    <div className="min-h-screen w-full overflow-y-auto [scrollbar-gutter:stable] bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
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
