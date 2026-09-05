import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decodeSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { getPrisma, hasDatabaseUrl } from "@/lib/prisma";

export async function POST() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(SESSION_COOKIE)?.value;
  const session = decodeSession(sessionValue);

  // Server-side session revocation: increment tokenVersion
  if (session?.id && hasDatabaseUrl()) {
    try {
      const prisma = getPrisma();
      await prisma.user.update({
        where: { id: session.id },
        data: { tokenVersion: { increment: 1 } }
      });
    } catch (err) {
      console.error("Failed to revoke session token in DB:", err);
    }
  }

  // Clear cookie
  cookieStore.set(SESSION_COOKIE, "", {
    ...sessionCookieOptions,
    maxAge: 0
  });
  cookieStore.delete(SESSION_COOKIE);

  return NextResponse.json({ ok: true, message: "Signed out successfully." });
}
