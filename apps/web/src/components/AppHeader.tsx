// --------------------------------------------------------------
// 顶栏（元培学院酒红古典风）
// - 深酒红背景 + 校徽 + 中英双标 + 搜索框 + 主题切换
// - 手机端隐藏搜索框和英文副标，把汉堡按钮放最左
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
    <header className="sticky top-0 z-40 h-20 bg-[--color-sidebar] text-[--color-sidebar-foreground] border-b border-[--color-sidebar-border]">
      <div className="h-full px-4 lg:px-6 flex items-center gap-4">
        {/* 移动端汉堡 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSidebar}
          className="lg:hidden text-[--color-sidebar-foreground] hover:bg-white/10"
          aria-label="打开侧栏"
        >
          <Menu />
        </Button>

        {/* 品牌名 */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="leading-tight">
            <div className="font-serif text-lg md:text-xl tracking-wide">
              元培学院 Web 开发教程
            </div>
            <div className="hidden md:block text-[10px] tracking-[0.35em] text-[--color-sidebar-muted] mt-0.5">
              YUANPEI COLLEGE · WEB DEVELOPMENT
            </div>
          </div>
        </Link>

        {/* 右侧：搜索框 + 主题切换 */}
        <div className="ml-auto flex items-center gap-2">
          <SearchBox className="hidden md:flex w-64 lg:w-80" />
          <ThemeToggle className="text-[--color-sidebar-foreground] hover:bg-white/10" />
        </div>
      </div>
    </header>
  );
}
