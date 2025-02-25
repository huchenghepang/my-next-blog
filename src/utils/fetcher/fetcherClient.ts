import { showMessage } from "@/components/Message/MessageManager";
import { CustomResponse } from "@/types/customResponse";
import { FetcherOptions } from "@/types/fetcher";

export async function fetcherClient<D = unknown, CD = CustomResponse<D>>(
    url: string,
    options?: FetcherOptions,
): Promise<{ response: Response; body?: CD , success: boolean }> {
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
            showMessage({ type: "error", text: "解析失败" })
            return { response: res,  success: false }
        }
        if (!result.success) {
            showMessage({ type: "error", text: result?.errorMessage || "请求失败" })
            return { response: res, body: result, success: false }
        }
        showMessage({ type: "success", text: result.message || '获取数据成功' })
        return { response: res, body: result as CD, success: true }
    } catch (error) {
        showMessage({ type: "error", text: "请求出错" })
        return { response: res, success: false }
    }
}