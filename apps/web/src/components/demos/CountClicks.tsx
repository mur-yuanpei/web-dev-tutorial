// --------------------------------------------------------------
// Demo 组件：CountClicks
// 演示"前端触发 → 后端处理 → 落库 → 返回新值 → 前端更新"完整链路
// --------------------------------------------------------------

import { useEffect, useState } from "react";
import { api } from "../../lib/api.js";

export function CountClicks() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getClickCount().then((r) => setCount(r.count));
  }, []);

  async function handleClick() {
    setLoading(true);
    try {
      const r = await api.addClick();
      setCount(r.count);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900 space-y-3">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        每点一次，后端会往 <code>demo_events</code> 表插入一行；返回值是当前累计数。
        你的点击会永久存在数据库里，刷新页面也不会重置。
      </p>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
        >
          点我 +1
        </button>
        <span className="text-lg font-semibold">
          当前累计：{count === null ? "加载中..." : count}
        </span>
      </div>
    </div>
  );
}
