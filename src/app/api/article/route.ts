import { Notes } from "@/types/mysql";
import { PaginationParams, PaginationResponse } from "@/types/response";
import { createApiHandler } from "@/utils/createApiHandler";
import { parseRequestDataAndQueryData } from "@/utils/parseRequestData";
import prisma from "@/utils/prisma";
import { sendResponse } from "@/utils/responseHandler/responseHandler";

// 定义分页查询处理函数
export const POST = createApiHandler(async (req) => {
    const data = await parseRequestDataAndQueryData<{ pagination?: PaginationParams, categoryId?: number, tagInfo?: { id: number; name: string } }>(req);
    
    
    const { pagination, categoryId } = data.body || { pagination: { page: 1, limit: 5 } };
    // 计算分页的偏移量和限制
    const { page = 1, limit: pageSize = 10 } = pagination || {}
    const skip = (page - 1) * pageSize;
    const take = pageSize > 1000 ? 1000 : pageSize;

    // 查询符合条件的文章
    const [articles, totalCount] = await prisma.$transaction([
        prisma.notes.findMany({
            where: {
                category_id: categoryId,  // 根据分类 ID 进行过滤
                is_archive: true,
                note_tags:{
                    some:{
                        tag_id: data.body?.tagInfo?.id
                    }
                }
            },
            skip,         // 偏移量
            take,         // 每页条数
            orderBy: {
                create_time: 'desc',  // 根据创建时间降序排列（可以根据需求修改）
            },
            include: {
                note_tags: {
                    select: {
                        "tags": {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        }),
        prisma.notes.count({
            where: {
                category_id: categoryId,  // 根据分类 ID 进行过滤
                is_archive: true,
                note_tags: {
                    some: {
                        tag_id: data.body?.tagInfo?.id
                    }
                }
            }
        })
    ]);

    // 计算总页数
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    // 返回分页数据和文章列表
    return sendResponse({
        message: "请求成功",
        data: {
            articles,
            pagination: {
                page,
                pageSize,
                totalCount: totalPages === 1 ? articles.length : totalCount,
                totalPages,
            }
        }
    });
});
interface NoteTags {
    note_tags: {
        tags: {
            id: number;
            name: string;
        };
    }[]
};
export type NotesWithTags = Notes & NoteTags;
export interface ArticlesCategoryies {
    articles: NotesWithTags[],
    pagination: PaginationResponse
}