// lib/prisma.ts

import { PrismaClient } from "@/prisma/generated/prisma/client";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';


const globalForPrisma = global as unknown as { prisma: PrismaClient };
const adapter = new PrismaMariaDb(process.env.DATABASE_URL)
const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,
        'log':
        ['query', 'error', 'warn'],
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;