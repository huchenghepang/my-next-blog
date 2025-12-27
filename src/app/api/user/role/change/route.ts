import { change_role_schema } from "@/schema/user";
import { createApiHandler } from "@/utils/createApiHandler";
import logger from "@/utils/logger";
import prisma from "@/utils/prisma";
import {
  sendError,
  sendResponse,
} from "@/utils/responseHandler/responseHandler";
import { parseSessionValueBykey } from "@/utils/session";
import { updateSessionData } from "@/utils/session/redis-session";

export const POST = createApiHandler(
  async (req) => {
    try {
      const data = req.data;
      const roles = await prisma.userRoles.findFirst({
        where: {
          user_id: data.userId,
          role_id: data.roleId,
        },
        include: {
          Roles: true,
        },
      });
      if (!roles) return sendError({ errorMessage: "没有权限切换到该角色" });
      const sessionid = await parseSessionValueBykey("sky-session");
      if (!sessionid) return sendError({ errorMessage: "切换角色失败" });
      const isSuccess = await updateSessionData(sessionid, {
        user: {
          userId: data.userId,
          currentRole: {
            role_id: roles.role_id,
            role_name: roles.Roles.role_name,
          },
        },
      });
      if (!isSuccess) return sendError({ errorMessage: "切换角色失败" });
      return sendResponse({
        message: "切换角色成功",
        data: {
          currentRole: {
            role_id: roles.role_id,
            role_name: roles.Roles.role_name,
          },
        },
      });
    } catch (error) {
      logger.error({ error: error as Error, message: "切换角色出错" });
      return sendError({ errorMessage: "切换角色出错" });
    }
  },
  {
    schema: change_role_schema,
  }
);
