import { z } from "zod";
import sql from "@/lib/db";
import { sha256 } from "@/lib/crypto";
import { sendOTP } from "@/lib/email";

const schema = z.object({
  email: z.string().email("Please provide a valid Gmail address."),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = schema.parse(body);

    const lower = email.toLowerCase().trim();

    // Check lockout
    const [user] = await sql`
      SELECT id, locked_until FROM users WHERE email = ${lower}
    `;

    if (user?.locked_until && new Date(user.locked_until) > new Date()) {
      const remaining = Math.ceil(
        (new Date(user.locked_until).getTime() - Date.now()) / 60000
      );
      return Response.json(
        { error: `Account locked. Try again in ${remaining} minute(s).` },
        { status: 429 }
      );
    }

    // Upsert user
    const [upserted] = await sql`
      INSERT INTO users (email) VALUES (${lower})
      ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
      RETURNING id
    `;

    // Invalidate existing OTPs
    await sql`UPDATE otps SET used = TRUE WHERE user_id = ${upserted.id} AND used = FALSE`;

    // Generate 6-digit OTP
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = sha256(code);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await sql`
      INSERT INTO otps (user_id, code_hash, expires_at)
      VALUES (${upserted.id}, ${codeHash}, ${expiresAt.toISOString()})
    `;

    // Send email
    await sendOTP(lower, code);

    return Response.json({ success: true, message: "OTP sent. Check your inbox." });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: err.issues[0]?.message ?? "Invalid input." }, { status: 400 });
    }
    console.error("[send-otp]", err);
    return Response.json({ error: "Failed to send OTP. Try again." }, { status: 500 });
  }
}
