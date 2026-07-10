// --------------------------------------------------------------
// TableOfContents 组件测试
// --------------------------------------------------------------

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TableOfContents } from "./TableOfContents";

describe("TableOfContents", () => {
  it("空 headings 时不渲染", () => {
    const { container } = render(<TableOfContents headings={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("非空 headings 时显示 nav", () => {
    render(
      <TableOfContents
        headings={[
          { level: 2, text: "章节 A", id: "a" },
          { level: 2, text: "章节 B", id: "b" },
        ]}
      />,
    );
    expect(screen.getByRole("navigation", { name: "章节目录" })).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  it("h3 有额外缩进（pl-6）", () => {
    render(
      <TableOfContents
        headings={[
          { level: 2, text: "父", id: "p" },
          { level: 3, text: "子", id: "c" },
        ]}
      />,
    );
    const child = screen.getByRole("link", { name: "子" });
    expect(child.className).toContain("pl-6");
  });
});
