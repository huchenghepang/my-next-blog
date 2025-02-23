import { createApiHandler } from "@/utils/createApiHandler";
import prisma from "@/utils/prisma";
import { sendResponse } from "@/utils/responseHandler/responseHandler";


export const GET = createApiHandler(async () => {
    /* 获取分类的信息 */
    const categoryRows = await prisma.article_categories.findMany()
    return sendResponse({ data: categoryRows })
})