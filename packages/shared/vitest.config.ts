// --------------------------------------------------------------
// packages/shared 的 vitest 配置
// - 纯 zod schema 测试，跑在 node 环境
// --------------------------------------------------------------

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
