import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as {
  prisma: any
}

// Create a typed Prisma client that works with Accelerate
const createPrismaClient = () => {
  const client = new PrismaClient()
  
  // Only use accelerate if we have the proper DATABASE_URL
  if (process.env.DATABASE_URL?.includes('prisma-data.net')) {
    return client.$extends(withAccelerate()) as any
  }
  
  return client as any
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
