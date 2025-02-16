export interface LoginResponse {
    token: string;
    userData: UserData;
}

export interface UserData {
    account: string;
    avatar: null;
    email: null;
    register_datetime: Date;
    signature: null;
    user_id: string;
    username: string;
    permissions: Permission[];
    roles: CurrentRole[];
    currentRole: CurrentRole;
}

export interface CurrentRole {
    role_id: number;
    role_name: string;
}

export interface Permission {
    permission_id: number;
    permission_name: string;
    permission_value: null | string;
    parent_id: number | null;
    type: Type;
}

export type Type = "route" | "button";
