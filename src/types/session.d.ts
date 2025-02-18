
export interface SessionData {
    user?: {
        userId?: string | undefined,
        account?: string,
        currentRole?: {
            role_id?: number;
            role_name?: string;
        };
        [key: string]: any;
    };
    expires?:number;
    captcha?: string
}