import type { IStorage } from "./mem-storage";
import { MemStorage } from "./mem-storage";
import { DbStorage } from "./db-storage";

export type { IStorage, WorkProject } from "./mem-storage";

/** `DATABASE_URL`이 있으면 PostgreSQL(Drizzle), 없으면 기존 인메모리 */
export const storage: IStorage = process.env.DATABASE_URL?.trim()
  ? new DbStorage()
  : new MemStorage();
