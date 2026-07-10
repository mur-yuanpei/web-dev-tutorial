// --------------------------------------------------------------
// lib/toc.ts 单元测试
// slugify + extractHeadings —— 纯函数，边界覆盖
// --------------------------------------------------------------

import { describe, expect, it } from "vitest";
import { extractHeadings, slugify } from "./toc.js";

describe("slugify", () => {
  it("英文空格 → 连字符", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("保留中文", () => {
    expect(slugify("你好 世界")).toBe("你好-世界");
  });

  it("大写转小写", () => {
    expect(slugify("HELLO")).toBe("hello");
  });

  it("多个连续空格合并", () => {
    expect(slugify("A   B")).toBe("a-b");
  });

  it("去掉首尾空白", () => {
    expect(slugify("  hi  ")).toBe("hi");
  });

  it("丢弃特殊字符", () => {
    expect(slugify("Hello!!!")).toBe("hello");
  });

  it("多个连字符合并", () => {
    expect(slugify("a---b")).toBe("a-b");
  });

  it("去除首尾连字符", () => {
    expect(slugify("-hi-")).toBe("hi");
  });

  it("空串返回空串", () => {
    expect(slugify("")).toBe("");
  });
});

describe("extractHeadings", () => {
  it("空 markdown 返回空数组", () => {
    expect(extractHeadings("")).toEqual([]);
  });

  it("忽略 h1（只提 h2/h3）", () => {
    const md = "# 标题一\n## 子章\n### 三级";
    const result = extractHeadings(md);
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ level: 2, text: "子章" });
    expect(result[1]).toMatchObject({ level: 3, text: "三级" });
  });

  it("给每个标题生成 id", () => {
    const md = "## Hello World";
    const result = extractHeadings(md);
    expect(result[0]?.id).toBe("hello-world");
  });

  it("忽略代码块内的 ## fake", () => {
    const md = "## 真标题\n```\n## 假标题\n```\n## 又一个真的";
    const result = extractHeadings(md);
    expect(result).toHaveLength(2);
    expect(result.map((h) => h.text)).toEqual(["真标题", "又一个真的"]);
  });

  it("跨代码块正常", () => {
    const md = "```\n## 隐藏\n```\n## 显示";
    const result = extractHeadings(md);
    expect(result).toHaveLength(1);
    expect(result[0]?.text).toBe("显示");
  });

  it("只有 h3 也能识别", () => {
    const result = extractHeadings("### 三级独立");
    expect(result).toHaveLength(1);
    expect(result[0]?.level).toBe(3);
  });

  it("h4/h5 不被提取", () => {
    expect(extractHeadings("#### 四级\n##### 五级")).toEqual([]);
  });
});
