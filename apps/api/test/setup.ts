// --------------------------------------------------------------
// apps/api 测试环境 setup
// - 起 in-memory pglite（WASM Postgres）
// - 跑 migration 建表
// - 通过 setTestDb 注入到生产 db client 里（Proxy 会转发所有查询）
// - 每个用例前 TRUNCATE 清库
// --------------------------------------------------------------

import path from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { afterAll, beforeAll, beforeEach } from "vitest";
import * as schema from "../src/db/schema.js";
import { setTestDb } from "../src/db/client.js";

const pg = new PGlite();
export const testDb = drizzle(pg, { schema });

const here = path.dirname(fileURLToPath(import.meta.url));
const migrationsFolder = path.resolve(here, "../drizzle");

beforeAll(async () => {
  await migrate(testDb, { migrationsFolder });
  // biome-ignore lint: 测试注入，类型窄化差异不重要
  setTestDb(testDb as unknown as Parameters<typeof setTestDb>[0]);
});

beforeEach(async () => {
  await testDb.execute(
    "TRUNCATE demo_events, sections, chapters, courses RESTART IDENTITY CASCADE",
  );
});

afterAll(async () => {
  await pg.close();
});
