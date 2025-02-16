import "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id?: string // 自定义字段：用户 ID
            role?: string // 自定义字段：用户角色
            name?: string | null
            email?: string | null
            image?: string | null
        }
    }
}