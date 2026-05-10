import sql from "@/lib/db";
import { decrypt } from "@/lib/crypto";
import { sendNightlyReport } from "@/lib/email";

export const runtime = "nodejs";

export async function GET(request: Request) {
  // Validate cron secret
  const authHeader = request.headers.get("Authorization");
  const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;

  if (!authHeader || authHeader !== expectedSecret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];
  const results: { email: string; status: string; error?: string }[] = [];

  try {
    const users = await sql`
      SELECT id, email, app_password
      FROM users
      WHERE app_password IS NOT NULL
    `;

    for (const user of users) {
      try {
        const appPassword = decrypt(user.app_password);

        const tasks = await sql`
          SELECT id, title, status, recurring_task_id
          FROM tasks
          WHERE user_id = ${user.id}
          AND task_date = ${today}
          ORDER BY created_at ASC
        `;

        const dateStr = new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        await sendNightlyReport(
          user.email,
          appPassword,
          tasks as {
            id: string;
            title: string;
            status: "pending" | "completed";
            recurring_task_id: string | null;
          }[],
          dateStr
        );

        results.push({
          email: user.email,
          status: "sent",
        });
      } catch (err) {
        console.error(`[cron] Failed for ${user.email}:`, err);

        results.push({
          email: user.email,
          status: "failed",
          error: String(err),
        });
      }
    }

    return Response.json({
      success: true,
      date: today,
      results,
    });
  } catch (err) {
    console.error("[cron/nightly]", err);

    return Response.json(
      { error: "Cron job failed." },
      { status: 500 }
    );
  }
}