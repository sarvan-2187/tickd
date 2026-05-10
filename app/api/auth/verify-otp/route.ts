import { z } from "zod";
import { cookies } from "next/headers";
import sql from "@/lib/db";
import { sha256 } from "@/lib/crypto";
import { signToken } from "@/lib/jwt";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  code: z.string().length(6).regex(/^\d{6}$/),
});

const MAX_ATTEMPTS = 3;
const LOCKOUT_MINUTES = 15;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code } = schema.parse(body);
    const lower = email.toLowerCase().trim();

    // Fetch user
    const [user] = await sql`SELECT id, locked_until FROM users WHERE email = ${lower}`;
    if (!user) {
      return Response.json({ error: "No OTP was sent to this address." }, { status: 400 });
    }

    // Check lockout
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const remaining = Math.ceil(
        (new Date(user.locked_until).getTime() - Date.now()) / 60000
      );
      return Response.json(
        { error: `Account locked. Try again in ${remaining} minute(s).` },
        { status: 429 }
      );
    }

    // Fetch valid OTP
    const [otp] = await sql`
      SELECT id, code_hash, attempts, expires_at
      FROM otps
      WHERE user_id = ${user.id}
        AND used = FALSE
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (!otp) {
      return Response.json({ error: "No active OTP found. Please request a new one." }, { status: 400 });
    }

    // Check expiry
    if (new Date(otp.expires_at) < new Date()) {
      await sql`UPDATE otps SET used = TRUE WHERE id = ${otp.id}`;
      return Response.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
    }

    // Verify code
    const inputHash = sha256(code);
    if (inputHash !== otp.code_hash) {
      const newAttempts = otp.attempts + 1;
      if (newAttempts >= MAX_ATTEMPTS) {
        const lockUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
        await sql`UPDATE users SET locked_until = ${lockUntil.toISOString()} WHERE id = ${user.id}`;
        await sql`UPDATE otps SET used = TRUE, attempts = ${newAttempts} WHERE id = ${otp.id}`;
        return Response.json(
          { error: `Too many attempts. Account locked for ${LOCKOUT_MINUTES} minutes.` },
          { status: 429 }
        );
      }
      await sql`UPDATE otps SET attempts = ${newAttempts} WHERE id = ${otp.id}`;
      return Response.json(
        { error: `Incorrect OTP. ${MAX_ATTEMPTS - newAttempts} attempt(s) remaining.` },
        { status: 400 }
      );
    }

    // Success — mark OTP used, clear lockout
    await sql`UPDATE otps SET used = TRUE WHERE id = ${otp.id}`;
    await sql`UPDATE users SET locked_until = NULL WHERE id = ${user.id}`;

    // Issue JWT session cookie
    const token = signToken({ userId: user.id, email: lower });
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, sessionCookieOptions());

    return Response.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: "Invalid input." }, { status: 400 });
    }
    console.error("[verify-otp]", err);
    return Response.json({ error: "Verification failed. Try again." }, { status: 500 });
  }
}
