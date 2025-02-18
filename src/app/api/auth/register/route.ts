import { register_login_schema } from "@/schema/auth";
import { register_login_Interface } from "@/types/params/auth";
import { createApiHandler } from "@/utils/createApiHandler";
import logger from "@/utils/logger";
import prisma from "@/utils/prisma";
import { sendError, sendResponse } from "@/utils/responseHandler/responseHandler";
import { validateRequest } from "@/utils/validateRequest";
import { hashSync } from "bcrypt";
import { v5 as uuidv5 } from 'uuid';

const MY_NAMESPACE = uuidv5("huchenghedezidingyi", uuidv5.DNS);

/* 保存账号数据 */
const nicknames = ["风一样的少年", "代码狂魔", "夜空中最亮的星", "神秘访客", "未知生物"];
export const POST = createApiHandler(async (req) => {
    try {
        const { data, error } = await validateRequest<register_login_Interface>(req, register_login_schema);
        if (!data) {
            return sendError({ errorMessage: error });
        }

        /* 查询是否存在该用户 */
        const user = await prisma.user_info.findFirst({ where: { user_id: data.account } })
        if (user) return sendError({ errorMessage: "当前账号已被注册" })
        /* 生成唯一的用户ID */
        const userId = uuidv5(data.account, MY_NAMESPACE);
        /* 加密密码 */
        const passwordBcrypted = hashSync(data.password, 10);

        const defaultUsername = nicknames[Math.floor(Math.random() * nicknames.length)];

        await prisma.user_info.create({
            data: {
                user_id: userId,
                account: data.account,
                password: passwordBcrypted,
                username: defaultUsername,
                avatar:"https://www.gravatar.com/avatar/00000000000000000000000000000000?d=robohash"
            }
        })
        return sendResponse({ message: "注册成功" })
    } catch (error) {
        logger.error({ error: error as Error, message: "注册失败" });
        return sendError({ errorMessage: "注册出现错误错误" });
    }
});