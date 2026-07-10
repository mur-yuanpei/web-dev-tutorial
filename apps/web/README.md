# @app/web · 前端

> React + Vite + Tailwind v4 + shadcn/ui 的现代前端 —— 元培学院古典书院风

## 技术栈

| 用途 | 技术 | 说明 |
|---|---|---|
| 构建 | **[Vite](https://vite.dev) 6** | dev 秒开、HMR、生产打包 |
| 框架 | **[React](https://react.dev) 18** | 组件化 UI |
| 路由 | **[React Router](https://reactrouter.com) 7**（data mode） | `loader` 预取数据 + 客户端路由 |
| 语言 | **TypeScript 5.9** | 严格模式、`@/*` path alias |
| 样式 | **[Tailwind CSS v4](https://tailwindcss.com)** | `@theme` 在 CSS 里定义主题、`@custom-variant dark` 深色模式 |
| Tailwind 工具 | **`@tailwindcss/vite`** + **`@tailwindcss/typography`** | v4 vite 集成 + prose 排版 |
| 组件库 | **[shadcn/ui](https://ui.shadcn.com)**（new-york 风格） | 复制源码到 `src/components/ui/`，可自由改 |
| 组件依赖 | `@radix-ui/*`（dialog/scroll-area/separator/slot）+ `class-variance-authority` + `clsx` + `tailwind-merge` | shadcn 底层 |
| 图标 | **[lucide-react](https://lucide.dev) 0.469** | 图标库 |
| Toast | **[sonner](https://sonner.emilkowal.ski) 1.7** | 交互反馈 |
| Markdown | **react-markdown 9** + **remark-gfm 4** | 章节内容渲染 |
| 共享类型 | **`@app/shared`**（workspace） | zod schema + TS 类型 |
| 测试 | **Vitest 2** + **jsdom 25** + **@testing-library/react 16** | 组件与纯函数测试 |
| Web 字体 | Inter · Source Serif 4 · Noto Serif SC · JetBrains Mono（Google Fonts CDN） | UI / serif 标题 / 中文衬线 / 代码 |

## 目录结构

```
apps/web/
├── src/
│   ├── main.tsx              # 入口 · 挂载 React 树 + 定义路由
│   ├── root.tsx              # 三栏布局根组件 + Toc/Search Context
│   ├── styles.css            # Tailwind v4 @theme 定义主题（元培古典风）
│   ├── routes/
│   │   ├── home.tsx          # 首页
│   │   ├── course.tsx        # /courses/:slug 课程详情
│   │   └── chapter.tsx       # /chapters/:slug 章节详情
│   ├── components/
│   │   ├── AppHeader.tsx     # 顶栏（深酒红 · 品牌名 · 搜索 · 主题切换）
│   │   ├── Sidebar.tsx       # 左侧课程树
│   │   ├── TableOfContents.tsx  # 右侧本章目录（h2/h3 + 滚动高亮）
│   │   ├── SearchBox.tsx     # 顶栏搜索（Cmd/Ctrl+K）
│   │   ├── ThemeToggle.tsx   # 深浅色切换
│   │   ├── MarkdownRenderer.tsx  # Markdown 渲染 + 徽章分隔线
│   │   ├── brand/
│   │   │   └── OrnamentDivider.tsx  # 中式徽章分隔线（内联 SVG）
│   │   ├── ui/               # shadcn/ui 生成的组件源码（可自由修改）
│   │   │   ├── button.tsx / card.tsx / badge.tsx / input.tsx
│   │   │   ├── textarea.tsx / label.tsx / separator.tsx
│   │   │   ├── scroll-area.tsx / sheet.tsx / sonner.tsx
│   │   │   └── README.md     # shadcn 目录说明
│   │   └── demos/            # 教程里挂在章节底部的交互 Demo
│   │       ├── HelloAPI.tsx / CountClicks.tsx / ListMessages.tsx
│   │       └── index.tsx     # DemoByKey · 按 demoKey 派发到对应组件
│   └── lib/
│       ├── api.ts            # 后端 API 客户端（fetch 封装）
│       ├── toc.ts            # slugify + Markdown 标题提取
│       └── utils.ts          # shadcn 的 cn helper
├── public/assets/            # 元培官方素材（logo 等）
├── test/
│   └── setup.ts              # vitest setup · jest-dom + jsdom API stub
├── Dockerfile                # 多阶段：build → nginx alpine 静态托管
├── nginx.conf                # 生产环境 nginx 配置（SPA fallback + /api 反代）
├── components.json           # shadcn 配置
├── index.html                # 入口 HTML + Google Fonts
├── vite.config.ts            # Vite + Tailwind v4 插件 + @/* alias
├── vitest.config.ts          # jsdom + testing-library
├── package.json
└── tsconfig.json
```

## 快速开始

```bash
# 从仓库根跑
bun --filter @app/web dev         # 启动前端（http://localhost:5173）
bun --filter @app/web typecheck   # 类型检查
bun --filter @app/web test        # 跑测试
bun --filter @app/web build       # 生产构建
```

前端在 dev 时通过 `vite.config.ts` 的 `server.proxy` 把 `/api/*` 代理到后端 `http://localhost:3000`。生产用 nginx 反代实现同样的路径。

## 关键设计

### 三栏独立滚动布局（`root.tsx`）

```
┌──────────────────────────────────────┐
│ AppHeader 顶栏（sticky · 深酒红）      │
├──────────┬──────────────────┬────────┤
│          │                  │        │
│ Sidebar  │  正文（overflow  │  TOC   │
│ 各自     │  y-auto 独立滚） │  各自  │
│ 滚动     │                  │  滚动  │
│          │                  │        │
└──────────┴──────────────────┴────────┘
```

页面本身 `overflow-hidden`，三栏各自 `overflow-y-auto`。中间正文滚动时左右栏纹丝不动。

### 主题（`styles.css`）

- **浅色**：米白背景（`oklch(0.985 0.008 85)`）+ 深酒红主色（`oklch(0.36 0.14 22)` ≈ `#5b1414`）+ 金色点缀
- **深色**：墨黑略暖 + 提亮的红
- **字体**：中文用 Noto Serif SC；西文标题 Source Serif 4；UI Inter；代码 JetBrains Mono

### Context

`root.tsx` 提供两个 React Context：

- **`TocContext`** —— 章节页通过 `useTocSetter(headings)` 上传给右侧 TOC
- **`SearchContext`** —— SearchBox 与 Sidebar 通过 `useSearch()` 共享 query state

### shadcn/ui

组件源码放在 `src/components/ui/`，直接可读可改。加新组件：

```bash
bunx shadcn@latest add dialog dropdown-menu tabs
```

或参考官方文档直接手工复制。

## 路由

| 路径 | 组件 | Loader |
|---|---|---|
| `/` | HomePage | 拉课程列表 |
| `/courses/:slug` | CoursePage | 拉课程 + 章节 |
| `/chapters/:slug` | ChapterPage | 拉章节 + 前后导航 |

**Loader 模式**（React Router v7 data mode）：路由切换时先跑 loader 预取数据，再渲染组件，避免"页面先出现 → 数据再到"的抖动。

## 测试

- `src/lib/*.test.ts` —— 纯函数（toc/utils/api）
- `src/components/*.test.tsx` —— React 组件（用 MemoryRouter + testing-library）
- `test/setup.ts` —— jsdom 缺失 API 全部 stub（`IntersectionObserver` / `ResizeObserver` / `matchMedia` / `hasPointerCapture` / `scrollIntoView`）

## Docker

**多阶段构建**：
1. `oven/bun` 里 `bun --filter @app/web build` 得到 `dist/`
2. `nginx:1.27-alpine` 里 COPY dist → `/usr/share/nginx/html`
3. nginx 配置：SPA fallback（`try_files $uri $uri/ /index.html`）+ `/api/*` 反代到 `api:3000`

生产镜像只暴露 80 端口，`/api` 走同域反代（无 CORS 问题）。

## 教学附加值

- `src/routes/chapter.tsx` —— React Router v7 loader 模式实战
- `src/components/Sidebar.tsx` —— 复杂交互组件示范（路由感知 + 折叠 + 搜索过滤）
- `src/components/demos/` —— 前端调后端的 3 种范式（GET / POST / 表单）
- `src/lib/api.ts` —— API 客户端组织
- `src/components/ui/*` —— shadcn/ui 复制源码的组件设计范式（`class-variance-authority` + `cn`）

每个文件顶部都有中文注释。
