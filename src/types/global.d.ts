declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string
    NODE_ENV?: "development" | "production"
    GITHUB_ID: string
    GITHUB_SECRET: string
    NEXTAUTH_SECRET: string
    NEXTAUTH_URL: string
    API_TARGET: string
    DATABASE_URL: string
    DATABASE_STORE_URL: string
    GITHUB_CALLBACK_URL: string
    /** The base URL of the server (optional if you're using the same domain) */
    BETTER_AUTH_URL?: string
  }
}

// 声明 CSS 模块和普通 CSS 文件的类型
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.sass' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.less' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.styl' {
  const content: Record<string, string>;
  export default content;
}

// 声明图片文件的类型
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.gif' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default value;
}