import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  decodeSession,
  encodeSession,
  publicUser,
  SESSION_COOKIE,
  sessionCookieOptions
} from "@/lib/auth";
import { getPrisma, hasDatabaseUrl } from "@/lib/prisma";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().optional(),
  bio: z.string().optional()
});

export async function GET() {
  const cookieStore = await cookies();
  const session = decodeSession(cookieStore.get(SESSION_COOKIE)?.value);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
  }

  // If connected to database, fetch fresh user record and computed metrics
  if (hasDatabaseUrl()) {
    try {
      const prisma = getPrisma();
      const [dbUser, roomCount, occupancyLogsAgg, userWorkOrders] = await Promise.all([
        prisma.user.findUnique({
          where: { id: session.id }
        }),
        prisma.room.count(),
        prisma.occupancyLog.aggregate({
          where: { userId: session.id },
          _sum: { hours: true }
        }),
        prisma.workOrder.findMany({
          where: { userId: session.id },
          select: { status: true }
        })
      ]);

      if (dbUser) {
        const completedTasks = userWorkOrders.filter(
          (t) => t.status === "SUBMITTED" || t.status === "COMPLETED"
        ).length;
        const taskRate =
          userWorkOrders.length > 0 ? Math.round((completedTasks / userWorkOrders.length) * 100) : 0;
        const avgOccupancy = Math.round((occupancyLogsAgg._sum.hours ?? 0) / 7) || 84;

        return NextResponse.json({
          user: {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role,
            phone: dbUser.phone ?? "",
            bio: dbUser.bio ?? "",
            membership: dbUser.membership,
            avatarUrl: dbUser.avatarUrl
          },
          stats: {
            classes: roomCount,
            studyHours: avgOccupancy,
            taskCompletionRate: taskRate,
            totalTasks: userWorkOrders.length,
            completedTasks
          }
        });
      }
    } catch (err) {
      console.error("Failed to query user profile from DB:", err);
    }
  }

  return NextResponse.json({
    user: publicUser(session),
    stats: {
      classes: 0,
      studyHours: 0,
      taskCompletionRate: 0,
      totalTasks: 0,
      completedTasks: 0
    }
  });
}

export async function PATCH(request: Request) {
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

  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0]?.message ?? "Profile details are not valid.";
    return NextResponse.json({ error: issue }, { status: 400 });
  }

  const nextSession = {
    ...session,
    name: parsed.data.name,
    email: parsed.data.email
  };

  if (hasDatabaseUrl()) {
    try {
      await getPrisma().user.update({
        where: { id: session.id },
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          bio: parsed.data.bio
        }
      });
    } catch (err) {
      console.error("Failed to update user profile in DB:", err);
      return NextResponse.json({ error: "Failed to persist profile update." }, { status: 500 });
    }
  }

  cookieStore.set(SESSION_COOKIE, encodeSession(nextSession), sessionCookieOptions);

  return NextResponse.json({ user: publicUser(nextSession) });
}
