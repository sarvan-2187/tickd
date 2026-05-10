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
const sql = neon(dbUrl);

async function main() {
  const columns = await sql`
    SELECT column_name, column_default, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'tasks' AND column_name = 'rollover';
  `;
  console.log(JSON.stringify(columns, null, 2));
  process.exit(0);
}

main();
