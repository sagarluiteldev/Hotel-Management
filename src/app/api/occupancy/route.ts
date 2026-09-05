import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { decodeSession, SESSION_COOKIE } from "@/lib/auth";
import { getPrisma, hasDatabaseUrl } from "@/lib/prisma";

const logOccupancySchema = z.object({
  hours: z.number().min(0.5).max(100),
  courseTitle: z.string().optional()
});

const defaultWeeklyLogs: Record<string, number> = {
  Mon: 72,
  Tue: 81,
  Wed: 86,
  Thu: 92,
  Fri: 97,
  Sat: 98,
  Sun: 64
};

export async function GET() {
  const cookieStore = await cookies();
  const session = decodeSession(cookieStore.get(SESSION_COOKIE)?.value);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
  }

  if (hasDatabaseUrl() && session.id !== "demo-user") {
    try {
      const prisma = getPrisma();
      const logs = await prisma.occupancyLog.findMany({
        where: { userId: session.id },
        orderBy: { loggedAt: "asc" }
      });

      if (logs.length > 0) {
        const aggregated: Record<string, number> = { ...defaultWeeklyLogs };
        for (const log of logs) {
          if (log.dayLabel) {
            aggregated[log.dayLabel] = log.hours;
          }
        }
        return NextResponse.json({ logs: aggregated });
      }
    } catch (err) {
      console.error("Error fetching occupancy logs:", err);
    }
  }

  return NextResponse.json({ logs: defaultWeeklyLogs });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = decodeSession(cookieStore.get(SESSION_COOKIE)?.value);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const parsed = logOccupancySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please provide valid occupancy percentage (10 to 100)." }, { status: 400 });
  }

  const { hours, courseTitle } = parsed.data;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDay = days[new Date().getDay()];

  if (hasDatabaseUrl() && session.id !== "demo-user") {
    try {
      const prisma = getPrisma();

      if (courseTitle) {
        const room = await prisma.room.findFirst({
          where: { title: courseTitle }
        });
        if (room) {
          await prisma.room.update({
            where: { id: room.id },
            data: {
              progress: Math.min(100, Math.round(hours))
            }
          });
        }
      }

      await prisma.occupancyLog.create({
        data: {
          userId: session.id,
          hours,
          dayLabel: currentDay
        }
      });
    } catch (err) {
      console.error("Failed to record occupancy in DB:", err);
    }
  }

  return NextResponse.json({
    ok: true,
    day: currentDay,
    hours
  });
}
