// --------------------------------------------------------------
// Demo 组件：ListMessages
// 一个迷你留言板，展示"提交表单 → POST → 列表刷新"最常见的交互模式
// --------------------------------------------------------------

import type { Message } from "@app/shared";
import { useEffect, useState, type FormEvent } from "react";
import { api } from "../../lib/api.js";

export function ListMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setMessages(await api.listMessages());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!author.trim() || !body.trim()) {
      setError("昵称和留言都得填");
      return;
    }
    setSubmitting(true);
    try {
      await api.postMessage({ author: author.trim(), body: body.trim() });
      setBody("");
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "提交失败");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900 space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        一个迷你留言板：表单 → POST 到后端 → 写入数据库 → 前端重新拉列表。
      </p>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder="昵称"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
        />
        <textarea
          placeholder="说点什么..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? "发送中..." : "发送"}
        </button>
      </form>

      <div className="space-y-2">
        {messages.length === 0 ? (
          <p className="text-sm text-slate-500">还没人留言，第一个吧！</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className="p-3 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-medium text-sm">{m.author}</span>
                <span className="text-xs text-slate-500">
                  {new Date(m.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm mt-1 whitespace-pre-wrap">{m.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
