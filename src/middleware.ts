
import { NextRequest, NextResponse } from "next/server";
import { sendError } from "./app/utils/responseHandler/responseHandler";



// 允许的来源（CORS）
const allowedOrigins = ["http://localhost:4000"];

// API 限流存储（简单示例）
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = 10; // 5 次请求
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 分钟





export async function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const origin = req.headers.get("origin") || "";
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip"); // 适用于 Vercel
    const ip = forwardedFor?.split(",")[0].trim() || realIp || "unknown";

    console.log(`[${new Date().toISOString()}] ${req.method} ${url.pathname} - ${ip}`);

    // 🌍 CORS 处理
    if (req.method === "OPTIONS") {
        if (allowedOrigins.includes(origin)) {
            return new Response(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": origin,
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
            });
        }
        return sendError({code:"403"})
    }

    // 🚧 API 限流（针对 IP）
    if (url.pathname.startsWith("/api")) {
        const now = Date.now();
        const userData = rateLimitMap.get(ip) || { count: 0, timestamp: now };

        if (now - userData.timestamp > RATE_LIMIT_WINDOW) {
            userData.count = 0;
            userData.timestamp = now;
        }

        userData.count += 1;
        rateLimitMap.set(ip, userData);

        if (userData.count > RATE_LIMIT) {
            return sendError({code:"429"})
        }
    }


    // 添加 CORS 头
    const res = NextResponse.next();
    if (allowedOrigins.includes(origin)) {
        res.headers.set("Access-Control-Allow-Origin", origin);
    }
    return res;
}

// 只应用于 `/api` 路径
export const config = {
    matcher: ["/api/:path*"],
};
