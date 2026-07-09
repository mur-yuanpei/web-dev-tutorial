// --------------------------------------------------------------
// Demo 沙盒路由：供教程中的交互组件调用
// 这些接口本身就是"前后端如何配合"的活样例，
// 学生可以在浏览器 F12 → Network 里观察真实的请求响应。
// --------------------------------------------------------------

import { createMessageInput, type ClickCount, type Message } from "@app/shared";
import { zValidator } from "@hono/zod-validator";
import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";

import { db } from "../db/client.js";
import { demoEvents } from "../db/schema.js";

export const demoRoute = new Hono();

// GET /api/demo/hello —— 最简单的示例
demoRoute.get("/hello", (c) => {
  return c.json({
    message: "你好！这条消息来自后端。",
    time: new Date().toISOString(),
  });
});

// POST /api/demo/click —— 累加一次点击并返回总数
demoRoute.post("/click", async (c) => {
  await db.insert(demoEvents).values({
    demoKey: "count-clicks",
    payload: { at: new Date().toISOString() },
  });

  const rows = await db
    .select()
    .from(demoEvents)
    .where(eq(demoEvents.demoKey, "count-clicks"));

  const result: ClickCount = { count: rows.length };
  return c.json(result);
});

// GET /api/demo/click —— 取当前计数（不 +1）
demoRoute.get("/click", async (c) => {
  const rows = await db
    .select()
    .from(demoEvents)
    .where(eq(demoEvents.demoKey, "count-clicks"));

  const result: ClickCount = { count: rows.length };
  return c.json(result);
});

// GET /api/demo/messages —— 最近 20 条留言
demoRoute.get("/messages", async (c) => {
  const rows = await db
    .select()
    .from(demoEvents)
    .where(eq(demoEvents.demoKey, "messages"))
    .orderBy(desc(demoEvents.createdAt))
    .limit(20);

  const result: Message[] = rows.map((r) => {
    const payload = r.payload as { author?: unknown; body?: unknown };
    return {
      id: r.id,
      author: typeof payload.author === "string" ? payload.author : "匿名",
      body: typeof payload.body === "string" ? payload.body : "",
      createdAt: r.createdAt.toISOString(),
    };
  });

  return c.json(result);
});

// POST /api/demo/messages —— 发一条留言
// 用 zValidator 做请求体校验：不符合 schema 直接 400，业务代码里拿到的一定是合法数据
demoRoute.post("/messages", zValidator("json", createMessageInput), async (c) => {
  const input = c.req.valid("json");

  const [row] = await db
    .insert(demoEvents)
    .values({
      demoKey: "messages",
      payload: { author: input.author, body: input.body },
    })
    .returning();

  if (!row) return c.json({ error: "写入失败" }, 500);

  const result: Message = {
    id: row.id,
    author: input.author,
    body: input.body,
    createdAt: row.createdAt.toISOString(),
  };

  return c.json(result, 201);
});
