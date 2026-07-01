import { NextResponse } from "next/server";
import { debugLog } from "@/lib/debug-log";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const envCheck = {
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasAuthSecret: !!(process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET),
    hasAdminEmail: !!process.env.ADMIN_EMAIL,
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
    hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
    nodeEnv: process.env.NODE_ENV,
    databaseHost: process.env.DATABASE_URL?.includes("@")
      ? process.env.DATABASE_URL.split("@")[1]?.split("/")[0] ?? null
      : null,
  };

  // #region agent log
  debugLog(
    "api/debug-admin/route.ts:GET",
    "Admin env diagnostic",
    envCheck,
    "A-B-C"
  );
  // #endregion

  let dbStatus: { ok: boolean; error?: string } = { ok: false };

  try {
    if (!process.env.DATABASE_URL) {
      dbStatus = { ok: false, error: "DATABASE_URL not set" };
    } else {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = { ok: true };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown DB error";
    dbStatus = { ok: false, error: message };
    // #region agent log
    debugLog(
      "api/debug-admin/route.ts:GET",
      "DB connection failed",
      { error: message },
      "A-D"
    );
    // #endregion
  }

  return NextResponse.json({ env: envCheck, database: dbStatus });
}
