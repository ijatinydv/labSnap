import { PrismaClient } from "@prisma/client";

// Prevent multiple instances of Prisma Client in development (hot reloading)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Prisma 7: Pass the database URL directly to the constructor
    adapter: undefined, // Using direct connection, not Accelerate
    datasourceUrl: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
