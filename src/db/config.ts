export default {
    mysqlConfig: {
        // 连接主机
        host: process.env.NODE_ENV === 'production' ? "127.0.0.1" : "127.0.0.1", // 连接主机
        // 连接端口
        port: 3306,     // 连接端口
        password: "jeff123456", // 连接密码 如果开源就是123456 改动这同时需要改动mysql文件夹下docker-compose.yml下的密码
        user: "my_admin", // 连接用户名     改动这同时需要改动mysql文件夹下docker-compose.yml下的用户名
        database: "blogdb",   // 连接的数据库
    }
}