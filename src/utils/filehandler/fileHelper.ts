import { FilesInfo } from '@/types/mysql';
import FILE_TYPES from './fileTypes';
// 计算文件的哈希值
import crypto from "crypto";
import { writeFileSync } from 'fs';
import { ensureDirSync, readFileSync, statSync } from 'fs-extra';
import path from 'path';
import prisma from '../prisma';
import { getCurrentTimeInTimeZone } from '../timezone';
/**
 * 根据文件扩展名匹配文件夹
 * @param {string} fileType - 文件扩展名
 * @returns {string} 匹配的文件夹名称
 */
export function getFolderByFileType(fileType: string): string {
    for (const [folder, extensions] of Object.entries(FILE_TYPES)) {
        if (extensions.includes(fileType)) {
            return folder;
        }
    }
    return 'default'; // 默认文件夹
}



async function calculateFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hash = crypto.createHash('md5'); // 使用 md5 生成哈希值
    hash.update(Buffer.from(buffer));
    return hash.digest('hex');
}

// 定义一个函数来生成哈希值
export function generateHashByText(text: string): string {
    return crypto.createHash("md5").update(text).digest("hex");
}

// 获取文件信息
export async function getFileInfo(file: File): Promise<FilesInfo> {
    const hash = await calculateFileHash(file);
    const fileInfo: FilesInfo = {
        file_name: file.name,                      // 文件名
        file_path: '',                             // 这将由保存文件时的路径动态生成
        file_ext: path.extname(file.name), // 文件后缀
        file_type: file.type,                      // MIME类型
        file_size: file.size,                      // 文件大小
        file_fullname: file.name,                  // 文件全名
        hash: hash,                                // 文件的哈希值
        status: 'active',                          // 默认状态
    };

    return fileInfo;
}

// 设置上传文件的存储目录
export const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");
// 设置图片的上传地址
const UPLOAD_IMAGE_DIR = path.join(process.cwd(), "public");

/* 这个代码在开发环境下会执行很多次，但是在生产环境下就是执行一次的，不会带来性能的消耗    */
ensureDirSync(UPLOAD_DIR);
ensureDirSync(UPLOAD_IMAGE_DIR)

// 保存文件
export async function saveFile(blob: File) {
    // 获取文件基本信息 
    const fileInfo = await getFileInfo(blob);
    const filePathFolder = getFolderByFileType(fileInfo.file_ext)
    const uploadDir = filePathFolder === 'image' ? path.join(UPLOAD_IMAGE_DIR, filePathFolder) : path.join(UPLOAD_DIR, filePathFolder);
    ensureDirSync(uploadDir);
    const fileHash = fileInfo.hash;
    const fileName = `${fileHash}${fileInfo.file_ext}`; // 保留文件扩展名
    const fileFinalPath = path.join(uploadDir, fileName);
    // 转为二进制并保存文件
    const arrayBuffer = await blob.arrayBuffer();
    writeFileSync(fileFinalPath, new DataView(arrayBuffer));
    return { ...fileInfo, file_name: fileName, file_path: fileFinalPath, filePathFolder };
}

export async function saveFileInfoIntoDB(fileInfo: FilesInfo) {
    // 获取当前时间，格式化并加上 8 小时
    const datetime = getCurrentTimeInTimeZone();
    const file = await prisma.files_info.create({
        data: {
            file_ext: fileInfo.file_ext,
            file_name: fileInfo.file_name,
            file_fullname: fileInfo.file_fullname,
            file_path: fileInfo.file_path,
            file_size: fileInfo.file_size,
            file_type: fileInfo.file_type,
            upload_time: datetime,
            hash: fileInfo.hash,
            status: fileInfo.status
        }
    });
    return file;
}
interface FileInfo {
    file_name: string;
    file_path: string;
    file_ext: string;
    upload_time?: string;
    modifyTime: string;
    file_type: string;
    file_size: number;
    file_fullname: string;
    hash: string;
}
export function getFileInfoByPath(filePath: string, defaultHash?: string): FileInfo {
    // 获取文件的基本信息
    const stats = statSync(filePath);
    const fileName = path.basename(filePath);
    const fileExt = path.extname(filePath).slice(1); // 获取文件后缀
    const fileType = getMimeType(fileExt); // 获取文件MIME类型
    const fileSize = stats.size;
    const uploadTime = stats.mtime.toISOString(); // 文件的修改时间作为上传时间
    const hash = defaultHash || generateFileHash(filePath); // 计算文件的哈希值
    return {
        file_name: fileName,
        file_path: filePath,
        modifyTime: uploadTime,
        file_ext: fileExt,
        upload_time: uploadTime,
        file_type: fileType,
        file_size: fileSize,
        file_fullname: fileName, // 如果文件名和全名相同
        hash: hash,
    };
}

// 获取文件的 MIME 类型
function getMimeType(fileExt: string): string {
    const mimeTypes: { [key: string]: string } = {
        'txt': 'text/plain',
        'jpg': 'image/jpeg',
        'png': 'image/png',
        'pdf': 'application/pdf',
        'html': 'text/html',
        "md": "application/md"
    };
    return mimeTypes[fileExt] || 'application/octet-stream'; // 默认返回二进制流类型
}

// 生成文件的哈希值
function generateFileHash(filePath: string): string {
    const hash = crypto.createHash('sha256');
    const fileBuffer = readFileSync(filePath); // 读取文件内容
    hash.update(fileBuffer);
    return hash.digest('hex');
}

import { promises as fs } from "fs";
import logger from '../logger';

/**
 * 读取指定路径的文章内容
 * @param filePath 文章文件的相对或绝对路径
 * @returns 返回文章内容字符串
 */
export async function readArticle(filePath: string): Promise<string> {
    try {
        const absolutePath = path.resolve(filePath);
        const content = await fs.readFile(absolutePath, "utf-8");
        return content;
    } catch (error) {
        logger.error({ message: `Error reading file: ${filePath}`, error: error as Error });
        throw new Error("Failed to read article content.");
    }
}
