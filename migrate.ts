import { neon } from "@neondatabase/serverless";
import * as fs from "fs";

function getEnvVar(key: string): string {
  try {
    const content = fs.readFileSync(".env.local", "utf-8");
    const match = content.match(new RegExp(`^${key}=(.*)$`, "m"));
    if (match) return match[1].trim().replace(/^['"]|['"]$/g, '');
  } catch (e) {}
  
  try {
    const content = fs.readFileSync(".env", "utf-8");
    const match = content.match(new RegExp(`^${key}=(.*)$`, "m"));
    if (match) return match[1].trim().replace(/^['"]|['"]$/g, '');
  } catch (e) {}
  
  return process.env[key] || "";
}

const dbUrl = getEnvVar("DATABASE_URL");
if (!dbUrl) throw new Error("No DATABASE_URL found");

const sql = neon(dbUrl);

async function migrate() {
  try {
    console.log("Creating recurring_tasks table...");
    await sql`
      CREATE TABLE IF NOT EXISTS recurring_tasks (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title      TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    
    console.log("Altering tasks table to add recurring_task_id...");
    await sql`
      ALTER TABLE tasks ADD COLUMN IF NOT EXISTS recurring_task_id UUID REFERENCES recurring_tasks(id) ON DELETE CASCADE;
    `;
    console.log("Migration complete!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    process.exit(0);
  }
}

migrate();
