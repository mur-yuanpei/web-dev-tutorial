// --------------------------------------------------------------
// Vite 配置：开发服务器 + 生产打包
// 关键点：
//   - React 插件：让 Vite 认识 JSX/TSX
//   - Tailwind v4 插件：Tailwind v4 不再走 PostCSS，用官方 vite 插件
//   - server.proxy：本地开发时把 /api/* 代理到后端 3000 端口
//     这样前端代码里写 fetch('/api/courses') 就够了，不用管跨域
// --------------------------------------------------------------

import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiBase = env.VITE_API_BASE_URL ?? "http://localhost:3000";
  const webPort = Number(env.WEB_PORT ?? 5173);

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        // 与 tsconfig.json 的 paths 保持一致，让 @/* 指向 src/*
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: webPort,
      strictPort: true,
      proxy: {
        "/api": {
          target: apiBase,
          changeOrigin: true,
        },
      },
    },
    build: {
      target: "es2022",
      sourcemap: true,
    },
  };
});
