// --------------------------------------------------------------
// Demo 组件：CountClicks —— 前端 → 后端 → 落库 完整链路
// --------------------------------------------------------------

import { MousePointerClick } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardDescription>
          每点一次，后端往 <code className="text-xs">demo_events</code> 表插一行；返回累计数。
          刷新页面数据不会重置 —— 存在数据库里。
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-4">
        <Button onClick={handleClick} disabled={loading} variant="default">
          <MousePointerClick />
          点我 +1
        </Button>
        <div className="text-sm">
          当前累计：
          <span className="font-mono text-lg font-semibold text-[--color-primary] ml-1 tabular-nums">
            {count === null ? "..." : count}
          </span>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-[--color-muted-foreground]">
        源码 · apps/web/src/components/demos/CountClicks.tsx
      </CardFooter>
    </Card>
  );
}
