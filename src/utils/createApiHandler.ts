import { NextRequest, NextResponse } from 'next/server';
import logger from './logger';

type ApiHandler = (req: NextRequest) => Promise<NextResponse>;
type Middleware = (req: NextRequest) => Promise<NextResponse | void>;

interface ApiHandlerOptions {
    middlewares?: Middleware[];
}

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
            return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
        }
    };
}
