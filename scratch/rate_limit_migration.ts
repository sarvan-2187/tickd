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
    console.log("Creating rate_limits table...");
    await sql`
      CREATE TABLE IF NOT EXISTS rate_limits (
        id SERIAL PRIMARY KEY,
        identifier TEXT NOT NULL,
        key TEXT NOT NULL,
        last_request TIMESTAMPTZ DEFAULT NOW(),
        request_count INTEGER DEFAULT 1,
        UNIQUE(identifier, key)
      );
    `;
    console.log("Migration complete!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    process.exit(0);
  }
}

migrate();
