import config from "@/config/config";
import { createApiHandler } from "@/utils/createApiHandler";
import logger from "@/utils/logger";
import prisma from "@/utils/prisma";
import { sendError } from "@/utils/responseHandler/responseHandler";
import { generateSessionId, saveSession } from "@/utils/session/redis-session";
import axios from "axios";
import { NextResponse } from "next/server";

export const GET = createApiHandler(async (req) => {
    const code = req.nextUrl.searchParams.get('code')
    if (!code) {
        return sendError({ code: "401", errorMessage: "github登录失败" })
    }

    
    try {
        // 获取 Access Token
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_ID,
                client_secret: process.env.GITHUB_SECRET,
                code,
            },
            {
                timeout: 100000,
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const { access_token } = tokenResponse.data;


        if (!access_token) {
            return sendError({ code: "400", errorMessage: "获取 Access Token 失败" });
        }

        // 使用 Access Token 获取用户信息
        const userResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!userResponse.ok) {
            return sendError({ code: "400", errorMessage: "获取用户信息失败" });
        }

        const userData = await userResponse.json();

        // 整理并返回需要的字段
        const userResponseData = {
            username: userData.login,
            id: userData.id,
            avatarUrl: userData.avatar_url,
            profileUrl: userData.html_url,
            name: userData.name || "No Name Provided",
            followersCount: userData.followers,
            followingCount: userData.following,
            publicReposCount: userData.public_repos,
            accountCreatedAt: userData.created_at,
            bio: userData.bio || "No bio provided",
            location: userData.location || "Location not provided",
            company: userData.company || "Company not provided",
            email: userData.email || "Email not provided",
            hireable: userData.hireable || false,
            twoFactorAuthenticationEnabled: userData.two_factor_authentication,
        };

        const userID = userResponseData.id + ''

        /* 查询这个用户有没有注册账号 如果没有则自动注册 */
        const user = await prisma.user_info.findFirst({
            where: {
                user_id: userID
            }
        })
        if (!user) {
            /* 加密密码 */
            /* 注册绑定账号 */
            const user = await prisma.user_info.create({
                data: {
                    account: userData.login,
                    user_id: userID,
                    username: userData.name,
                    avatar: userData.avatarUrl,
                    password: ""
                }
            })
            if(!user) return sendError({errorMessage:"登录GitHub失败"})
            
        }

        /* 保存session */
        const sessionId = generateSessionId();
        saveSession(sessionId, { expires: config.expireSessionTime, data: { user: { userId: userID, account: userData.login } } })

        const res = NextResponse.redirect("http://localhost:4000/user")
        res.cookies.set("sky-session", sessionId, {
            maxAge: config.expireSessionTime,  
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:"lax",
            path:"/"
        })
        return res
    } catch (error) {
        logger.error({ message: "GitHub 授权处理失败", error: error as Error });
        return sendError({ code: "401", errorMessage: "GitHub 授权处理失败" });
    }
});
