// --------------------------------------------------------------
// demo-sandbox 路由集成测试
// --------------------------------------------------------------

import { describe, expect, it } from "vitest";
import { app } from "../app.js";

describe("GET /api/demo/hello", () => {
  it("返回 message + time", async () => {
    const res = await app.request("/api/demo/hello");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { message: string; time: string };
    expect(typeof body.message).toBe("string");
    expect(typeof body.time).toBe("string");
  });
});

describe("POST /api/demo/click", () => {
  it("从 0 累加到 3", async () => {
    for (let i = 1; i <= 3; i++) {
      const res = await app.request("/api/demo/click", { method: "POST" });
      const body = (await res.json()) as { count: number };
      expect(body.count).toBe(i);
    }
  });
});

describe("GET /api/demo/click", () => {
  it("不修改计数", async () => {
    await app.request("/api/demo/click", { method: "POST" });
    await app.request("/api/demo/click", { method: "POST" });
    const res = await app.request("/api/demo/click");
    const body = (await res.json()) as { count: number };
    expect(body.count).toBe(2);
    // 再查一次仍是 2
    const res2 = await app.request("/api/demo/click");
    const body2 = (await res2.json()) as { count: number };
    expect(body2.count).toBe(2);
  });
});

describe("POST /api/demo/messages", () => {
  it("合法留言 → 201 + 返回值", async () => {
    const res = await app.request("/api/demo/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: "张三", body: "你好" }),
    });
    expect(res.status).toBe(201);
    const body = (await res.json()) as { author: string; body: string };
    expect(body.author).toBe("张三");
    expect(body.body).toBe("你好");
  });

  it("空 author → 400", async () => {
    const res = await app.request("/api/demo/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: "", body: "hi" }),
    });
    expect(res.status).toBe(400);
  });

  it("超长 body → 400", async () => {
    const res = await app.request("/api/demo/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: "a", body: "b".repeat(500) }),
    });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/demo/messages", () => {
  it("发过 2 条 → 返回长度 2", async () => {
    await app.request("/api/demo/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: "a", body: "1" }),
    });
    await app.request("/api/demo/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: "b", body: "2" }),
    });
    const res = await app.request("/api/demo/messages");
    const body = (await res.json()) as unknown[];
    expect(body).toHaveLength(2);
  });
});
