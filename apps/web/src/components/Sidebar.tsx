// --------------------------------------------------------------
// 左侧导航栏：显示所有课程 → 章节树，高亮当前路由
// - 桌面端：常驻左侧
// - 移动端：默认收起，靠一个按钮打开抽屉
// --------------------------------------------------------------

import type { NavCourse } from "@app/shared";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router";

interface SidebarProps {
  tree: NavCourse[];
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ tree, open, onClose }: SidebarProps) {
  const location = useLocation();
  const params = useParams();

  // 计算当前激活的 course slug（用于自动展开对应课程）
  const activeCourseSlug = getActiveCourseSlug(location.pathname, params, tree);

  // 用户手动折叠/展开的状态（key: courseSlug → collapsed）
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // 路由变化时自动关闭移动端抽屉
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  function toggle(slug: string) {
    setCollapsed((prev) => ({ ...prev, [slug]: !prev[slug] }));
  }

  return (
    <>
      {/* 移动端遮罩 */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-20"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          "fixed lg:sticky lg:top-16 z-30 lg:z-0",
          "top-0 left-0 h-screen lg:h-[calc(100vh-4rem)]",
          "w-72 shrink-0",
          "bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800",
          "overflow-y-auto",
          "transition-transform lg:transform-none",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <nav className="p-4 space-y-3">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              [
                "block px-3 py-2 rounded-md text-sm font-medium",
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
              ].join(" ")
            }
          >
            🏠 首页
          </NavLink>

          {tree.map((course, i) => {
            const isCollapsed =
              collapsed[course.slug] ?? course.slug !== activeCourseSlug;

            return (
              <div key={course.slug} className="space-y-1">
                <div className="flex items-stretch">
                  <NavLink
                    to={`/courses/${course.slug}`}
                    className={({ isActive }) =>
                      [
                        "flex-1 px-3 py-1.5 rounded-l-md text-sm font-semibold",
                        isActive
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
                      ].join(" ")
                    }
                  >
                    <span className="text-slate-400 font-mono text-xs mr-2">
                      {String(i).padStart(2, "0")}
                    </span>
                    {course.title}
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => toggle(course.slug)}
                    aria-label={isCollapsed ? "展开" : "折叠"}
                    className="px-2 rounded-r-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span
                      className={[
                        "inline-block transition-transform text-xs",
                        isCollapsed ? "" : "rotate-90",
                      ].join(" ")}
                    >
                      ▶
                    </span>
                  </button>
                </div>

                {!isCollapsed && (
                  <ul className="ml-4 pl-3 border-l border-slate-200 dark:border-slate-800 space-y-0.5">
                    {course.chapters.map((ch) => (
                      <li key={ch.slug}>
                        <NavLink
                          to={`/chapters/${ch.slug}`}
                          className={({ isActive }) =>
                            [
                              "flex items-center gap-1.5 px-2 py-1 rounded text-sm",
                              isActive
                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
                            ].join(" ")
                          }
                        >
                          <span className="truncate">{ch.title}</span>
                          {ch.demoKey && (
                            <span
                              className="text-[10px] shrink-0 text-amber-600 dark:text-amber-400"
                              title="含可交互 Demo"
                            >
                              ●
                            </span>
                          )}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

/**
 * 根据当前路由推断激活的课程 slug，用来自动展开对应课程。
 * - /courses/:slug             → :slug
 * - /chapters/:slug            → slug 的前缀部分（seed 里章节 slug 是 "courseSlug--chapterName"）
 */
function getActiveCourseSlug(
  pathname: string,
  params: { slug?: string },
  tree: NavCourse[],
): string | null {
  if (pathname.startsWith("/courses/") && params.slug) {
    return params.slug;
  }
  if (pathname.startsWith("/chapters/") && params.slug) {
    // 优先精确匹配（万一未来章节 slug 不再遵循前缀规则）
    for (const course of tree) {
      if (course.chapters.some((ch) => ch.slug === params.slug)) {
        return course.slug;
      }
    }
  }
  return null;
}
