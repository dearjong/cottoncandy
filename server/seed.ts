/**
 * PostgreSQL에 목업 데이터 적재 (Work 홈 카드 등).
 * 사용: DATABASE_URL 설정 후 `npm run db:push` → `npm run db:seed`
 */
import "dotenv/config";
import { getDb } from "./db";
import { messages, notifications, projects, users, workProjects } from "@shared/schema";
import {
  SEED_PROJECT_DRAFT,
  SEED_USER,
  SEED_WORK_PROJECT_ROWS,
  SEED_MESSAGES,
  SEED_NOTIFICATIONS,
} from "./seed-data";

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("DATABASE_URL이 없습니다. .env에 PostgreSQL 연결 문자열을 넣으세요.");
    process.exit(1);
  }

  const db = getDb();

  await db.insert(users).values(SEED_USER).onConflictDoNothing({
    target: users.username,
  });
  await db.insert(projects).values(SEED_PROJECT_DRAFT).onConflictDoNothing({
    target: projects.userId,
  });

  await db.delete(workProjects);
  await db.delete(messages);
  await db.delete(notifications);

  if (SEED_WORK_PROJECT_ROWS.length > 0) {
    await db.insert(workProjects).values(
      SEED_WORK_PROJECT_ROWS.map((r) => ({
        userId: r.userId,
        projectType: r.projectType,
        data: r.data,
      })),
    );
  }

  if (SEED_MESSAGES.length > 0) {
    await db.insert(messages).values(SEED_MESSAGES);
  }

  if (SEED_NOTIFICATIONS.length > 0) {
    await db.insert(notifications).values(SEED_NOTIFICATIONS);
  }

  console.log(
    `[db:seed] users(이꽃별) · projects 초안 · work_projects ${SEED_WORK_PROJECT_ROWS.length}건 · messages ${SEED_MESSAGES.length}건 · notifications ${SEED_NOTIFICATIONS.length}건 적재 완료`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
