// --------------------------------------------------------------
// 课程详情页：显示课程简介 + 章节列表
// --------------------------------------------------------------

import type { CourseWithChapters } from "@app/shared";
import { Link, useLoaderData, type LoaderFunctionArgs } from "react-router";

import { api } from "../lib/api.js";

export async function courseLoader({
  params,
}: LoaderFunctionArgs): Promise<CourseWithChapters> {
  const slug = params.slug;
  if (!slug) throw new Response("缺少课程 slug", { status: 400 });
  return await api.getCourse(slug);
}

export function CoursePage() {
  const course = useLoaderData() as CourseWithChapters;

  return (
    <div className="space-y-6">
      <nav className="text-sm text-slate-500">
        <Link to="/" className="hover:text-blue-600">
          ← 返回课程列表
        </Link>
      </nav>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-slate-600 dark:text-slate-400">{course.description}</p>
      </header>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">章节</h2>
        <ol className="space-y-2">
          {course.chapters.map((ch, i) => (
            <li key={ch.id}>
              <Link
                to={`/chapters/${ch.slug}`}
                className="flex items-start gap-3 p-3 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500"
              >
                <span className="text-slate-400 text-sm font-mono pt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="font-medium">{ch.title}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {ch.summary}
                  </div>
                </div>
                {ch.demoKey && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 shrink-0 self-center">
                    含 Demo
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
