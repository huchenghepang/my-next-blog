import { config } from 'dotenv';
import { resolve } from 'path';

function loadEnv(envName) {
    const envFile = `.env${envName ? '.' + envName : ''}`;
    const result = config({
        path: resolve(process.cwd(), envFile),
    });

    if (result.error) {
        console.warn(`⚠️ 未找到 ${envFile}，使用空环境`);
        return {};
    }

    console.log(`✅ 成功加载 ${envFile}`);
    return result.parsed || {};
}

export const apps = [
    {
        name: 'sky_blog',
        script: 'pnpm',
        args: 'start',
        instances: 1,
        exec_mode: 'fork',
        interpreter: 'none',  // 关键
        env: {
            NODE_ENV: 'development',
            PORT: 3006,
            ...loadEnv('development'),
        },
        env_production: {
            NODE_ENV: 'production',
            PORT: 3006,
            ...loadEnv('production'),
        },
        env_test: {
            NODE_ENV: 'test',
            PORT: 5000,
            ...loadEnv('test'),
        },
        error_file: './logs/pm2-error.log',
        out_file: './logs/pm2-out.log',
        time: true,
        max_memory_restart: '1G',
        autorestart: true,
    },
];