// --------------------------------------------------------------
// API 入口：只做一件事 —— 起 HTTP server
// 真正的 Hono app 定义在 ./app.ts（这样测试能 import app 不启动 server）
// --------------------------------------------------------------

import { serve } from "@hono/node-server";
import { app } from "./app.js";
import { env } from "./env.js";

serve({ fetch: app.fetch, port: env.API_PORT }, (info) => {
  console.log(`🚀 API 已启动：http://localhost:${info.port}`);
  console.log(`   健康检查：http://localhost:${info.port}/api/health`);
});
