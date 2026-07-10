// --------------------------------------------------------------
// Markdown 渲染组件
// react-markdown + remark-gfm 支持 GitHub 风格 Markdown（表格、任务列表等）
// 用 Tailwind Typography 插件的 `prose` 类做默认排版
//
// 对 h2/h3 自动加 id（与 lib/toc.ts 的 slugify 保持一致），
// 让右侧 TOC 的锚点跳转能生效
//
// h1 隐藏 —— 章节页有独立的 <h1>{chapter.title}</h1>，
// 避免正文里的 `# 标题` 与页面顶部标题重复
// --------------------------------------------------------------

import type { HTMLAttributes, ReactNode } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { OrnamentDivider } from "@/components/brand/OrnamentDivider";
import { slugify } from "@/lib/toc";

function extractText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (children && typeof children === "object" && "props" in children) {
    const props = (children as { props?: { children?: ReactNode } }).props;
    if (props?.children) return extractText(props.children);
  }
  return "";
}

function makeHeading(Tag: "h2" | "h3") {
  return function Heading({ children, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
    const id = slugify(extractText(children));
    return (
      <Tag id={id} {...rest}>
        {children}
      </Tag>
    );
  };
}

/** 把 Markdown 的 `---` 渲染成中式徽章分隔线 */
function Hr() {
  return <OrnamentDivider />;
}

/** 隐藏一级标题 —— 页面顶部已经有 chapter.title */
function HiddenH1() {
  return null;
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <article className="prose max-w-none">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: HiddenH1,
          h2: makeHeading("h2"),
          h3: makeHeading("h3"),
          hr: Hr,
        }}
      >
        {content}
      </Markdown>
    </article>
  );
}

