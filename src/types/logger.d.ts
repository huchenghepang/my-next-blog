// 定义自定义的错误日志参数类型

import { CustomError } from "./error";
import { MysqlError } from "./mysql_error";



type ErrorSource =
    | 'ApplicationError'
    | 'SystemError'
    | 'NetworkError'
    | 'DatabaseError'
    | 'ExternalServiceError';

type ErrorSeverity =
    | 'Fatal'   // 致命错误
    | 'Critical'   // 致命异常
    | 'Error'   // 错误
    | 'Warning'  // 警告
    | 'Info';   // 信息


type ErrorNature =
    | 'SyntaxError'   // 语法错误
    | 'LogicalError'   // 逻辑错误
    | 'RuntimeError'   // 运行时错误
    | 'CompilationError'   // 编译错误
    | 'ResourceError';   // 资源错误

type ErrorRecoverability =
    | 'Recoverable'  // 可恢复错误
    | 'NonRecoverable';  // 不可恢复错误   


type levelType = 'info' | 'warn' | 'error' | 'debug' | 'fatal'

interface Log {
    message: string | Log;  // 日志的简短描述信息
    requestMethod?: string;
    requestPath?: string;
    dateTime?: string;
    detail?: string; // 详细的错误信息
    timestamp?: string;  // 错误发生的时间
    stack?: string | undefined;
    level?: levelType;  // 日志级别
    error?: Error | MysqlError | CustomError ;
    request?: {
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE';  // 请求方法
        url?: string;  // 请求的 URL
        params?: Record<string, any>;  // 请求参数
        requestId?: string;  // 请求 ID
    };
    user?: {
        userId: string;  // 用户 ID
        username: string;  // 用户名
    };
    server?: {
        hostname: string;  // 服务器主机名
        os: string;  // 操作系统信息
    };
    reason?: unknown;
    version?: string;  // 应用版本
    environment?: string;  // 环境（如：production, staging）
    transactionId?: string;  // 事务 ID
    promise?: unknown
}



interface ErrorLogParams extends Log {
    message: string;
    source?: ErrorSource;   // 错误来源
    severity?: ErrorSeverity;   // 错误的严重性
    nature?: ErrorNature;   // 错误的性质
    recoverability?: ErrorRecoverability;   // 错误的可恢复性
    stack?: string;
    level?: 'error';  // 错误的级别
    client?: {
        ip?: string;  // 客户端 IP 地址
        userAgent?: string;  // 客户端的 User-Agent 字符串
    };
    server?: {
        hostname: string;  // 服务器主机名
        os: string;  // 操作系统信息
    };
    transactionId?: string;  // 事务 ID
    [key: string]: any;  // 允许扩展其他不在此范围内的字段
}



export interface ErrorMethod {
    (infoObject: ErrorLogParams): void;
    (message: string): void;
}


export interface LoggerMethod {
    (infoObject: Log): void;
    (message: string): void;
}