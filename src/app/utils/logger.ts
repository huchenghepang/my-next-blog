import { ErrorMethod, levelType, Log, LoggerMethod } from '@/types/logger';
import chalk from 'chalk';
import { stringify } from 'flatted';
import fs from 'fs';
import { createLogger, format, Logger, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { getCurrentDateTime } from './formatDateTime';
import { isValidVariable } from './generalUtils';


const logDir = 'logs'; // 设置日志目录

// 创建日志目录（如果不存在）
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}



// 自定义格式化函数
const customJsonFormat = format((info) => {
    // 干预日志字段
    info.environment = process.env.NODE_ENV || 'development'; // 添加环境信息
    info.datetime = getCurrentDateTime()
    return info;
});

/* 打印控制台提示词 */
const tips = {
    "otherInfo": chalk.blue('other infomation')
}


function formatStack(stack: string | undefined): string {
    // 存在调用栈
    if (typeof stack === 'string') {
        // 将调用栈分成每行进行处理，去除不必要的空格和换行
        const stackArray = stack.split('\n');
        const formattedStack = stackArray
            .map((item, index) => {
                if (index % 2 === 1) {
                    return chalk.bgHex("#2e3b4e").hex("#bfa")(`${index}:  ${item.trim()}`)
                } else {
                    return chalk.bgHex("#3b3b3b").hex("#bfa")(`${index}:  ${item.trim()}`)
                }
            }) // 为栈信息添加统一的缩进
            .join('\n');

        // 返回格式化后的日志信息
        return "\n" + formattedStack;
    }

    return ''
}

function formatLevelAndMessage(message: string, level: levelType) {
    switch (level) {
        case "error":
            return `level：[${chalk.bgRed(level)}] - message:${chalk.red(message)}`;
        case "debug":
            return `level：[${chalk.bgGreen(level)}] - message:${chalk.green(message)}`;
        case "warn":
            return `level：[${chalk.bgBlue(level)}] - message:${chalk.blue(message)}`
        default:
            return `level：[${level}] - message:${message}`
    }
}

function formatDetailInfo(info: string | object): string {
    if (typeof info === "string") {
        return info
    } else {
        /* 处理对象将其字符串化 */
        return stringify(info);
    }
}


function formatError(err: Error) {
    const fotmattedLogInfo = isValidVariable(err.stack) ? formatStack(err.stack) : "";
    return `errorName:${chalk.red(err.name)}:\n` + `errorMessage:${chalk.green(err.message)}` + `\n${fotmattedLogInfo}`
}

/**
 * 日志格式，包含时间戳和自定义格式化输出
 */
const logFormat = process.env.NODE_ENV === "development" ? format.combine(
    format.printf((info) => {
        /* 开发环境配置 */
        const { message, level, ...otherInfo } = info as Log;
        if (typeof message === 'string') {
            if (message !== '') {
                const newFormatMessage = formatLevelAndMessage(message, level!)
                const { stack, error, ...logInfo } = otherInfo;
                const stackString = formatStack(stack);
                const ErrorString = error ? formatError(error) : "";
                const fotmattedLogInfo = isValidVariable(logInfo) ? formatDetailInfo(logInfo) : "";
                return getCurrentDateTime() + `   ` + newFormatMessage + stackString + fotmattedLogInfo + `\n${ErrorString}`
            }
            return getCurrentDateTime() + `   ` + formatLevelAndMessage(message, level!)
        } else {
            const { stack, message: innerMessage, error, ...logInfo } = message;
            const newFormatMessage = formatLevelAndMessage(innerMessage as string, level!)
            const stackString = formatStack(stack);
            const fotmattedLogInfo = isValidVariable(logInfo) ? formatDetailInfo(logInfo) : "";
            const ErrorString = error ? formatError(error) : "";
            return getCurrentDateTime() + `   ` + newFormatMessage + stackString + fotmattedLogInfo + `\n${ErrorString}`
        }
    }),
) : format.combine(
    customJsonFormat(),
    format.json()
);




// 默认日志级别
let level = 'info'; // 默认级别为 info

/**
 * 日志传输器数组，包含控制台传输器
 * @type {(transports.ConsoleTransportInstance | DailyRotateFile)[]}
 */
const transportsArray: (transports.ConsoleTransportInstance | DailyRotateFile)[] = [
    new transports.Console({
        format: logFormat,
    }),

];

// 根据当前环境设置不同的日志级别和输出方式
if (process.env.NODE_ENV === 'production') {
    level = 'warn'; // 生产环境只记录警告及以上级别的日志
    transportsArray.pop();
    transportsArray.push(
        new DailyRotateFile({
            format: logFormat,
            filename: `${logDir}/%DATE%.log`, // 日志文件名带日期
            datePattern: 'YYYY-MM-DD', // 每天一个日志文件
            zippedArchive: true, // 日志文件压缩
            maxSize: '20m', // 日志文件大小限制为 20MB
            maxFiles: '14d', // 保留 14 天的日志文件
        })
    );
} else if (process.env.NODE_ENV === 'development') {
    level = 'debug'; // 开发环境记录调试级别的日志
}





/**
 * 创建并配置 logger 实例
 * @type {import('winston').Logger}
 */
const winstomLogger = createLogger({
    level, // 设置日志级别
    transports: transportsArray, // 设置日志输出方式
});

// 错误日志处理，未捕获的异常将输出到指定的文件
winstomLogger.exceptions.handle(
    new DailyRotateFile({
        filename: `${logDir}/exceptions/%DATE%-error.log`, // 异常日志文件
        datePattern: 'YYYY-MM-DD', // 每天一个日志文件
        maxFiles: '30d', // 保留 30 天的日志
        zippedArchive: true, // 异常日志文件压缩
        format: format.combine(
            format.timestamp(),
            format.json() // 异常日志记录为 JSON 格式，便于机器解析
        ),
    }),
);


/* 自己封装logger */



class CustomLogger {
    private logger: Logger;



    constructor() {
        this.logger = winstomLogger;
    }

    // 自定义的 error 方法
    public error: ErrorMethod = (infoObject: object | string) => {
        this.logger.error(infoObject)
    }

    // 自定义的 warn 方法
    public warn: LoggerMethod = (infoObject: object | string) => {
        this.logger.warn(infoObject)
    }

    // 自定义的 info 方法
    public info: LoggerMethod = (infoObject: object | string) => {
        this.logger.info(infoObject)
    }

    // 自定义的 debug 方法
    public debug: LoggerMethod = (infoObject: object | string) => {
        this.logger.debug(infoObject)
    }

    // 获取原始 logger 实例，方便做更复杂的日志操作
    public getLogger(): Logger {
        return this.logger;
    }
}
const logger = new CustomLogger();
// 导出封装后的 logger 实例
export default logger