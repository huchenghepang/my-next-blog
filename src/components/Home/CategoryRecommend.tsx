import prisma from "@/lib/prisma";
import logger from "@/utils/logger";
import { FC } from "react";
import HomeSection from "./HomeSection";

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
      <HomeSection>
        <div className="max-w-5xl mx-auto px-4 text-center ">
          <h2 className="text-3xl font-bold">分类导航</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-4 ">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/posts/?categoryid=${category.id}`}
                className="bg-gray-200  hover:bg-yellow-500 hover:text-gray-500 dark:hover:bg-yellow-200 dark:bg-zinc-600   px-6 py-2 rounded-full transition"
              >
                {category.name}
              </a>
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
