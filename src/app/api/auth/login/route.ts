import { register_login_schema } from "@/app/schema/auth";
import { createApiHandler } from "@/app/utils/createApiHandler";
import { fetcher } from "@/app/utils/fetcher";
import logger from "@/app/utils/logger";
import { sendError, sendResponse } from "@/app/utils/responseHandler/responseHandler";
import { validateRequest } from "@/app/utils/validateRequest";
import { register_login_Interface } from "@/types/params/auth";

export const POST = createApiHandler(async(req)=>{
    try {
        const { data, error } = await validateRequest<register_login_Interface>(req, register_login_schema);
        if (!data) {
            return sendError({ errorMessage: error });
        }
        const result =await fetcher("http://localhost:3000/api/auth/login",{body:JSON.stringify(data),method:"POST"})
        if (result.success) return  sendResponse({data:result.data})
        return sendError({errorMessage:result.errorMessage})
    } catch (error) {
        logger.error({error:error as Error,message:"登录失败"})
        return sendError({errorMessage:"发生错误"})
    }
})