import { FetcherOptions } from "@/types/fetcher";
import logger from "./logger";



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

