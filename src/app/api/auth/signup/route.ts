import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { encodeSession, publicUser, SESSION_COOKIE, sessionCookieOptions, SessionUser } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";
import { getPrisma, hasDatabaseUrl } from "@/lib/prisma";

const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.string().trim().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .regex(/[A-Za-z]/, "Password must contain at least one letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
});

export async function POST(request: Request) {
  // 1. Rate Limiting: 3 registrations per 10 minutes per IP
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`signup:${clientIp}`, 3, 600);

  if (!rateLimit.success) {
    return NextResponse.json(
      {
        error: `Too many registration attempts. Please wait ${rateLimit.resetSeconds} seconds before trying again.`
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.resetSeconds)
        }
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0]?.message ?? "Please complete all fields correctly.";
    return NextResponse.json({ error: issue }, { status: 400 });
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { error: "Database connection is not configured. Registration unavailable." },
      { status: 503 }
    );
  }

  const prisma = getPrisma();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (existing) {
    return NextResponse.json(
      { error: "An account already exists with this email address." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash,
      role: "MANAGER",
      membership: "PRO"
    }
  });

  // Provision starter hotel suites, work orders, and occupancy logs
  try {
    const allRooms = await prisma.room.findMany({ take: 4 });
    if (allRooms.length > 0) {
      // Create personal starter work orders for the new operations manager
      await prisma.workOrder.createMany({
        data: [
          {
            title: "VIP Penthouse 401 Welcome & Champagne Setup",
            userId: user.id,
            roomId: allRooms[0]?.id,
            status: "TODO",
            priority: "HIGH",
            dueAt: new Date(Date.now() + 2 * 60 * 60 * 1000)
          },
          {
            title: "Suite 204 AC Filter Check & Thermostat Calibration",
            userId: user.id,
            roomId: allRooms[1]?.id,
            status: "IN_PROGRESS",
            priority: "HIGH",
            dueAt: new Date(Date.now() + 4 * 60 * 60 * 1000)
          },
          {
            title: "Restock Premium Wine Cellar in Garden Villa 305",
            userId: user.id,
            roomId: allRooms[2]?.id,
            status: "SUBMITTED",
            priority: "MEDIUM",
            dueAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
          },
          {
            title: "Inspect Poolside Cabanas & Replenish Luxury Towels",
            userId: user.id,
            roomId: allRooms[3]?.id,
            status: "TODO",
            priority: "LOW",
            dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
          }
        ]
      });

      const starterLogs = [
        { day: "Mon", hours: 72 },
        { day: "Tue", hours: 81 },
        { day: "Wed", hours: 86 },
        { day: "Thu", hours: 92 },
        { day: "Fri", hours: 97 },
        { day: "Sat", hours: 98 },
        { day: "Sun", hours: 64 }
      ];
      await prisma.occupancyLog.createMany({
        data: starterLogs.map((l) => ({
          userId: user.id,
          hours: l.hours,
          dayLabel: l.day
        }))
      });
    }
  } catch (err) {
    console.error("Failed to provision starter hotel data for new user:", err);
  }

  const sessionUser: SessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    membership: user.membership,
    tokenVersion: user.tokenVersion
  };

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, encodeSession(sessionUser), sessionCookieOptions);

  return NextResponse.json({ user: publicUser(sessionUser) }, { status: 201 });
}
