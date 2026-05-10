import { z } from "zod";
import sql from "@/lib/db";
import { headers } from "next/headers";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

const LIMIT_HOUR = 3; // 3 requests per hour

export async function POST(request: Request) {
  try {
    const head = await headers();
    const ip = head.get("x-forwarded-for") || "unknown";
    const body = await request.json();
    const { name, email, message } = schema.parse(body);

    const key = "contact_form";
    const identifier = ip;

    // Check rate limit
    const [limit] = await sql`
      SELECT last_request, request_count FROM rate_limits 
      WHERE identifier = ${identifier} AND key = ${key}
    `;

    const now = new Date();
    if (limit) {
      const last = new Date(limit.last_request);
      const diffMs = now.getTime() - last.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours < 1) {
        if (limit.request_count >= LIMIT_HOUR) {
          return Response.json(
            { error: "Too many messages. Please try again in an hour." },
            { status: 429 }
          );
        } else {
          // Increment count
          await sql`
            UPDATE rate_limits SET request_count = request_count + 1, last_request = NOW()
            WHERE identifier = ${identifier} AND key = ${key}
          `;
        }
      } else {
        // Reset count
        await sql`
          UPDATE rate_limits SET request_count = 1, last_request = NOW()
          WHERE identifier = ${identifier} AND key = ${key}
        `;
      }
    } else {
      // Create new limit entry
      await sql`
        INSERT INTO rate_limits (identifier, key, last_request, request_count)
        VALUES (${identifier}, ${key}, NOW(), 1)
      `;
    }

    // If we passed rate limit, forward to NTFY
    const ntfyResponse = await fetch("https://ntfy.sh/tickd-life-2313", {
      method: "POST",
      body: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      headers: {
        "Title": "New Contact Message - Tickd",
        "Tags": "incoming_envelope",
      },
    });

    if (!ntfyResponse.ok) {
      throw new Error("Failed to send to NTFY");
    }

    return Response.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: err.issues[0]?.message ?? "Invalid input." }, { status: 400 });
    }
    console.error("[api/contact]", err);
    return Response.json({ error: "Something went wrong. Try again later." }, { status: 500 });
  }
}
