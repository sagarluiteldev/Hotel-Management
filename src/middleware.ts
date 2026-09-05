import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "learning_dashboard_session";

// Paths that don't require authentication
const PUBLIC_PATHS = ["/signin", "/signup", "/api/auth", "/api/health"];

// Paths that are always accessible (static assets, Next.js internals)
const IGNORED_PREFIXES = ["/_next", "/favicon", "/uploads"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip middleware for static assets and Next.js internals
  if (IGNORED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // 2. CSRF Protection: Verify Origin on mutating requests to API
  if (["POST", "PATCH", "PUT", "DELETE"].includes(request.method) && pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");

    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          return NextResponse.json(
            { error: "CSRF check failed: Cross-origin mutation request blocked." },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json({ error: "Invalid Origin header." }, { status: 400 });
      }
    }
  }

  // 3. Allow public auth pages and health check route
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    const session = request.cookies.get(SESSION_COOKIE);
    if (session?.value && (pathname === "/signin" || pathname === "/signup")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 4. Redirect legacy route URLs to new hotel routes
  if (pathname === "/classes") {
    return NextResponse.redirect(new URL("/rooms", request.url));
  }
  if (pathname === "/teachers") {
    return NextResponse.redirect(new URL("/staff", request.url));
  }
  if (pathname === "/tasks") {
    return NextResponse.redirect(new URL("/work-orders", request.url));
  }

  // 5. Require authentication for all operational routes
  const session = request.cookies.get(SESSION_COOKIE);
  if (!session?.value) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const signinUrl = new URL("/signin", request.url);
    if (pathname !== "/") {
      signinUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(signinUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (browser favicon)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon\\.ico).*)"
  ]
};
