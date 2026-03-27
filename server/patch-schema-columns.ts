/**
 * drizzle-kit push 가 PK/드리프트로 실패할 때, 컬럼만 안전하게 추가합니다.
 * 사용: DATABASE_URL 설정 후 `npx tsx server/patch-schema-columns.ts`
 */
import "dotenv/config";
import pg from "pg";

const STMTS = [
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name text`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS email text`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS phone text`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type text`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at timestamp DEFAULT now()`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at timestamp DEFAULT now()`,
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft'`,
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS submitted_at timestamp`,
];

async function main() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error("DATABASE_URL 없음");
    process.exit(1);
  }
  const pool = new pg.Pool({ connectionString: url, max: 2 });
  try {
    for (const s of STMTS) {
      await pool.query(s);
      console.log("[patch ok]", s.slice(0, 70) + (s.length > 70 ? "…" : ""));
    }
  } finally {
    await pool.end();
  }
  console.log("patch-schema-columns 완료");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
