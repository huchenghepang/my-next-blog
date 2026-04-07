import { getLatestPublicArticle } from "@/api/article";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

async function getLatestArticles() {
  const articleInfo = await getLatestPublicArticle();
  return articleInfo;
}

// 缓存
const getCacheLatestArticle = unstable_cache(
  getLatestArticles,
  ["latest-article"],
  {
    revalidate: 3600,
  },
);

export default async function ArticleList() {
  const latestArticle = await getCacheLatestArticle();
  console.log(latestArticle);
  // 重定向到最新文章的详情页
  if (latestArticle && latestArticle.slug) {
    redirect(`/post/${latestArticle.slug}?title=${latestArticle.title}`);
  }

  return redirect("/404");
}
