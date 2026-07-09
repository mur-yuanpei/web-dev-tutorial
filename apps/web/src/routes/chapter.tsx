// --------------------------------------------------------------
// 章节详情页：Markdown 内容 + 底部可交互 Demo + 前后章节导航
// --------------------------------------------------------------

import type { ChapterDetail } from "@app/shared";
import { Link, useLoaderData, type LoaderFunctionArgs } from "react-router";

import { DemoByKey } from "../components/demos/index.js";
import { MarkdownRenderer } from "../components/MarkdownRenderer.js";
import { api } from "../lib/api.js";

export async function chapterLoader({
  params,
}: LoaderFunctionArgs): Promise<ChapterDetail> {
  const slug = params.slug;
  if (!slug) throw new Response("缺少章节 slug", { status: 400 });
  return await api.getChapter(slug);
}

export function ChapterPage() {
  const chapter = useLoaderData() as ChapterDetail;

  return (
    <div className="space-y-8">
      <nav className="text-sm text-slate-500 flex items-center gap-2">
        <Link to="/" className="hover:text-blue-600">
          课程列表
        </Link>
        <span>/</span>
        <Link
          to={`/courses/${chapter.course.slug}`}
          className="hover:text-blue-600"
        >
          {chapter.course.title}
        </Link>
      </nav>

      <header className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-3xl font-bold">{chapter.title}</h1>
        <p className="text-slate-600 dark:text-slate-400">{chapter.summary}</p>
      </header>

      <div className="space-y-6">
        {chapter.sections.map((s) => {
          if (s.kind === "code") {
            return (
              <pre
                key={s.id}
                className="p-4 rounded-lg bg-slate-900 text-slate-100 overflow-x-auto text-sm"
              >
                <code>{s.content}</code>
              </pre>
            );
          }
          if (s.kind === "note") {
            return (
              <div
                key={s.id}
                className="p-4 rounded-lg border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-900/20"
              >
                <MarkdownRenderer content={s.content} />
              </div>
            );
          }
          return <MarkdownRenderer key={s.id} content={s.content} />;
        })}
      </div>

      {chapter.demoKey && (
        <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span>🧪 亲手试试</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-normal">
              {chapter.demoKey}
            </span>
          </h2>
          <DemoByKey demoKey={chapter.demoKey} />
        </section>
      )}

      <nav className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        {chapter.prevChapter ? (
          <Link
            to={`/chapters/${chapter.prevChapter.slug}`}
            className="text-sm text-blue-600 hover:underline"
          >
            ← {chapter.prevChapter.title}
          </Link>
        ) : (
          <span />
        )}
        {chapter.nextChapter ? (
          <Link
            to={`/chapters/${chapter.nextChapter.slug}`}
            className="text-sm text-blue-600 hover:underline ml-auto"
          >
            {chapter.nextChapter.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
