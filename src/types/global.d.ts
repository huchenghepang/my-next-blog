declare namespace NodeJS {
    interface ProcessEnv {
        PORT?: string;
        NODE_ENV?: 'development' | 'production';
        GITHUB_ID:string;
        GITHUB_SECRET:string;
        NEXTAUTH_SECRET:string;
        NEXTAUTH_URL:string;
        API_TARGET:string;
        DATABASE_URL:string;
        DATABASE_STORE_URL:string;
        GITHUB_CALLBACK_URL:string;
    }
}

