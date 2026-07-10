// --------------------------------------------------------------
// 左侧导航栏（元培学院古典风）
// - 米色底 + 深酒红 serif 文字
// - 课程带大号 serif 数字前缀 (00 / 01 / 02 ...)
// - 当前项高亮为"下划线 + 加粗"（学院气质，不用色块）
// --------------------------------------------------------------

import type { NavCourse } from "@app/shared";
import { ChevronRight, Home } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router";
import { cn, formatIndex } from "@/lib/utils";
import { useSearch } from "@/root";
import { SearchBox } from "./SearchBox";

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

  // 路由变化时通知外层（例如移动端关闭抽屉）
  // 注意：初次挂载不算变化，否则一打开抽屉就会立即关掉
  const initialPath = useRef(location.pathname);
  useEffect(() => {
    if (location.pathname !== initialPath.current) {
      onNavigate?.();
      initialPath.current = location.pathname;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  function toggle(slug: string) {
    setCollapsed((prev) => ({ ...prev, [slug]: !prev[slug] }));
  }

  // 课程 slug → 在 tree 中的下标，用于 Sidebar 数字前缀（00/01/02...）
  // 用 Map 一次算好，避免每次 render 都 O(n) findIndex
  const indexBySlug = useMemo(() => {
    const m = new Map<string, number>();
    tree.forEach((c, i) => m.set(c.slug, i));
    return m;
  }, [tree]);

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
        "flex flex-col h-full w-full overflow-hidden bg-[var(--color-sidebar)] text-[var(--color-sidebar-foreground)]",
        className,
      )}
    >
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        {/* 移动端 Sheet 里的搜索框（顶栏已有搜索，桌面隐藏此处避免重复） */}
        <div className="lg:hidden p-3 border-b border-[var(--color-sidebar-border)]">
          <SearchBox />
        </div>
        <nav className="p-4 space-y-0.5">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-2 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "text-[var(--color-sidebar-accent)] font-semibold"
                  : "text-[var(--color-sidebar-foreground)]/85 hover:text-[var(--color-sidebar-foreground)]",
              )
            }
          >
            <Home className="h-4 w-4" />
            首页
          </NavLink>

          <div className="pt-3 space-y-1">
            {noResult && (
              <div className="px-2 py-6 text-center text-sm text-[var(--color-sidebar-muted)]">
                未找到与"{query}"相关的课程
              </div>
            )}
            {filteredTree.map((course) => {
              const i = indexBySlug.get(course.slug) ?? 0;
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
                            ? "text-[var(--color-sidebar-accent)] font-semibold"
                            : "text-[var(--color-sidebar-foreground)]/90 hover:text-[var(--color-sidebar-foreground)]",
                        )
                      }
                    >
                      <span
                        className={cn(
                          "font-serif text-lg leading-none w-6 shrink-0 tabular-nums",
                          isActiveCourse
                            ? "text-[var(--color-sidebar-accent)]"
                            : "text-[var(--color-sidebar-muted)]",
                        )}
                      >
                        {formatIndex(i)}
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
                      className="px-2 shrink-0 text-[var(--color-sidebar-muted)] hover:text-[var(--color-sidebar-foreground)]"
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
                    <ul className="ml-8 mt-1 space-y-0.5 border-l border-[var(--color-sidebar-border)] pl-3 min-w-0">
                      {course.chapters.map((ch) => (
                        <li key={ch.slug} className="min-w-0">
                          <NavLink
                            to={`/chapters/${ch.slug}`}
                            title={ch.title}
                            className={({ isActive }) =>
                              cn(
                                "block px-2 py-1 text-sm truncate transition-colors",
                                isActive
                                  ? "text-[var(--color-sidebar-accent)] font-medium"
                                  : "text-[var(--color-sidebar-foreground)]/70 hover:text-[var(--color-sidebar-foreground)]",
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
