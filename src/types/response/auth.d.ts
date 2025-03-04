export interface AuthLoginResponse  {
    user: User
    roles: Role[]
}

export interface User {
    index: number
    user_id: string
    account: string
    register_datetime: string
    is_login: number
    is_delete: number
    username: string
    role: any
    avatar: string
    email: any
    signature: any
}

export interface Role {
    user_id: string
    role_id: number
    Roles: Roles
}

export interface Roles {
    role_id: number
    role_name: string
    description: string
    created_at: string
    updated_at: string
}
