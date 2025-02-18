import redisClient from '@/db/redis/redis';
import { Rolepermissions } from "@/types/mysql";
import { queryByFieldsWithSelectedFields } from '../db/sql/normal';
import logger from './logger';

export async function validatePermission(
    roldId: number,
    permissionId: number
) {
    /* 先在redis中进行权限的验证 如果没有则请求数据库 */
    try {
        const RedisKeyName = `role:${roldId}:permission:${permissionId}`;
        const exists = await redisClient.existsKey(RedisKeyName)

        if (exists.success && exists.data?.exists) {
            return true
        }
        // 检查 Mysql中的权限状态
        try {
            /* 需要去mysql数据库获取验证信息 */
            const result = await checkPermissionsInMySQL(roldId, permissionId);
            if (result) {
                /* 存入redis */
                 
                redisClient.setKey(RedisKeyName, true);
                return true
            } else {
                return false
            }
        } catch (redisError) {
            const err = redisError as Error
            if (err.message === "Redis connection timeout or refused") {

                return false
            }
            throw err;
        }
    } catch (error) {
        logger.error({error:error as Error,message:"权限验证失败"})
        return false
    }
    /* 在数据库中进行权限的验证 */

}

// 从 MySQL 验证权限
async function checkPermissionsInMySQL(
    roleId: number,
    permissionId: number
) {
    try {
        const result = await queryByFieldsWithSelectedFields<Rolepermissions>("RolePermissions", ["permission_id", "role_id"], [permissionId, roleId], ["permission_id", "role_id"])
        if (!result ) return null;
        if(result.data.length === 0) return null
        return result;
    } catch (error) {
        logger.error({ error: error as Error, message: "权限验证失败" })
        return null
    }
}