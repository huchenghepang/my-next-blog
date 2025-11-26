/* 配置MySQL连接  */


import logger from '@/utils/logger';
import mysql, { PoolOptions, RowDataPacket } from 'mysql2/promise';
import config from './config';
const parseMysqlUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parsed.port || "3306", // MySQL 默認端口
      user: parsed.username,
      password: parsed.password,
      database: parsed.pathname.substring(1), // 去掉開頭的 '/'
    };
  } catch (error) {
    logger.error("Invalid MySQL URL format");
    return null;
  }
};
// 创建连接池，设置连接池的参数

const options: PoolOptions = {
  // host: '127.0.0.1',
  uri: config.mysqlConfig.url,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 5, // 最大空闲连接数，默认等于 `connectionLimit`
  idleTimeout: 30000, // 调整为30秒      // 空闲连接超时，以毫秒为单位，默认值为 60000 ms
  queueLimit: 20,
  enableKeepAlive: true, // 心跳保持连接
  keepAliveInitialDelay: 0,
};
const connectionInfo = parseMysqlUrl(config.mysqlConfig.url);
if (connectionInfo) {
  console.log("MySQL Connection Info:", {
    host: connectionInfo.host,
    port: connectionInfo.port,
    user: connectionInfo.user,
    database: connectionInfo.database,
  });
}

const pool = mysql.createPool(options);

(() => {
  try {
    pool
      .query("SELECT 1")
      .then(([rows]) => {
        const result = rows as RowDataPacket[];
        if (result[0] && result[0]["1"] === 1) {
          logger.warn("连接成功");

          // 顯示連接信息
          console.log("✅ MySQL connection pool initialized successfully");
          if (connectionInfo) {
            console.log("Connected to MySQL server:", {
              host: connectionInfo.host,
              port: connectionInfo.port,
              database: connectionInfo.database,
              user: connectionInfo.user,
            });
          }

          if (connectionInfo) {
            logger.warn(
              `连接的 MySQL 服务器地址: ${connectionInfo.host}:${connectionInfo.port}`
            );
            logger.warn(`数据库: ${connectionInfo.database}`);
            logger.warn(`用户名: ${connectionInfo.user}`);
          }
        }
      })
      .catch((reason) => {
        logger.error({ message: String(reason) });
      });
  } catch (err) {
    logger.error({ message: "数据库连接测试失败：", error: err as Error });
  }
})();
export default pool