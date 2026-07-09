// --------------------------------------------------------------
// Markdown 渲染组件
// react-markdown + remark-gfm 支持 GitHub 风格 Markdown（表格、任务列表等）
// 用 Tailwind Typography 插件的 `prose` 类做默认排版
// --------------------------------------------------------------

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
    </article>
  );
}
