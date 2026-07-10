// --------------------------------------------------------------
// lib/api.ts 测试
// - 用 vi.stubGlobal("fetch", ...) mock 掉浏览器 fetch
// - 每个方法：URL / method / body / 错误处理 逐一断言
// --------------------------------------------------------------

import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "./api.js";

function mockFetch(response: {
  ok?: boolean;
  status?: number;
  json?: unknown;
  text?: string;
}) {
  const impl = vi.fn(async () => ({
    ok: response.ok ?? true,
    status: response.status ?? 200,
    json: async () => response.json,
    text: async () => response.text ?? "",
  }));
  vi.stubGlobal("fetch", impl);
  return impl;
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe("api.listCourses", () => {
  it("请求 /api/courses 并返回 JSON", async () => {
    const f = mockFetch({ json: [{ id: 1 }] });
    const result = await api.listCourses();
    expect(f).toHaveBeenCalledWith(
      "/api/courses",
      expect.objectContaining({ headers: { "Content-Type": "application/json" } }),
    );
    expect(result).toEqual([{ id: 1 }]);
  });
});

describe("api.getTree", () => {
  it("请求 /api/courses/tree", async () => {
    const f = mockFetch({ json: [] });
    await api.getTree();
    expect(f).toHaveBeenCalledWith("/api/courses/tree", expect.any(Object));
  });
});

describe("api.getCourse", () => {
  it("拼接 slug 到 URL", async () => {
    const f = mockFetch({ json: {} });
    await api.getCourse("frontend-basics");
    expect(f).toHaveBeenCalledWith(
      "/api/courses/frontend-basics",
      expect.any(Object),
    );
  });
});

describe("api.getChapter", () => {
  it("拼接章节 slug", async () => {
    const f = mockFetch({ json: {} });
    await api.getChapter("frontend-basics--what-is-web");
    expect(f).toHaveBeenCalledWith(
      "/api/chapters/frontend-basics--what-is-web",
      expect.any(Object),
    );
  });
});

describe("api.postMessage", () => {
  it("发 POST + JSON body", async () => {
    const f = mockFetch({ json: { id: 1 } });
    await api.postMessage({ author: "张三", body: "hi" });
    const [, init] = f.mock.calls[0] ?? [];
    expect(init).toMatchObject({
      method: "POST",
      body: JSON.stringify({ author: "张三", body: "hi" }),
    });
  });
});

describe("api 错误处理", () => {
  it("非 2xx 响应抛 Error（含状态码）", async () => {
    mockFetch({ ok: false, status: 404, text: "not found" });
    await expect(api.listCourses()).rejects.toThrow(/API 404/);
  });

  it("500 错误也会抛", async () => {
    mockFetch({ ok: false, status: 500, text: "boom" });
    await expect(api.listCourses()).rejects.toThrow(/API 500/);
  });
});

describe("api.addClick", () => {
  it("POST /api/demo/click 无 body", async () => {
    const f = mockFetch({ json: { count: 5 } });
    await api.addClick();
    expect(f).toHaveBeenCalledWith(
      "/api/demo/click",
      expect.objectContaining({ method: "POST" }),
    );
  });
});
