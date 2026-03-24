import "dotenv/config";
import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!url) {
  console.error("❌ DATABASE_URL no definida");
  process.exit(1);
}

const client = createClient({ url, authToken });

const migrationsDir = path.join(process.cwd(), "prisma/migrations");

async function main() {
  const entries = fs.readdirSync(migrationsDir)
    .filter((f) => f !== "migration_lock.toml" && fs.statSync(path.join(migrationsDir, f)).isDirectory())
    .sort();

  for (const folder of entries) {
    const sqlPath = path.join(migrationsDir, folder, "migration.sql");
    if (!fs.existsSync(sqlPath)) continue;

    const sql = fs.readFileSync(sqlPath, "utf-8");
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    console.log(`▶ ${folder}`);
    for (const stmt of statements) {
      await client.execute(stmt);
    }
    console.log(`  ✓ OK`);
  }

  console.log("\n✅ Todas las migraciones aplicadas.");
}

main()
  .catch((e) => { console.error("❌", e.message); process.exit(1); })
  .finally(() => client.close());
