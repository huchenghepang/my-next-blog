import { createApiHandler } from "@/utils/createApiHandler";
import prisma from "@/utils/prisma";
import { sendResponse } from "@/utils/responseHandler/responseHandler";

export const GET = createApiHandler(async()=>{
    const tags = await prisma.tags.findMany({
        select: {
            id: true,
            name: true,
            note_tags: {
                select: {
                    notes: {
                        select: {
                            id: true,
                        },
                    }
                },
            },
        },
    })
    return sendResponse({
        message: "获取tag数据成功",
        data: tags
    })
})

export interface TagsWithNotes {
    id: number;
    name: string;
    note_tags: {
        notes: {
            id: number;
        };
    }[];
}   