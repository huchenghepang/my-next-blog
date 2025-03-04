import { createApiHandler } from "@/utils/createApiHandler";
import { parseRequestDataAndQueryData } from "@/utils/parseRequestData";
import prisma from "@/utils/prisma";
import { sendError, sendResponse } from "@/utils/responseHandler/responseHandler";

export const GET = createApiHandler(async (req) => {
    const data = await parseRequestDataAndQueryData<any,{ keyword: string }>(req);
    console.log(data);
    
    const article = await prisma.notes.findFirst({
        select: {
            id: true
        },
        where: {
            OR: [
                { name: { contains: data.query?.keyword } }, // 只要包含关键字就匹配
                { name: { startsWith: data.query?.keyword } }, // 以关键字开头
                { name: { endsWith: data.query?.keyword } }, // 以关键字结尾
            ]
        }
    });
    if (!article) return sendError({ errorMessage: "没有找到相关文章" });

    // 重定向到文章页面
    return sendResponse({data:{redirect:"/posts/"+article.id}})
})