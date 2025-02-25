import PreViewArticle from "@/components/MyEditor/PreViewArticle";
import TableOfContents from "@/components/MyEditor/TocWithContent/TocWithContent";
import { HeadList } from "@/types/custom-editor";
import { readArticle } from "@/utils/filehandler/fileHelper";
import logger from "@/utils/logger";
import prisma from "@/utils/prisma";
import { redirect } from "next/navigation";

type PostPageProps = {
  // 允许 params 是一个普通对象或 Promise 对象
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  /* 获取当前所有存在的博客文章ID */
  const notes = await prisma.notes.findMany({ select: { id: true } });
  return notes.map((note) => {
    return {
      id: note.id.toString(),
    };
  });
}

async function getArticleInfoByID(id: number) {
  if (!id) return;

  const article = await prisma.notes.findUnique({
    where: { id: id ,is_archive:true},
    include: {
      article_categories: { select: { level: true, name: true, id: true } },
      note_tags: { select: { tags: true } },
      files_info: {
        select: {
          file_path: true,
        },
      },
    },
  });
  return article;
}

export default async function PostPage({ params }: PostPageProps) {
  let redirectPath: string | null = null;
  try {
    const rawparams = await params;
    const { id } = rawparams;
    if (!id || isNaN(Number(id))) {
      // 过滤无效的 ID，比如 favicon.ico
      redirectPath = "/404";
      throw Error(`无效的文章 ID: ${id}`);
    }
    
    /* 根据id信息查询数据库里面的文章内容 */
    const article = await getArticleInfoByID(Number(id));
    if (!article) {
      redirectPath = "/404";
      throw Error(`访问ID为:${id}的文章不存在`);
    }
    const content = await readArticle(article.files_info.file_path);

    const toc: HeadList[] | undefined = JSON.parse(article.toc as string);

    return (
      <div className="flex">
        {toc && <TableOfContents toc={toc} />}
        <div className="w-full flex">
          <PreViewArticle
            id={String(article.id)}
            text={content || ""}
            toc={toc}
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
