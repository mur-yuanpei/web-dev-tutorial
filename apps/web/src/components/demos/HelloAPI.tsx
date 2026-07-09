// --------------------------------------------------------------
// Demo 组件：HelloAPI
// 最简单的"前端调后端"示例，让学生看见 fetch 的真实过程。
// --------------------------------------------------------------

import { useState } from "react";
import { api } from "../../lib/api.js";

export function HelloAPI() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await api.hello();
      setMessage(`${res.message}（服务器时间：${res.time}）`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900 space-y-3">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        点下面这个按钮，前端会向后端 <code>/api/demo/hello</code> 发一次 GET 请求。
        打开 F12 → Network 你能看到真实的 HTTP 往返。
      </p>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "请求中..." : "调用后端"}
      </button>
      {message && (
        <p className="text-sm p-3 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          {message}
        </p>
      )}
    </div>
  );
}
