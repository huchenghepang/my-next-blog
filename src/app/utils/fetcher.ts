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
interface FetcherOptions extends Omit<RequestInit, 'headers' | 'method'> {
    method?: HttpMethod; // 限制method为特定的HTTP方法
    headers?: Record<string, string | number | boolean>;
    contentType?: ContentType; // 内容类型
}

export async function fetcher<T = CustomResponse>(
    url: string,
    options?: FetcherOptions
): Promise<T> {
    const { contentType = "application/json", method = 'GET', ...restOptions } = options || {}; // 默认 method 为 GET
    const headers: Record<string, string> = {
        "Content-Type": contentType , // 默认使用application/json
        ...restOptions?.headers,
    };

    const res = await fetch(url, {
        method, // 使用传递的method值
        ...restOptions,
        headers,
    });

    if (!res.ok) {
        logger.error({ message: "请求有问题，响应了不正确的资源" });
    }

    if (!res) {
        logger.error({ message: "请求有问题，没有接收到响应" });
    }

    return res.json() as Promise<T>;
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

