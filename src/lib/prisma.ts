import {PrismaClient} from "@/prisma/generated/prisma/client"
import {PrismaPg} from "@prisma/adapter-pg"

const globalForPrisma = global as unknown as {prisma: PrismaClient}

// 正确的方式：使用配置对

const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL})

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ["query", "error", "warn"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
