import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set.");
  }

  if (!databaseUrl.startsWith("prisma://")) {
    throw new Error(
      "Prisma 7 requires Prisma Accelerate for MongoDB at runtime. Use a prisma:// DATABASE_URL or install prisma and @prisma/client 6.19.x for direct MongoDB URLs."
    );
  }

  return new PrismaClient({
    accelerateUrl: databaseUrl,
  });
}

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }

  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const value = Reflect.get(getPrismaClient(), prop, receiver);
    return typeof value === "function" ? value.bind(getPrismaClient()) : value;
  },
});
