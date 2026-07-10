// --------------------------------------------------------------
// 左侧导航栏（元培学院酒红古典风）
// - 深酒红底 + 白色 serif 文字
// - 课程带大号 serif 数字前缀 (00 / 01 / 02 ...)
// - 当前项高亮为"下划线 + 加粗"（学院气质，不用色块）
// --------------------------------------------------------------

import type { NavCourse } from "@app/shared";
import { ChevronRight, Home } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router";
import { cn } from "@/lib/utils";
import { useSearch } from "@/root";

interface SidebarProps {
  tree: NavCourse[];
  /** 移动端里 —— 点了任意链接后通知外层关闭抽屉 */
  onNavigate?: () => void;
  className?: string;
}

export function Sidebar({ tree, onNavigate, className }: SidebarProps) {
  const location = useLocation();
  const params = useParams();
  const { query } = useSearch();

  const activeCourseSlug = getActiveCourseSlug(location.pathname, params, tree);

  // 折叠状态：不在当前课程内的会默认折叠
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // 路由变化时通知外层
  useEffect(() => {
    onNavigate?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  function toggle(slug: string) {
    setCollapsed((prev) => ({ ...prev, [slug]: !prev[slug] }));
  }

  // 搜索过滤：course.title 命中或 chapter.title 命中都保留
  const filteredTree = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tree;
    return tree
      .map((course) => {
        const courseHit = course.title.toLowerCase().includes(q);
        const filteredChapters = course.chapters.filter((ch) => ch.title.toLowerCase().includes(q));
        // 课程本身命中 → 展示全部章节；否则只展示命中章节
        return {
          ...course,
          chapters: courseHit ? course.chapters : filteredChapters,
          _hasMatch: courseHit || filteredChapters.length > 0,
        };
      })
      .filter((c) => c._hasMatch);
  }, [tree, query]);

  const hasQuery = query.trim().length > 0;
  const noResult = hasQuery && filteredTree.length === 0;

  return (
    <div
      className={cn(
        "flex flex-col h-full w-full overflow-hidden bg-[--color-sidebar] text-[--color-sidebar-foreground]",
        className,
      )}
    >
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <nav className="p-4 space-y-0.5">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-2 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "text-[--color-sidebar-accent] font-semibold"
                  : "text-[--color-sidebar-foreground]/85 hover:text-[--color-sidebar-foreground]",
              )
            }
          >
            <Home className="h-4 w-4" />
            首页
          </NavLink>

          <div className="pt-3 space-y-1">
            {noResult && (
              <div className="px-2 py-6 text-center text-sm text-[--color-sidebar-muted]">
                未找到与"{query}"相关的课程
              </div>
            )}
            {filteredTree.map((course) => {
              const i = tree.findIndex((c) => c.slug === course.slug);
              const isActiveCourse = course.slug === activeCourseSlug;
              // 搜索时强制展开命中的课程
              const isCollapsed = hasQuery
                ? false
                : (collapsed[course.slug] ?? course.slug !== activeCourseSlug);

              return (
                <div key={course.slug} className="pt-2">
                  <div className="flex items-stretch group min-w-0">
                    <NavLink
                      to={`/courses/${course.slug}`}
                      className={({ isActive }) =>
                        cn(
                          "flex-1 flex items-baseline gap-2.5 px-2 py-1.5 min-w-0 transition-colors",
                          isActive || isActiveCourse
                            ? "text-[--color-sidebar-accent] font-semibold"
                            : "text-[--color-sidebar-foreground]/90 hover:text-[--color-sidebar-foreground]",
                        )
                      }
                    >
                      <span
                        className={cn(
                          "font-serif text-lg leading-none w-6 shrink-0 tabular-nums",
                          isActiveCourse
                            ? "text-[--color-sidebar-accent]"
                            : "text-[--color-sidebar-muted]",
                        )}
                      >
                        {String(i).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "font-serif text-[15px] leading-snug truncate min-w-0",
                          isActiveCourse && "underline decoration-2 underline-offset-4",
                        )}
                        title={course.title}
                      >
                        {course.title}
                      </span>
                    </NavLink>
                    <button
                      type="button"
                      onClick={() => toggle(course.slug)}
                      aria-label={isCollapsed ? "展开" : "折叠"}
                      className="px-2 shrink-0 text-[--color-sidebar-muted] hover:text-[--color-sidebar-foreground]"
                    >
                      <ChevronRight
                        className={cn(
                          "h-3.5 w-3.5 transition-transform",
                          !isCollapsed && "rotate-90",
                        )}
                      />
                    </button>
                  </div>

                  {!isCollapsed && (
                    <ul className="ml-8 mt-1 space-y-0.5 border-l border-[--color-sidebar-border] pl-3 min-w-0">
                      {course.chapters.map((ch) => (
                        <li key={ch.slug} className="min-w-0">
                          <NavLink
                            to={`/chapters/${ch.slug}`}
                            title={ch.title}
                            className={({ isActive }) =>
                              cn(
                                "block px-2 py-1 text-sm truncate transition-colors",
                                isActive
                                  ? "text-[--color-sidebar-accent] font-medium"
                                  : "text-[--color-sidebar-foreground]/70 hover:text-[--color-sidebar-foreground]",
                              )
                            }
                          >
                            {ch.title}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

/** 从当前路由推断激活课程 —— 用来自动展开对应课程 */
function getActiveCourseSlug(
  pathname: string,
  params: { slug?: string },
  tree: NavCourse[],
): string | null {
  if (pathname.startsWith("/courses/") && params.slug) {
    return params.slug;
  }
  if (pathname.startsWith("/chapters/") && params.slug) {
    for (const course of tree) {
      if (course.chapters.some((ch) => ch.slug === params.slug)) {
        return course.slug;
      }
    }
  }
  return null;
}
