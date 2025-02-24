import { NextRequest, NextResponse } from 'next/server';
import logger from './logger';
import { sendError } from './responseHandler/responseHandler';

type Options = { params: any };

type ApiHandler = (req: NextRequest, options?: Options) => Promise<NextResponse>;
type Middleware = (req: NextRequest) => Promise<NextResponse | void>;

/**
 * 创建一个带有中间件支持的 Next.js API 处理函数
 *
 * @param handler - 核心业务逻辑的处理函数，接受 `NextRequest` 和可选的 `options` 参数，返回一个 `NextResponse`。
 * @param options - 选项对象，包含额外的配置选项，比如中间件等。默认为 `undefined`。
 * @returns 返回一个新的 API 处理函数，这个函数会先处理任何中间件，然后调用核心的 `handler` 业务逻辑。
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
    options?: Options
): ApiHandler {
    return async (req: NextRequest, options) => {
        try {
            // 执行业务逻辑
            const response = await handler(req);
            return response;
        } catch (error) {
            logger.error({ error: error as Error, message: 'API处理错误' });
            return sendError({ code: '500', errorMessage: '服务器处理错误' });
        }
    };
}
