// --------------------------------------------------------------
// CountClicks Demo 测试
// --------------------------------------------------------------

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CountClicks } from "./CountClicks";

beforeEach(() => {
  vi.unstubAllGlobals();
});

/** 简易 fetch mock：按调用顺序返回不同的 count */
function stubFetchSequence(counts: number[]) {
  const impl = vi.fn(async () => {
    const count = counts.shift() ?? 0;
    return {
      ok: true,
      status: 200,
      json: async () => ({ count }),
      text: async () => "",
    };
  });
  vi.stubGlobal("fetch", impl);
  return impl;
}

describe("CountClicks", () => {
  it("挂载时先 GET 拿初始计数", async () => {
    const f = stubFetchSequence([7]);
    render(<CountClicks />);
    expect(await screen.findByText("7")).toBeInTheDocument();
    // 首次调用是 GET /api/demo/click
    const [url, init] = f.mock.calls[0] ?? [];
    expect(url).toBe("/api/demo/click");
    // 初次是 GET —— init 不带 method 或 method=GET
    expect((init as RequestInit | undefined)?.method).toBeUndefined();
  });

  it("点击按钮 → POST 并更新累计", async () => {
    const user = userEvent.setup();
    const f = stubFetchSequence([1, 2]);
    render(<CountClicks />);
    await screen.findByText("1"); // 初次 GET
    await user.click(screen.getByRole("button", { name: /点我 \+1/ }));
    expect(await screen.findByText("2")).toBeInTheDocument();
    // 第二次调用是 POST
    const [, init] = f.mock.calls[1] ?? [];
    expect((init as RequestInit).method).toBe("POST");
  });
});
