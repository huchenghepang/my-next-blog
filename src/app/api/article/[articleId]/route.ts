import { createApiHandlerWithOptions } from "@/utils/createApiHandler";
import prisma from "@/utils/prisma";
import { sendError, sendResponse } from "@/utils/responseHandler/responseHandler";

export const GET = createApiHandlerWithOptions(async (req, { params }) => {
    const { articleId } = await params
    if (!articleId) return sendError({ errorMessage: "缺少文章ID" });
    const article = await prisma.notes.findUnique({
        where: {
            id: +articleId,
            is_archive:true,
        },
        select: {
            reading: true,
            id: true,
            category_id: true,
            comment_count: true,
            "create_time": true,
            "is_archive": true,
            "name": true,
            "updated_time": true,
            note_tags: {
                select: { tags: true }
            },
            article_categories: {
                select: {
                    id: true,
                    level: true,
                    name: true
                }
            },
            comments: {
                select: {
                    "comment_id": true,
                    "content": true,
                    "created_at": true,
                    "like_count": true,
                    "parent_id": true,
                    "reply_count": true,
                    "updated_at": true,
                    "user_comments": {
                        select: {
                            "user_info": {
                                select: {
                                    user_id: true,
                                    username: true
                                }
                            }
                        }
                    }
                }
            }
        },
    })
    if (!article) return sendError({ errorMessage: "获取文章信息失败" });
    /* 增加文章的阅读量 */
    await prisma.notes.update({
        where:{
            id:+articleId
        },
        data:{
            reading:{
                increment:1
            }
        }
    })
    return sendResponse({ message: "成功", data: { ...article } })
})