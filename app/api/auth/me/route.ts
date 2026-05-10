import sql from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [user] = await sql`
    SELECT id, email, (app_password IS NOT NULL) AS has_app_password
    FROM users WHERE id = ${session.userId}
  `;

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  return Response.json({
    id: user.id,
    email: user.email,
    hasAppPassword: user.has_app_password,
  });
}
