import { CreateArticleParams } from "@/types/params/article";
import { createApiHandler } from "@/utils/createApiHandler";
import { generateHashByText, getFileInfoByPath, saveFileInfoIntoDB } from "@/utils/filehandler/fileHelper";
import prisma from "@/utils/prisma";
import { sendError, sendResponse } from "@/utils/responseHandler/responseHandler";
import { addHoursToDate } from "@/utils/timezone";
import { ensureDir, writeFileSync } from "fs-extra";
import path from "path";

const fileFinalPath = path.join(process.cwd(), "public/uploads/notes/");
ensureDir(fileFinalPath);

export const POST = createApiHandler(async (req) => {
    const params: CreateArticleParams = await req.json();

    /* 1. 保存文本文件 */
    const hash = generateHashByText(params.content);
    const filePathName = hash + ".md";
    const saveFilePath = path.join(fileFinalPath, filePathName);
    writeFileSync(saveFilePath, params.content, { encoding: "utf-8" });

    /* 2. 保存文件信息 */
    const fileInfo = await getFileInfoByPath(fileFinalPath + filePathName, hash);
    const fileInfoDB = await saveFileInfoIntoDB({
        ...fileInfo,
        status: "active",
        file_fullname: params.title.trim() + ".md",
    });

    /* 3. 创建文章 */
    const createTime = addHoursToDate(params.createdAt);
    const note = await prisma.notes.create({
        data: {
            create_time: createTime,
            created_at: createTime,
            category_id: params.category,
            file_id: fileInfoDB.file_id,
            name: params.title,
            summary: params.summary,
            toc:JSON.stringify(params.directory),
            is_archive: params.isArchived,
        },
    });

    if (!note) return sendError({ errorMessage: "保存文章失败" });

    /* 4. 处理标签逻辑 */
    const tagNames = [...new Set(params.tags.map(tag => tag.trim()))]; // 去重标签
    const tagIds: number[] = [];

    for (const tagName of tagNames) {
        const tag = await prisma.tags.upsert({
            where: { name: tagName },
            update: {}, // 已存在则不变
            create: { name: tagName },
        });
        tagIds.push(tag.id);
    }

    /* 5. 关联 NoteTags */
    await prisma.note_tags.createMany({
        data: tagIds.map(tagId => ({
            note_id: note.id,
            tag_id: tagId,
        })),
        skipDuplicates: true, // 避免重复关联
    });

    return sendResponse({ message: "保存文章成功" });
});
