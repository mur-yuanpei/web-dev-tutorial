// --------------------------------------------------------------
// 首页：欢迎语 + 学习引导
// 完整的课程/章节导航在左侧栏，首页只做起手引导
// --------------------------------------------------------------

import type { Course } from "@app/shared";
import { Link, useLoaderData } from "react-router";

import { api } from "../lib/api.js";

export async function homeLoader(): Promise<Course[]> {
  return await api.listCourses();
}

export function HomePage() {
  const courses = useLoaderData() as Course[];
  const firstCourse = courses[0];

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold">从零学 Web 全栈开发</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          这个网站本身，就是用它讲的技术栈搭建的。你<b>读到</b>的内容存在
          PostgreSQL 里，经过 Hono 后端的 API 传输，被 React 前端拉取并渲染成你眼前的页面。
        </p>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          学完本教程，你可以直接把这个项目 clone 下来当脚手架，做你自己的第一个真实项目。
        </p>
        {firstCourse && (
          <Link
            to={`/courses/${firstCourse.slug}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            从「{firstCourse.title}」开始 →
          </Link>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">怎么学</h2>
        <ol className="space-y-2 text-slate-600 dark:text-slate-400 leading-relaxed list-decimal pl-6">
          <li>按左侧目录顺序读课程 —— 从「认识 Web 开发」开始建立整体认知</li>
          <li>
            每章读完后，<b>打开对应的项目源码文件</b>看一眼真实实现 —— 章节里会指路到具体路径
          </li>
          <li>看到带 <span className="text-amber-600 dark:text-amber-400">●</span> 标记的章节，一定要动手试试底部的可交互 Demo</li>
          <li>按 F12 打开浏览器开发者工具，观察每次点击对应的 HTTP 请求 —— 这是理解前后端最直观的方式</li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">课程一览</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {courses.map((c, i) => (
            <Link
              key={c.id}
              to={`/courses/${c.slug}`}
              className="block p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500 transition"
            >
              <div className="text-xs text-slate-400 font-mono">
                {String(i).padStart(2, "0")}
              </div>
              <div className="font-medium mt-0.5">{c.title}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                {c.description}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
