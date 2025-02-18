import { createApiHandler } from "@/utils/createApiHandler";
import logger from "@/utils/logger";
import { sendError, sendResponse } from "@/utils/responseHandler/responseHandler";
import { parseSessionValueBykey } from "@/utils/session";
import { removeSession } from "@/utils/session/redis-session";

export const GET = createApiHandler(async (req) => {
    try {
        const sessionID = await parseSessionValueBykey("sky-session");
        if (!sessionID) return sendError({ errorMessage: "退出登录失败，当前没有登录" });

        /* 清除服务器保存的会话 */
        const isSuccess = await removeSession(sessionID);
        if (!isSuccess) return sendError({ errorMessage: "退出登录失败" });

        /* 通知客户端清除cookie信息 */
        const response = sendResponse({ message: "退出登录成功" });
        response.cookies.delete("sky-session"); // 这里正确删除 Cookie

        return response;
    } catch (error) {
        logger.error({ error: error as Error, message: "退出登录出错" });
        return sendError({ code: "500", errorMessage: "退出登录出错" });
    }
});
