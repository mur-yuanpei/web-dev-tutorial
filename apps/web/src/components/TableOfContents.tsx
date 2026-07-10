// --------------------------------------------------------------
// 右侧章节内目录（TOC）
// - 从当前章节的 Markdown 里提出的 h2 / h3 列表
// - IntersectionObserver 高亮当前在视口内的标题
// - 桌面 lg 才显示，小屏隐藏
// --------------------------------------------------------------

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/toc";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  headings: Heading[];
  className?: string;
}

export function TableOfContents({ headings, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 用"离顶部最近"的可见标题作为活动项
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0 && visible[0]) {
          const id = visible[0].target.id;
          if (id) setActiveId(id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="章节目录"
      className={cn("text-sm py-10 pl-6 pr-4 w-full min-w-0", className)}
    >
      <div className="font-serif text-[--color-primary] text-base mb-3 tracking-wide">
        本章目录
      </div>
      <ul className="space-y-1.5 border-l border-[--color-border] min-w-0">
        {headings.map((h) => {
          const isActive = h.id === activeId;
          return (
            <li key={h.id} className="min-w-0">
              <a
                href={`#${h.id}`}
                title={h.text}
                className={cn(
                  "block -ml-px pl-3 py-1 border-l-2 transition-colors leading-snug truncate",
                  h.level === 3 && "pl-6",
                  isActive
                    ? "border-[--color-primary] text-[--color-primary] font-medium"
                    : "border-transparent text-[--color-muted-foreground] hover:text-[--color-foreground]",
                )}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
