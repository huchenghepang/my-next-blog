
import pool from '@/db/mysql';
import { Sessions } from '@/types/mysql';
import { SessionData } from '@/types/session';
import { RowDataPacket } from 'mysql2';
import { cookies } from 'next/headers';
import logger from './logger';
type cookiesType = "connect.sid" | "next-auth.session-token" | "next-auth.csrf-token" 
export async function getSession(cookieName: cookiesType = "connect.sid") {
    try {
        const cookieStore = cookies();
        const sessionId = (await cookieStore).get(cookieName)?.value.split(':')[1].split('.')[0];
        
        if (!sessionId) return null;

        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM sessions WHERE session_id = ?', [sessionId]);
        if (!rows || rows.length === 0) return null;
        const session = rows[0] as Sessions;
        /* 解析session数据 */
        if (session.data) {
            const sessionData = JSON.parse(session.data) as SessionData;
            return sessionData;
        } else {
            return null;
        }
    } catch (error) {
        logger.error({error:error as Error,message:"获取session失败"})
        return null
    }

}
