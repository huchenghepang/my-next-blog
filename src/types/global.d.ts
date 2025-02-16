declare namespace NodeJS {
    interface ProcessEnv {
        PORT?: string;
        NODE_ENV?: 'development' | 'production';
        GITHUB_ID:string;
        GITHUB_SECRET:string;
        NEXTAUTH_SECRET:string;
        NEXTAUTH_URL:string;
        API_TARGET:string;
    }
}

