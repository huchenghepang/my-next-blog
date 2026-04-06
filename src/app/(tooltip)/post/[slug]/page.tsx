import { getArticleDetailBySlug } from "@/api/article";
import PreViewArticle from "@/components/MyEditor/PreViewArticle";
import logger from "@/utils/logger";
import { redirect } from "next/navigation";

type PostPageProps = {
  // 允许 params 是一个普通对象或 Promise 对象
  params: Promise<{ slug: string }>;
};

// export async function generateStaticParams() {
//   /* 获取当前所有存在的博客文章ID */
//   const notes = await prisma.notes.findMany({ select: { id: true } });
//   return notes.map((note) => {
//     return {
//       id: note.id.toString(),
//     };
//   });
// }

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
      // 过滤无效的 ID，比如 favicon.ico
      redirectPath = "/404";
      throw Error(`无效的文章 slug: ${slug}`);
    }

    /* 根据slug信息查询数据库里面的文章内容 */
    const article = await getArticleInfoBySlug(String(slug));
    if (!article) {
      redirectPath = "/404";
      throw Error(`访问slug为:${slug}的文章不存在`);
    }
    const content = article.content;

    const toc = article.toc;

    return (
      <div className="flex">
        {/* {toc && <TableOfContents toc={toc} />} */}
        <div className="w-full flex">
          <PreViewArticle
            slug={String(article.slug)}
            text={content || ""}
            // toc={toc}
          />
        </div>
      </div>
    );
  } catch (error) {
    logger.error({
      error: error as Error,
      message: (error as Error).message || "博客页面访问出错",
    });
    redirectPath = "/404";
  } finally {
    // 必须在finally去重定向 因为redirect内部舍弃错误的
    if (redirectPath) redirect(redirectPath);
  }
}
