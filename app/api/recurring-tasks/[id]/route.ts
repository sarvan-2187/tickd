import sql from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const resolvedParams = await params;
  const id = resolvedParams.id;

  try {
    const [deleted] = await sql`
      DELETE FROM recurring_tasks
      WHERE id = ${id} AND user_id = ${session.userId}
      RETURNING id
    `;

    if (!deleted) {
      return Response.json({ error: "Task not found." }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("[recurring-tasks DELETE]", err);
    return Response.json({ error: "Failed to delete recurring task." }, { status: 500 });
  }
}
