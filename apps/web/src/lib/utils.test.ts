// --------------------------------------------------------------
// lib/utils.ts 的 cn 测试
// - clsx 语法 + tailwind-merge 冲突去重
// --------------------------------------------------------------

import { describe, expect, it } from "vitest";
import { cn } from "./utils.js";

describe("cn", () => {
  it("多个字符串合并", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("过滤 falsy 值", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("条件类名", () => {
    const active = true;
    expect(cn("base", active && "active")).toBe("base active");
  });

  it("tailwind 冲突后者覆盖前者", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("接受数组", () => {
    expect(cn(["a", "b"])).toBe("a b");
  });

  it("接受对象条件", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
  });

  it("空调用返回空串", () => {
    expect(cn()).toBe("");
  });
});
