import { formatDateUTC } from "@/utils/format/formatDatetime";
import prisma from "@/utils/prisma";
import { ArticleCardProps } from "./ArticleCard";
import ArticlesList from "./ArticlesList";

// 服务器组件：获取数据并传递给 HotArticlle 组件
const HotArticlleWrapper = async () => {
  const articles = await prisma.notes.findMany({
    where: {
      is_archive: true,
    },
    select: {
      name: true,
      create_time: true,
      summary: true,
      reading: true,
      id: true,
    },
    orderBy: {
      create_time: "desc",
    },
    take: 4,
  });

  // 格式化数据
  const articleList: ArticleCardProps[] = articles.map((article) => ({
    id: article.id.toString(),
    title: article.name,
    datetime: formatDateUTC(article.create_time.toString()).split(" ")[0],
    summary: article.summary || "",
    views: article.reading,
    href: `/posts/${article.id}`,
  }));

  return <ArticlesList articleList={articleList} />;
};

// 开启 ISR（增量静态生成）
export const revalidate = 86400; // 每 24 小时重新生成 
/* 特别注意开发者模式下会一直生成 没有缓存 */

export default HotArticlleWrapper;
