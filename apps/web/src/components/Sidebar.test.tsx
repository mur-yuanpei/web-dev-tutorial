// --------------------------------------------------------------
// Sidebar 组件测试
// --------------------------------------------------------------

import type { NavCourse } from "@app/shared";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import { Sidebar } from "./Sidebar";

const tree: NavCourse[] = [
  {
    slug: "frontend",
    title: "前端基础",
    order: 1,
    chapters: [
      { slug: "frontend--what-is-web", title: "网页是什么", demoKey: null },
      { slug: "frontend--three-in-one", title: "三件套", demoKey: "hello-api" },
    ],
  },
  {
    slug: "backend",
    title: "后端入门",
    order: 2,
    chapters: [{ slug: "backend--http", title: "HTTP", demoKey: null }],
  },
];

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/chapters/:slug" element={<Sidebar tree={tree} />} />
        <Route path="/*" element={<Sidebar tree={tree} />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Sidebar", () => {
  it("渲染所有课程标题", () => {
    renderAt("/");
    expect(screen.getByText("前端基础")).toBeInTheDocument();
    expect(screen.getByText("后端入门")).toBeInTheDocument();
  });

  it("当前章节所在课程自动展开", () => {
    renderAt("/chapters/frontend--what-is-web");
    // "前端基础" 是当前课程，它的 chapters 应该显示
    expect(
      screen.getByRole("link", { name: /网页是什么/ }),
    ).toBeInTheDocument();
  });

  it("非当前课程的章节默认折叠", () => {
    renderAt("/chapters/frontend--what-is-web");
    // 后端入门的章节 HTTP 不应出现
    expect(screen.queryByRole("link", { name: /^HTTP$/ })).toBeNull();
  });

  it("点击折叠按钮切换 chapters 显隐", async () => {
    const user = userEvent.setup();
    renderAt("/chapters/frontend--what-is-web");
    // 前端课程有两个折叠按钮，找展开状态的（第一个）
    const collapseBtns = screen.getAllByRole("button", { name: "折叠" });
    expect(collapseBtns.length).toBeGreaterThan(0);
    // 折叠掉当前课程
    await user.click(collapseBtns[0] as Element);
    expect(screen.queryByRole("link", { name: /网页是什么/ })).toBeNull();
  });
});
