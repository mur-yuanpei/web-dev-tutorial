# shadcn/ui 组件目录

这个目录下的每个 tsx 文件都是 shadcn/ui 官方生成的**组件源码**。

## 特点

- **不是 npm 包** —— 组件源码复制在你的项目里，可以任意修改
- 只依赖：`class-variance-authority`（变体管理）、`clsx` + `tailwind-merge`（class 合并，见 `@/lib/utils`）、`lucide-react`（图标）、少量 `@radix-ui/*`（无障碍原语，如 Sheet、ScrollArea、Separator）

## 目前已装

| 组件 | 用途 |
|---|---|
| `button` | 各处按钮 —— 6 种 variant、4 种 size |
| `card` | 卡片容器 —— CardHeader/Title/Description/Content/Footer 一套 |
| `badge` | 小标签 —— 5 种 variant（含 accent 学院风） |
| `input` | 单行输入 |
| `textarea` | 多行输入 |
| `label` | 表单标签 |
| `separator` | 视觉分隔 |
| `scroll-area` | 自定义滚动条容器（Sidebar 用） |
| `sheet` | 移动端左侧抽屉（Radix Dialog 封装） |
| `sonner` | Toast 提示 |

## 加更多组件

**推荐用官方 CLI**（如果能装好）：

```bash
bunx shadcn@latest add dialog dropdown-menu tabs
```

**或者**打开 https://ui.shadcn.com/docs/components，把你需要的组件源码复制到这个目录、按需调整。

## 一个教学要点

传统组件库（MUI / Ant Design）你只能 `import { Button } from "@mui/material"` —— 组件是黑盒。这里你可以直接打开 `button.tsx` 看每一行代码。**这就是学习 UI 库最好的方式**。
