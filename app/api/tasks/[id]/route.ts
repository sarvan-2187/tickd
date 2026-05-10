import { z } from "zod";
import sql from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

const patchSchema = z.object({
  title: z.string().min(1).max(500).trim().optional(),
  status: z.enum(["pending", "completed"]).optional(),
  rollover: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await request.json();
    const updates = patchSchema.parse(body);

    if (Object.keys(updates).length === 0) {
      return Response.json({ error: "No fields to update." }, { status: 400 });
    }

    // Apply updates one field at a time using tagged template queries
    let task = null;

    if (updates.title !== undefined && updates.status !== undefined) {
      const [t] = await sql`
        UPDATE tasks SET title = ${updates.title}, status = ${updates.status}, updated_at = NOW()
        WHERE user_id = ${session.userId} AND id = ${id}
        RETURNING id, title, status, task_date, rollover, updated_at
      `;
      task = t;
    } else if (updates.title !== undefined) {
      const [t] = await sql`
        UPDATE tasks SET title = ${updates.title}, updated_at = NOW()
        WHERE user_id = ${session.userId} AND id = ${id}
        RETURNING id, title, status, task_date, rollover, updated_at
      `;
      task = t;
    } else if (updates.status !== undefined) {
      const [t] = await sql`
        UPDATE tasks SET status = ${updates.status}, updated_at = NOW()
        WHERE user_id = ${session.userId} AND id = ${id}
        RETURNING id, title, status, task_date, rollover, updated_at
      `;
      task = t;
    } else if (updates.rollover !== undefined) {
      const [t] = await sql`
        UPDATE tasks SET rollover = ${updates.rollover}, updated_at = NOW()
        WHERE user_id = ${session.userId} AND id = ${id}
        RETURNING id, title, status, task_date, rollover, updated_at
      `;
      task = t;
    }

    if (!task) return Response.json({ error: "Task not found." }, { status: 404 });
    return Response.json(task);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: err.issues[0]?.message ?? "Invalid input." }, { status: 400 });
    }
    console.error("[tasks PATCH]", err);
    return Response.json({ error: "Failed to update task." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const result = await sql`
    DELETE FROM tasks WHERE id = ${id} AND user_id = ${session.userId}
    RETURNING id
  `;

  if (result.length === 0) {
    return Response.json({ error: "Task not found." }, { status: 404 });
  }

  return Response.json({ success: true });
}
