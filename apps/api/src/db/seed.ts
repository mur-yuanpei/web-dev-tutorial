// --------------------------------------------------------------
// Seed 脚本：往数据库灌入教程初始内容
// 本项目双重身份：
//   - 项目源码 = 学生要学的技术栈
//   - 数据库内容 = 学生要读的教程本身
// 这个脚本就是"教程内容"的来源。修改教程内容 = 修改这个文件 + 重跑 seed。
// --------------------------------------------------------------

import { db } from "./client.js";
import { chapters, courses, sections } from "./schema.js";

// --------------------------------------------------------------
// 教程结构（章节顺序即学习路径）
// --------------------------------------------------------------

type SeedSection = {
  kind: "text" | "code" | "note";
  content: string;
};

type SeedChapter = {
  slug: string;
  title: string;
  summary: string;
  demoKey?: string;
  sections: SeedSection[];
};

type SeedCourse = {
  slug: string;
  title: string;
  description: string;
  chapters: SeedChapter[];
};

const SEED: SeedCourse[] = [
  {
    slug: "intro",
    title: "认识 Web 开发",
    description: '在动手写代码之前 —— 先搞清楚"前端"、"后端"到底各自在干什么，又是如何合作的',
    chapters: [
      {
        slug: "frontend-backend",
        title: "前端与后端：一顿饭的比喻",
        summary: "两个角色，两种代码，两台电脑",
        sections: [
          {
            kind: "text",
            content: `# 前端与后端：一顿饭的比喻

想象你去餐厅吃饭：

- **服务员** 在大厅：递菜单、听你点单、把菜端上桌。你只跟他打交道。
- **厨师** 在后厨：拿到订单、从冰箱取食材、烹饪、装盘、交给服务员。你从来不进后厨。
- **冰箱** 在储藏室：所有食材原封不动地存在这里。

Web 开发几乎是**完全一样的分工**：

| 餐厅 | Web 开发 | 跑在哪里 |
|---|---|---|
| 服务员（大厅） | **前端**（Frontend） | 用户的浏览器里 |
| 厨师（后厨） | **后端**（Backend） | 服务器机器上 |
| 冰箱 | **数据库** | 服务器机器上（或另一台专门的机器） |

## 前端在干什么

- 显示页面：按钮、文字、颜色、布局
- 响应用户操作：点击、输入、滚动
- 向后端"点单"：要数据、要保存、要删除
- 收到"菜"后端上桌：把后端返回的数据画到界面上

前端代码由**你的浏览器**下载并执行。所以任何人 F12 都能看到前端的全部源码 —— **前端没有秘密**。

## 后端在干什么

- 接收前端的请求
- 检查权限（你能看这条数据吗？你能改吗？）
- 读/写数据库
- 把结果打包成 JSON 返回给前端

后端代码在**服务器**上跑，用户看不到源码。**敏感逻辑必须放在后端** —— 比如"检查密码是否正确"、"扣款是否合法"。

## 数据库在干什么

只做一件事：**永久保存**结构化数据。

前端一关掉，内存里的数据就没了。要让"下次打开还能看到"，就得存到数据库。

## 为什么要分开？

- **安全**：用户能看到前端代码 → 敏感逻辑必须放后端
- **性能**：一台服务器能同时服务几千个用户，共用一份数据
- **一致性**：所有用户看到的数据来自同一个数据库，不会"张三看到的和李四看到的不一样"
- **专业分工**：前端工程师和后端工程师可以并行工作，通过"接口约定"配合`,
          },
          {
            kind: "note",
            content: "💡 **一个反直觉的事实**：前端和后端**不一定要用同一门编程语言**。本项目前端用 TypeScript（浏览器执行），后端也用 TypeScript（Node.js 执行）—— 但你完全可以后端用 Python、Java、Go。前后端只通过 HTTP + JSON 通信，各自内部用什么语言互不干涉。",
          },
        ],
      },
      {
        slug: "how-they-talk",
        title: "它们怎么对话：HTTP 与 API",
        summary: '服务员和厨师用"点单纸"沟通 —— 网页世界的"点单纸"就是 HTTP 请求',
        sections: [
          {
            kind: "text",
            content: `# 它们怎么对话：HTTP 与 API

前端和后端在两台不同的电脑上，怎么沟通？答案：**HTTP 协议**。

## 一次对话的完整过程

假设你在本项目里点了一下"发送留言"按钮：

\`\`\`
[浏览器/前端] ────请求────▶ [服务器/后端] ───▶ [数据库]
                                                │
[浏览器/前端] ◀───响应──── [服务器/后端] ◀────┘
      │
      └─▶ 把结果画到界面上
\`\`\`

**每次对话都包含两条消息：请求（Request）和响应（Response）。**

## 请求长什么样？

\`\`\`
POST /api/demo/messages HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "author": "张三",
  "body": "你好！"
}
\`\`\`

拆开看：

- **POST**：动作。"我要新建一条数据"
- **/api/demo/messages**：地址。指向后端的哪个功能
- **Content-Type**：告诉后端"请求体是 JSON 格式"
- **JSON 主体**：具体要传的数据

## 响应长什么样？

\`\`\`
HTTP/1.1 201 Created
Content-Type: application/json

{ "id": 42, "author": "张三", "body": "你好！", "createdAt": "..." }
\`\`\`

- **201**：状态码。表示"新建成功"（200 表示成功、404 表示找不到、500 表示服务器挂了）
- **JSON 主体**：后端返回的数据

## 什么是 API？

**API = Application Programming Interface（应用程序接口）**。

翻译成人话：后端**约定好**的一组"服务员会接受的点单"。比如本项目的后端 API：

| 方法 | 路径 | 作用 |
|---|---|---|
| GET | /api/courses | 列出所有课程 |
| GET | /api/chapters/:slug | 获取某章节详情 |
| POST | /api/demo/messages | 发一条留言 |
| GET | /api/demo/messages | 获取所有留言 |

前端只要**知道这些约定**，就能调用后端 —— 不需要知道后端内部代码怎么写的。这就是"接口"的意义。`,
          },
          {
            kind: "note",
            content: "💡 **亲眼看一次对话**：在浏览器按 F12 打开开发者工具 → Network 标签 → 刷新本页面。你会看到浏览器实际发出了哪些 HTTP 请求、收到什么响应。点开任何一条能看到完整的请求/响应细节。这是理解前后端配合最直观的方式。",
          },
        ],
        demoKey: "hello-api",
      },
      {
        slug: "full-picture",
        title: "以本项目为例：一次留言的完整旅程",
        summary: '从你点击"发送"到留言出现在别人屏幕上 —— 中间发生了什么',
        sections: [
          {
            kind: "text",
            content: `# 以本项目为例：一次留言的完整旅程

拿本项目里的"留言板 Demo"举例，看看一条留言从产生到显示，走过哪些代码。

## 步骤 1：你在浏览器里输入

前端组件：\`apps/web/src/components/demos/ListMessages.tsx\`

一个 React 组件，用 \`useState\` 保存输入框里的内容。你敲键盘，React 每次都用最新值重新渲染组件。

## 步骤 2：点击"发送"

组件里的 \`handleSubmit\` 被触发，调用 \`api.postMessage({ author, body })\`。

## 步骤 3：前端发起 HTTP 请求

\`apps/web/src/lib/api.ts\` 里的 fetch 封装：

\`\`\`ts
fetch("/api/demo/messages", {
  method: "POST",
  body: JSON.stringify({ author, body }),
})
\`\`\`

浏览器把这条请求从你的电脑通过网络发到服务器。

## 步骤 4：后端接收请求

\`apps/api/src/index.ts\` 里的 Hono app 收到请求，根据 URL 路由到对应处理函数：

\`\`\`ts
app.route("/api/demo", demoRoute);
\`\`\`

## 步骤 5：后端校验数据

\`apps/api/src/routes/demo-sandbox.ts\`：

\`\`\`ts
demoRoute.post("/messages", zValidator("json", createMessageInput), ...)
\`\`\`

如果前端传的数据不合规范（比如 author 是空字符串），后端会直接返回 400 错误，业务代码根本不会执行。这就是"服务器不信任客户端"的原则。

## 步骤 6：后端写入数据库

\`\`\`ts
await db.insert(demoEvents).values({ demoKey: "messages", payload: {...} })
\`\`\`

Drizzle ORM 把这段 TS 代码转成 SQL：
\`\`\`sql
INSERT INTO demo_events (demo_key, payload) VALUES ('messages', '{...}')
\`\`\`

PostgreSQL 接到 SQL 后把数据永久写到磁盘。

## 步骤 7：后端返回响应

后端拿到刚插入行的 ID 和 createdAt，打包成 JSON 返回：

\`\`\`json
{ "id": 42, "author": "张三", "body": "你好！", "createdAt": "..." }
\`\`\`

## 步骤 8：前端更新界面

前端拿到响应，调用 \`refresh()\` 重新拉取留言列表，React 检测到 \`messages\` state 变化，把新留言渲染到页面上。

## 关键领悟

- **每一步都是一段真实的代码**，你可以在项目里找到、修改它
- **前后端通过 HTTP + JSON 通信**，各自内部实现互不干涉
- **数据库是"永久记忆"**：服务器重启、浏览器关闭，数据都还在
- **后端是最后一道防线**：任何"必须保证"的规则（不能发空、字数限制、只有本人能删）都要在后端做校验

后面几门课程会逐个拆解：前端怎么写、后端怎么写、数据库怎么设计、工程化怎么搭。看完之后再回头看这一章，你会发现每一步都变得具体、可操作。`,
          },
        ],
        demoKey: "list-messages",
      },
    ],
  },
  {
    slug: "frontend-basics",
    title: "前端基础",
    description: "HTML、CSS、JavaScript 三件套 —— 网页是由什么构成的",
    chapters: [
      {
        slug: "what-is-web",
        title: "网页到底是什么",
        summary: "浏览器地址栏输入一串字符后，究竟发生了什么？",
        sections: [
          {
            kind: "text",
            content: `# 网页到底是什么

你打开 \`https://baidu.com\`，屏幕上出现了一个搜索框。中间发生了什么？

**简化的过程：**

1. 浏览器向 baidu.com 的服务器发起一个 **HTTP 请求**
2. 服务器返回一份 **HTML 文档**（就是纯文本）
3. 浏览器解析这段 HTML，画出你看到的界面
4. 期间可能还要下载 CSS（决定长什么样）、JavaScript（决定能干什么）、图片等

**关键领悟：**

- 网页的本质是**文本**。你在浏览器里"右键 → 查看源代码"，能看到全部内容。
- 浏览器是一个"翻译器"，把文本翻译成你看到的图形界面。
- 服务器只是一台**能通过网络发送文件的电脑**，本质和你自己的电脑没有区别。`,
          },
          {
            kind: "note",
            content: `💡 **动手做**：现在按下 \`F12\` 打开浏览器开发者工具，切换到 "Network" 标签页，然后刷新页面。你会看到浏览器请求了多少个文件 —— 这就是"网页"的真面目。`,
          },
        ],
      },
      {
        slug: "html-structure",
        title: "HTML：网页的骨架",
        summary: '标签、元素、属性 —— 用一门标记语言描述"页面上有什么"',
        sections: [
          {
            kind: "text",
            content: `# HTML：网页的骨架

HTML = HyperText Markup Language（超文本标记语言）。它不是"编程语言"，只是一套**用来描述内容结构**的标签规则。

## 一个最小的 HTML 页面

\`\`\`html
<!doctype html>
<html>
  <head>
    <title>我的第一个网页</title>
  </head>
  <body>
    <h1>你好，世界</h1>
    <p>这是一段文字。</p>
  </body>
</html>
\`\`\`

## 三个核心概念

- **标签（tag）**：\`<h1>\`、\`<p>\`、\`<img>\` 这样的东西，用来标示"这块内容是什么"
- **元素（element）**：开标签 + 内容 + 闭标签，如 \`<p>hello</p>\`
- **属性（attribute）**：写在开标签里的键值对，如 \`<a href="https://baidu.com">\`

## 一个原则

HTML 描述的是**语义**（这块是标题、这块是段落、这块是链接），而不是**样式**（这块要红色、要大字号）。样式的事归 CSS 管。`,
          },
        ],
      },
      {
        slug: "css-basics",
        title: "CSS：外表与布局",
        summary: '选择器 + 盒模型 + 布局 —— 让页面从"能读"到"好看"',
        sections: [
          {
            kind: "text",
            content: `# CSS：外表与布局

CSS = Cascading Style Sheets（层叠样式表）。它告诉浏览器：**满足某个条件的元素应该长什么样**。

## 三块拼图

\`\`\`css
h1 {              /* 选择器：所有 h1 元素 */
  color: red;     /* 属性: 值 */
  font-size: 32px;
}
\`\`\`

## 盒模型

任何一个 HTML 元素在页面上都占据一个矩形区域，这个区域由**四层**组成（由内到外）：

- **content** 内容本身
- **padding** 内边距（撑开背景色）
- **border** 边框
- **margin** 外边距（元素之间的空隙）

理解盒模型 = 理解为什么"我明明设了 width: 100px，实际却是 120px"。

## Tailwind CSS

Tailwind 让你**在 HTML 里直接写"预设好的 CSS 组合"**：

\`\`\`html
<h1 class="text-3xl font-bold text-blue-600">标题</h1>
\`\`\`

不用再新开一个 CSS 文件、再想一个类名。本项目前端页面全部用 Tailwind 写的，你可以打开任意一个组件文件查看。`,
          },
        ],
      },
      {
        slug: "js-basics",
        title: "JavaScript：让页面动起来",
        summary: "变量、函数、事件 —— 从静态文本到交互程序",
        sections: [
          {
            kind: "text",
            content: `# JavaScript：让页面动起来

HTML 描述"有什么"，CSS 描述"长什么样"，JavaScript 描述"能做什么"。

## 最小可运行代码

\`\`\`js
const name = "Alice";           // 定义变量
function greet(who) {           // 定义函数
  return \`你好，\${who}\`;
}
console.log(greet(name));       // 输出：你好，Alice
\`\`\`

## 让页面响应用户

\`\`\`js
document.querySelector("button").addEventListener("click", () => {
  alert("你点了我！");
});
\`\`\`

翻译成人话："在这个页面上找到那个 button，给它挂一个'点击'事件监听器，触发时弹个提示"。

## TypeScript

TypeScript = JavaScript + 类型标注。本项目全部代码都是 TS。

\`\`\`ts
function greet(who: string): string {
  return \`你好，\${who}\`;
}

greet(123);  // ← 编译器会报错：期望 string，收到 number
\`\`\`

**为什么值得学 TS？** 类型信息让编辑器能给你**自动补全**和**编译期报错**，把"运行时才炸"的问题提前到"写代码就发现"。规模一大就离不开它。`,
          },
          {
            kind: "note",
            content: "💡 试试本页下方的 Demo —— 那是一段真正在跑的 React 组件（本质是 JS + JSX）。",
          },
        ],
        demoKey: "hello-api",
      },
    ],
  },

  {
    slug: "react-tailwind",
    title: "React 与 Tailwind",
    description: "从操作 DOM 到组件化：现代前端的两个基石",
    chapters: [
      {
        slug: "component-thinking",
        title: "组件思维",
        summary: "把界面拆成可复用的积木",
        sections: [
          {
            kind: "text",
            content: `# 组件思维

传统写法：一整个 HTML 文件，几百行。改一处、找半天。

React 的做法：把界面拆成**组件**（Component），组件之间可以嵌套、可以复用。

\`\`\`tsx
function Button({ label }: { label: string }) {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded">
      {label}
    </button>
  );
}

function App() {
  return (
    <div>
      <Button label="确定" />
      <Button label="取消" />
    </div>
  );
}
\`\`\`

## 关键领悟

- **组件是函数**：接受参数（props），返回 JSX（长得像 HTML 的 JavaScript）
- **JSX 不是 HTML**：\`class\` 变成 \`className\`，\`{}\` 里可以塞任何 JS 表达式
- **组件可以嵌套**：\`<App>\` 里放 \`<Button>\`，就像 HTML 里 \`<div>\` 里放 \`<span>\``,
          },
        ],
      },
      {
        slug: "props-and-state",
        title: "Props 与 State",
        summary: "组件如何接收数据、如何管理自己的数据",
        sections: [
          {
            kind: "text",
            content: `# Props 与 State

React 里有两种数据：

## Props（属性）

从**外部传进来**的数据，组件不能修改它。就像函数参数。

\`\`\`tsx
function Greeting({ name }: { name: string }) {
  return <p>你好，{name}</p>;
}

<Greeting name="Alice" />
\`\`\`

## State（状态）

组件**内部自己管理**的数据。用 \`useState\` 声明：

\`\`\`tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      点击 {count} 次
    </button>
  );
}
\`\`\`

**规则：** 调用 \`setCount\` 后，React 会**重新执行这个组件函数**，用新的 count 值重新渲染界面。

这就是"响应式"——数据变了，界面自动跟着变。你再也不用手动 \`document.querySelector\`。`,
          },
        ],
        demoKey: "count-clicks",
      },
      {
        slug: "effects-and-fetch",
        title: "副作用与数据获取",
        summary: "useEffect 与调用后端 API",
        sections: [
          {
            kind: "text",
            content: `# 副作用与数据获取

组件渲染时不能直接 \`fetch\`（那会引起无限循环）。副作用要放在 \`useEffect\` 里。

\`\`\`tsx
import { useEffect, useState } from "react";

function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => setCourses(data));
  }, []);  // ← 空数组：只在组件第一次挂载时跑一次

  return (
    <ul>
      {courses.map((c) => <li key={c.id}>{c.title}</li>)}
    </ul>
  );
}
\`\`\`

## Tailwind 实用类

顺便认识几个最常见的 Tailwind 类名：

- \`p-4\` = padding: 1rem
- \`text-lg\` = font-size: 1.125rem
- \`flex gap-2\` = display: flex; gap: 0.5rem
- \`bg-slate-100\` = 浅灰背景
- \`hover:bg-slate-200\` = 鼠标悬停时的背景色
- \`dark:bg-slate-800\` = 深色模式下的背景色

以上都能在浏览器里"F12 → 检查元素"看到实际生成的 CSS。`,
          },
        ],
        demoKey: "list-messages",
      },
    ],
  },

  {
    slug: "engineering",
    title: "工程化",
    description: "为什么现代前端要用 Vite、Bun、monorepo、Turborepo",
    chapters: [
      {
        slug: "why-vite",
        title: "为什么需要 Vite",
        summary: '从"直接写 script 标签"到"打包工具"到"Vite"',
        sections: [
          {
            kind: "text",
            content: `# 为什么需要 Vite

## 三个时代

**远古：** 在 HTML 里手写 \`<script src="a.js">\`。文件多了顺序不对就炸，无法用最新语法（旧浏览器不支持）。

**打包工具时代（webpack）：** 写代码时可以用最新语法、可以 \`import\`，一个工具把它们打包成浏览器能跑的一个大文件。缺点：项目一大，dev 启动要等 30 秒。

**现代（Vite）：** 利用现代浏览器**原生支持 ES modules**，开发时不打包，只在浏览器请求某个文件时按需转换。启动**秒开**。

## 本项目里的 Vite

\`apps/web/vite.config.ts\` 就是 Vite 的入口配置。装了 React 插件、Tailwind 插件，然后 \`bun run dev\` 就能打开开发服务器。

## Bun

Bun 是一个 JavaScript 运行时（能替代 Node）+ 包管理器（能替代 npm/yarn/pnpm）+ 打包工具。

在这个项目里我们主要用它的两个能力：
1. **装依赖快**：\`bun install\` 比 \`npm install\` 快好几倍
2. **直接跑 TS**：\`bun run src/index.ts\` 不用先编译成 JS`,
          },
        ],
      },
      {
        slug: "monorepo",
        title: "Monorepo 与 workspaces",
        summary: "一个仓库放多个包 —— 为什么这样组织",
        sections: [
          {
            kind: "text",
            content: `# Monorepo 与 workspaces

## 场景

你的产品有：
- 一个 Web 前端
- 一个 API 后端
- 一份两边都用的类型定义

**做法 A（多个仓库）**：三个 git repo。每次改类型要发布 npm 包、另两边升级、可能不兼容...
**做法 B（monorepo）**：一个 repo，三个"子包"，一次修改立即生效。

## workspaces

\`\`\`json
// 根 package.json
{
  "workspaces": ["apps/*", "packages/*"]
}
\`\`\`

Bun 看到这行，会把 \`apps/web\`、\`apps/api\`、\`packages/shared\` 都当"子包"，允许它们互相 import。

\`\`\`json
// apps/api/package.json
{
  "dependencies": {
    "@app/shared": "workspace:*"  // ← 引用同一 repo 里的另一个包
  }
}
\`\`\`

看看本项目根目录的 \`package.json\`，就是这么配的。`,
          },
        ],
      },
      {
        slug: "turborepo",
        title: "Turborepo：任务编排",
        summary: 'workspaces 只管代码组织，Turborepo 管"如何跑多个包"',
        sections: [
          {
            kind: "text",
            content: `# Turborepo：任务编排

workspaces 让你能把多个包放一起，但**如何启动它们**还是要你自己搞：

- 单纯用 workspaces：开一个终端跑前端，再开一个终端跑后端
- 用 Turborepo：\`turbo dev\` 一条命令并行启动所有服务

**更重要的是缓存：**

- 你修改了 apps/web 的代码 → \`turbo build\` 只重建 web
- packages/shared 没变 → 直接用上次的构建产物，秒过

企业级项目几十个包时，这个能力节省的时间惊人。

## 本项目的 turbo.json

看看根目录 \`turbo.json\`：

- \`dev\`：\`persistent: true\` 表示这是"一直跑着的服务"，不会算它完成
- \`build\`：\`dependsOn: ["^build"]\` 表示当前包 build 前，先把依赖的包 build 掉
- \`typecheck\`：可以并行、结果可以缓存

命令入口在根 \`package.json\` 里：\`bun run dev\` → \`turbo dev\`。`,
          },
        ],
      },
    ],
  },

  {
    slug: "backend",
    title: "后端入门",
    description: "HTTP、Hono、Node.js —— 服务器代码是怎么处理请求的",
    chapters: [
      {
        slug: "http-basics",
        title: "什么是 HTTP",
        summary: "客户端 → 请求 → 服务器 → 响应 —— 就这四个词",
        sections: [
          {
            kind: "text",
            content: `# 什么是 HTTP

## 一句话

HTTP 是"客户端向服务器要东西"的一套约定俗成的对话格式。

## 请求（Request）

由客户端发出，包含：
- **方法**：GET（获取）、POST（新建）、PUT（更新）、DELETE（删除）
- **URL**：\`http://api.example.com/courses/1\`
- **Headers**：如 \`Content-Type: application/json\`
- **Body**（可选）：POST/PUT 时携带的数据，通常是 JSON

## 响应（Response）

由服务器返回，包含：
- **状态码**：200（成功）、404（找不到）、500（服务器出错）...
- **Headers**
- **Body**：数据

## 亲手试试

打开你的浏览器，访问 \`http://localhost:3000/api/health\` —— 你会看到后端返回的 JSON。这就是最基本的 HTTP 请求响应。

在浏览器 F12 → Network 里，你能看到本项目**每一次**前端调用后端 API 的完整请求响应。这是理解前后端配合的最好方式。`,
          },
        ],
      },
      {
        slug: "hono-routing",
        title: "Hono：现代 Node 后端框架",
        summary: '定义"哪个 URL 由哪段代码处理"',
        sections: [
          {
            kind: "text",
            content: `# Hono：现代 Node 后端框架

Hono 是一个**极简、跨运行时**的 Web 框架。相比传统的 Express，它：
- 更快
- API 更小、更现代
- 类型推导更强

## 一个最小 Hono 应用

\`\`\`ts
import { Hono } from "hono";

const app = new Hono();

app.get("/hello", (c) => {
  return c.json({ message: "hi" });
});

// 启动 server 见 apps/api/src/index.ts
\`\`\`

## 路由

\`\`\`ts
app.get("/courses", handler)              // GET /courses
app.get("/courses/:slug", handler)        // 带参数
app.post("/messages", handler)            // POST 请求
\`\`\`

## 参数

\`\`\`ts
app.get("/courses/:slug", (c) => {
  const slug = c.req.param("slug");       // 路径参数
  const page = c.req.query("page");       // ?page=1
  return c.json({ slug, page });
});
\`\`\`

## POST body

\`\`\`ts
app.post("/messages", async (c) => {
  const body = await c.req.json();
  return c.json({ received: body });
});
\`\`\`

打开 \`apps/api/src/routes/\`，看看本项目真实的路由代码是怎么写的。`,
          },
        ],
      },
    ],
  },

  {
    slug: "database",
    title: "数据库设计",
    description: "为什么需要数据库、如何设计表、SQL 基础",
    chapters: [
      {
        slug: "why-db",
        title: "为什么要用数据库",
        summary: "不能直接把数据存文件吗？",
        sections: [
          {
            kind: "text",
            content: `# 为什么要用数据库

## 用文件存有什么问题？

假设你做留言板，把每条留言存成一个 JSON 文件。你会遇到：

1. **并发写入冲突**：两个用户同时发言，A 刚读文件、B 也读了文件，两人都往里加一条、都写回去 —— 结果丢了一条
2. **查询慢**：想查"某个用户发的所有留言"，你得读**所有**文件才能找到
3. **一致性难**：留言删了，但引用它的通知记录没删，数据烂在那儿
4. **规模崩溃**：一亿条数据 = 一亿个文件

## 数据库解决了什么

- **事务**：保证一组操作要么全成功、要么全失败（ACID）
- **索引**：查询从"扫全部"变成"直接跳到目标"
- **约束**：外键、非空、唯一 —— 从**结构上**避免烂数据
- **并发控制**：多个客户端同时读写不会互相搞坏

## 关系型 vs 非关系型

- **关系型**（PostgreSQL、MySQL）：用**表**组织数据，强类型、强约束
- **非关系型**（MongoDB、Redis）：更灵活但约束弱

本项目用 PostgreSQL —— 最经典、功能最强的开源关系数据库。`,
          },
        ],
      },
      {
        slug: "table-design",
        title: "表设计与关系",
        summary: "如何把现实世界的东西拆成表",
        sections: [
          {
            kind: "text",
            content: `# 表设计与关系

以本项目为例，教程内容如何设计？

## 天真做法

一张大表 \`tutorials\`，每行放一个"章节"，字段包括：所属课程名、章节名、内容、课程描述...

**问题：** 同一门课程的描述被抄写在每个章节行里。修改一次要改十几行。数据冗余。

## 拆表 + 关系

- **courses** 表：每门课程一行
- **chapters** 表：每个章节一行，含 \`course_id\` 字段引用 courses

一对多关系：一门课程有多个章节。

再进一步，章节里的内容也拆出：

- **sections** 表：每段内容一行，含 \`chapter_id\` 字段

看看本项目的 \`apps/api/src/db/schema.ts\` —— 这就是活样例。

## 主键与外键

- **主键**：每张表都要有一个"能唯一标识一行"的字段，本项目用自增整数 \`id\`
- **外键**：一张表里引用另一张表主键的字段，如 chapters.course_id → courses.id

外键让数据库能**帮你保证**："不能创建一个 course_id 不存在的章节"、"删除课程时自动删掉它的章节（cascade）"。

## 索引

想快速查"某门课程的所有章节"？给 \`chapters.course_id\` 加索引。数据库会维护一个额外的排序结构，让这类查询从 O(n) 变 O(log n)。

代价：写入时要多维护一份索引，占额外空间。**索引不是免费的**，只加在真的需要的列上。`,
          },
        ],
      },
      {
        slug: "sql-basics",
        title: "SQL 增删改查",
        summary: "SELECT / INSERT / UPDATE / DELETE",
        sections: [
          {
            kind: "code",
            content: `-- 查询：拿出所有课程，按 order 升序
SELECT id, slug, title FROM courses ORDER BY "order" ASC;

-- 查询：某门课的所有章节
SELECT * FROM chapters WHERE course_id = 1 ORDER BY "order";

-- 关联查询：把 course 和它的 chapters 一起查出来
SELECT c.title AS course, ch.title AS chapter
FROM courses c
JOIN chapters ch ON ch.course_id = c.id
WHERE c.slug = 'frontend-basics';

-- 插入
INSERT INTO courses (slug, title, description, "order")
VALUES ('extra', '进阶主题', '选修内容', 99);

-- 更新
UPDATE courses SET title = '新标题' WHERE slug = 'extra';

-- 删除
DELETE FROM courses WHERE slug = 'extra';`,
          },
          {
            kind: "text",
            content: `## 亲手跑这些 SQL

启动 pg 之后，进入 psql（PostgreSQL 官方命令行）：

\`\`\`bash
docker exec -it web-tutor-postgres psql -U dev -d webtutor
\`\`\`

然后逐条粘贴上面的 SQL 试试。

**为什么先学 SQL 再用 ORM？** 因为 ORM 只是 SQL 的封装。会写 SQL 的人用 ORM 是如虎添翼；不会 SQL 的人用 ORM 是知其然不知其所以然，一遇到性能问题就抓瞎。`,
          },
        ],
      },
    ],
  },

  {
    slug: "orm-drizzle",
    title: "Drizzle ORM 实战",
    description: '从"手写 SQL"到"类型安全的查询构造器"',
    chapters: [
      {
        slug: "why-orm",
        title: "为什么用 ORM",
        summary: "字符串拼 SQL 的痛点 vs ORM 的好处",
        sections: [
          {
            kind: "text",
            content: `# 为什么用 ORM

## 手写 SQL 的痛

\`\`\`ts
const result = await client.query(
  \`SELECT * FROM chapters WHERE course_id = \${courseId}\`
);
// 问题 1：SQL 注入（如果 courseId 是用户输入）
// 问题 2：result 是 any 类型，编辑器不知道有哪些字段
// 问题 3：改表结构（比如把 course_id 改名 courseId）编辑器不报错
\`\`\`

## Drizzle 的做法

\`\`\`ts
const result = await db.select().from(chapters)
  .where(eq(chapters.courseId, courseId));

// result 类型自动推导为 ChapterRow[]
// 编辑器补全每个字段
// 表结构改了，用到旧字段的地方立刻报错
\`\`\`

**Drizzle 特点：**
- **零抽象**：写的代码和最终 SQL 几乎一一对应，你**知道**每一步跑了什么
- **完全类型安全**：schema 变化 → 编辑器立刻标红所有受影响的代码
- **不假装万能**：需要复杂查询？直接用 \`sql\` 模板写原生 SQL，仍然类型安全

## 本项目里怎么用

看 \`apps/api/src/routes/courses.ts\` —— 那就是真实的 Drizzle 查询代码。`,
          },
        ],
      },
      {
        slug: "drizzle-migration",
        title: "Migration：如何演进表结构",
        summary: "改 schema.ts → 生成 SQL → 执行 —— 这个流程为什么重要",
        sections: [
          {
            kind: "text",
            content: `# Migration：如何演进表结构

## 场景

你想给 \`chapters\` 加一个字段 \`estimated_minutes\`（预计学习时长）。

## 手工做法（错误）

\`\`\`sql
ALTER TABLE chapters ADD COLUMN estimated_minutes INTEGER;
\`\`\`

在你本机执行了。**但**：
- 团队其他人不知道
- 生产环境部署时没人执行
- 上线炸掉

## Migration 做法（正确）

1. 修改 \`schema.ts\`，加上新字段
2. 运行 \`bun run db:generate\` → drizzle-kit 对比 schema 和上次的状态，生成一个 SQL 文件（\`drizzle/0001_add_estimated_minutes.sql\`）
3. 提交到 git，其他人拉代码后 \`bun run db:migrate\` 就同步了
4. 生产环境部署脚本里也跑一遍 migrate

## 关键规则

- **迁移文件一旦提交，绝不修改**。如果错了，加一个新的 migration 修正它
- **迁移是单向前进的**。回滚通过"写一个反向 migration"来实现，而不是删除文件

本项目的 migration 文件在 \`apps/api/drizzle/\` 目录下。`,
          },
          {
            kind: "note",
            content: "💡 想直观看数据库内容？跑 `bun run db:studio`，会打开 Drizzle Studio 网页界面。",
          },
        ],
      },
    ],
  },
];

