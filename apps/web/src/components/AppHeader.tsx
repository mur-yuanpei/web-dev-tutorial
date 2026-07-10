// --------------------------------------------------------------
// 顶栏（元培学院米色古典风）
// - 米色背景 + 深酒红品牌名 + 搜索框 + 主题切换
// - 手机端：紧凑高度（h-14）、品牌名截断、搜索框放到 Sidebar 抽屉里
// - 桌面：完整品牌名 + 英文副标 + 顶栏内嵌搜索
// --------------------------------------------------------------

import { Menu } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { SearchBox } from "./SearchBox";
import { ThemeToggle } from "./ThemeToggle";

interface AppHeaderProps {
  onOpenSidebar: () => void;
}

export function AppHeader({ onOpenSidebar }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 h-12 lg:h-14 bg-[var(--color-header)] text-[var(--color-header-foreground)] border-b border-[var(--color-header-border)]">
      <div className="h-full px-3 lg:px-6 flex items-center gap-2 lg:gap-4">
        {/* 移动端汉堡 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSidebar}
          className="lg:hidden text-[var(--color-header-foreground)] hover:bg-white/10 shrink-0 -ml-1"
          aria-label="打开侧栏"
        >
          <Menu />
        </Button>

        {/* 品牌名 —— 手机端只显示"Web 开发教程"，桌面显示完整名 + 英文小标 */}
        <Link to="/" className="flex items-baseline gap-3 min-w-0 flex-1 lg:flex-initial">
          <span className="font-serif text-base lg:text-lg tracking-wide truncate">
            <span className="hidden sm:inline">元培学院 Web 开发教程</span>
            <span className="sm:hidden">Web 开发教程</span>
          </span>
          <span className="hidden xl:inline text-[10px] tracking-[0.3em] text-[var(--color-header-muted)] shrink-0">
            YUANPEI · WEB DEVELOPMENT
          </span>
        </Link>

        {/* 右侧：搜索框（仅桌面）+ 主题切换 */}
        <div className="ml-auto flex items-center gap-1 lg:gap-2 shrink-0">
          <SearchBox className="hidden lg:flex w-64 xl:w-80" />
          <ThemeToggle className="text-[var(--color-header-foreground)] hover:bg-white/10" />
        </div>
      </div>
    </header>
  );
}
