/* 配置MySQL连接  */


import logger from '@/utils/logger';
import mysql, { PoolOptions, RowDataPacket } from 'mysql2/promise';
import config from './config';

// 创建连接池，设置连接池的参数

const options: PoolOptions = {
    // host: '127.0.0.1',
    host: config.mysqlConfig.host,
    port: config.mysqlConfig.port,
    user: config.mysqlConfig.user,
    password: config.mysqlConfig.password,
    database: config.mysqlConfig.database,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 5, // 最大空闲连接数，默认等于 `connectionLimit`
    idleTimeout: 30000, // 调整为30秒      // 空闲连接超时，以毫秒为单位，默认值为 60000 ms
    queueLimit: 20,
    enableKeepAlive: true, // 心跳保持连接
    keepAliveInitialDelay: 0,
}

const pool = mysql.createPool(options);


(() => {
    try {
        pool.query('SELECT 1').then(([rows]) => {
            const result = rows as RowDataPacket[];
            if (result[0] && result[0]['1'] === 1) {
                logger.info('连接成功');
            }
        }).catch((reason) => {
            logger.error({ message: String(reason) });
        });
    } catch (err) {
        logger.error({ message: '数据库连接测试失败：', error: err as Error });
    }
})();
export default pool