import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { ok: false, error: "DATABASE_URL is not set" },
        { status: 503 }
      );
    }

    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({ ok: true, database: "connected" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Health check failed:", error);
    return NextResponse.json({ ok: false, error: message }, { status: 503 });
  }
}
