import prisma from "@/lib/prisma";
import { createApiHandler } from "@/utils/createApiHandler";
import {
  sendError,
  sendResponse,
} from "@/utils/responseHandler/responseHandler";

export const GET = createApiHandler(async () => {
  const article = await prisma.notes.findMany({
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
  })
  if (!article) return sendError({errorMessage: "获取推荐文章数据失败"})
  return sendResponse({message: "获取推荐文章成功", data: article})
});

export interface ArticleRecommend {
  id: number
  name: string
  create_time: Date
  summary: string | null
  reading: number
}
