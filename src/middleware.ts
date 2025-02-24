import * as globalConfig from '@/config/config';
import { sendError } from '@/utils/responseHandler/responseHandler';
import { NextRequest, NextResponse } from 'next/server';

// 中间件1：身份验证
function authMiddleware(req: NextRequest) {
    const token = req.cookies.get('sky-session');
    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

// 中间件2：IP 限制（仅允许特定IP访问）
function ipFilterMiddleware(req: NextRequest) {
    const clientIP = req.headers.get("x-forwarded-for") || "unknown ip";
    if (clientIP && !globalConfig.default.allowedIPs.includes(clientIP)) {
        return sendError({ errorMessage: "ip不存在或获取ip地址不允许访问", code: "403" });
    }
}

// 中间件3：拦截 favicon.ico 请求
function faviconMiddleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 如果请求路径以 favicon.ico 结尾，直接返回 404
    if (pathname.endsWith('favicon.ico')) {
        return NextResponse.redirect(new URL('/icons/favico.ico', req.url));
    }

    return NextResponse.next(); // 继续处理其他请求
}

// 中间件4：拦截对于post的请求，增加文章的阅读量

// 主中间件：按顺序执行多个中间件
export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 优先拦截 favicon.ico 请求
    const faviconResponse = faviconMiddleware(req);
    if (faviconResponse) {
        return faviconResponse;
    }

    // 针对 `/dashboard` 和 `/admin` 路径的特定路由
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
        // 处理身份验证和IP限制
        const authResponse = authMiddleware(req);
        if (authResponse) {
            return authResponse;
        }

        const ipFilterResponse = ipFilterMiddleware(req);
        if (ipFilterResponse) {
            return ipFilterResponse;
        }
    }

    // 默认情况下，继续处理其他请求
    return NextResponse.next();
}

// 配置：faviconMiddleware 匹配全局，其余的匹配特定路径
export const config = {
    matcher: ['/((?!favicon\.ico$).*)', '/dashboard/:path*', '/admin/:path*'],
};