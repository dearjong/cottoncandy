import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

let pool: pg.Pool | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

/** PostgreSQL + Drizzle. `DATABASE_URL`이 있을 때만 사용합니다. */
export function getDb() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!dbInstance) {
    pool = new pg.Pool({ connectionString: url, max: 10 });
    dbInstance = drizzle(pool, { schema });
  }
  return dbInstance;
}

export async function closeDbPool() {
  if (pool) {
    await pool.end();
    pool = null;
    dbInstance = null;
  }
}
