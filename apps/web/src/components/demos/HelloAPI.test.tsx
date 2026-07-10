// --------------------------------------------------------------
// HelloAPI Demo 测试
// --------------------------------------------------------------

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HelloAPI } from "./HelloAPI";

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe("HelloAPI", () => {
  it("初始渲染显示按钮和说明", () => {
    render(<HelloAPI />);
    expect(screen.getByRole("button", { name: "调用后端" })).toBeInTheDocument();
  });

  it("点击按钮后调用 fetch 并显示消息", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          message: "你好来自后端",
          time: "2026-01-01T00:00:00.000Z",
        }),
        text: async () => "",
      })),
    );
    render(<HelloAPI />);
    await user.click(screen.getByRole("button", { name: "调用后端" }));
    expect(await screen.findByText(/你好来自后端/)).toBeInTheDocument();
  });
});
