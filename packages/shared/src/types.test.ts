// --------------------------------------------------------------
// packages/shared 的 zod schema 测试
// - 每个 schema 至少一个"合法"用例 + 一个"非法"用例
// - 边界值（min/max 长度、integer / positive）单独测
// - 目标：读这份测试就能知道 schema 的约束
// --------------------------------------------------------------

import { describe, expect, it } from "vitest";
import {
  chapterSchema,
  clickCountSchema,
  courseSchema,
  createMessageInput,
  messageSchema,
  navCourseSchema,
  sectionKind,
  sectionSchema,
} from "./types.js";

// ---------------- courseSchema ----------------

describe("courseSchema", () => {
  const valid = {
    id: 1,
    slug: "frontend-basics",
    title: "前端基础",
    description: "HTML CSS JS",
    order: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
  };

  it("接受合法的 course", () => {
    expect(courseSchema.safeParse(valid).success).toBe(true);
  });

  it("拒绝负数 id", () => {
    expect(courseSchema.safeParse({ ...valid, id: -1 }).success).toBe(false);
  });

  it("拒绝非整数 id", () => {
    expect(courseSchema.safeParse({ ...valid, id: 1.5 }).success).toBe(false);
  });

  it("拒绝缺字段", () => {
    const { title, ...rest } = valid;
    void title;
    expect(courseSchema.safeParse(rest).success).toBe(false);
  });
});

// ---------------- chapterSchema ----------------

describe("chapterSchema", () => {
  const valid = {
    id: 1,
    courseId: 1,
    slug: "html",
    title: "HTML",
    summary: "网页的骨架",
    order: 0,
    demoKey: null,
    createdAt: "2026-01-01T00:00:00.000Z",
  };

  it("接受 demoKey = null", () => {
    expect(chapterSchema.safeParse(valid).success).toBe(true);
  });

  it("接受 demoKey 为字符串", () => {
    expect(
      chapterSchema.safeParse({ ...valid, demoKey: "hello-api" }).success,
    ).toBe(true);
  });

  it("拒绝 demoKey 为数字", () => {
    expect(chapterSchema.safeParse({ ...valid, demoKey: 5 }).success).toBe(false);
  });
});

// ---------------- sectionKind + sectionSchema ----------------

describe("sectionKind enum", () => {
  it.each(["text", "code", "note"])("接受 %s", (v) => {
    expect(sectionKind.safeParse(v).success).toBe(true);
  });

  it("拒绝非法值", () => {
    expect(sectionKind.safeParse("markdown").success).toBe(false);
  });
});

describe("sectionSchema", () => {
  it("接受最小合法 section", () => {
    expect(
      sectionSchema.safeParse({
        id: 1,
        chapterId: 1,
        order: 0,
        kind: "text",
        content: "hello",
      }).success,
    ).toBe(true);
  });
});

// ---------------- createMessageInput ----------------

describe("createMessageInput", () => {
  it("接受合法输入", () => {
    expect(createMessageInput.safeParse({ author: "张三", body: "你好" }).success).toBe(true);
  });

  it("拒绝空 author", () => {
    expect(createMessageInput.safeParse({ author: "", body: "hi" }).success).toBe(false);
  });

  it("拒绝空 body", () => {
    expect(createMessageInput.safeParse({ author: "a", body: "" }).success).toBe(false);
  });

  it("author 长度 40 是合法的（边界值）", () => {
    expect(
      createMessageInput.safeParse({ author: "a".repeat(40), body: "hi" }).success,
    ).toBe(true);
  });

  it("author 长度 41 越界", () => {
    expect(
      createMessageInput.safeParse({ author: "a".repeat(41), body: "hi" }).success,
    ).toBe(false);
  });

  it("body 长度 400 是合法的（边界值）", () => {
    expect(
      createMessageInput.safeParse({ author: "a", body: "b".repeat(400) }).success,
    ).toBe(true);
  });

  it("body 长度 401 越界", () => {
    expect(
      createMessageInput.safeParse({ author: "a", body: "b".repeat(401) }).success,
    ).toBe(false);
  });
});

// ---------------- messageSchema ----------------

describe("messageSchema", () => {
  it("接受合法留言", () => {
    expect(
      messageSchema.safeParse({
        id: 1,
        author: "张三",
        body: "hi",
        createdAt: "2026-01-01T00:00:00.000Z",
      }).success,
    ).toBe(true);
  });
});

// ---------------- clickCountSchema ----------------

describe("clickCountSchema", () => {
  it("count 为 0 合法", () => {
    expect(clickCountSchema.safeParse({ count: 0 }).success).toBe(true);
  });

  it("count 为负数越界", () => {
    expect(clickCountSchema.safeParse({ count: -1 }).success).toBe(false);
  });
});

// ---------------- navCourseSchema ----------------

describe("navCourseSchema", () => {
  it("接受嵌套 chapters", () => {
    expect(
      navCourseSchema.safeParse({
        slug: "a",
        title: "A",
        order: 0,
        chapters: [
          { slug: "a-1", title: "章 1", demoKey: null },
          { slug: "a-2", title: "章 2", demoKey: "hello-api" },
        ],
      }).success,
    ).toBe(true);
  });

  it("拒绝 chapters 是 null", () => {
    expect(
      navCourseSchema.safeParse({
        slug: "a",
        title: "A",
        order: 0,
        chapters: null,
      }).success,
    ).toBe(false);
  });
});
