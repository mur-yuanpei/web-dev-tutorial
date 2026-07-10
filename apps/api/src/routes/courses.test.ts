// --------------------------------------------------------------
// courses 路由集成测试
// - 用 pglite 起 in-memory pg（setup 里初始化）
// - 用 hono app.request(...) 直接调路由（不启 HTTP server）
// --------------------------------------------------------------

import { describe, expect, it } from "vitest";
import { app } from "../app.js";
import { chapters, courses } from "../db/schema.js";
import { testDb } from "../../test/setup.js";

async function seedCourses() {
  const [c1] = await testDb
    .insert(courses)
    .values({
      slug: "frontend",
      title: "前端基础",
      description: "HTML CSS JS",
      order: 0,
    })
    .returning();
  const [c2] = await testDb
    .insert(courses)
    .values({
      slug: "backend",
      title: "后端入门",
      description: "HTTP",
      order: 1,
    })
    .returning();

  if (!c1 || !c2) throw new Error("insert failed");

  await testDb.insert(chapters).values([
    {
      courseId: c1.id,
      slug: "frontend--html",
      title: "HTML",
      summary: "网页骨架",
      order: 0,
    },
    {
      courseId: c1.id,
      slug: "frontend--css",
      title: "CSS",
      summary: "外表",
      order: 1,
    },
  ]);

  return { c1, c2 };
}

describe("GET /api/courses", () => {
  it("空库返回 []", async () => {
    const res = await app.request("/api/courses");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it("列出所有课程按 order 排序", async () => {
    await seedCourses();
    const res = await app.request("/api/courses");
    const body = (await res.json()) as { slug: string; order: number }[];
    expect(body).toHaveLength(2);
    expect(body[0]?.slug).toBe("frontend");
    expect(body[1]?.slug).toBe("backend");
  });
});

describe("GET /api/courses/tree", () => {
  it("返回嵌套 chapters", async () => {
    await seedCourses();
    const res = await app.request("/api/courses/tree");
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      slug: string;
      chapters: { slug: string }[];
    }[];
    expect(body).toHaveLength(2);
    expect(body[0]?.chapters).toHaveLength(2);
    expect(body[1]?.chapters).toHaveLength(0);
  });
});

describe("GET /api/courses/:slug", () => {
  it("命中返回 course + chapters", async () => {
    await seedCourses();
    const res = await app.request("/api/courses/frontend");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { slug: string; chapters: unknown[] };
    expect(body.slug).toBe("frontend");
    expect(body.chapters).toHaveLength(2);
  });

  it("未命中返回 404", async () => {
    const res = await app.request("/api/courses/nope");
    expect(res.status).toBe(404);
  });
});
