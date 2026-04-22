import { CacheKey, Revalidate } from "@/config";
import logger from "@/utils/logger";
import { unstable_cache } from "next/cache";
import {
  getArticleCategoryList,
  getLatestPublicArticle,
  getPublicArticles,
} from "../article";

//#region 缓存最新文章
async function getLatestArticles() {
  const articleInfo = await getLatestPublicArticle();
  console.log("articleInfo", articleInfo);

  return {
    ...articleInfo,
    slug: "/post/" + articleInfo.slug,
  };
}

export const getCacheLatestArticle = unstable_cache(
  getLatestArticles,
  [CacheKey.ARTICLE.LATEST_ARTICLE],
  {
    revalidate: 3600,
  },
);

export const getCachedArticles = unstable_cache(
  async () => {
    try {
      const res = await getPublicArticles({
        is_published: true,
        page: 1,
        pageSize: 3,
      });

      if (!res?.items) return [];

      return res.items
        .filter((a) => Boolean(a.public_id))
        .map((ar) => ({
          id: ar.public_id!,
          title: ar.title,
          slug: "/post/" + ar.slug,
          author: ar.external_author,
          summary: ar.description,
        }));
    } catch (error) {
      console.error("Failed to fetch articles:", error);
      return [];
    }
  },
  [CacheKey.HOME.ARTICLES],
  {
    revalidate: 3600,
    tags: ["articles"],
  },
);

// 方案：使用参数序列化 + 模块级缓存函数
const _cachedArticlesFetcher = unstable_cache(
  async (categoryId?: number, page: number = 1, pageSize: number = 6) => {
    return await getPublicArticles({ category_id: categoryId, page, pageSize });
  },
  [CacheKey.ARTICLE.ARTICLES], // 基础 key，参数通过函数参数区分
  { tags: ["articles"] },
);

export const getCacheQueryArticles = (params: {
  page?: number;
  pageSize?: number;
  categoryId?: number;
}) => {
  const safePage = params.page && !isNaN(params.page) ? params.page : 1;
  const safePageSize =
    params.pageSize && !isNaN(params.pageSize) ? params.pageSize : 3;
  const safeCategoryId =
    params.categoryId && !isNaN(params.categoryId)
      ? params.categoryId
      : undefined;

  // 动态 revalidate 无法直接传入 unstable_cache，建议：
  // 方案A: 使用固定 revalidate + revalidateTag 手动失效
  // 方案B: 将缓存策略应用到数据层而非装饰器层
  return _cachedArticlesFetcher(safeCategoryId, safePage, safePageSize);
};;
//#endregion

//#region 缓存文章分类

const fetchCategories = async () => {
  try {
    const res = await getArticleCategoryList();
    return res.items || [];
  } catch (err) {
    logger.error({
      message: "获取分类失败",
      error: err,
    });
    return [];
  }
};

export const getCachedCategories = unstable_cache(
  fetchCategories,
  [CacheKey.ARTICLE.CATEGORIES],
  {
    revalidate: Revalidate.LONG,
  },
);

//#endregion
