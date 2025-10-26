import logger from "@/utils/logger";
import prisma from "@/utils/prisma";
import { FC } from "react";

// 根据文件名生成组件
const CategoryRecommend: FC = async () => {
  try {
    const categories = await prisma.article_categories.findMany({
      where: {
        level: { in: [2, 3] },
      },
      take: 8,
    });

    return (
      <section className="bg-white py-12 dark:bg-zinc-600  dark:text-white">
        <div className="max-w-5xl mx-auto px-4 text-center ">
          <h2 className="text-3xl font-bold text-gray-800">分类导航</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-4 ">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/posts/?categoryid=${category.id}`}
                className="bg-gray-200  hover:bg-blue-500 hover:text-white dark:hover:bg-cyan-200 dark:bg-zinc-600  dark:text-white px-6 py-2 rounded-full transition"
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>
      </section>
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
