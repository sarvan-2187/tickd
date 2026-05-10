import { z } from "zod";
import sql from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { encrypt } from "@/lib/crypto";
import { sendTestEmail } from "@/lib/email";

const schema = z.object({
  appPassword: z
    .string()
    .regex(
      /^[a-z]{4} [a-z]{4} [a-z]{4} [a-z]{4}$/i,
      "App Password must be in the format: xxxx xxxx xxxx xxxx (16 lowercase letters)"
    ),
});

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { appPassword } = schema.parse(body);

    // Verify the App Password by sending a test email
    await sendTestEmail(session.email, appPassword);

    // Encrypt and store
    const encrypted = encrypt(appPassword);
    await sql`
      UPDATE users SET app_password = ${encrypted} WHERE id = ${session.userId}
    `;

    return Response.json({ success: true, message: "App Password verified and saved." });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: err.issues[0]?.message ?? "Invalid input." }, { status: 400 });
    }
    // Nodemailer auth failure
    if ((err as NodeJS.ErrnoException).code === "EAUTH") {
      return Response.json(
        { error: "Invalid App Password. Authentication failed. Please check and try again." },
        { status: 400 }
      );
    }
    console.error("[app-password POST]", err);
    return Response.json({ error: "Failed to verify App Password." }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await getSessionUser();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await sql`UPDATE users SET app_password = NULL WHERE id = ${session.userId}`;
  return Response.json({ success: true });
}
