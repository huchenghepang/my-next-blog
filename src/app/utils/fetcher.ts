import { CustomResponse } from "@/types/customResponse";
import logger from "./logger";

// 定义允许的 HTTP 方法
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';
type ContentType = 
    | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'
    | 'text/plain'
    | 'application/xml'
    | 'text/xml'
    | 'application/octet-stream';

// 定义 FetchHeaders
type FetchHeaders =
    | Headers
    | HeaderObject
    | string[][];

// 预定义常见 Header 类型（允许 `string | number | boolean`，但最终要转换成字符串）
interface HeaderObject {
    // 通用 Header
    Accept?: string;
    Authorization?: string;
    'Cache-Control'?: string;
    Connection?: 'keep-alive' | 'close' | string;
    'Content-Length'?: number;
    'Content-Type'?: ContentType;
    Cookie?: string;
    Date?: string;
    Expect?: string;
    Forwarded?: string;
    Host?: string;
    Referer?: string;
    'User-Agent'?: string;

    // CORS 相关
    Origin?: string;
    'Access-Control-Request-Method'?: string;
    'Access-Control-Request-Headers'?: string;

    // 自定义和调试 Header
    'X-Requested-With'?: string;
    'X-Forwarded-For'?: string;
    'X-Forwarded-Host'?: string;
    'X-Forwarded-Proto'?: string;
    'X-Correlation-ID'?: string;
    'X-Trace-ID'?: string;
    
    // 允许额外 Header（索引签名）
    [key: string]: string | number | boolean | undefined;
}


interface FetcherOptions extends Omit<RequestInit, 'headers' | 'method'> {
    method?: HttpMethod; // 限制method为特定的HTTP方法
    headers?: FetchHeaders  ;
    contentType?: ContentType; // 内容类型
}

export async function fetcher<D = unknown>(
    url: string,
    options?: FetcherOptions
): Promise<{ response: Response; data: D | null}> {
    const { contentType = "application/json", method = "GET", ...restOptions } = options || {};

    const headers: HeadersInit = {
        "Content-Type": contentType,
        ...restOptions?.headers,
    } as unknown as HeadersInit;

    const res = await fetch(url, {
        method,
        ...restOptions,
        headers,
    });

    let data: D | null;

    try {
        const contentType = res.headers.get("content-type");
        if (contentType?.includes("application/json")) {
            data = (await res.json()) as D;
        } else if (contentType?.includes("text")) {
            data = (await res.text()) as D;
        } else {
            data = (await res.blob()) as D; // 其他情况，可能是文件流
        }
    } catch (error) {
        data = null ; // 失败时，返回 `null` 并强制类型转换
    }

    return { response: res, data };
}

export async function fetcherWithRetry<T>(
    url: string,
    options?: RequestInit,
    retries = 3
): Promise<T> {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const res = await fetch(url, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    ...options?.headers,
                },
            });
            if (!res.ok) {
                logger.error({ message: "请求有问题，响应了不正确的资源" })
            }
            if (!res) {
                logger.error({ message: "请求有问题，没有接收到响应" })
            }

            return await res.json();
        } catch (error) {
            if (attempt === retries - 1) throw error;
        }
    }
    throw new Error("Fetch failed after retries");
}

