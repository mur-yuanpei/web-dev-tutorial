// --------------------------------------------------------------
// Demo 组件：HelloAPI —— 最简单的"前端调后端"示例
// --------------------------------------------------------------

import { Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardDescription>
          点下面这个按钮，前端会向后端 <code className="text-xs">/api/demo/hello</code> 发一次 GET
          请求。打开 F12 → Network 你能看到真实的 HTTP 往返。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleClick} disabled={loading}>
          <Send />
          {loading ? "请求中..." : "调用后端"}
        </Button>
        {message && (
          <div className="rounded-md border border-[--color-border] bg-[--color-muted] px-3 py-2 text-sm">
            {message}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-[--color-muted-foreground]">
        源码 · apps/web/src/components/demos/HelloAPI.tsx
      </CardFooter>
    </Card>
  );
}
