import { CacheKey } from "@/config";
import { unstable_cache } from "next/cache";
import { getLatestPublicArticle, getPublicArticles } from "../article";

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

//#endregion
