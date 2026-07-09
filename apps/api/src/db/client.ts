// --------------------------------------------------------------
// 数据库客户端：整个 API 进程共享的连接池
// 学生要理解：应用不是每次查询都开一个新连接（那样慢又浪费），
// 而是启动时创建"连接池"，用完还回去，供下一次查询复用。
// --------------------------------------------------------------

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "../env.js";
import * as schema from "./schema.js";

// postgres-js 的默认 max=10，日常够用
const queryClient = postgres(env.DATABASE_URL);

export const db = drizzle(queryClient, { schema });
export { schema };
