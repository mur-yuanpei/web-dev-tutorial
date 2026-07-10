// --------------------------------------------------------------
// Hono app 定义（无 server 启动逻辑）
// 拆出来单独 export 是为了让测试能 import 它调 app.request(...)，
// 而不启动一个真的 HTTP server
// --------------------------------------------------------------

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { chaptersRoute } from "./routes/chapters.js";
import { coursesRoute } from "./routes/courses.js";
import { demoRoute } from "./routes/demo-sandbox.js";

export const app = new Hono();

// middleware：请求日志（学生能在终端看到每次请求）
app.use("*", logger());

// middleware：允许前端跨域访问
// 开发时 Vite 跑在 5173、API 跑在 3000，浏览器会拦这种跨域请求，除非后端明确 allow
app.use(
  "/api/*",
  cors({
    origin: (origin) => origin ?? "*",
    credentials: true,
  }),
);

app.get("/api/health", (c) => c.json({ ok: true, ts: new Date().toISOString() }));

// 挂子路由
app.route("/api/courses", coursesRoute);
app.route("/api/chapters", chaptersRoute);
app.route("/api/demo", demoRoute);

// 全局错误兜底
app.onError((err, c) => {
  console.error("💥 服务端异常：", err);
  return c.json({ error: "Internal Server Error" }, 500);
});

app.notFound((c) => c.json({ error: "Not Found", path: c.req.path }, 404));
