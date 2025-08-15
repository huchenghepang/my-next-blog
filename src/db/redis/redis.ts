
import logger from '@/utils/logger';
import Redis, { Redis as RedisInstance } from 'ioredis';

// 定义通用的响应接口
interface Response<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}


class RedisClient {
    private redis: RedisInstance;

    constructor() {
        this.redis = new Redis({
            host: '127.0.0.1', // Redis 服务器地址
            port: 6379, // Redis 端口
            password: 'h5mJWbSvKB', // Redis 密码
            db: 1, // 数据库索引
            retryStrategy: (times: number) => {
                const maxAttempts = 5; // 最大重试次数
                if (times > maxAttempts) {
                    return null; // 返回 null，停止重试
                }
                const delay = Math.min(times * 100, 2000); // 每次重试的延迟时间
                return delay; // 返回延迟时间，继续重试
            },
            maxRetriesPerRequest: 5, // 每个请求的最大重试次数
            connectTimeout: 10000, // 连接超时时间（毫秒）
        });

        this.handleEvents();
    }

    // 绑定连接事件
    private handleEvents() {
        this.redis.on('connect', () => logger.info('Redis connected successfully.'));
        this.redis.on('error', (err) => logger.error({ message: 'Redis connection error:', error: err }));
        this.redis.on('reconnecting', () => logger.info('Redis reconnecting...'));
        this.redis.on('end', () => logger.info('Redis connection closed.'));
    }

    // 通用错误处理方法
    private handleError(operation: string, error: any): Response {
        logger.error({ message: `Error during ${operation}:`, error });
        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
            throw new Error('Redis connection timeout or refused');
        }
        return { success: false, error: error.message || 'Unknown error' };
    }

    /**
     * 设置键值对
     * @param key 键
     * @param value 值
     * @param expireTimeInSeconds 可选的过期时间（秒）
     */
    async setKey(key: string, value: any, expireTimeInSeconds?: number): Promise<Response> {
        try {
            const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;

            if (expireTimeInSeconds) {
                await this.redis.setex(key, expireTimeInSeconds, valueToStore as string);
            } else {
                await this.redis.set(key, valueToStore as string);
            }
            return { success: true };
        } catch (err) {
            return this.handleError('setKey', err);
        }
    }

    /**
     * 获取键的值
     * @param key 键
     */
    async getKey<T = any>(key: string): Promise<Response<T | null>> {
        try {
            const value = await this.redis.get(key);

            if (!value) return { success: true, data: value as null };
            return { success: true, data: JSON.parse(value) as T }
        } catch (err) {
            return this.handleError('getKey', err);
        }
    }

    /**
     * 删除键
     * @param key 键
     */
    async delKey(key: string): Promise<Response> {
        try {
            await this.redis.del(key);
            return { success: true };
        } catch (err) {
            return this.handleError('delKey', err);
        }
    }

    /**
     * 检查键是否存在
     * @param key 键
     */
    async existsKey(key: string): Promise<Response<{ exists: boolean }>> {
        try {
            const exists = await this.redis.exists(key);
            return { success: true, data: { exists: Boolean(exists) } };
        } catch (err) {
            return this.handleError('existsKey', err);
        }
    }

    /**
     * 获取所有键
     */
    async getAllKeys(): Promise<Response<string[]>> {
        try {
            const keys = await this.redis.keys('*');
            return { success: true, data: keys };
        } catch (err) {
            return this.handleError('getAllKeys', err);
        }
    }

    /**
     * 根据模式匹配并删除所有符合的键
     * @param pattern 匹配模式
     */
    async deleteKeysByPattern(pattern: string): Promise<Response<string[]>> {
        try {
            let cursor = '0';
            const keysToDelete: string[] = [];

            do {
                const [newCursor, keys] = await this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
                cursor = newCursor;

                keysToDelete.push(...keys);
            } while (cursor !== '0');

            if (keysToDelete.length > 0) {
                await this.redis.del(...keysToDelete);
                return { success: true, data: keysToDelete };
            } else {
                return { success: false, message: 'No keys matched the pattern.' };
            }
        } catch (err) {
            return this.handleError('deleteKeysByPattern', err);
        }
    }

    /**
     * 发布消息
     * @param channel 频道
     * @param message 消息内容
     */
    async publishMessage(channel: string, message: string): Promise<Response> {
        try {
            await this.redis.publish(channel, message);
            return { success: true };
        } catch (err) {
            return this.handleError('publishMessage', err);
        }
    }

    /**
     * 订阅频道
     * @param channel 频道
     * @param callback 回调函数
     */
    subscribeToChannel(channel: string, callback: (channel: string, message: string) => void) {
        this.redis.subscribe(channel)
            .then(() => {
                logger.info(`Subscribed to ${channel}`);
                this.redis.on('message', (subscribedChannel: string, message: string) => {
                    if (subscribedChannel === channel) {
                        callback(subscribedChannel, message);
                    }
                });
            })
            .catch((err) => this.handleError('subscribeToChannel', err));
    }

    /**
     * 关闭 Redis 连接
     */
    async quit(): Promise<Response> {
        try {
            await this.redis.quit();
            logger.info('Redis connection closed.');
            return { success: true };
        } catch (err) {
            return this.handleError('quit', err);
        }
    }
}

const redisClient = new RedisClient();
export default redisClient;
