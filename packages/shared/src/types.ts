// --------------------------------------------------------------
// 前后端共享的"数据形状"定义
// 为什么放这里？—— API 返回什么、前端接什么，必须一致。
// 把类型定义放在 packages/shared，前端 import、后端 import，
// 一处修改，两端同时更新。这就是 monorepo 里"共享代码"的意义。
// --------------------------------------------------------------

import { z } from "zod";

/** 顶层课程：如"前端基础"、"数据库入门" */
export const courseSchema = z.object({
  id: z.number().int().positive(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  order: z.number().int(),
  createdAt: z.string(), // ISO 时间串
});
export type Course = z.infer<typeof courseSchema>;

/** 章节：属于某门课程 */
export const chapterSchema = z.object({
  id: z.number().int().positive(),
  courseId: z.number().int().positive(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  order: z.number().int(),
  demoKey: z.string().nullable(), // 如果不为空，前端会挂载对应的 Demo 组件
  createdAt: z.string(),
});
export type Chapter = z.infer<typeof chapterSchema>;

/** 章节内的一段内容（Markdown） */
export const sectionKind = z.enum(["text", "code", "note"]);
export type SectionKind = z.infer<typeof sectionKind>;

export const sectionSchema = z.object({
  id: z.number().int().positive(),
  chapterId: z.number().int().positive(),
  order: z.number().int(),
  kind: sectionKind,
  content: z.string(),
});
export type Section = z.infer<typeof sectionSchema>;

/** 课程详情：课程 + 它的章节列表 */
export const courseWithChaptersSchema = courseSchema.extend({
  chapters: z.array(chapterSchema),
});
export type CourseWithChapters = z.infer<typeof courseWithChaptersSchema>;

/** 章节详情：章节 + 它的段落 + 归属课程（用来做导航） */
export const chapterDetailSchema = chapterSchema.extend({
  course: courseSchema,
  sections: z.array(sectionSchema),
  prevChapter: z
    .object({ slug: z.string(), title: z.string() })
    .nullable(),
  nextChapter: z
    .object({ slug: z.string(), title: z.string() })
    .nullable(),
});
export type ChapterDetail = z.infer<typeof chapterDetailSchema>;

/** 侧栏导航树：所有课程 + 每门课程的章节（仅 slug + title + demoKey） */
export const navChapterSchema = z.object({
  slug: z.string(),
  title: z.string(),
  demoKey: z.string().nullable(),
});
export const navCourseSchema = z.object({
  slug: z.string(),
  title: z.string(),
  order: z.number().int(),
  chapters: z.array(navChapterSchema),
});
export type NavCourse = z.infer<typeof navCourseSchema>;
export type NavChapter = z.infer<typeof navChapterSchema>;

// --------------------------------------------------------------
// Demo 相关：章节里的可交互小组件用到的接口
// --------------------------------------------------------------

/** POST /api/demo/messages 的请求体 */
export const createMessageInput = z.object({
  author: z.string().min(1).max(40),
  body: z.string().min(1).max(400),
});
export type CreateMessageInput = z.infer<typeof createMessageInput>;

/** 单条留言 */
export const messageSchema = z.object({
  id: z.number().int().positive(),
  author: z.string(),
  body: z.string(),
  createdAt: z.string(),
});
export type Message = z.infer<typeof messageSchema>;

/** POST /api/demo/click 返回体：当前累计点击数 */
export const clickCountSchema = z.object({
  count: z.number().int().nonnegative(),
});
export type ClickCount = z.infer<typeof clickCountSchema>;
