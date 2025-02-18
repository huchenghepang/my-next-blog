import { createApiHandler } from "@/utils/createApiHandler";
import logger from "@/utils/logger";
import { NextResponse } from "next/server";
import querystring from "querystring";
export const GET = createApiHandler(async () => {
    try {
        const params = querystring.stringify({
            client_id: process.env.GITHUB_ID,
            redirect_uri: process.env.GITHUB_CALLBACK_URL,
            scope: "read:user user:email", // 请求用户基本信息和邮箱
        });
        const githubAuthURL = `https://github.com/login/oauth/authorize?${params}`;
        return NextResponse.redirect(githubAuthURL);
    } catch (error) {
        logger.error({ error: error as Error, message: "" });
        // 返回一个NextResponse错误响应
        return NextResponse.json({ error: "GitHub登录失败" }, { status: 500 });
    }
});