// --------------------------------------------------------------
// 数据库客户端：整个 API 进程共享的连接池
// 学生要理解：应用不是每次查询都开一个新连接（那样慢又浪费），
// 而是启动时创建"连接池"，用完还回去，供下一次查询复用。
//
// 特别说明：测试环境（NODE_ENV=test）不连真 pg，
// 而是用 pglite 的 in-memory Postgres，由 test/setup.ts 通过 setTestDb 注入
// --------------------------------------------------------------

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "../env.js";
import * as schema from "./schema.js";

type Db = ReturnType<typeof drizzle<typeof schema>>;

let _db: Db | null = null;

function initProdDb(): Db {
  const queryClient = postgres(env.DATABASE_URL);
  return drizzle(queryClient, { schema });
}

/**
 * 测试用：由 test/setup.ts 调用，注入 pglite 实例
 */
export function setTestDb(dbInstance: Db) {
  _db = dbInstance;
}

// 用 Proxy 让 `import { db }` 拿到的是延迟解析的引用
// —— 生产环境首次访问时才连 pg；测试里 setup 先 setTestDb 就用 test db
export const db = new Proxy({} as Db, {
  get(_, prop) {
    if (!_db) _db = initProdDb();
    return Reflect.get(_db, prop);
  },
});

export { schema };
