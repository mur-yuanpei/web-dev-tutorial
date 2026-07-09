// --------------------------------------------------------------
// Demo 组件路由：根据章节的 demoKey 挂载对应组件
// --------------------------------------------------------------

import type { ComponentType } from "react";
import { CountClicks } from "./CountClicks.js";
import { HelloAPI } from "./HelloAPI.js";
import { ListMessages } from "./ListMessages.js";

const registry: Record<string, ComponentType> = {
  "hello-api": HelloAPI,
  "count-clicks": CountClicks,
  "list-messages": ListMessages,
};

export function DemoByKey({ demoKey }: { demoKey: string }) {
  const Component = registry[demoKey];
  if (!Component) {
    return (
      <div className="text-sm text-slate-500 italic">
        （未找到 Demo：{demoKey}）
      </div>
    );
  }
  return <Component />;
}
