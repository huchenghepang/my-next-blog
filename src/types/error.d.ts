import { HttpStatusCodeValues } from "./response";

type ErrorName =
    | "DecryptionFailed"        // 解密失败
    | "EncryptionFailed"        // 加密失败
    | "RequestError"            // 请求错误
    | "InvalidParameter"        // 参数错误
    | "ServerProcessingError"   // 服务器处理错误
    | "CORSIssue"               // 跨域错误
    | "JWTParsingError"         // JWT 解析错误
    | "AuthenticationError"     // 身份验证错误
    | "AuthorizationError"      // 权限验证错误
    | "DatabaseError"           // 数据库错误
    | "NetworkError"            // 网络错误
    | "TimeoutError"            // 超时错误
    | "ValidationError"         // 数据验证错误
    | "ResourceNotFound"        // 资源未找到
    | "ConflictError"           // 数据冲突错误
    | "DependencyError"         // 依赖错误
    | "UnknownError"           // 未知错误
    | "OnlyImageAllow" // 只允许图片
    | "ECONNREFUSED"
    | "ETIMEDOUT"


interface CustomError extends Error {
    name: ErrorName;
    code?: HttpStatusCodeValues; // 可选的 `code` 属性
}

