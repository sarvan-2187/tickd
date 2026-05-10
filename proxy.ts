import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { SESSION_COOKIE } from "@/lib/auth";

const PROTECTED = ["/tasks", "/settings"];
const PUBLIC_ONLY = ["/", "/verify", "/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isPublicOnly = PUBLIC_ONLY.includes(pathname);

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? verifyToken(token) : null;

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect authenticated users away from public auth pages
  if (isPublicOnly && session) {
    return NextResponse.redirect(new URL("/tasks", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/verify", "/login", "/tasks/:path*", "/settings/:path*"],
};
