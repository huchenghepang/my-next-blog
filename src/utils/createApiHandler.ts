import { NextRequest, NextResponse } from 'next/server';
import logger from './logger';
import { sendError } from './responseHandler/responseHandler';
import { Options } from '@/types/response/api';

type ApiHandler = (req: NextRequest) => Promise<NextResponse>;
type Middleware = (req: NextRequest,option:Options) => Promise<NextResponse | void>;



/**
 * 创建一个带有中间件支持的 Next.js API 处理函数
 *
 * @param handler - 核心业务逻辑的处理函数
 * @param options - 选项，包含前置和后置中间件
 * @returns 一个新的 API 处理函数，带有中间件支持
 *
 * @example
 * ```typescript
 * async function handler(req: NextRequest) {
 *   return NextResponse.json({ message: 'Hello, world!' });
 * }
 *
 * async function authMiddleware(req: NextRequest) {
 *   const token = req.headers.get('Authorization');
 *   if (!token) return NextResponse.json({ error: '未授权' }, { status: 401 });
 * }
 *
 * export const GET = createApiHandler(handler, { middlewares: [authMiddleware] });
 * ```
 */
export function createApiHandler(
    handler: ApiHandler,
): ApiHandler {
    return async (req: NextRequest) => {
        try {
            // 执行业务逻辑
            const response = await handler(req);
            return response;
        } catch (error) {
            logger.error({error:error as Error,message:"API处理错误"});
            return sendError({code:"500",errorMessage:"服务器处理错误"})
        }
    };
}

export function createApiHandlerWithOptions(
    handler: Middleware,
) {
    return async (req: NextRequest,options:Options) => {
        try {
            // 执行业务逻辑
            const response = await handler(req, options);
            return response;
        } catch (error) {
            logger.error({ error: error as Error, message: "API处理错误" });
            return sendError({ code: "500", errorMessage: "服务器处理错误" })
        }
    };
}
