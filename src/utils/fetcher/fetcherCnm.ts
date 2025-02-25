import { CustomResponse } from "@/types/customResponse";
import { FetcherOptions } from "@/types/fetcher";

export async function fetcherClientCnm<D = unknown, CD = CustomResponse<D>>(
    url: string,
    options?: FetcherOptions,
): Promise<{ response: Response; body?: CD, success: boolean }> {
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
    try {
        const result = await res.json()
        if (!result) {
            return { response: res, success: false }
        }
        if (!result.success) {
            return { response: res, body: result, success: false }
        }
        return { response: res, body: result as CD, success: true }
    } catch (error) {
        return { response: res, success: false }
    }
}