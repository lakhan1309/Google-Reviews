import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { debugLog } from "@/lib/debug-log";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    // #region agent log
    debugLog(
      "lib/prisma.ts:createPrismaClient",
      "DATABASE_URL missing",
      { hasUrl: false },
      "A"
    );
    // #endregion
    throw new Error(
      "DATABASE_URL is not set. Add your Neon connection string in Vercel environment variables."
    );
  }

  // #region agent log
  debugLog(
    "lib/prisma.ts:createPrismaClient",
    "Creating Prisma pool",
    {
      hasUrl: true,
      isNeon: connectionString.includes("neon.tech"),
      host: connectionString.includes("@")
        ? connectionString.split("@")[1]?.split("/")[0]
        : "unknown",
    },
    "A-D"
  );
  // #endregion

  const pool =
    globalForPrisma.pool ??
    new Pool({
      connectionString,
      max: 1,
      idleTimeoutMillis: 20000,
      connectionTimeoutMillis: 10000,
      ssl: connectionString.includes("neon.tech")
        ? { rejectUnauthorized: false }
        : undefined,
    });

  globalForPrisma.pool = pool;

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value;
  },
});
