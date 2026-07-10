// --------------------------------------------------------------
// 课程详情页：课程简介 + 章节列表（元培古典风）
// --------------------------------------------------------------

import type { CourseWithChapters } from "@app/shared";
import { ArrowLeft, FlaskConical } from "lucide-react";
import { Link, type LoaderFunctionArgs, useLoaderData } from "react-router";
import { OrnamentDivider } from "@/components/brand/OrnamentDivider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatIndex } from "@/lib/utils";
import { api } from "../lib/api.js";

export async function courseLoader({ params }: LoaderFunctionArgs): Promise<CourseWithChapters> {
  const slug = params.slug;
  if (!slug) throw new Response("缺少课程 slug", { status: 400 });
  return await api.getCourse(slug);
}

export function CoursePage() {
  const course = useLoaderData() as CourseWithChapters;

  return (
    <div className="space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-[--color-muted-foreground] hover:text-[--color-primary]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        返回课程列表
      </Link>

      <header className="space-y-3">
        <div className="font-serif text-5xl sm:text-6xl text-[--color-primary]/25 tabular-nums leading-none">
          {formatIndex(course.order)}
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[--color-primary]">
          {course.title}
        </h1>
        <p className="text-[--color-foreground]/80 leading-relaxed">{course.description}</p>
      </header>

      <OrnamentDivider seal="章" />

      <section className="space-y-3">
        <h2 className="font-serif text-lg font-semibold text-[--color-primary]">章节</h2>
        <ol className="space-y-2">
          {course.chapters.map((ch, i) => (
            <li key={ch.id}>
              <Link to={`/chapters/${ch.slug}`} className="block group">
                <Card className="transition-all hover:border-[--color-primary] hover:shadow-sm">
                  <CardContent className="flex items-start gap-4 p-4">
                    <span className="font-serif text-xl text-[--color-primary]/50 pt-0.5 tabular-nums w-8 shrink-0">
                      {formatIndex(i + 1)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif font-medium text-[15px] text-[--color-foreground] group-hover:text-[--color-primary]">
                        {ch.title}
                      </div>
                      <div className="text-sm text-[--color-muted-foreground] mt-0.5">
                        {ch.summary}
                      </div>
                    </div>
                    {ch.demoKey && (
                      <Badge
                        variant="outline"
                        className="gap-1 shrink-0 self-center border-[--color-accent] text-[--color-accent]"
                      >
                        <FlaskConical className="h-3 w-3" />含 Demo
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
