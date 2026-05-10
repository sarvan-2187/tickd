import sql from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1, "Title is required").max(500),
});

export async function GET() {
  const session = await getSessionUser();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const recurringTasks = await sql`
      SELECT id, title, created_at
      FROM recurring_tasks
      WHERE user_id = ${session.userId}
      ORDER BY created_at ASC
    `;
    return Response.json(recurringTasks);
  } catch (err) {
    console.error("[recurring-tasks GET]", err);
    return Response.json({ error: "Failed to fetch recurring tasks." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { title } = createSchema.parse(body);

    const [task] = await sql`
      INSERT INTO recurring_tasks (user_id, title)
      VALUES (${session.userId}, ${title})
      RETURNING id, title, created_at
    `;

    return Response.json(task, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: err.issues[0]?.message ?? "Invalid input." }, { status: 400 });
    }
    console.error("[recurring-tasks POST]", err);
    return Response.json({ error: "Failed to create recurring task." }, { status: 500 });
  }
}
