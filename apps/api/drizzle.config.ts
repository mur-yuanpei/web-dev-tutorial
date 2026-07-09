// --------------------------------------------------------------
// drizzle-kit 配置
// 它是一个命令行工具，做两件事：
//   1. 根据 src/db/schema.ts 生成 SQL migration 文件（drizzle/xxxx.sql）
//   2. 提供 drizzle-studio（可视化查看数据库内容）
//
// migration 文件是"如何把数据库从旧结构升级到新结构"的说明书，
// 它们应该提交到 git，让每个开发者/生产环境都执行同一套变更。
// --------------------------------------------------------------

import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://dev:dev@localhost:5432/webtutor",
  },
  verbose: true,
  strict: true,
});
