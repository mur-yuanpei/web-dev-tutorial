// --------------------------------------------------------------
// 根布局：顶栏（固定）+ 三栏（各自独立滚动）
//
// 页面撑满 viewport 高度：
//   [顶栏 手机 h-14 / 桌面 h-20 固定]
//   [三栏区 flex-1 min-h-0]
//     ├── 左 Sidebar   自己滚动
//     ├── 中 正文       自己滚动
//     └── 右 TOC        自己滚动
//
// - 桌面 lg+：三栏全展示
// - 手机 / 平板 md：只有正文；左 Sidebar 靠顶栏"汉堡"打开为抽屉
//   （Sheet 里的 Sidebar 顶部内嵌搜索框，弥补顶栏搜索被隐藏）
// - 章节页通过 useTocSetter() 传 headings 给右侧 TOC
// --------------------------------------------------------------

import type { NavCourse } from "@app/shared";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Outlet, useLoaderData, useLocation } from "react-router";

import { AppHeader } from "./components/AppHeader";
import { Sidebar } from "./components/Sidebar";
import { TableOfContents } from "./components/TableOfContents";
import { Sheet, SheetContent } from "./components/ui/sheet";
import { Toaster } from "./components/ui/sonner";
import { api } from "./lib/api.js";
import type { Heading } from "./lib/toc";

export async function rootLoader(): Promise<NavCourse[]> {
  return await api.getTree();
}

// --- 章节页往上传 TOC 数据的 context ---
type TocCtx = {
  setHeadings: (h: Heading[]) => void;
};
const TocContext = createContext<TocCtx | null>(null);

export function useTocSetter() {
  const ctx = useContext(TocContext);
  if (!ctx) throw new Error("useTocSetter must be used inside <Root />");
  return ctx.setHeadings;
}

// --- 顶栏搜索 → Sidebar 过滤的 context ---
type SearchCtx = {
  query: string;
  setQuery: (q: string) => void;
};
const SearchContext = createContext<SearchCtx | null>(null);

export function useSearch() {
  const ctx = useContext(SearchContext);
  // 允许在测试环境不 wrap Provider —— 返回一个空的默认值
  if (!ctx) return { query: "", setQuery: () => {} };
  return ctx;
}

export function Root() {
  const tree = useLoaderData() as NavCourse[];
  const [mobileOpen, setMobileOpen] = useState(false);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [query, setQuery] = useState("");
  const mainRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();

  // 路由切换时把正文滚动条归零 —— <main> 是自己的滚动容器，
  // window 不滚，所以 React Router 默认的滚动重置对它无效
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <TocContext.Provider value={{ setHeadings }}>
      <SearchContext.Provider value={{ query, setQuery }}>
        <div className="h-screen flex flex-col overflow-hidden bg-[--color-background] text-[--color-foreground]">
          <AppHeader onOpenSidebar={() => setMobileOpen(true)} />

          {/* 移动端抽屉 —— Sidebar 自带米色底 */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetContent
              side="left"
              onOpenAutoFocus={(e) => e.preventDefault()}
              className="w-[85vw] max-w-xs p-0 border-[var(--color-border)]"
            >
              <Sidebar tree={tree} onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* 三栏区 —— flex-1 撑满剩余高度，各栏自己 overflow-y-auto */}
          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_240px]">
            {/* 左侧栏 —— 高度撑满、自身内部滚动（Sidebar 里的 ScrollArea 处理） */}
            <div className="hidden lg:block h-full overflow-hidden">
              <Sidebar tree={tree} />
            </div>

            {/* 主内容 —— 独立滚动容器 */}
            <main ref={mainRef} className="min-w-0 h-full overflow-y-auto">
              <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-6 sm:py-10 lg:py-14">
                <Outlet />
              </div>
              <footer className="border-t border-[--color-border] py-6 bg-[--color-muted]/50 mt-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-xs text-[--color-muted-foreground] font-serif tracking-wide">
                  元培学院 · Web 开发教程 · 项目本身即教程范本
                </div>
              </footer>
            </main>

            {/* 右侧 TOC —— 独立滚动 */}
            <div className="hidden lg:block h-full overflow-y-auto border-l border-[--color-border]">
              <TableOfContents headings={headings} />
            </div>
          </div>

          <Toaster position="top-right" />
        </div>
      </SearchContext.Provider>
    </TocContext.Provider>
  );
}
