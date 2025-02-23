import config from "@/config/config";
import { saveFile, saveFileInfoIntoDB } from "@/utils/filehandler/fileHelper";
import logger from "@/utils/logger";
import { sendError, sendResponse } from "@/utils/responseHandler/responseHandler";
import { NextRequest } from "next/server";




export const POST = async (req: NextRequest) => {
    try {
        const data = await req.formData();
        const file = data.get("file") as File

        const fileInfo = await saveFile(file);
        /* 保存文件的信息到服务器 */
        const fileDB = await saveFileInfoIntoDB(fileInfo)
        if (!fileDB) return sendError({
            errorMessage: "文件信息保存数据库失败，文件上传失败"
        })
        /* 对于图片给出访问地址，文件给出一个虚假地址，防止被随意下载 */
        return sendResponse({
            message: "文件上传成功",
            data: {
                fileInfo: { ...fileInfo, file_path: "" },
                accessUrl: new URL(fileInfo.filePathFolder + "/" + fileInfo.file_name, config.baseUrl)
            }
        });
    } catch (error) {
        logger.error({ error: error as Error, message: "文件上传出错" })
        return sendError({
            errorMessage: "文件上传出错"
        })
    }
};

export interface UploadResponse {
    fileInfo: {
        file_path: string;
        file_name: string;
        filePathFolder: string;
        file_id?: number;
        file_ext: string;
        upload_time?: string;
        file_type: string;
        file_size: number;
        file_fullname: string;
        user_id?: string;
        hash: string;
        status: "active" | "inactive" | "deleted";
        description?: string;
    };
    accessUrl: string;
}
