// --------------------------------------------------------------
// ListMessages Demo 测试
// - mock sonner 的 toast 断言 error / success 触发
// - mock fetch 断言正确的 POST body
// --------------------------------------------------------------

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "sonner";
import { ListMessages } from "./ListMessages";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}));

beforeEach(() => {
  vi.unstubAllGlobals();
  vi.mocked(toast.success).mockClear();
  vi.mocked(toast.error).mockClear();
});

function stubMessages(initial: unknown[]) {
  let messages = [...initial];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      if (init?.method === "POST" && init.body) {
        const parsed = JSON.parse(init.body as string) as {
          author: string;
          body: string;
        };
        const newMsg = {
          id: messages.length + 1,
          author: parsed.author,
          body: parsed.body,
          createdAt: new Date().toISOString(),
        };
        messages = [newMsg, ...messages];
        return {
          ok: true,
          status: 201,
          json: async () => newMsg,
          text: async () => "",
        };
      }
      return {
        ok: true,
        status: 200,
        json: async () => messages,
        text: async () => "",
      };
    }),
  );
}

describe("ListMessages", () => {
  it("初始渲染 → 空状态提示", async () => {
    stubMessages([]);
    render(<ListMessages />);
    expect(await screen.findByText(/还没人留言/)).toBeInTheDocument();
  });

  it("空字段提交 → toast.error", async () => {
    const user = userEvent.setup();
    stubMessages([]);
    render(<ListMessages />);
    await user.click(screen.getByRole("button", { name: /发送/ }));
    expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
      expect.stringContaining("都得填"),
    );
  });

  it("完整表单 → 提交后新留言出现 + toast.success", async () => {
    const user = userEvent.setup();
    stubMessages([]);
    render(<ListMessages />);

    await user.type(screen.getByLabelText("昵称"), "张三");
    await user.type(screen.getByLabelText("留言"), "你好");
    await user.click(screen.getByRole("button", { name: /发送/ }));

    expect(await screen.findByText("你好")).toBeInTheDocument();
    expect(vi.mocked(toast.success)).toHaveBeenCalledWith(
      expect.stringContaining("成功"),
    );
  });
});
