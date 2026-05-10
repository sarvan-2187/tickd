import { z } from "zod";
import sql from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

const createSchema = z.object({
  title: z.string().min(1).max(500).trim(),
  task_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export async function GET(request: Request) {
  const session = await getSessionUser();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");
  const today = new Date().toISOString().split("T")[0];
  const taskDate = dateParam || today;

  if (taskDate >= today) {
    // 1. Fetch recurring tasks
    const recurringTasks = await sql`
      SELECT id, title FROM recurring_tasks WHERE user_id = ${session.userId}
    `;

    if (recurringTasks.length > 0) {
      // 2. Fetch existing tasks for this date
      const existingTasks = await sql`
        SELECT recurring_task_id FROM tasks 
        WHERE user_id = ${session.userId} AND task_date = ${taskDate} AND recurring_task_id IS NOT NULL
      `;
      const existingRecIds = new Set(existingTasks.map((t) => t.recurring_task_id));

      // 3. Find missing recurring tasks
      const missing = recurringTasks.filter((rt) => !existingRecIds.has(rt.id));

      // 4. Insert missing recurring tasks one by one (serverless driver limitation workaround)
      for (const rt of missing) {
        await sql`
          INSERT INTO tasks (user_id, title, task_date, recurring_task_id)
          VALUES (${session.userId}, ${rt.title}, ${taskDate}, ${rt.id})
        `;
      }
    }
  }

  const tasks = await sql`
    SELECT id, title, status, task_date, rollover, created_at, updated_at, recurring_task_id
    FROM tasks
    WHERE user_id = ${session.userId}
      AND task_date = ${taskDate}
    ORDER BY created_at ASC
  `;

  return Response.json(tasks);
}

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { title, task_date } = createSchema.parse(body);
    const today = new Date().toISOString().split("T")[0];
    const finalDate = task_date || today;

    const [task] = await sql`
      INSERT INTO tasks (user_id, title, task_date)
      VALUES (${session.userId}, ${title}, ${finalDate})
      RETURNING id, title, status, task_date, rollover, created_at, updated_at
    `;

    return Response.json(task, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: err.issues[0]?.message ?? "Invalid input." }, { status: 400 });
    }
    console.error("[tasks POST]", err);
    return Response.json({ error: "Failed to create task." }, { status: 500 });
  }
}
