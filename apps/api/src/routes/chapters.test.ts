// --------------------------------------------------------------
// chapters 路由集成测试
// --------------------------------------------------------------

import { describe, expect, it } from "vitest";
import { testDb } from "../../test/setup.js";
import { app } from "../app.js";
import { chapters, courses, sections } from "../db/schema.js";

async function seedThreeChapters() {
  const [c] = await testDb
    .insert(courses)
    .values({ slug: "c", title: "C", description: "d", order: 0 })
    .returning();
  if (!c) throw new Error("insert course failed");

  const rows = await testDb
    .insert(chapters)
    .values([
      { courseId: c.id, slug: "c--a", title: "A", summary: "sa", order: 0 },
      { courseId: c.id, slug: "c--b", title: "B", summary: "sb", order: 1 },
      { courseId: c.id, slug: "c--z", title: "Z", summary: "sz", order: 2 },
    ])
    .returning();

  // 给 B 加两段 section
  const bChapter = rows.find((r) => r.slug === "c--b");
  if (!bChapter) throw new Error("chapter b missing");
  await testDb.insert(sections).values([
    { chapterId: bChapter.id, order: 0, kind: "text", content: "hello" },
    { chapterId: bChapter.id, order: 1, kind: "code", content: "code" },
  ]);

  return { c };
}

describe("GET /api/chapters/:slug", () => {
  it("404 当 slug 不存在", async () => {
    const res = await app.request("/api/chapters/nope");
    expect(res.status).toBe(404);
  });

  it("命中返回 chapter + course + sections + prev/next", async () => {
    await seedThreeChapters();
    const res = await app.request("/api/chapters/c--b");
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      slug: string;
      sections: unknown[];
      prevChapter: { slug: string } | null;
      nextChapter: { slug: string } | null;
    };
    expect(body.slug).toBe("c--b");
    expect(body.sections).toHaveLength(2);
    expect(body.prevChapter?.slug).toBe("c--a");
    expect(body.nextChapter?.slug).toBe("c--z");
  });

  it("首章 prevChapter = null", async () => {
    await seedThreeChapters();
    const res = await app.request("/api/chapters/c--a");
    const body = (await res.json()) as { prevChapter: unknown };
    expect(body.prevChapter).toBeNull();
  });

  it("末章 nextChapter = null", async () => {
    await seedThreeChapters();
    const res = await app.request("/api/chapters/c--z");
    const body = (await res.json()) as { nextChapter: unknown };
    expect(body.nextChapter).toBeNull();
  });
});
