import { register_login_schema } from "@/app/schema/auth";
import { createApiHandler } from "@/app/utils/createApiHandler";
import { fetcher } from "@/app/utils/fetcher";
import logger from "@/app/utils/logger";
import { sendError } from "@/app/utils/responseHandler/responseHandler";
import { validateRequest } from "@/app/utils/validateRequest";
import { register_login_Interface } from "@/types/params/auth";
import { LoginResponse } from "@/types/response/login.r";
import { NextResponse } from "next/server";

export const POST = createApiHandler(async (req) => {
    try {
        const { data, error } = await validateRequest<register_login_Interface>(req, register_login_schema);
        if (!data) {
            return sendError({ errorMessage: error });
        }

        // 获取客户端请求中的 Cookie
        const clientCookies = req.headers.get('cookie') || '';
       
        // 转发请求到后端服务器，并手动传递 Cookie
        const result = await fetcher<LoginResponse>("http://localhost:3000/api/auth/login", {
            body: JSON.stringify(data),
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Cookie': clientCookies, // 手动传递 Cookie
            },
            credentials:"include", // 确保包含 Cookie
            referrer:req.referrer
        });

        if (result) {
            const response = NextResponse.json(result.data, { status: result.response.status });
            // 从后端服务器的响应中获取新的 Set-Cookie 头
            const serverCookies = result.response.headers.get('set-cookie')
            if (serverCookies) {;
                response.headers.set("set-cookie", serverCookies);
            }
            return response
        }
        return sendError({ errorMessage: "登录失败" });
    } catch (error) {
        logger.error({ error: error as Error, message: "登录失败" });
        return sendError({ errorMessage: "发生错误" });
    }
});