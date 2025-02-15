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



