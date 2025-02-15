import { ErrorStatusCodeValues, HttpStatusCodeValues } from './response';


// 通过断言指定类型
// 通过断言指定类型


/* 通用的响应 */
interface CustomResponse {
    success: boolean;
    code: number;
    message: string;
    data: unknown; 
    timestamp: string;
    requestId: string;
    detail?: string | null;
    errorMessage?: string
}

/* 错误的响应 */
interface CustomErrorResponse {
    code: number;
    detail: string | null;
    errorMessage: string | null;
}

type SendResponseOptions<T = unknown> = {
    message?: string;
    data?: T;
    code?: HttpStatusCodeValues;
};

type SendErrorOptions = {
    code?: ErrorStatusCodeValues;
    detail?: string;
    errorMessage?: string;
};

