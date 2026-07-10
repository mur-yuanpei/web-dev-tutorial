// --------------------------------------------------------------
// cn = classnames merge —— shadcn 生态标配的类名合并工具
// - clsx 处理"条件类名"：cn("base", condition && "extra")
// - twMerge 处理"冲突类名"：cn("p-2", "p-4") 结果只保留 p-4
// 组合起来 = 写 UI 组件时最舒服的类名 API
// --------------------------------------------------------------

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 把课程/章节序号补零到 2 位 —— 元培古典风的编号样式
 * formatIndex(0) → "00"，formatIndex(7) → "07"，formatIndex(12) → "12"
 */
export function formatIndex(n: number) {
  return String(n).padStart(2, "0");
}
