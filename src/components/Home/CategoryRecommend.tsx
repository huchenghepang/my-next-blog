import { getArticleCategoryData } from "@/api/article";
import { CacheKey, Revalidate } from "@/config";
import logger from "@/utils/logger";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { FC } from "react";
import HomeSection from "./HomeSection";

async function fetchCategoryData() {
  const { items: categories } = await getArticleCategoryData();
  const categoryList = categories.sort((a, b) => b.count - a.count);
  return categoryList.splice(0, 5);
}

const cacheFetchCategoryData = unstable_cache(
  fetchCategoryData,
  [CacheKey.HOME.CATEGORY_COUNT_DATA],
  {
    revalidate: Revalidate.LONG,
  },
);

// 根据文件名生成组件
const CategoryRecommend: FC = async () => {
  const categories = await cacheFetchCategoryData();
  try {
    return (
      <HomeSection>
        <div className="max-w-5xl mx-auto px-4 text-center ">
          <h2 className="text-3xl font-bold">分类导航</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-4 ">
            {categories.map((category) => (
              <Link
                key={category.category_id}
                href={`/post/category/${category.slug}`}
                className="bg-gray-200  hover:bg-yellow-500 hover:text-gray-500 dark:hover:bg-yellow-200 dark:bg-zinc-600   px-6 py-2 rounded-full transition"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </HomeSection>
    );
  } catch (error) {
    logger.error({
      error: error as Error,
      message: "首页分类组件请求渲染错误",
    });
    return <></>;
  }
};

export const revalidate = 86400;

export default CategoryRecommend;
