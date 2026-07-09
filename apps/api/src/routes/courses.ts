// --------------------------------------------------------------
// 课程相关路由
// --------------------------------------------------------------

import type { Course, CourseWithChapters, NavCourse } from "@app/shared";
import { asc, eq } from "drizzle-orm";
import { Hono } from "hono";

import { db } from "../db/client.js";
import { chapters, courses } from "../db/schema.js";

export const coursesRoute = new Hono();

// GET /api/courses —— 所有课程列表（不含章节）
coursesRoute.get("/", async (c) => {
  const rows = await db.select().from(courses).orderBy(asc(courses.order));

  const result: Course[] = rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description,
    order: r.order,
    createdAt: r.createdAt.toISOString(),
  }));

  return c.json(result);
});

// GET /api/courses/tree —— 侧栏导航：所有课程 + 每门的章节（精简字段）
coursesRoute.get("/tree", async (c) => {
  const rows = await db.query.courses.findMany({
    orderBy: [asc(courses.order)],
    with: {
      chapters: {
        orderBy: [asc(chapters.order)],
      },
    },
  });

  const result: NavCourse[] = rows.map((course) => ({
    slug: course.slug,
    title: course.title,
    order: course.order,
    chapters: course.chapters.map((ch) => ({
      slug: ch.slug,
      title: ch.title,
      demoKey: ch.demoKey,
    })),
  }));

  return c.json(result);
});

// GET /api/courses/:slug —— 某门课程 + 它的章节
coursesRoute.get("/:slug", async (c) => {
  const slug = c.req.param("slug");

  const course = await db.query.courses.findFirst({
    where: eq(courses.slug, slug),
    with: {
      chapters: {
        orderBy: [asc(chapters.order)],
      },
    },
  });

  if (!course) {
    return c.json({ error: "课程不存在" }, 404);
  }

  const result: CourseWithChapters = {
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    order: course.order,
    createdAt: course.createdAt.toISOString(),
    chapters: course.chapters.map((ch) => ({
      id: ch.id,
      courseId: ch.courseId,
      slug: ch.slug,
      title: ch.title,
      summary: ch.summary,
      order: ch.order,
      demoKey: ch.demoKey,
      createdAt: ch.createdAt.toISOString(),
    })),
  };

  return c.json(result);
});