// --------------------------------------------------------------
// 执行
// --------------------------------------------------------------

async function main() {
  console.log("🌱 开始灌入教程内容...");

  // 清空旧数据（cascade 会级联删掉 chapters 和 sections）
  await db.delete(courses);
  console.log("  已清空旧数据");

  for (const [courseIdx, course] of SEED.entries()) {
    const [insertedCourse] = await db
      .insert(courses)
      .values({
        slug: course.slug,
        title: course.title,
        description: course.description,
        order: courseIdx,
      })
      .returning();

    if (!insertedCourse) throw new Error(`Failed to insert course ${course.slug}`);
    console.log(`  ✓ 课程：${course.title}`);

    for (const [chapterIdx, chapter] of course.chapters.entries()) {
      const [insertedChapter] = await db
        .insert(chapters)
        .values({
          courseId: insertedCourse.id,
          slug: `${course.slug}--${chapter.slug}`,
          title: chapter.title,
          summary: chapter.summary,
          order: chapterIdx,
          demoKey: chapter.demoKey ?? null,
        })
        .returning();

      if (!insertedChapter) throw new Error(`Failed to insert chapter ${chapter.slug}`);

      if (chapter.sections.length > 0) {
        await db.insert(sections).values(
          chapter.sections.map((s, i) => ({
            chapterId: insertedChapter.id,
            order: i,
            kind: s.kind,
            content: s.content,
          })),
        );
      }
    }
  }

  console.log("✅ Seed 完成");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed 失败：", err);
  process.exit(1);
});
