// --------------------------------------------------------------
// 首页：所有课程列表
// 用 React Router 的 loader 在导航前预取数据，避免"页面先出现，数据后到"的抖动
// --------------------------------------------------------------

import type { Course } from "@app/shared";
import { Link, useLoaderData } from "react-router";

import { api } from "../lib/api.js";

export async function homeLoader(): Promise<Course[]> {
  return await api.listCourses();
}

export function HomePage() {
  const courses = useLoaderData() as Course[];

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold">从零学 Web 全栈开发</h1>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          这个网站本身，就是用它讲的技术栈搭建的。你**读到**的内容存在 PostgreSQL 里，
          经过 Hono 后端的 API 传输，被 React 前端拉取并渲染成你眼前的页面。
          <br />
          学完本教程，你可以直接把这个项目 clone 下来当脚手架，去做你自己的第一个项目。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">课程目录</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {courses.map((c) => (
            <Link
              key={c.id}
              to={`/courses/${c.slug}`}
              className="block p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-sm transition"
            >
              <div className="text-sm text-slate-400">课程 {c.order + 1}</div>
              <h3 className="font-semibold mt-1">{c.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {c.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
