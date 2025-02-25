


/* 常用的返回状态码 */
// 定义常用的 HTTP 状态码枚举
export enum HttpStatusCode {
    OK = "200",                    // 请求成功
    Created = "201",               // 资源创建成功
    Accepted = "202",              // 请求已接受，但未处理完成
    NoContent = "204",             // 请求成功，但无返回内容
    MultipleChoices = "300",       // 多种选择
    MovedPermanently = "301",      // 资源已永久移动
    Found = "302",                 // 资源临时移动
    SeeOther = "303",              // 查看其他资源
    NotModified = "304",           // 资源未修改
    TemporaryRedirect = "307",     // 临时重定向
    PermanentRedirect = "308"      // 永久重定向
}

type HttpStatusCodeValues = "200" | "201" | "202" | "204" | "300" | "301" | "302" | "303" | "304" | "307" | "308"
    | "400"  // 请求无效
    | "401"  // 未授权
    | "402"  // 需要支付（保留状态码）
    | "403"  // 禁止访问
    | "404"  // 请求的资源未找到
    | "405"  // 方法不被允许
    | "406"  // 不可接受
    | "407"  // 需要代理身份验证
    | "408"  // 请求超时
    | "409"  // 资源冲突
    | "410"  // 资源已被永久删除
    | "411"  // 需要指定内容长度
    | "412"  // 先决条件失败
    | "413"  // 请求实体过大
    | "414"  // 请求的 URI 过长
    | "415"  // 不支持的媒体类型
    | "416"  // 请求范围不符合
    | "417"  // 预期失败
    | "418"  // 我是一个茶壶（愚人节彩蛋状态码）
    | "421"  // 被误导的请求
    | "422"  // 无法处理的实体
    | "423"  // 资源被锁定
    | "424"  // 依赖失败
    | "425"  // 提前请求
    | "426"  // 需要升级协议
    | "428"  // 需要先决条件
    | "429"  // 请求过多
    | "431"  // 请求头字段过大
    | "451"  // 因法律原因不可用
    | "500"  // 服务器内部错误
    | "501"  // 未实现
    | "502"  // 网关错误
    | "503"  // 服务不可用
    | "504"  // 网关超时
    | "505"  // 不支持的 HTTP 版本
    | "506"  // 变体协商失败
    | "507"  // 存储不足
    | "508"  // 循环检测
    | "510"  // 未扩展
    | "511"; // 需要网络身份验证;


export enum ErrorStatusCode {
    // 4xx 客户端错误
    BadRequest = 400,            // 请求无效
    Unauthorized = 401,          // 未授权
    PaymentRequired = 402,       // 需要支付（保留状态码）
    Forbidden = 403,             // 禁止访问
    NotFound = 404,              // 请求的资源未找到
    MethodNotAllowed = 405,      // 方法不被允许
    NotAcceptable = 406,         // 不可接受
    ProxyAuthenticationRequired = 407, // 需要代理身份验证
    RequestTimeout = 408,        // 请求超时
    Conflict = 409,              // 资源冲突
    Gone = 410,                  // 资源已被永久删除
    LengthRequired = 411,        // 需要指定内容长度
    PreconditionFailed = 412,    // 先决条件失败
    PayloadTooLarge = 413,       // 请求实体过大
    URITooLong = 414,            // 请求的 URI 过长
    UnsupportedMediaType = 415,  // 不支持的媒体类型
    RangeNotSatisfiable = 416,   // 请求范围不符合
    ExpectationFailed = 417,     // 预期失败
    ImATeapot = 418,             // 我是一个茶壶（愚人节彩蛋状态码）
    MisdirectedRequest = 421,    // 被误导的请求
    UnprocessableEntity = 422,   // 无法处理的实体
    Locked = 423,                // 资源被锁定
    FailedDependency = 424,      // 依赖失败
    TooEarly = 425,              // 提前请求
    UpgradeRequired = 426,       // 需要升级协议
    PreconditionRequired = 428,  // 需要先决条件
    TooManyRequests = 429,       // 请求过多
    RequestHeaderFieldsTooLarge = 431, // 请求头字段过大
    UnavailableForLegalReasons = 451,  // 因法律原因不可用

    // 5xx 服务器错误
    InternalServerError = 500,   // 服务器内部错误
    NotImplemented = 501,        // 未实现
    BadGateway = 502,            // 网关错误
    ServiceUnavailable = 503,    // 服务不可用
    GatewayTimeout = 504,        // 网关超时
    HTTPVersionNotSupported = 505, // 不支持的 HTTP 版本
    VariantAlsoNegotiates = 506, // 变体协商失败
    InsufficientStorage = 507,   // 存储不足
    LoopDetected = 508,          // 循环检测
    NotExtended = 510,           // 未扩展
    NetworkAuthenticationRequired = 511 // 需要网络身份验证
}
type ErrorStatusCodeValues =
    | "400"  // 请求无效
    | "401"  // 未授权
    | "402"  // 需要支付（保留状态码）
    | "403"  // 禁止访问
    | "404"  // 请求的资源未找到
    | "405"  // 方法不被允许
    | "406"  // 不可接受
    | "407"  // 需要代理身份验证
    | "408"  // 请求超时
    | "409"  // 资源冲突
    | "410"  // 资源已被永久删除
    | "411"  // 需要指定内容长度
    | "412"  // 先决条件失败
    | "413"  // 请求实体过大
    | "414"  // 请求的 URI 过长
    | "415"  // 不支持的媒体类型
    | "416"  // 请求范围不符合
    | "417"  // 预期失败
    | "418"  // 我是一个茶壶（愚人节彩蛋状态码）
    | "421"  // 被误导的请求
    | "422"  // 无法处理的实体
    | "423"  // 资源被锁定
    | "424"  // 依赖失败
    | "425"  // 提前请求
    | "426"  // 需要升级协议
    | "428"  // 需要先决条件
    | "429"  // 请求过多
    | "431"  // 请求头字段过大
    | "451"  // 因法律原因不可用
    | "500"  // 服务器内部错误
    | "501"  // 未实现
    | "502"  // 网关错误
    | "503"  // 服务不可用
    | "504"  // 网关超时
    | "505"  // 不支持的 HTTP 版本
    | "506"  // 变体协商失败
    | "507"  // 存储不足
    | "508"  // 循环检测
    | "510"  // 未扩展
    | "511"; // 需要网络身份验证

interface ApiResponse {
    success: boolean;              // 请求是否成功
    code?: HttpStatusCode | number;                 // HTTP 状态码或自定义状态码
    message: string;              // 操作结果的描述
    data: unknown;              // 返回的数据内容，泛型可以根据具体情况指定
    error: ApiError | null;      // 错误信息，如果有的话
    timestamp: string;            // 响应生成的时间戳
    requestId: string;            // 唯一的请求 ID
    meta?: ApiMeta;              // 额外的元数据（可选）
    ErrorMessage?: string;
    [key: string]: unknown;           // 其他元数据
}


interface ApiError {
    code: HttpStatusCode | number;                 // 错误代码
    description: string;          // 错误描述
}

interface ApiMeta {
    pagination?: Pagination;      // 分页信息（可选）
    version: string;              // API 版本号
    [key: string]: unknown;           // 其他元数据
}

interface Pagination {
    page: number;          // 当前页码
    limit: number;           // 总页数
    total: number;           // 总记录数
    totalPages?:number;
}

export interface PaginationResponse {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}



// 自定义响应内容


type HttpStatusCodes = {
    [key: string]: {
        message: string;
        detail: string;
    };
};


export type PaginationParams = Omit<Pagination, "total">