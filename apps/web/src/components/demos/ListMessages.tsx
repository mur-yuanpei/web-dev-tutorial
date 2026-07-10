// --------------------------------------------------------------
// Demo 组件：ListMessages —— 迷你留言板
// 演示表单 → POST → 列表刷新 完整交互模式
// --------------------------------------------------------------

import type { Message } from "@app/shared";
import { Send } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "../../lib/api.js";

export function ListMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function refresh() {
    setMessages(await api.listMessages());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!author.trim() || !body.trim()) {
      toast.error("昵称和留言都得填");
      return;
    }
    setSubmitting(true);
    try {
      await api.postMessage({ author: author.trim(), body: body.trim() });
      setBody("");
      toast.success("发送成功");
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "提交失败");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          一个迷你留言板：表单 → POST → 写入 <code className="text-xs">demo_events</code> →
          前端重新拉取列表。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="msg-author">昵称</Label>
            <Input
              id="msg-author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="怎么称呼你？"
              maxLength={40}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="msg-body">留言</Label>
            <Textarea
              id="msg-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={2}
              placeholder="说点什么..."
              maxLength={400}
            />
          </div>
          <Button type="submit" disabled={submitting}>
            <Send />
            {submitting ? "发送中..." : "发送"}
          </Button>
        </form>

        <div className="space-y-2">
          {messages.length === 0 ? (
            <p className="text-sm text-[--color-muted-foreground]">还没人留言，第一个吧！</p>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className="rounded-md border border-[--color-border] bg-[--color-muted]/40 p-3"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium text-sm">{m.author}</span>
                  <span className="text-xs text-[--color-muted-foreground] tabular-nums">
                    {new Date(m.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm mt-1 whitespace-pre-wrap">{m.body}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-[--color-muted-foreground]">
        源码 · apps/web/src/components/demos/ListMessages.tsx
      </CardFooter>
    </Card>
  );
}
