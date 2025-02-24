import { createApiHandler, createApiHandlerWithOptions } from "@/utils/createApiHandler";
import { sendResponse } from "@/utils/responseHandler/responseHandler";

export const GET = createApiHandlerWithOptions(async (req,{params:{ar}})=>{

    return sendResponse({message:"成功"})
})