// --------------------------------------------------------------
// 根布局：顶栏 + 左侧目录 + 主内容
// - loader：预取整棵导航树，避免子页面各自请求
// - 桌面端：sidebar 常驻左侧；移动端：靠"目录"按钮打开抽屉
// --------------------------------------------------------------

import type { NavCourse } from "@app/shared";
import { useEffect, useState } from "react";
import { Link, Outlet, useLoaderData } from "react-router";

import { Sidebar } from "./components/Sidebar.js";
import { api } from "./lib/api.js";

export async function rootLoader(): Promise<NavCourse[]> {
  return await api.getTree();
}

export function Root() {
  const tree = useLoaderData() as NavCourse[];

  const [dark, setDark] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const el = document.documentElement;
    if (dark) el.classList.add("dark");
    else el.classList.remove("dark");
  }, [dark]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur sticky top-0 z-40 h-16">
        <div className="px-4 lg:px-6 h-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setNavOpen((v) => !v)}
              className="lg:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="打开目录"
            >
              ☰
            </button>
            <Link
              to="/"
              className="text-lg font-semibold hover:text-blue-600 dark:hover:text-blue-400"
            >
              🌱 Web 开发启蒙教程
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setDark((v) => !v)}
            className="text-sm px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {dark ? "☀️ 浅色" : "🌙 深色"}
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        <Sidebar tree={tree} open={navOpen} onClose={() => setNavOpen(false)} />

        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-6">
        <div className="max-w-5xl mx-auto px-6 text-sm text-slate-500 dark:text-slate-400">
          用 React + Vite + Tailwind + Hono + Drizzle + PostgreSQL 搭建 · 项目本身即教程范本
        </div>
      </footer>
    </div>
  );
}
