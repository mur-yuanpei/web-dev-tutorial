// --------------------------------------------------------------
// 数据库表定义（Drizzle Schema）
// 一份 TypeScript 代码，Drizzle 会：
//   1. 从这里生成 SQL migration（CREATE TABLE ...）
//   2. 让你写查询时享受完整的类型安全
//
// 这份 schema 本身就是数据库设计课的活教材：
//   - 主键、外键、唯一约束、非空约束
//   - 一对多：course -> chapter -> section
//   - 索引：加在经常查询的列上（如 slug）
//   - jsonb：Postgres 特有的、能存半结构化数据的字段
// --------------------------------------------------------------

import { relations } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// -------------------- courses --------------------

export const courses = pgTable(
  "courses",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    order: integer("order").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("courses_slug_idx").on(table.slug),
    orderIdx: index("courses_order_idx").on(table.order),
  }),
);

// -------------------- chapters --------------------

export const chapters = pgTable(
  "chapters",
  {
    id: serial("id").primaryKey(),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    order: integer("order").notNull(),
    // 可选：如果不为 null，前端会挂载对应的 Demo 组件
    demoKey: text("demo_key"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("chapters_slug_idx").on(table.slug),
    courseIdx: index("chapters_course_id_idx").on(table.courseId),
  }),
);

// -------------------- sections --------------------

// pgEnum 会生成 Postgres 层的 ENUM 类型，比 text + CHECK 约束更规范
export const sectionKindEnum = pgEnum("section_kind", ["text", "code", "note"]);

export const sections = pgTable(
  "sections",
  {
    id: serial("id").primaryKey(),
    chapterId: integer("chapter_id")
      .notNull()
      .references(() => chapters.id, { onDelete: "cascade" }),
    order: integer("order").notNull(),
    kind: sectionKindEnum("kind").notNull().default("text"),
    content: text("content").notNull(),
  },
  (table) => ({
    chapterIdx: index("sections_chapter_id_idx").on(table.chapterId),
  }),
);

// -------------------- demo_events --------------------

// Demo 组件产生的运行时数据：点击计数、留言板等
// payload 用 jsonb —— Postgres 特色，能存半结构化数据、还能对内部字段建索引
export const demoEvents = pgTable(
  "demo_events",
  {
    id: serial("id").primaryKey(),
    demoKey: text("demo_key").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    demoKeyIdx: index("demo_events_demo_key_idx").on(table.demoKey),
  }),
);

// -------------------- relations --------------------
// relations 让 Drizzle 的 query API 支持 join 时保持类型安全
// （db.query.courses.findFirst({ with: { chapters: true } })）

export const coursesRelations = relations(courses, ({ many }) => ({
  chapters: many(chapters),
}));

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  course: one(courses, {
    fields: [chapters.courseId],
    references: [courses.id],
  }),
  sections: many(sections),
}));

export const sectionsRelations = relations(sections, ({ one }) => ({
  chapter: one(chapters, {
    fields: [sections.chapterId],
    references: [chapters.id],
  }),
}));

// -------------------- 便捷类型导出 --------------------

export type CourseRow = typeof courses.$inferSelect;
export type ChapterRow = typeof chapters.$inferSelect;
export type SectionRow = typeof sections.$inferSelect;
export type DemoEventRow = typeof demoEvents.$inferSelect;
