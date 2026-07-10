// --------------------------------------------------------------
// 首页（元培学院风）：题字 hero + 学习引导 + 课程一览
// --------------------------------------------------------------

import type { Course } from "@app/shared";
import { ArrowRight, BookOpen, FlaskConical, KeyboardIcon, ListOrdered } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import { OrnamentDivider } from "@/components/brand/OrnamentDivider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIndex } from "@/lib/utils";
import { api } from "../lib/api.js";

export async function homeLoader(): Promise<Course[]> {
  return await api.listCourses();
}

const guides = [
  { icon: ListOrdered, text: "按左侧目录顺序读课程 —— 从「先跑起来再说」开始建立手感" },
  { icon: BookOpen, text: "每章读完之后，打开对应的项目文件对照一下真实写法 —— 章节里会告诉你去看哪个文件" },
  { icon: FlaskConical, text: "看到带闪光标记的章节，一定要动手试试底部的小练习" },
  { icon: KeyboardIcon, text: "在浏览器里按 F12 打开开发者工具，可以看到网页背后正在发生什么" },
];

export function HomePage() {
  const courses = useLoaderData() as Course[];
  const firstCourse = courses[0];

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Hero */}
      <section className="space-y-5 sm:space-y-6 pt-2 sm:pt-4 text-center">
        <div className="text-[10px] sm:text-xs tracking-[0.4em] sm:tracking-[0.5em] text-[--color-accent] font-medium">
          YUANPEI COLLEGE · WEB DEVELOPMENT
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight leading-tight text-[--color-primary]">
          元培学院 Web 开发教程
        </h1>
        <p className="text-[--color-muted-foreground] text-base sm:text-lg font-serif">
          厚德载物 · 自强不息 —— 从零学 Web 全栈开发
        </p>

        <OrnamentDivider />

        <div className="max-w-[64ch] mx-auto space-y-4 text-[--color-foreground]/85 leading-relaxed text-left text-[15px] sm:text-base">
          <p>
            这是<b className="text-[--color-primary]">元培学院</b>与
            <b className="text-[--color-primary]">腾讯 IEG 用户研究与市场部门</b>合作的
            <b className="text-[--color-primary]">"AI 模拟用户"研究项目</b>的一部分成果。
          </p>
          <p>
            我们相信最好的教材是<b>可以动手玩的教材</b>。所以我们做了一件事：
            <b className="text-[--color-primary]">把这份教材本身，做成一个真实网站</b>。
          </p>
          <p>
            你现在读到的所有内容 —— 侧边的目录、这些文字、每一门课程 —— 都是这个网站程序自己
            "算出来"再画到屏幕上的。学完本教程之后，你也能做出一个这样的网站。
          </p>
        </div>

        {firstCourse && (
          <div className="pt-2">
            <Button asChild size="lg">
              <Link to={`/courses/${firstCourse.slug}`}>
                从「{firstCourse.title}」开始
                <ArrowRight />
              </Link>
            </Button>
          </div>
        )}
      </section>

      {/* 学习引导 */}
      <section className="space-y-5">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[--color-primary] text-center">
          学习方法
        </h2>
        <Card className="bg-[--color-secondary]/60">
          <CardContent className="pt-6">
            <ol className="space-y-4">
              {guides.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-[15px] leading-relaxed">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[--color-primary] text-[--color-primary-foreground]">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </section>

      {/* 课程一览 */}
      <section className="space-y-5">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[--color-primary] text-center">
          课程一览
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {courses.map((c, i) => (
            <Link key={c.id} to={`/courses/${c.slug}`} className="block group">
              <Card className="h-full transition-all hover:border-[--color-primary] hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="font-serif text-2xl text-[--color-primary]/60 tabular-nums leading-none">
                    {formatIndex(i)}
                  </div>
                  <CardTitle className="text-lg mt-2 font-serif text-[--color-primary]">
                    {c.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">{c.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
