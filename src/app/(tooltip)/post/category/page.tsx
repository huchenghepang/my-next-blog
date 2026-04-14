"use client";

import { useArticleData } from "@/hooks/useArticleData";
import ArticleGrid from "./ArticleGrid";
import CategoryFilter from "./CategoryFilter";

export default function CategoryPage() {
  const {
    categories,
    articles,
    selectedCategory,
    loading,
    error,
    setSelectedCategory,
    refresh,
  } = useArticleData();

  const currentCategoryName = selectedCategory
    ? categories.find((c) => c.category_id === selectedCategory)?.name
    : null;

  return (
    <div className="min-h-screen w-full overflow-y-auto [scrollbar-gutter:stable] bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* 标题 */}
        <header className="text-center mb-10 lg:mb-14">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent mb-3">
            📚 文章分类
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            只是想多些不同和区别
          </p>
        </header>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* 👇 3. 文章列表：固定最小高度防抖动 */}
        <section className="min-h-[600px] md:min-h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {currentCategoryName || "全部文章"}
            </h2>
            {!selectedCategory && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                共 {articles.length} 篇
              </span>
            )}
          </div>

          <ArticleGrid
            articles={articles}
            categories={categories}
            loading={loading}
            error={error}
            onRetry={refresh}
          />
        </section>
      </div>
    </div>
  );
}
