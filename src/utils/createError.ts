import { CustomError, ErrorName } from "@/types/error";
import { HttpStatusCodeValues } from "@/types/response";


// 创建一个自定义错误对象
export function createError(name: ErrorName, message: string, code?: HttpStatusCodeValues): CustomError {
    const err = new Error(message) as CustomError; // 将 Error 转换为 CustomError 类型
    err.name = name; // 设置错误的名称
    if (code) {
        err.code = code; // 如果传入了 `code`，则设置 `code` 属性
    }
    return err; // 返回创建的错误对象
}

    