import { NextResponse } from "next/server";
import { getPrisma, hasDatabaseUrl } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "disconnected";
  let dbLatencyMs = 0;

  if (hasDatabaseUrl()) {
    try {
      const prisma = getPrisma();
      const dbStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      dbLatencyMs = Date.now() - dbStart;
      dbStatus = "connected";
    } catch (err) {
      console.error("Health check database error:", err);
      dbStatus = "error";
    }
  }

  const isHealthy = !hasDatabaseUrl() || dbStatus === "connected";
  const statusCode = isHealthy ? 200 : 503;

  return NextResponse.json(
    {
      status: isHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      environment: process.env.NODE_ENV || "development",
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs
      },
      responseTimeMs: Date.now() - startTime
    },
    {
      status: statusCode,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache"
      }
    }
  );
}
