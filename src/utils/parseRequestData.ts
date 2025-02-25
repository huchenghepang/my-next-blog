import { NextRequest } from "next/server";


export async function parseRequestData(req: NextRequest): Promise<any> {
    let parsedData: any = null;
    const contentType = req.headers.get("content-type") || "";
    if (req.method === "POST" || req.method === "PUT") {
        const rawText = await req.text();
        parsedData = Object.fromEntries(new URLSearchParams(rawText));
    } else if (contentType.includes("application/json")) {
        parsedData = await req.json();
    }
    return parsedData
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




