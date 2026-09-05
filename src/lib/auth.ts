import crypto from "crypto";
import { getPrisma, hasDatabaseUrl } from "./prisma";

export const SESSION_COOKIE = "learning_dashboard_session";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role?: "ADMIN" | "MANAGER" | "STAFF" | "GUEST";
  membership: "FREE" | "PRO" | "TEAM";
  avatarUrl?: string;
  tokenVersion?: number;
};

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30 // 30 days
};

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "CRITICAL SECURITY ERROR: SESSION_SECRET environment variable is missing in production. Generate a random 64-char key."
      );
    }
    return "development-secret-key-32-chars-minimum-dashboard-seed";
  }
  if (process.env.NODE_ENV === "production" && secret.length < 32) {
    throw new Error(
      "CRITICAL SECURITY ERROR: SESSION_SECRET in production must be at least 32 characters long."
    );
  }
  return secret;
}

function signPayload(payloadB64: string): string {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(payloadB64)
    .digest("base64url");
}

export function encodeSession(user: SessionUser): string {
  const payload = Buffer.from(JSON.stringify(user), "utf8").toString("base64url");
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

export function decodeSession(value?: string | null): SessionUser | null {
  if (!value || typeof value !== "string") {
    return null;
  }

  const parts = value.split(".");
  if (parts.length !== 2) {
    return null;
  }

  const [payload, signature] = parts;
  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(payload);

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  // Constant-time comparison to prevent timing attacks
  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const raw = Buffer.from(payload, "base64url").toString("utf8");
    const json = JSON.parse(raw);
    if (!json || typeof json !== "object" || !json.id || !json.email) {
      return null;
    }
    return json as SessionUser;
  } catch {
    return null;
  }
}

/**
 * Validates session against database to support immediate session revocation (e.g. on logout or password change).
 */
export async function validateSessionWithDb(session: SessionUser | null): Promise<SessionUser | null> {
  if (!session) return null;
  if (!hasDatabaseUrl()) return session;

  try {
    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { id: true, name: true, email: true, role: true, membership: true, avatarUrl: true, tokenVersion: true }
    });

    if (!user) return null;

    // Check if session token version matches database record
    if (session.tokenVersion !== undefined && user.tokenVersion !== session.tokenVersion) {
      return null; // Session has been revoked!
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      membership: user.membership,
      avatarUrl: user.avatarUrl ?? undefined,
      tokenVersion: user.tokenVersion
    };
  } catch (err) {
    console.error("Session verification error:", err);
    return session;
  }
}

export function publicUser(user: SessionUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    membership: user.membership,
    avatarUrl: user.avatarUrl
  };
}
