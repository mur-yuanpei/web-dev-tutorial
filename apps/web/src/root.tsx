// --------------------------------------------------------------
// 根布局：所有页面共用的顶栏 + 主体容器
// --------------------------------------------------------------

import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router";

export function Root() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const el = document.documentElement;
    if (dark) el.classList.add("dark");
    else el.classList.remove("dark");
  }, [dark]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-lg font-semibold hover:text-blue-600 dark:hover:text-blue-400"
          >
            🌱 Web 开发启蒙教程
          </Link>
          <button
            type="button"
            onClick={() => setDark((v) => !v)}
            className="text-sm px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {dark ? "☀️ 浅色" : "🌙 深色"}
          </button>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-6">
        <div className="max-w-5xl mx-auto px-6 text-sm text-slate-500 dark:text-slate-400">
          用 React + Vite + Tailwind + Hono + Drizzle + PostgreSQL 搭建 · 项目本身即教程范本
        </div>
      </footer>
    </div>
  );
}
