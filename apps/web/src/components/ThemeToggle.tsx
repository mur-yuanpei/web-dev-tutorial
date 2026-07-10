// --------------------------------------------------------------
// 主题切换按钮：在 <html> 上加 / 去 .dark 类
// - 首次进入读 localStorage，无值时看 prefers-color-scheme
// - 每次 toggle 写回 localStorage
// --------------------------------------------------------------

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme");
    if (saved === "dark") return true;
    if (saved === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const el = document.documentElement;
    if (dark) {
      el.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      el.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setDark((v) => !v)}
      className={cn(className)}
      aria-label={dark ? "切换到浅色主题" : "切换到深色主题"}
    >
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}
