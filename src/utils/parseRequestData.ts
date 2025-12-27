import { NextRequest } from "next/server";

/**
 * 解析 Next.js 请求中的数据
 * 根据请求的 Content-Type 自动选择合适的解析方式
 * 
 * @param req - NextRequest 对象，包含 HTTP 请求的所有信息
 * @returns Promise<any> - 解析后的请求数据，解析失败或无数据时返回 null
 * 
 * 支持的 Content-Type:
 * - application/json: 解析为 JSON 对象
 * - application/x-www-form-urlencoded: 解析为键值对对象
 * - multipart/form-data: 解析为包含表单数据的对象
 * - text/plain: 返回原始文本内容
 * 
 * 对于 GET、HEAD、DELETE 请求，直接返回 null（这些方法通常不包含 body）
 * 对于 POST、PUT、PATCH 请求，如果未明确指定 Content-Type，会尝试自动检测
 */
export async function parseRequestData(req: NextRequest): Promise<any> {
  try {
    const contentType = req.headers.get("content-type") || "";

    // GET/HEAD/DELETE 等请求通常没有 body
    if (
      req.method === "GET" ||
      req.method === "HEAD" ||
      req.method === "DELETE"
    ) {
      return null;
    }

    // 根据 Content-Type 解析
    if (contentType.includes("application/json")) {
      return await req.json();
    }

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await req.text();
      return Object.fromEntries(new URLSearchParams(text));
    }

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const data: Record<string, any> = {};
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }
      return data;
    }

    if (contentType.includes("text/plain")) {
      return await req.text();
    }

    // 对于其他有 body 的请求方法，尝试解析文本
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      const text = await req.text();
      if (!text.trim()) return null;

      // 尝试自动检测 JSON
      if (text.startsWith("{") || text.startsWith("[")) {
        try {
          return JSON.parse(text);
        } catch {
          return text;
        }
      }
      return text;
    }

    return null;
  } catch (error) {
    console.error("解析请求数据失败:", error);
    return null;
  }
}

export async function parseRequestDataAndQueryData<T=any,Q=any>(req: NextRequest) {
    const queryParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    let bodyData: any = null;

    const contentType = req.headers.get("content-type") || "";
    if (req.method === "POST" || req.method === "PUT") {
        if (contentType.includes("application/json")) {
            try {
                bodyData = await req.json(); // 解析 JSON
            } catch (error) {
                bodyData = null; // 避免报错
            }
        } else if (contentType.includes("application/x-www-form-urlencoded")) {
            const rawText = await req.text();
            bodyData = Object.fromEntries(new URLSearchParams(rawText));
        }
    }

    return { query: queryParams as Q, body: bodyData as (T | null)};
}




