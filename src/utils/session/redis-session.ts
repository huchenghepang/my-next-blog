import redisClient from "@/db/redis/redis";
import { SessionData } from "@/types/session";
import { randomUUID } from "crypto";
import logger from "../logger";


/* 生成sessionid */
export function generateSessionId() {
    return randomUUID()
}

/* 保存会话到数据库 */
export async function saveSession(sessionId: string, { expires, data }: { expires: number, data: SessionData }) {
    try {
        const keyName = `sessionId:${sessionId}`
        const result = await redisClient.setKey(keyName, { expires, data }, expires)
        if (!result.success) return false
        return true
    } catch (error) {
        logger.error({ error: error as Error, message: "保存会话出错" })
        return false
    }
}

export async function removeSession(sessionId: string) {
    try {
        const keyName = `sessionId:${sessionId}`
        const result = await redisClient.delKey(keyName)
        if (!result.success) return false
        return true
    } catch (error) {
        logger.error({ error: error as Error, message: "删除会话出错" })
        return false
    }
}

/* 更新会话数据 */
export async function updateSessionData(sessionId: string, newData: Partial<SessionData>) {
    try {
        const keyName = `sessionId:${sessionId}`;

        // 获取当前会话的数据
        const existingSession = await redisClient.getKey<SessionData>(keyName);

        if (!existingSession) {
            logger.warn({ message: `会话 ${sessionId} 不存在，无法更新` });
            return false;
        }

        // 将现有数据与新数据合并，保留旧数据的未变更部分
        const updatedData = { ...existingSession.data, ...newData };

        // 更新会话数据
        const result = await redisClient.setKey(keyName, { expires: existingSession.data?.expires, data: updatedData }, newData.expires || existingSession.data?.expires);

        if (!result.success) {
            logger.error({ message: `更新会话 ${sessionId} 数据失败` });
            return false;
        }
        return true;
    } catch (error) {
        logger.error({ error: error as Error, message: "更新会话数据出错" });
        return false;
    }
}

/* 获取session数据 */

export async function getSessionFromRedis(sessionId: string) {
    try {
        const keyName = `sessionId:${sessionId}`;

        // 从 Redis 获取 session 数据
        const sessionData = await redisClient.getKey<{ expires: number, data: SessionData }>(keyName);

        // 如果 session 不存在
        if (!sessionData || !sessionData.success || !sessionData.data) {
            logger.warn({ message: `会话 ${sessionId} 不存在` });
            return null;
        }
        return sessionData.data;
    } catch (error) {
        logger.error({ error: error as Error, message: "获取会话数据出错" });
        return null;
    }
}

