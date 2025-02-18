
import pool from '@/db/mysql';
import { Sessions } from '@/types/mysql';
import { SessionData } from '@/types/session';
import { RowDataPacket } from 'mysql2';
import { cookies } from 'next/headers';
import logger from './logger';
import { getSessionFromRedis } from './session/redis-session';
type cookiesType = "connect.sid" | "sky-session"




export async function parseSessionValueBykey(cookieName: cookiesType) {
    const cookieStore = cookies();
    switch (cookieName) {
        case "connect.sid":
            return (await cookieStore).get(cookieName)?.value.split(':')[1].split('.')[0];
        case "sky-session":
            return (await cookieStore).get(cookieName)?.value
        default:
            break;
    }
}




export async function getSession(cookieName: cookiesType = "connect.sid") {
    try {

        const sessionId = await parseSessionValueBykey(cookieName)
        if (!sessionId) return null;

        switch (cookieName) {
            case "connect.sid":
                const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM sessions WHERE session_id = ?', [sessionId]);
                if (!rows || rows.length === 0) return null;
                const session = rows[0] as Sessions;
                /* 解析session数据 */
                if (session.data) {
                    const sessionData = JSON.parse(session.data) as SessionData;
                    return sessionData;
                }else{
                    return null
                }
            case "sky-session":
                const sessionData = await getSessionFromRedis(sessionId)    
                return {...sessionData?.data}
            default:
                break;
        }
    } catch (error) {
        logger.error({ error: error as Error, message: "获取session失败" })
        return null
    }
}
