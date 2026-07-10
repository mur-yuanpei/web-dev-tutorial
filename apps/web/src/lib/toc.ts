// --------------------------------------------------------------
// TOC 工具：从 Markdown 提取 h2/h3 标题，生成右侧目录数据
// - 用简单正则扫 ^## / ^### 行
// - 生成的 id 用于 <h2 id="...">，跟 TOC 的锚点链接对应
// --------------------------------------------------------------

export type Heading = {
  level: 2 | 3;
  text: string;
  id: string;
};

/** 把标题文本转成 URL 安全的 id */
export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\s]+/g, "-")
    .replace(/[^a-z0-9一-龥-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** 从一段 Markdown 里提取 h2 和 h3 */
export function extractHeadings(markdown: string): Heading[] {
  const lines = markdown.split("\n");
  const headings: Heading[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    // 跳过 ``` 代码块内的内容（避免把代码里的 ## 当成标题）
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const h2 = line.match(/^##\s+(.+)$/);
    if (h2 && h2[1]) {
      const text = h2[1].trim();
      headings.push({ level: 2, text, id: slugify(text) });
      continue;
    }
    const h3 = line.match(/^###\s+(.+)$/);
    if (h3 && h3[1]) {
      const text = h3[1].trim();
      headings.push({ level: 3, text, id: slugify(text) });
    }
  }

  return headings;
}
