import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  encodeSession,
  publicUser,
  SESSION_COOKIE,
  sessionCookieOptions,
  SessionUser
} from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";
import { getPrisma, hasDatabaseUrl } from "@/lib/prisma";

const signinSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required.")
});

export async function POST(request: Request) {
  // 1. Rate Limiting: 5 attempts per minute per IP
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`signin:${clientIp}`, 5, 60);

  if (!rateLimit.success) {
    return NextResponse.json(
      {
        error: `Too many sign-in attempts. Please wait ${rateLimit.resetSeconds} seconds before trying again.`
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.resetSeconds),
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining)
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

  const parsed = signinSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0]?.message ?? "Enter a valid email and password.";
    return NextResponse.json({ error: issue }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { error: "Authentication service unavailable. Database is not configured." },
      { status: 503 }
    );
  }

  // 2. Database-backed authentication
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail }
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
  }

  const sessionUser: SessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    membership: user.membership,
    avatarUrl: user.avatarUrl ?? undefined,
    tokenVersion: user.tokenVersion
  };

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, encodeSession(sessionUser), sessionCookieOptions);

  return NextResponse.json(
    { user: publicUser(sessionUser) },
    {
      headers: {
        "X-RateLimit-Remaining": String(rateLimit.remaining)
      }
    }
  );
}
