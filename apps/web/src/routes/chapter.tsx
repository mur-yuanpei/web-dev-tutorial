// --------------------------------------------------------------
// 章节详情页（元培古典风）：Markdown 正文 + 底部 Demo + 前后章节导航
// - 提取 h2/h3 传给右侧 TOC（通过 root.tsx 的 useTocSetter）
// - code / note section 用主题色 + 学院风装饰
// --------------------------------------------------------------

import type { ChapterDetail } from "@app/shared";
import { ChevronLeft, ChevronRight, FlaskConical } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link, type LoaderFunctionArgs, useLoaderData } from "react-router";
import { OrnamentDivider } from "@/components/brand/OrnamentDivider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DemoByKey } from "../components/demos/index.js";
import { MarkdownRenderer } from "../components/MarkdownRenderer.js";
import { api } from "../lib/api.js";
import { extractHeadings } from "../lib/toc.js";
import { useTocSetter } from "../root.js";

export async function chapterLoader({ params }: LoaderFunctionArgs): Promise<ChapterDetail> {
  const slug = params.slug;
  if (!slug) throw new Response("缺少章节 slug", { status: 400 });
  return await api.getChapter(slug);
}

export function ChapterPage() {
  const chapter = useLoaderData() as ChapterDetail;
  const setHeadings = useTocSetter();

  const headings = useMemo(
    () =>
      chapter.sections
        .filter((s) => s.kind === "text" || s.kind === "note")
        .flatMap((s) => extractHeadings(s.content)),
    [chapter.sections],
  );

  useEffect(() => {
    setHeadings(headings);
    return () => setHeadings([]);
  }, [headings, setHeadings]);

  return (
    <article className="space-y-8">
      {/* 面包屑 */}
      <nav className="text-sm text-[--color-muted-foreground] flex items-center gap-2">
        <Link to="/" className="hover:text-[--color-primary]">
          课程列表
        </Link>
        <span className="text-[--color-border]">/</span>
        <Link to={`/courses/${chapter.course.slug}`} className="hover:text-[--color-primary]">
          {chapter.course.title}
        </Link>
      </nav>

      {/* 标题区 */}
      <header className="space-y-3 pb-2">
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight leading-tight text-[--color-primary]">
          {chapter.title}
        </h1>
        <p className="text-lg text-[--color-muted-foreground] leading-relaxed">{chapter.summary}</p>
      </header>

      <OrnamentDivider />

      {/* 正文 */}
      <div className="space-y-6">
        {chapter.sections.map((s) => {
          if (s.kind === "code") {
            return (
              <pre
                key={s.id}
                className="p-4 rounded-md bg-[--color-secondary] border border-[--color-border] border-l-[3px] border-l-[--color-primary] overflow-x-auto text-sm font-mono"
              >
                <code>{s.content}</code>
              </pre>
            );
          }
          if (s.kind === "note") {
            return (
              <Card
                key={s.id}
                className="border-l-[3px] border-l-[--color-accent] bg-[--color-secondary]/60"
              >
                <CardContent className="pt-6">
                  <MarkdownRenderer content={s.content} />
                </CardContent>
              </Card>
            );
          }
          return <MarkdownRenderer key={s.id} content={s.content} />;
        })}
      </div>

      {/* 交互 Demo */}
      {chapter.demoKey && (
        <section className="space-y-4 pt-4">
          <OrnamentDivider seal="试" />
          <h2 className="font-serif text-2xl font-semibold flex items-center gap-2 text-[--color-primary]">
            <FlaskConical className="text-[--color-accent]" />
            亲手试试
            <Badge variant="outline" className="ml-1 font-mono text-[10px]">
              {chapter.demoKey}
            </Badge>
          </h2>
          <DemoByKey demoKey={chapter.demoKey} />
        </section>
      )}

      {/* 前后章节 */}
      <Separator />
      <nav className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {chapter.prevChapter ? (
          <Link to={`/chapters/${chapter.prevChapter.slug}`}>
            <Card className="transition-all hover:border-[--color-primary] hover:shadow-sm h-full">
              <CardContent className="p-4">
                <div className="text-xs text-[--color-muted-foreground] flex items-center gap-1">
                  <ChevronLeft className="h-3 w-3" />
                  上一章
                </div>
                <div className="mt-1 font-serif font-medium text-[--color-primary]">
                  {chapter.prevChapter.title}
                </div>
              </CardContent>
            </Card>
          </Link>
        ) : (
          <span />
        )}
        {chapter.nextChapter ? (
          <Link to={`/chapters/${chapter.nextChapter.slug}`} className="sm:ml-auto">
            <Card className="transition-all hover:border-[--color-primary] hover:shadow-sm h-full">
              <CardContent className="p-4 sm:text-right">
                <div className="text-xs text-[--color-muted-foreground] flex items-center gap-1 sm:justify-end">
                  下一章
                  <ChevronRight className="h-3 w-3" />
                </div>
                <div className="mt-1 font-serif font-medium text-[--color-primary]">
                  {chapter.nextChapter.title}
                </div>
              </CardContent>
            </Card>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
