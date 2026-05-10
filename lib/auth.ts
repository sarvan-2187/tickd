import { cookies } from "next/headers";
import { verifyToken, type JWTPayload } from "@/lib/jwt";

export const SESSION_COOKIE = "dt_session";

/**
 * Reads the session cookie and verifies the JWT.
 * Returns the decoded payload or null if unauthenticated / expired.
 */
export async function getSessionUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Cookie options — HttpOnly, Secure, SameSite=Lax, 24h maxAge.
 */
export function sessionCookieOptions(maxAge = 60 * 60 * 24) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
