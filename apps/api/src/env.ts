// --------------------------------------------------------------
// 环境变量读取 + 校验
// 用 zod 做一层"启动即校验"：如果缺关键变量，进程立即报错退出，
// 而不是在业务代码某处运行时才 undefined 崩溃。
// --------------------------------------------------------------

import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .url()
    .default("postgres://dev:dev@localhost:5432/webtutor"),
  API_PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ 环境变量校验失败：");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
