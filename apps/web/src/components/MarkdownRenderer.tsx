// --------------------------------------------------------------
// Markdown 渲染组件
// react-markdown + remark-gfm 支持 GitHub 风格 Markdown（表格、任务列表等）
// 用 Tailwind Typography 插件的 `prose` 类做默认排版
//
// 对 h2/h3 自动加 id（与 lib/toc.ts 的 slugify 保持一致），
// 让右侧 TOC 的锚点跳转能生效
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

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <article className="prose max-w-none">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{ h2: makeHeading("h2"), h3: makeHeading("h3"), hr: Hr }}
      >
        {content}
      </Markdown>
    </article>
  );
}
