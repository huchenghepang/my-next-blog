import config from "@/config/config";
import { register_login_schema } from "@/schema/auth";
import { register_login_Interface } from "@/types/params/auth";
import { createApiHandler } from "@/utils/createApiHandler";
import logger from "@/utils/logger";
import prisma from "@/utils/prisma";
import { sendError, sendResponse } from "@/utils/responseHandler/responseHandler";
import { generateSessionId, saveSession } from "@/utils/session/redis-session";
import { validateRequest } from "@/utils/validateRequest";
import { compareSync } from "bcrypt";

export const POST = createApiHandler(async (req) => {
    try {
        const { data, error } = await validateRequest<register_login_Interface>(req, register_login_schema);
        if (!data) {
            return sendError({ errorMessage: error });
        }

        /* 读取判断用户是否存在*/
        const user = await prisma.user_info.findFirst({
            where: {
                account: data.account,
            }
        })
        if (!user) return sendError({ errorMessage: "账号或者用户不存在" });
        const { password, account, user_id } = user
        /* 判断密码是否正确 */
        if (password === '' || !password) {
            return sendError({ errorMessage: "账号是github账号还未进行绑定" })
        }
        const isSucceess = compareSync(data.password, password)
        if (!isSucceess) return sendError({ errorMessage: "当前密码不正确" })

        const roles = await prisma.userRoles.findMany({
            where: { user_id: user_id },
            include: { Roles: true },
            orderBy: { role_id: 'asc' },  // 按 roleID 升序排序
        });
        const firstRole = roles[0]
        /* 所有可选的用户角色 */
        const allRoleIds = roles.map(role => role.role_id)

        /* 生成sessionID */
        const sessionId = generateSessionId()
        const isSaveSuccess = await saveSession(sessionId, {
            expires: config.expireSessionTime, data: {
                user: {
                    account: account, userId: user_id,
                    roles: allRoleIds, currentRole: { role_id: firstRole?.role_id, role_name: firstRole?.Roles.role_name }
                }
            }
        })
        if (!isSaveSuccess) return sendError({ errorMessage: "登录失败" });

        const res = sendResponse({ message: "登录成功", data: { user: { ...user, password: undefined }, roles } })
        res.cookies.set("sky-session", sessionId, {
            maxAge: config.expireSessionTime,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            path: "/"
        })
        return res
    } catch (error) {
        logger.error({ error: error as Error, message: "登录失败" });
        return sendError({ errorMessage: "发生错误" });
    }
});