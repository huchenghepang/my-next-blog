import { createApiHandler } from "@/utils/createApiHandler";
import logger from "@/utils/logger";
import prisma from '@/utils/prisma';
import { sendError, sendResponse } from '@/utils/responseHandler/responseHandler';
import { getSession } from "@/utils/session";


export const GET = createApiHandler(async () => {
    try {
        const session = await getSession("sky-session");
        
        if (!session || !session.user) return sendError({errorMessage:"缺少验证信息",code:"403"})
        const { userId, currentRole, roles } = session.user
        if (userId && currentRole && currentRole.role_id) {
            const user = await prisma.user_info.findUnique({
                where: {
                    user_id: userId
                },
                select: { username: true, user_id: true, signature: true, account: true, avatar: true, email: true, register_datetime: true },
            })
            if (!user) return sendError({ errorMessage: "无法验证身份" });

            const permissions = await prisma.rolePermissions.findMany({
                where: { role_id: currentRole.role_id }, include: {
                    Permissions: {
                        select: { "permission_name": true, "permission_id": true, "permission_value": true }
                    }
                }
            });
            if (!permissions) return sendError({ errorMessage: "无法验证身份" });
            const newPermissions = permissions.map((rolePermisss => {
                return rolePermisss.Permissions
            }))
            return sendResponse({ data: { user: user, permissions: newPermissions, roles, currentRole } })
        }
        return sendError({ errorMessage: "无法验证身份" })
    } catch (error) {
        logger.error({ error: error as Error, message: "获取用户信息出错" });
        return sendError({ errorMessage: "获取用户信息发生错误" });
    }
})


interface UserDetail {
    user_id: string;
    account: string;
    register_datetime: Date | null;
    username: string;
    avatar: string ;
    email: string | null;
    signature: string | null;
}

interface Permissions {
    permission_id: number;
    permission_name: string;
    permission_value: string | null;
}

export interface UserInfo {
    user: UserDetail, permissions: Permissions[], roles: number[] | undefined, currentRole: {
        role_id?: number;
        role_name?: string;
    }
}