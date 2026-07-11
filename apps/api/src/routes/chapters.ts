// --------------------------------------------------------------
// 章节相关路由
// --------------------------------------------------------------

import type { ChapterDetail } from "@app/shared";
import { and, asc, desc, eq, gt, lt } from "drizzle-orm";
import { Hono } from "hono";

import { db } from "../db/client.js";
import { chapters, courses, sections } from "../db/schema.js";

export const chaptersRoute = new Hono();

// GET /api/chapters/:slug —— 章节详情（含课程信息、内容段、前后导航）
chaptersRoute.get("/:slug", async (c) => {
  const slug = c.req.param("slug");

  const chapter = await db.query.chapters.findFirst({
    where: eq(chapters.slug, slug),
    with: {
      course: true,
      sections: {
        orderBy: [asc(sections.order)],
      },
    },
  });

  if (!chapter) {
    return c.json({ error: "章节不存在" }, 404);
  }

  // 同课程内前一章（order 比当前小的最大者）
  const [prevRow] = await db
    .select({ slug: chapters.slug, title: chapters.title })
    .from(chapters)
    .where(and(eq(chapters.courseId, chapter.courseId), lt(chapters.order, chapter.order)))
    .orderBy(desc(chapters.order))
    .limit(1);

  // 同课程内后一章（order 比当前大的最小者）
  const [sameCourseNext] = await db
    .select({ slug: chapters.slug, title: chapters.title })
    .from(chapters)
    .where(and(eq(chapters.courseId, chapter.courseId), gt(chapters.order, chapter.order)))
    .orderBy(asc(chapters.order))
    .limit(1);

  // 如果同课程没有后一章，跳到下一门课程的第一章，用 courseTitle 标注跨课程
  let nextChapter: ChapterDetail["nextChapter"] = sameCourseNext ?? null;
  if (!sameCourseNext) {
    const nextCourse = await db.query.courses.findFirst({
      where: gt(courses.order, chapter.course.order),
      orderBy: [asc(courses.order)],
    });
    if (nextCourse) {
      const firstChapter = await db.query.chapters.findFirst({
        where: eq(chapters.courseId, nextCourse.id),
        orderBy: [asc(chapters.order)],
      });
      if (firstChapter) {
        nextChapter = {
          slug: firstChapter.slug,
          title: firstChapter.title,
          courseTitle: nextCourse.title,
        };
      }
    }
  }

  const result: ChapterDetail = {
    id: chapter.id,
    courseId: chapter.courseId,
    slug: chapter.slug,
    title: chapter.title,
    summary: chapter.summary,
    order: chapter.order,
    demoKey: chapter.demoKey,
    createdAt: chapter.createdAt.toISOString(),
    course: {
      id: chapter.course.id,
      slug: chapter.course.slug,
      title: chapter.course.title,
      description: chapter.course.description,
      order: chapter.course.order,
      createdAt: chapter.course.createdAt.toISOString(),
    },
    sections: chapter.sections.map((s) => ({
      id: s.id,
      chapterId: s.chapterId,
      order: s.order,
      kind: s.kind,
      content: s.content,
    })),
    prevChapter: prevRow ?? null,
    nextChapter,
  };

  return c.json(result);
});
