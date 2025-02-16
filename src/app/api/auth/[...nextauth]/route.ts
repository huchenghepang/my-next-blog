import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        })
    ],
    session: {
        maxAge: 1 * 24 * 60 * 60, // 
        updateAge: 24 * 60 * 60, // 每天更新会话有效期
    },
    jwt: {
        maxAge: 1* 24 * 60 * 60, 
    },
    cookies: {
        sessionToken: {
            name: "next-auth.session-token",
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 1 * 24 * 60 * 60, 
                path: "/",
            },
        },
    },
    callbacks: {
        async session({ session, token, user }) {
            // 将用户 ID 添加到会话中
            if (session.user) {
                session.user.id = token.sub as string
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                // 初次登录时，将用户 ID 添加到 JWT 中
                token.id = user.id
            }
            return token
        },
        async redirect({url,baseUrl}){
            // 这里你可以自定义重定向逻辑
            if (url.startsWith("/")) {
                // 允许相对路径的重定向
                return `${baseUrl}${url}`;
            } else if (new URL(url).origin === baseUrl) {
                // 允许同源的重定向
                return url;
            }
            // 默认重定向到首页
            return baseUrl;
        },
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST };

