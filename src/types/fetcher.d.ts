// 定义允许的 HTTP 方法
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';
export type ContentType =
    | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'
    | 'text/plain'
    | 'application/xml'
    | 'text/xml'
    | 'application/octet-stream';

// 定义 FetchHeaders
export type FetchHeaders =
    | Headers
    | HeaderObject
    | string[][];

// 预定义常见 Header 类型（允许 `string | number | boolean`，但最终要转换成字符串）
export interface HeaderObject {
    // 通用 Header
    Accept?: string;
    Authorization?: string;
    'Cache-Control'?: string;
    Connection?: 'keep-alive' | 'close' | string;
    'Content-Length'?: number;
    'Content-Type'?: ContentType;
    Cookie?: string;
    Date?: string;
    Expect?: string;
    Forwarded?: string;
    Host?: string;
    Referer?: string;
    'User-Agent'?: string;

    // CORS 相关
    Origin?: string;
    'Access-Control-Request-Method'?: string;
    'Access-Control-Request-Headers'?: string;

    // 自定义和调试 Header
    'X-Requested-With'?: string;
    'X-Forwarded-For'?: string;
    'X-Forwarded-Host'?: string;
    'X-Forwarded-Proto'?: string;
    'X-Correlation-ID'?: string;
    'X-Trace-ID'?: string;

    // 允许额外 Header（索引签名）
    [key: string]: string | number | boolean | undefined;
}


export interface FetcherOptions extends Omit<RequestInit, 'headers' | 'method'> {
    method?: HttpMethod; // 限制method为特定的HTTP方法
    headers?: FetchHeaders;
    contentType?: ContentType; // 内容类型
}