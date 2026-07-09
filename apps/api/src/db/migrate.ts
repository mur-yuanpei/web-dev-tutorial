// --------------------------------------------------------------
// migration 执行器
// 读 drizzle/ 目录下的 SQL 文件，一条条执行
// 通常在两个时机跑：
//   - 开发者拉取新代码后，本地同步表结构
//   - 生产环境部署新版本时
// --------------------------------------------------------------

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import { env } from "../env.js";

async function main() {
  const client = postgres(env.DATABASE_URL, { max: 1 });
  const db = drizzle(client);

  console.log("🚀 开始执行数据库 migration...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✅ Migration 完成");

  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Migration 失败：", err);
  process.exit(1);
});
