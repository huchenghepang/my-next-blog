import { getArticleCountByCategory, getPublicArticles } from "@/api/article";

export async function getArticleSlugs(): Promise<string[]> {
  try {
    let page = 1;
    const res = await getPublicArticles({
      page: 1,
      pageSize: 1000,
    });
    // 循环遍历所有文章

    const articles = res.items || [];
    const hasNext = res.pagination.hasNext || false;
    if (hasNext) {
      page++;
      const nextRes = await getPublicArticles({
        page: page,
        pageSize: 1000,
      });
      if (nextRes.items?.length) articles.push(...(nextRes.items || []));
    }
    return articles.map((article) => article.slug);
  } catch (error) {
    console.error("Error fetching article slugs:", error);
    return [];
  }
}

export async function getCategorySlugs(): Promise<string[]> {
  try {
    const res = await getArticleCountByCategory();
    const categories = res.items || [];
    return categories.map((category) => category.slug);
  } catch (error) {
    console.error("Error fetching category slugs:", error);
    return [];
  }
}
