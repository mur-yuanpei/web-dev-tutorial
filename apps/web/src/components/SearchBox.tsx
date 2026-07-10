// --------------------------------------------------------------
// 顶栏搜索框
// - 输入实时过滤 Sidebar 的 course tree
// - Cmd/Ctrl+K 快捷键聚焦
// - 状态存在 root.tsx 的 SearchContext 里
// --------------------------------------------------------------

import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useSearch } from "@/root";

interface SearchBoxProps {
  className?: string;
}

export function SearchBox({ className }: SearchBoxProps) {
  const { query, setQuery } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  // Cmd/Ctrl + K 快捷键聚焦
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        setQuery("");
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setQuery]);

  return (
    <div
      className={cn(
        "flex items-center gap-2 h-10 px-3 rounded-md bg-white/10 border border-white/15 text-[--color-sidebar-foreground] focus-within:bg-white/15 focus-within:border-white/25 transition-colors",
        className,
      )}
    >
      <Search className="h-4 w-4 opacity-60 shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索课程内容..."
        className="flex-1 bg-transparent outline-none placeholder:text-[--color-sidebar-muted] text-sm"
      />
      {query ? (
        <button
          type="button"
          onClick={() => setQuery("")}
          aria-label="清空"
          className="text-[--color-sidebar-muted] hover:text-[--color-sidebar-foreground]"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : (
        <kbd className="hidden lg:inline-flex items-center gap-1 rounded border border-white/20 px-1.5 h-5 text-[10px] text-[--color-sidebar-muted] font-mono">
          ⌘K
        </kbd>
      )}
    </div>
  );
}
