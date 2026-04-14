import prisma from "@/lib/prisma";
import { createApiHandler } from "@/utils/createApiHandler";
import { sendResponse } from "@/utils/responseHandler/responseHandler";

export const GET = createApiHandler(async () => {
  /* 获取分类及其文章数量 */
  const categoriesWithCount = await prisma.article_categories.findMany({
    include: {
      _count: {
        select: {
          articles: true
        }
      }
    }
  });

  const result = categoriesWithCount.map(category => ({
    category_id: category.id,
    name: category.name,
    count: category._count.articles,
    slug: category.slug || ""
  }));

  return sendResponse({ 
    data: {
      items: result,
      pagination: {
        hasNext: false,
        page: 1,
        pageSize: result.length,
        total: result.length,
        totalPages: 1
      }
    } 
  });
});