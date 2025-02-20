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
    const clientIP = req.headers.get("x-forwarded-for") || "unknown ip"
    console.log(clientIP);
    if (clientIP && !globalConfig.default.allowedIPs.includes(clientIP)) {
        return sendError({ errorMessage: "ip不存在获取ip地址不允许访问", code: "403" })
    }
}

// 主中间件：按顺序执行多个中间件
export function middleware(req: NextRequest) {
    return authMiddleware(req) ||  ipFilterMiddleware(req) || NextResponse.next();
}

// 仅对 `/dashboard` 和 `/admin` 生效
export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*'],
};
