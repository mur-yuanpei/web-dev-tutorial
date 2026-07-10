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
    slug: "quickstart",
    title: "先跑起来再说",
    description: "花 10 分钟把整个项目跑起来 —— 不解释任何原理，就是让它动起来",
    chapters: [
      {
        slug: "why-run-first",
        title: "为什么先不学、先跑",
        summary: '带着"我用过它"的手感读教程，比抽象学习快 10 倍',
        sections: [
          {
            kind: "text",
            content: `# 为什么先不学、先跑

> **本章**：先讲清楚这门课的思路 —— 为什么建议先跑起来再学。  
> **为什么**：很多人被"学不动"卡住，其实是"看不见"造成的。有手感之后学抽象概念快 10 倍。


## 常见的学习方式（低效）

大部分人学新东西是这样的：

1. 先读一本书或教程从头到尾
2. 每个概念都想理解
3. 学到一半忘了前面
4. 最后想动手做，发现"看是看懂了，但不知道从哪下手"

## 我建议的学习方式（高效）

1. **先把项目跑起来**（5 条命令，10 分钟）
2. 在浏览器里点点看看
3. 然后**再**回来读教程

区别在于：**当你后面读到"Hono 是什么"、"Drizzle 是什么"时**，你脑子里有一个"哦这个我跑过、我见过它的界面"的锚点。读起来快 10 倍。

## 这一门课要做什么

一件事：**用 5 条命令跑起来**。

- **不解释**每一条命令具体做了什么
- **不深究**原理
- 就是让你**看到界面**

有了界面在手，读后面 8 门课程时你会有完全不同的感觉。

## 需要准备什么

- 一台电脑（Mac / Windows / Linux 都行）
- 装好 [Bun](https://bun.sh)（一个命令：\`curl -fsSL https://bun.sh/install | bash\`）
- 装好 [Docker Desktop](https://www.docker.com/products/docker-desktop/)（图形化下载安装即可）
- 一个终端（Mac 自带 Terminal / Windows 用 PowerShell / Linux 用你熟悉的）

准备好这三样，进入下一章。`,
          },
          {
            kind: "note",
            content:
              "💡 如果你完全没听过 Bun 和 Docker，**不用现在弄懂**。装好就好。后面工程化课程会讲清楚它们是什么。",
          },
        ],
      },
      {
        slug: "five-commands",
        title: "5 条命令，10 分钟",
        summary: "复制粘贴、一个个跑，看到教程首页你就成功了",
        sections: [
          {
            kind: "text",
            content: `# 5 条命令，10 分钟

> **回顾**：上一章讲了"先做再学"的学习哲学。  
> **本章**：五条命令把整个项目在你电脑上跑起来。  
> **为什么**：看到界面才有后面所有学习的锚点。


## 前置检查

打开终端，跑这两条确认工具在：

\`\`\`bash
bun --version    # 应该输出版本号，如 1.3.11
docker --version # 应该输出版本号
\`\`\`

有 Docker 但没启动？打开 Docker Desktop 应用等它变成"绿色 running"。

## 拉代码

\`\`\`bash
git clone https://github.com/mur-yuanpei/web-dev-tutorial.git
cd web-dev-tutorial
\`\`\`

## 5 条命令

依次跑，**每条等前一条跑完再跑下一条**：

### 命令 1：装依赖

\`\`\`bash
bun install
\`\`\`

预计 3-10 秒。看到最后一行有 \`packages installed\` 就成。

### 命令 2：启动数据库

\`\`\`bash
bun run db:up
\`\`\`

预计 5 秒。看到 \`Container web-tutor-postgres Started\` 就成。

### 命令 3：创建数据库表

\`\`\`bash
bun run db:migrate
\`\`\`

预计 2 秒。看到 \`✅ Migration 完成\` 就成。

### 命令 4：灌入教程内容

\`\`\`bash
bun run db:seed
\`\`\`

预计 2 秒。看到 \`✅ Seed 完成\` 就成。

### 命令 5：启动前后端

\`\`\`bash
bun run dev
\`\`\`

**这条命令不会返回**（它一直在跑）。看到类似这样的输出说明成了：

\`\`\`
@app/api:dev: 🚀 API 已启动：http://localhost:3000
@app/web:dev:   ➜  Local:   http://localhost:5173/
\`\`\`

## 打开浏览器

访问 **http://localhost:5173**

看到教程首页 = 🎉 **你成功了**。

现在浏览器里的这个页面，就是接下来所有课程要讲的东西。

## 玩一下

先别急着看后面。玩 5 分钟：

- 侧栏点几门课程进去看
- 找一个有 🧪 标记的章节（比如"HTTP 与 API"），底部有可交互 Demo
- 按 F12 打开开发者工具、点 Network 面板刷新
- **切换深色/浅色主题**（右上角按钮）

## 有问题？看这里

**Q：\`bun install\` 报错？**
A：多半是网络。可以设 npm 镜像：\`bun config set install.registry https://registry.npmmirror.com\`

**Q：\`bun run db:up\` 报"docker: command not found"？**
A：Docker Desktop 没启动。打开应用等它 ready。

**Q：\`bun run db:up\` 报"port 5432 is already allocated"？**
A：本机有别的 pg 占了 5432 端口。停掉它 (\`docker ps\` 找到 → \`docker stop <name>\`)，或改本项目端口。

**Q：\`bun run dev\` 起了但 5173 空白？**
A：等一两秒 Vite 编译；再刷新。还是空白就看终端 API 是不是也起来了。

**Q：什么都对但看不到内容？**
A：可能 seed 没跑。回去跑 \`bun run db:seed\`。

## 停下来

跑通了，就停一下。**不用继续，也不用理解**。回到教程首页，从课程 1（认识 Web 开发）开始正常学。你现在有"跑过它"的手感了 —— 后面读教程会舒服很多。`,
          },
          {
            kind: "note",
            content:
              '🎯 **本课的唯一目标**：看到首页 + 感觉"我能让它动"。别的都不重要。跑不通就翻到 FAQ 或问同学 / 老师。',
          },
        ],
      },
    ],
  },
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

> **回顾**：上一门课让你把项目跑起来了。  
> **本章**：用一顿饭的比喻讲清楚"前端"和"后端"到底各是什么。  
> **为什么**：所有 Web 项目都是这个基本分工，理解它其他技术学起来就有方向。


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
            content:
              "💡 **一个反直觉的事实**：前端和后端**不一定要用同一门编程语言**。本项目前端用 TypeScript（浏览器执行），后端也用 TypeScript（Node.js 执行）—— 但你完全可以后端用 Python、Java、Go。前后端只通过 HTTP + JSON 通信，各自内部用什么语言互不干涉。",
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

> **回顾**：上一章讲清楚了前后端的角色分工。  
> **本章**：介绍它们对话用的协议：HTTP 请求 / 响应 / API。  
> **为什么**：写代码之前必须先理解通信协议 —— 后面几乎所有 bug 都跟这层有关。


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
            content:
              "💡 **亲眼看一次对话**：在浏览器按 F12 打开开发者工具 → Network 标签 → 刷新本页面。你会看到浏览器实际发出了哪些 HTTP 请求、收到什么响应。点开任何一条能看到完整的请求/响应细节。这是理解前后端配合最直观的方式。",
          },
        ],
        demoKey: "hello-api",
      },
      {
        slug: "devtools-inspection",
        title: "动手：用 F12 观察真实的 HTTP 请求",
        summary: "5 分钟实操 —— 打开浏览器开发者工具，亲眼看每一次请求",
        sections: [
          {
            kind: "text",
            content: `# 动手：用 F12 观察真实的 HTTP 请求

> **回顾**：上一章讲了 HTTP 通信理论。  
> **本章**：打开 F12 亲手看真实的请求 —— 5 分钟实操。  
> **为什么**：看得见的东西才能理解 —— 这个工具是后续所有前端调试的入口。


前面讲了 HTTP 是什么，这一章你**亲眼看一次**。5 分钟能完成。

## 第 1 步：打开开发者工具

在浏览器（推荐 Chrome / Edge / Firefox）里按 **F12**（或右键 → 检查）。会弹出一个面板。

顶部有一排标签：**Elements / Console / Sources / Network / ...** —— 点 **Network**。

## 第 2 步：勾选保留日志

在 Network 面板顶部找一个复选框 **Preserve log**（保留日志）—— 勾上。这样刷新页面后请求记录不会丢。

## 第 3 步：刷新本页面

按 **Cmd/Ctrl + R** 刷新。Network 面板会瞬间出现一大堆行 —— 每一行都是一次 HTTP 请求。

你会看到几类：

- \`Doc\` 类型：\`/chapters/intro--devtools-inspection\` —— 这个 HTML 页面本身
- \`Fetch/XHR\` 类型：\`courses/tree\`、\`chapters/xxx\` —— 前端从后端拉数据
- \`JS\` 类型：\`.js\` 文件 —— React 代码
- \`CSS\` 类型：\`.css\` 文件 —— 样式
- \`Img\` 类型：图片（本项目没什么图）

## 第 4 步：点开任意一条

点 Network 里的 \`chapters/intro--devtools-inspection\` 那一条，右边会打开细节面板。上面有几个 tab：

- **Headers** —— 请求头 + 响应头（包括状态码 200/404/500）
- **Payload** / **Request** —— 请求的 body（POST/PUT 时有）
- **Response** —— 服务器返回的原始内容
- **Preview** —— 格式化后的内容（JSON 会树状展开）
- **Timing** —— 每个阶段耗时

## 第 5 步：观察一次 API 调用

刚才刷新时，浏览器一定拉过一次 \`/api/courses/tree\`（左侧栏目录数据）。找到它、点开：

- **Headers** 里能看到 \`GET /api/courses/tree HTTP/1.1\`
- **Preview** 里能看到返回的 JSON 数组，每个课程一项
- **Timing** 里能看到耗时（几十毫秒到几百毫秒之间）

这就是**前端-后端-数据库**链条的证据。

## 挑战题

**动手试试**这些操作、然后回答：

1. 点上面导航到"本项目全景"课程，Network 里新增了几条请求？分别是什么类型？
2. 找一条状态码不是 200 的请求（如果有）。它是什么？
3. 用底部 Demo 里的"发一条留言"（如果本章挂了 Demo）观察 POST 请求的 body 长什么样

## 为什么这一步重要

看得见的东西才能理解。以后**任何**前端问题的排查，都是从 F12 开始的：

- 页面没渲染？看 Console 有没有报错
- 数据不显示？看 Network 里 API 请求是不是失败了
- 慢？看 Timing 里哪一步耗时最长

装备好这个工具，你已经比大多数初学者领先一步。`,
          },
          {
            kind: "note",
            content:
              "💡 **额外挑战**：现在打开任意一个你常用的网站（微博、B 站、知乎），F12 → Network 刷新，观察它一个页面加载了多少个请求。你会震惊 —— 通常几十到几百个。这就是现代网页的样子。",
          },
        ],
      },
      {
        slug: "full-picture",
        title: "以本项目为例：一次留言的完整旅程",
        summary: '从你点击"发送"到留言出现在别人屏幕上 —— 中间发生了什么',
        sections: [
          {
            kind: "text",
            content: `# 以本项目为例：一次留言的完整旅程

> **回顾**：前面几章从理论到实操讲了通信。  
> **本章**：用本项目的留言板 Demo，从点击到入库到刷新，把完整链路走一遍。  
> **为什么**：有了这张全景图，后面学具体技术时你能知道它在整体里的位置。


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

> **回顾**：上一门课建立了"前端 / 后端 / 数据库"的整体认知。  
> **本章**：钻进"前端"这一侧 —— 网页到底是什么。  
> **为什么**：浏览器地址栏输入 URL 后发生的事，是所有前端知识的起点。


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
        slug: "three-in-one",
        title: "HTML + CSS + JS：三件套速览",
        summary: "描述结构、外观、行为的三种语言，一次讲完",
        sections: [
          {
            kind: "text",
            content: `# HTML + CSS + JS：三件套速览

> **回顾**：上一章讲了浏览器如何呈现一个网页。  
> **本章**：HTML / CSS / JavaScript 三件套一次讲完 —— 结构、外观、行为。  
> **为什么**：现代前端框架（React / Vue）都是在这三件套之上，理解基础才能理解框架。


一个网页由**三种语言**协作构成，各司其职：

| 语言 | 管什么 | 一句话 |
|---|---|---|
| **HTML** | 结构 | 这块是标题、这块是段落、这块是按钮 |
| **CSS** | 外观 | 这块要红色、字大一点、居中排 |
| **JavaScript** | 行为 | 点这个按钮弹个提示、发个请求 |

这一章一次讲完基础。你在高中或大学基础课很可能学过，权当复习。

## HTML：结构

HTML = HyperText Markup Language（超文本标记语言）。**不是编程语言**，是描述"页面上有什么"的一套标签规则。

\`\`\`html
<!doctype html>
<html>
  <head>
    <title>我的第一个网页</title>
  </head>
  <body>
    <h1>你好，世界</h1>
    <p>这是一段文字。</p>
    <a href="https://baidu.com">跳转到百度</a>
  </body>
</html>
\`\`\`

三个核心概念：

- **标签**（\`<h1>\` / \`<p>\` / \`<a>\`）—— 标示"这块内容是什么类型"
- **元素**（开标签 + 内容 + 闭标签，如 \`<p>hello</p>\`）
- **属性**（写在开标签里，如 \`<a href="...">\`）

**关键原则**：HTML 描述**语义**（这是标题、那是链接），**不管**样式。样式归 CSS。

## CSS：外观

CSS = Cascading Style Sheets（层叠样式表）。它告诉浏览器：**满足某条件的元素应该长什么样**。

\`\`\`css
h1 {              /* 选择器：所有 h1 元素 */
  color: red;     /* 属性: 值 */
  font-size: 32px;
}
\`\`\`

**盒模型**（重要）：任何一个 HTML 元素在页面上都占据一个矩形，由四层组成（内到外）：

- **content** 内容本身
- **padding** 内边距
- **border** 边框
- **margin** 外边距

理解盒模型 = 知道"为什么我明明设了 width: 100px，实际却是 120px"。

**Tailwind CSS**：现代做法是**在 HTML 里直接写"预设好的 CSS 组合"**：

\`\`\`html
<h1 class="text-3xl font-bold text-blue-600">标题</h1>
\`\`\`

不用另开 CSS 文件、不用起类名。**本项目前端全部用 Tailwind**（后面 React 与 Tailwind 那门课细讲）。

## JavaScript：行为

HTML 描述"有什么"、CSS 描述"长什么样"、JavaScript 描述"能做什么"。

\`\`\`js
const name = "Alice";           // 定义变量
function greet(who) {           // 定义函数
  return \`你好，\${who}\`;
}
console.log(greet(name));       // 输出：你好，Alice
\`\`\`

**让页面响应用户**：

\`\`\`js
document.querySelector("button").addEventListener("click", () => {
  alert("你点了我！");
});
\`\`\`

翻译成人话："在页面上找那个 button，给它挂一个点击监听器，触发时弹个提示。"

**TypeScript**（TS）：JavaScript + 类型标注。本项目全部代码都是 TS。

\`\`\`ts
function greet(who: string): string {
  return \`你好，\${who}\`;
}

greet(123);  // ← 编译器会报错：期望 string，收到 number
\`\`\`

**为什么值得学 TS**？类型让编辑器给你**自动补全**和**编译期报错**，把"运行时才炸"提前到"写代码就发现"。规模一大就离不开。

## 三合一：一个完整例子

\`\`\`html
<!doctype html>
<html>
  <head>
    <style>
      button { padding: 8px 16px; background: #3b82f6; color: white; }
    </style>
  </head>
  <body>
    <button id="greet">打招呼</button>
    <script>
      document.getElementById("greet").addEventListener("click", () => {
        alert("你好！");
      });
    </script>
  </body>
</html>
\`\`\`

上面 10 行代码涵盖三件套：HTML 定义按钮、CSS 让它变蓝、JS 让它响应点击。

## 从这里到 React

现代前端不再直接写 HTML/CSS/JS。而是用 **React**（组件化的 JS）+ **Tailwind**（预设 CSS 类）—— **但底子还是 HTML/CSS/JS**。理解这一章，读后面的 React 章节会顺很多。`,
          },
          {
            kind: "note",
            content:
              "💡 试试本页下方的 Demo —— 那是一段真正在跑的 React 组件（本质是 JS + JSX + Tailwind class）。",
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

> **回顾**：上一门课回顾了 HTML/CSS/JS 三件套。  
> **本章**：介绍 React 的核心思想：组件化。  
> **为什么**：现代前端不再手写 HTML，而是"用组件搭积木" —— 这一章讲清楚这个转变。


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

> **回顾**：上一章讲了什么是组件。  
> **本章**：组件之间怎么传数据（props）、组件自己怎么记住数据（state）。  
> **为什么**：这两个概念是 React 的 90%。掌握它们你就能写出真正能用的组件。


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

> **回顾**：上一章讲了组件的两种数据来源：props 和 state。  
> **本章**：介绍副作用（useEffect） —— 组件如何跟"外部世界"交互（比如调 API）。  
> **为什么**：真实业务组件几乎都要拿后端数据，useEffect 是必学。同时讲 Tailwind v4 的用法。


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

## Tailwind CSS（本项目用的是 v4）

顺便认识几个最常见的 Tailwind 类名：

- \`p-4\` = padding: 1rem
- \`text-lg\` = font-size: 1.125rem
- \`flex gap-2\` = display: flex; gap: 0.5rem
- \`bg-slate-100\` = 浅灰背景
- \`hover:bg-slate-200\` = 鼠标悬停时的背景色
- \`dark:bg-slate-800\` = 深色模式下的背景色

以上都能在浏览器里"F12 → 检查元素"看到实际生成的 CSS。

## Tailwind v4 有什么变化

本项目已经升级到 Tailwind v4（2024 年底稳定版）。跟 v3 相比：

- **入口**：以前是 \`@tailwind base; @tailwind components; @tailwind utilities;\` 三行，现在只需 \`@import "tailwindcss";\` 一行
- **配置**：以前有 \`tailwind.config.ts\`（JavaScript 里配色板、字号），现在配置**直接写在 CSS 里**（用 \`@theme\` 块）
- **构建**：v4 用 Rust 引擎，编译速度快 10 倍以上
- **深色模式**：v4 默认按系统色查询触发；我们希望用户能主动切换，所以在 \`styles.css\` 里加了一行 \`@custom-variant dark (&:where(.dark, .dark *));\` —— 给 \`<html>\` 加 \`.dark\` 类就切到深色

打开 \`apps/web/src/styles.css\` 就能看到上面提的所有配置。整个文件只有 30 行左右，可读性远好于 v3。`,
          },
        ],
        demoKey: "list-messages",
      },
      {
        slug: "read-real-component",
        title: "读懂本项目的一个 React 组件",
        summary: "打开 HelloAPI.tsx，逐行拆解 props / state / event / fetch",
        sections: [
          {
            kind: "text",
            content: `# 读懂本项目的一个 React 组件

> **回顾**：上一章讲了 useEffect + fetch 的理论用法。  
> **本章**：打开本项目的 HelloAPI.tsx，逐行拆解一个真实组件。  
> **为什么**：读源码是学 React 最快的方式 —— 你会发现理论跟实战完全对得上。


前面讲了组件思维、Props/State、useEffect。这一章你**打开一个真实的组件源码**，把这些概念一次串起来。

## 我们要读的这个

打开 \`apps/web/src/components/demos/HelloAPI.tsx\`。这就是你在"HTTP 与 API"那一章底部点击"调用后端"看到的那个 Demo。整个组件不到 40 行：

\`\`\`tsx
import { useState } from "react";
import { api } from "../../lib/api.js";

export function HelloAPI() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await api.hello();
      setMessage(\`\${res.message}（服务器时间：\${res.time}）\`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border ... p-4 space-y-3">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        点下面这个按钮，前端会向后端 <code>/api/demo/hello</code> 发一次 GET 请求。
      </p>
      <button type="button" onClick={handleClick} disabled={loading}
        className="px-4 py-2 rounded-md bg-blue-600 text-white ...">
        {loading ? "请求中..." : "调用后端"}
      </button>
      {message && (
        <p className="text-sm p-3 rounded ...">
          {message}
        </p>
      )}
    </div>
  );
}
\`\`\`

## 逐块拆解

### 1. \`useState\` × 2

\`\`\`tsx
const [message, setMessage] = useState<string | null>(null);
const [loading, setLoading] = useState(false);
\`\`\`

组件有**两个 state**：

- \`message\`：从后端拿到的消息（初始是 null，还没请求过）
- \`loading\`：请求进行中吗？（初始 false，控制按钮是否显示 loading 文字）

**为什么用两个 state 而不是一个对象**？因为它们独立变化。合并成一个反而更烦。React 里"每一个独立变化的值 = 一个 state"是好做法。

### 2. 事件处理函数

\`\`\`tsx
async function handleClick() {
  setLoading(true);
  try {
    const res = await api.hello();
    setMessage(\`\${res.message}（服务器时间：\${res.time}）\`);
  } finally {
    setLoading(false);
  }
}
\`\`\`

点击按钮后跑这个函数：

1. **进入 loading 态**（\`setLoading(true)\`）
2. **调后端 API**（\`api.hello()\` 是 \`apps/web/src/lib/api.ts\` 里的 fetch 封装）
3. **成功了就更新消息**（\`setMessage(...)\`）
4. **不管成不成功都退出 loading 态**（\`finally\`）

\`api.hello()\` 是 async，所以 handleClick 必须也是 async，才能用 \`await\`。

### 3. JSX

\`\`\`tsx
<button type="button" onClick={handleClick} disabled={loading}>
  {loading ? "请求中..." : "调用后端"}
</button>
\`\`\`

- \`onClick={handleClick}\` —— 把上面那个函数挂到点击事件
- \`disabled={loading}\` —— loading 时禁用按钮（防止重复点击）
- \`{loading ? "请求中..." : "调用后端"}\` —— 花括号里可以塞任何 JS 表达式，包括三目

### 4. 条件渲染

\`\`\`tsx
{message && (
  <p>{message}</p>
)}
\`\`\`

\`&&\` 短路：\`message\` 是 null 时，整个表达式返回 null，React **什么都不渲染**；有值时才渲染 \`<p>\`。

这是 React 里最常见的条件渲染写法。

## 一次交互的完整时序

假设你点击了按钮：

\`\`\`
[t=0]   点击 → handleClick 触发
[t=0]   setLoading(true) → React 重新执行组件函数 → 按钮变成"请求中..."并禁用
[t=0]   await api.hello() 开始 → 浏览器 fetch /api/demo/hello
[t=100] 后端返回 { message: "你好！", time: "..." }
[t=100] setMessage("...") → React 重新执行 → <p>{message}</p> 渲染出来
[t=100] finally → setLoading(false) → 按钮恢复
\`\`\`

**每一次 setState 都会让组件函数重跑一次**，把最新值渲染到界面。这就是"响应式"。

## 挑战题

**读懂了这个再看下一个**：

1. 打开 \`apps/web/src/components/demos/CountClicks.tsx\`。它多了一个 \`useEffect\` —— 为什么？
2. 打开 \`apps/web/src/components/demos/ListMessages.tsx\`。它有 5 个 state，画一张"state 之间怎么互动"的图
3. 打开 \`apps/web/src/routes/home.tsx\`。它没有 useState 也能拿数据，为什么？（提示：useLoaderData）

## 你应该学到

- **组件 = 函数**，接受 props 返回 JSX
- **state = 组件的记忆**，用 useState 声明
- **事件处理函数在组件内定义**，通过 \`on*\` 属性挂载
- **每次 setState 都会触发重新渲染**，React 只更新变化的 DOM
- **异步操作用 async/await**，配合 loading state 优化体验

读源码是最快学 React 的方法。项目里所有组件都可以这样拆。`,
          },
          {
            kind: "note",
            content:
              "💡 **进阶阅读**：`apps/web/src/components/Sidebar.tsx` 是本项目最复杂的组件之一。它用了 useState、useEffect、useLocation、useParams、条件渲染、列表渲染、className 拼接、事件传递 —— 读懂它你就掌握了 React 90% 的日常场景。",
          },
        ],
      },
      {
        slug: "shadcn",
        title: "shadcn/ui：不一样的组件库",
        summary: '不是 npm 包，是把组件源码复制到你项目里的一种"新范式"',
        sections: [
          {
            kind: "text",
            content: `# shadcn/ui：不一样的组件库

> **回顾**：上一章拆解了一个用裸 React + Tailwind 写的组件。  
> **本章**：介绍 shadcn/ui —— 一种"复制源码"而非 npm 安装的组件库设计。  
> **为什么**：生产项目不会自己造按钮/表单/卡片。学会用组件库能极大提高开发速度。


## 传统组件库的做法

想要一个漂亮的按钮，你可能会：

\`\`\`bash
npm install @mui/material
\`\`\`

然后：

\`\`\`tsx
import { Button } from "@mui/material";
<Button variant="contained">确定</Button>
\`\`\`

组件是**别人 npm 包里的黑盒**。要改颜色/交互，只能靠 props 或 theme 覆盖，改不动的地方就没辙。

## shadcn/ui 的做法

\`\`\`bash
bunx shadcn add button
\`\`\`

它**把 Button 组件的完整源码复制到你项目的 \`src/components/ui/button.tsx\`**。之后：

\`\`\`tsx
import { Button } from "@/components/ui/button";
<Button>确定</Button>
\`\`\`

你可以直接打开 \`button.tsx\`，看到全部 30 来行代码；想改就改；这个改动完全是你的、跟着你的 git 走。

## 为什么这么设计

- **拥有源码 = 拥有控制权**：不用等库作者发新版才能改 API
- **零抽象成本**：你看到什么就是什么，不用猜"背后包了几层"
- **按需使用**：只 \`add\` 用得到的组件，包体不会因为一个按钮把整个组件库拉进来

## 生态基石

shadcn/ui 不是从零发明轮子，它站在几个成熟库之上：

- **Tailwind CSS** —— 样式
- **Radix UI** —— 无障碍原语（键盘导航、焦点管理、ARIA 属性）
- **class-variance-authority（cva）** —— 变体管理（主/次/危险按钮的写法组织）
- \`cn()\` helper（\`clsx + tailwind-merge\`）—— 优雅地拼合 class

## 对照本项目

- \`apps/web/components.json\` —— shadcn 的配置文件
- \`apps/web/src/components/ui/\` —— 所有用 \`bunx shadcn add\` 装进来的组件源码
- \`apps/web/src/lib/utils.ts\` —— 那个 \`cn\` helper 就在这里
- 学生要新组件时：\`bunx shadcn add dialog\`（然后打开 \`ui/dialog.tsx\` 读一读）`,
          },
        ],
      },
    ],
  },

  {
    slug: "engineering",
    title: "工程化",
    description: "为什么现代前端要用 Bun、Vite、monorepo、Biome",
    chapters: [
      {
        slug: "bun",
        title: "Bun：一个替代 npm/node 的新工具",
        summary: "你 clone 项目后第一个见到的工具",
        sections: [
          {
            kind: "text",
            content: `# Bun：一个替代 npm/node 的新工具

> **回顾**：上一门课学完了 React 前端。  
> **本章**：开始讲工程化 —— 项目跑起来背后的工具链。第一步：包管理器 Bun。  
> **为什么**：你 clone 项目跑的第一条命令是 \`bun install\`。搞懂它是理解工程化的起点。


你按项目 README 跑的第一条命令是 \`bun install\`。这一章讲清楚 Bun 是什么、为什么本项目押注它。

## Bun 是什么

Bun 是**三件套合一**的现代 JS 工具：

1. **JS 运行时**：直接跑 \`.js\` / \`.ts\` 文件（Node 只能跑 .js，跑 TS 要先编译）
2. **包管理器**：\`bun install\` 替代 \`npm install\` / \`yarn\` / \`pnpm\`
3. **打包工具 + 测试运行器**：项目里我们没用到，Vite 已经够了

它用 Zig 写的，速度比 Node/npm 快好几倍。

## 为什么本项目选 Bun

**装依赖飞快。** 本项目在你电脑上第一次 \`bun install\` 应该 3-5 秒完成。npm 装同样的依赖要 30-60 秒。

**直接跑 TypeScript。** 后端代码是 TS，用 Bun 跑：
\`\`\`bash
bun run apps/api/src/index.ts
\`\`\`
不需要先 \`tsc\` 编译成 JS，不需要 \`ts-node\`。

**内置 workspaces。** 根 \`package.json\` 里的 \`"workspaces": ["apps/*", "packages/*"]\` 是 Bun 天然支持的（下一章讲 monorepo 时你会看到）。

## 对照本项目的痕迹

- 根 \`package.json\` 有 \`"packageManager": "bun@1.3.11"\` —— 声明"这个项目就是用 Bun"
- \`bun.lock\` —— 锁定所有依赖版本（相当于 \`package-lock.json\`）
- \`apps/api/Dockerfile\` 用 \`oven/bun:1.3.11-alpine\` 作为基础镜像
- 部署时 \`docker compose run --rm api bun run apps/api/src/db/migrate.ts\` —— 生产环境也是 Bun 跑 TS

## Bun 会取代 Node 吗

短期不会。生态还在追赶，边缘用法（某些 C++ 扩展、部分企业内部工具）会踩坑。但对**新项目**，Bun 已经足够稳、体验极佳。本项目就是这么押注的。`,
          },
        ],
      },
      {
        slug: "why-vite",
        title: "为什么需要 Vite",
        summary: '从"直接写 script 标签"到"打包工具"到"Vite"',
        sections: [
          {
            kind: "text",
            content: `# 为什么需要 Vite

> **回顾**：上一章讲了 Bun 是什么。  
> **本章**：讲 Vite —— 前端开发时秒开的构建工具。  
> **为什么**：前端项目为什么改代码就自动刷新？Vite 是幕后功臣，也是现代前端事实标准。


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

> **回顾**：上一章讲了 Vite 的作用。  
> **本章**：介绍 monorepo：一个仓库放多个"包"（前端 / 后端 / 共享类型）。  
> **为什么**：本项目就是 monorepo。学会它你能理解为什么一份 zod schema 能被前后端共用。


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

看看本项目根目录的 \`package.json\`，就是这么配的。

## 一句话补充：Turborepo

单靠 workspaces 还有个不方便：想启动 API + 前端两个服务，得开两个终端。

**Turborepo** 是 workspaces 之上的**任务编排器**。一条 \`turbo dev\` 就能并行起所有服务；\`turbo build\` 还会缓存没变的包（改了 web 就只重构 web）。

本项目的 \`turbo.json\` 就配了这个。你日常只会用到：

- \`bun run dev\` = \`turbo dev\` = 并行起 api + web
- \`bun run build\` = \`turbo build\` = 并行构建（有缓存加速）

工程规模小时 Turborepo 帮助不大；十几个包时它是刚需。这里知道有这么个东西即可。`,
          },
        ],
      },
      {
        slug: "biome",
        title: "Biome：一体化的代码规范工具",
        summary: "一份配置搞定格式化 + lint，比 ESLint + Prettier 快 20 倍",
        sections: [
          {
            kind: "text",
            content: `# Biome：一体化的代码规范工具

> **回顾**：上一章讲了 monorepo 的组织方式。  
> **本章**：介绍 Biome —— 现代 lint + format 一体化工具。  
> **为什么**：生产项目都会跑 lint 保证代码质量。学会它，你的 CI 就有了第一道"质量门"。


## 传统做法的痛

一个真实项目的代码规范通常有两件事：

1. **格式化**（Formatter）：统一缩进、引号、换行 → 装 Prettier
2. **静态检查**（Linter）：找变量未使用、可能的 bug、坏 pattern → 装 ESLint

两个工具、两份配置文件、经常互相打架（Prettier 认为该换行、ESLint 觉得不该）。项目一大配置就成迷宫。

## Biome 做法

**一个 Rust 写的工具做两件事，一份 \`biome.json\`。**

- \`bun run lint\` = \`biome check .\` → 同时跑格式化检查和 lint 规则
- \`bun run format\` = \`biome format --write .\` → 一键把格式化差异修掉
- \`bun run lint:fix\` = \`biome check --write .\` → 可自动修的问题一次性修

Rust 让它比 ESLint 快约 20 倍。中等规模项目一秒内出结果。

## 对照本项目

- 根 \`biome.json\` —— 一份配置管全部
- \`bun run lint\` 命令在 \`package.json\` 里
- \`.github/workflows/ci.yml\` 里 \`Lint (biome)\` 是 typecheck 之前的第一道质量门
- 提交 PR 时 CI 会自动跑 lint，红了不能合并`,
          },
          {
            kind: "note",
            content:
              "💡 **顺手试试**：编辑本项目里任意一个 tsx 文件，把缩进弄乱、加些多余空格，然后运行 `bun run lint`。你会看到 biome 精确定位到每个问题。再运行 `bun run lint:fix`，一秒全部修好。",
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

> **回顾**：上一门课讲完了前端工程化。  
> **本章**：转到后端 —— 先讲 HTTP 协议本身。  
> **为什么**：服务器代码本质是"接收请求 → 处理 → 返回响应"。这一章是后端所有内容的根基。


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

> **回顾**：上一章讲了 HTTP 通信的原理。  
> **本章**：介绍 Hono —— 现代 Node 后端框架，用来接收 HTTP 请求。  
> **为什么**：本项目所有后端接口都是用 Hono 写的。学会 routing 你就能加自己的接口。


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
      {
        slug: "trace-a-request",
        title: "追一次真实请求：从进来到出去",
        summary: "打开 apps/api/src/routes/demo-sandbox.ts 的 POST /messages，逐行读懂",
        sections: [
          {
            kind: "text",
            content: `# 追一次真实请求：从进来到出去

> **回顾**：上一章讲了 Hono 路由的写法。  
> **本章**：打开留言 POST 接口，追一次真实请求从进入到返回的完整过程。  
> **为什么**：读源码比记 API 更有价值 —— 一次追下来，后端开发的完整心智模型就建起来了。


前面讲了 HTTP 是什么、Hono 路由怎么写。这一章你**追一条真实请求**从进入服务器到返回响应，中间发生了什么。5 分钟走完。

## 场景

用户在留言板 Demo 里点"发送"按钮，前端发起：

\`\`\`
POST /api/demo/messages HTTP/1.1
Content-Type: application/json

{ "author": "张三", "body": "你好！" }
\`\`\`

我们跟着这条请求走一遍。

## 第 1 站：Hono 入口

打开 \`apps/api/src/index.ts\`。Hono app 收到请求后，会**按路由挂载顺序匹配**：

\`\`\`ts
app.use("*", logger());       // ① 先经过日志中间件
app.use("/api/*", cors(...)); // ② CORS 允许跨域
app.get("/api/health", ...);  // ③ 不匹配（method 不对）
app.route("/api/courses", coursesRoute);  // ③ 不匹配（前缀不对）
app.route("/api/chapters", chaptersRoute); // ③ 不匹配
app.route("/api/demo", demoRoute);        // ✅ 匹配！转交给 demoRoute
\`\`\`

## 第 2 站：进入 demoRoute

打开 \`apps/api/src/routes/demo-sandbox.ts\`。这个文件里的 demoRoute 处理所有 \`/api/demo/*\` 请求。找到：

\`\`\`ts
demoRoute.post("/messages", zValidator("json", createMessageInput), async (c) => {
  const input = c.req.valid("json");
  // ...
});
\`\`\`

这一行做了几件事，我们逐个拆。

## 第 3 站：zValidator 校验

\`zValidator("json", createMessageInput)\` 是一个**中间件**，在你的 handler 之前跑。

它做：

1. 读请求的 JSON body
2. 用 \`createMessageInput\` 这个 zod schema 验证
3. **验证失败**：直接返回 400，你的 handler 根本不会被调用
4. **验证成功**：把解析后的对象存到 \`c\` 里，handler 通过 \`c.req.valid("json")\` 拿

\`createMessageInput\` 在哪里定义？打开 \`packages/shared/src/types.ts\`：

\`\`\`ts
export const createMessageInput = z.object({
  author: z.string().min(1).max(40),
  body: z.string().min(1).max(400),
});
\`\`\`

**这就是前后端共享 schema 的力量** —— 前端和后端用同一份规则校验，绝不会出现"前端说合法、后端说不合法"的错位。

## 第 4 站：写入数据库

\`\`\`ts
const [row] = await db
  .insert(demoEvents)
  .values({
    demoKey: "messages",
    payload: { author: input.author, body: input.body },
  })
  .returning();
\`\`\`

这就是 Drizzle 的 INSERT 语法。翻译成 SQL：

\`\`\`sql
INSERT INTO demo_events (demo_key, payload)
VALUES ('messages', '{"author":"张三","body":"你好！"}')
RETURNING *;
\`\`\`

\`.returning()\` 让 pg 返回插入后的完整行（含自增 id 和 createdAt）。

## 第 5 站：构造返回

\`\`\`ts
const result: Message = {
  id: row.id,
  author: input.author,
  body: input.body,
  createdAt: row.createdAt.toISOString(),
};
return c.json(result, 201);
\`\`\`

- \`Message\` 类型也在 \`packages/shared\` 里定义（前后端共享）
- 状态码 **201 Created**（不是 200，因为这是"新建"）
- \`c.json()\` 帮你设置 \`Content-Type: application/json\` header

## 全链路总结

\`\`\`
浏览器 POST
   ↓
Hono app.use logger  → 打日志
   ↓
Hono app.use cors    → 允许跨域
   ↓
app.route(/api/demo) → 派发到 demoRoute
   ↓
demoRoute.post(/messages)
   ↓
zValidator            → 校验请求 body
   ↓
handler
   ↓
db.insert().returning() → SQL 写库
   ↓
c.json(result, 201)   → 返回响应
   ↓
浏览器收到 { id, author, body, createdAt }
\`\`\`

**从进入到返回，10 行代码，完整链路**。

## 挑战题

现在你已经能读懂了。**试着自己看**：

1. 打开 \`apps/api/src/routes/demo-sandbox.ts\` 里的 \`POST /click\` —— 它是怎么"累加计数"的？
2. \`app.onError\` 在 \`index.ts\` 里做什么？什么时候被触发？
3. 如果前端提交时 body 为空字符串，会走到哪里、返回什么？

## 一个心态

**任何一个后端接口都能这样拆解。** 你以后接手别人的代码、debug 线上问题，就是这样一站一站追下去。学会这种"读代码的姿势"，比记 API 更有价值。`,
          },
          {
            kind: "note",
            content:
              "💡 **上一章的 F12 + 这一章的追代码 = 全栈调试的两把剑**：前端问题看 Network，后端问题追 handler。有了这两把剑，绝大多数问题你都能自己解决。",
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

> **回顾**：上一门课讲完了后端接口的接收和处理。  
> **本章**：开始讲数据库 —— 后端接收数据后存到哪。  
> **为什么**：任何非玩具级应用都需要持久化数据。数据库是这一环的核心。


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

> **回顾**：上一章讲了为什么需要数据库。  
> **本章**：教你如何把业务概念拆成表和字段。  
> **为什么**：表设计是数据库的核心技能。设计得好，后面写 SQL 就顺；设计得差，后期改起来极痛苦。


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
        slug: "hands-on-psql",
        title: "动手：打开数据库、亲手跑一条 SQL",
        summary: "从现在起，你能亲眼看数据、亲手改数据",
        sections: [
          {
            kind: "text",
            content: `# 动手：打开数据库、亲手跑一条 SQL

> **回顾**：上一章讲了表设计的理论。  
> **本章**：打开 psql（或 db:studio）亲手改数据 —— 10 分钟实操。  
> **为什么**：只有亲手跑一遍 SQL，数据库才从抽象概念变成"你能触摸的东西"。


前面讲了数据库理论、表设计。这一章你**亲手连接一次数据库**，看真实数据、跑真实 SQL。花 10 分钟。

## 方案 A：psql 命令行（最正统）

**psql** 是 PostgreSQL 官方命令行工具。本项目用 Docker 起的 pg，直接进容器：

\`\`\`bash
docker exec -it web-tutor-postgres psql -U dev -d webtutor
\`\`\`

看到 \`webtutor=#\` 提示符 = 你进入了数据库。

**试几条基础命令**：

\`\`\`sql
-- 查看所有表
\\dt

-- 看 courses 表结构
\\d courses

-- 数一下有多少门课程
SELECT COUNT(*) FROM courses;

-- 列出前 3 门课
SELECT id, slug, title FROM courses LIMIT 3;
\`\`\`

**关键快捷键**：

- \`\\q\` 退出 psql
- \`\\l\` 列所有数据库
- \`\\?\` 看所有 psql 命令帮助

## 方案 B：Drizzle Studio（可视化）

不喜欢命令行？跑一条：

\`\`\`bash
bun run db:studio
\`\`\`

浏览器会打开 \`https://local.drizzle.studio\`，看到所有表的**可视化界面**。可以点表看数据、可以直接编辑单元格、可以跑 SQL。

## 方案 C：DBeaver / TablePlus（GUI 工具）

如果你想用桌面 GUI（DBeaver 是免费的），连接信息：

- Host: \`localhost\`
- Port: \`5432\`
- Database: \`webtutor\`
- User: \`dev\`
- Password: \`dev\`

## 挑战：亲手改一条数据

用上面任一方式，试：

\`\`\`sql
-- 1. 查看第一门课
SELECT id, title FROM courses WHERE order = 0;

-- 2. 把它的标题改一下
UPDATE courses SET title = '你好数据库' WHERE order = 0;

-- 3. 刷新浏览器教程页面 → 你会看到第一门课名字变了！

-- 4. 改回去
UPDATE courses SET title = '认识 Web 开发' WHERE order = 0;
\`\`\`

**这一刻你亲手改了生产数据**（虽然是本地"生产"）。数据库不再是一个抽象概念，你能触摸它。

## 为什么这一步重要

- **调试神器**：日后前端说"这里数据不对"，你打开数据库直接看，不用猜
- **理解 ORM**：下一门课会用 Drizzle ORM，它其实就是**帮你生成 SQL**。会 SQL 才能读懂 ORM 的产出
- **面试常问**：面试官会让你写 SQL，你至少要能写得出基本的 SELECT/INSERT/UPDATE

## 常见问题

**Q**：\`docker exec\` 说"No such container"？
**A**：pg 没启动。先 \`bun run db:up\`。

**Q**：\`psql\` 里输错了怎么办？
**A**：SQL 语句必须以 \`;\` 结尾。如果按回车没反应，可能少了分号。补一个 \`;\` 回车就能执行。

**Q**：\`db:studio\` 打不开？
**A**：确保 \`bun run db:up\` 起了 pg。studio 会连 5432 端口。`,
          },
          {
            kind: "note",
            content:
              "💡 **一个小 tip**：psql 支持自动补全 —— 敲 `SEL` 按 Tab 会自动补成 `SELECT`。表名/字段名也能补。用起来就上瘾。",
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

> **回顾**：上一门课让你会写 SQL 了。  
> **本章**：介绍 ORM —— 让你用 TypeScript 代替字符串 SQL 操作数据库。  
> **为什么**：生产项目几乎都用 ORM 而非裸 SQL。学会它就能享受"类型安全 + 编辑器自动补全"的开发体验。


> **回顾**：上一章你已经能连上数据库、跑基本查询了。  
> **本章**：系统讲 SQL 增删改查（SELECT / INSERT / UPDATE / DELETE）。  
> **为什么**：SQL 是所有关系数据库的通用语言。学会它，换任何数据库都是熟悉的味道。


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
        slug: "read-real-code",
        title: "读懂本项目的一段 Drizzle 代码",
        summary: "打开 apps/api/src/routes/courses.ts，逐句拆解",
        sections: [
          {
            kind: "text",
            content: `# 读懂本项目的一段 Drizzle 代码

> **回顾**：上一章讲了 ORM 的思想。  
> **本章**：打开本项目的 Drizzle 查询代码，逐行拆解。  
> **为什么**：从"理论上懂"到"能改代码"之间的桥梁，就是读一遍真实代码。


上一章说了 ORM 的原理，这一章你**打开本项目一段真实代码**，逐句读懂。

## 我们要读的这段

打开 \`apps/api/src/routes/courses.ts\`，找到这个函数：

\`\`\`ts
// GET /api/courses/:slug —— 某门课程 + 它的章节
coursesRoute.get("/:slug", async (c) => {
  const slug = c.req.param("slug");

  const course = await db.query.courses.findFirst({
    where: eq(courses.slug, slug),
    with: {
      chapters: {
        orderBy: [asc(chapters.order)],
      },
    },
  });

  if (!course) {
    return c.json({ error: "课程不存在" }, 404);
  }

  // ...省略：整理返回格式
});
\`\`\`

这个函数处理"取一门课程 + 它的所有章节"。就是你刚才点开左侧目录任意一门课时，浏览器发出的 API 请求所触发的代码。

## 逐句拆解

### \`const slug = c.req.param("slug");\`

从 URL 里取出 \`:slug\` 部分。比如访问 \`/api/courses/frontend-basics\`，slug 就是 \`"frontend-basics"\`。

### \`db.query.courses.findFirst\`

Drizzle 的**查询构造器**。你可以理解成：

- \`db\` = 数据库连接（在 \`apps/api/src/db/client.ts\` 里初始化）
- \`db.query.courses\` = "对 courses 表进行查询"
- \`.findFirst(...)\` = "找**第一条**匹配的记录"（没有会返回 undefined）

### \`where: eq(courses.slug, slug)\`

翻译成 SQL：\`WHERE courses.slug = $1\`（$1 就是变量 slug）。

**为什么用 \`eq()\` 而不是直接写 \`===\`**？

因为 \`courses.slug\` 不是普通字符串 —— 它是 Drizzle 的 **schema 引用对象**，包含类型信息。\`eq()\` 接收这种对象和值，返回 SQL 条件。**类型安全**：你不小心写 \`eq(courses.slgu, slug)\`（打错字），TypeScript 立刻报错。

### \`with: { chapters: ... }\`

**这是 Drizzle 的甜蜜点**：一次查出 course + 它的所有 chapters，避免 N+1 查询。

翻译成 SQL 就是一个 \`LEFT JOIN\`。

**为什么能这样**？因为在 \`apps/api/src/db/schema.ts\` 里定义了 relations：

\`\`\`ts
export const coursesRelations = relations(courses, ({ many }) => ({
  chapters: many(chapters),
}));
\`\`\`

Drizzle 知道 "courses 一对多 chapters"，就能自动生成 join。

### \`orderBy: [asc(chapters.order)]\`

章节按 \`order\` 字段升序排。**再次注意**：\`asc(...)\` 也是 Drizzle helper，返回排序条件对象。

### 返回值的类型

\`course\` 现在的类型是 **Drizzle 推导出来的**：

\`\`\`ts
{ id: number, slug: string, title: string, ..., chapters: Array<{...}> } | undefined
\`\`\`

你**没写任何类型标注**，编辑器自动补全每个字段。这是"零抽象成本 + 完全类型安全"的具体表现。

## 挑战题

打开 \`apps/api/src/routes/chapters.ts\`，找 \`GET /api/chapters/:slug\` 的实现。它比上面这段更复杂 —— 里面用了 \`lt\` / \`gt\` 找前后章节。**试着自己解释**：

1. \`lt(chapters.order, chapter.order)\` 是什么 SQL？
2. \`.limit(1)\` 为什么必要？
3. 如果没有前一章（当前是第一章），\`prevRow\` 会是什么值？

## 一个总结

会用 Drizzle 的三步骤：

1. **在 schema.ts 定义表**（表结构 + relations）
2. **在 routes/\\*.ts 用 \`db.query.xxx\` 或 \`db.select().from(xxx)\`**（查询）
3. **相信编辑器自动补全**（不用手写类型）

其他 ORM（Prisma / TypeORM）流程类似。学会一个再迁移就容易了。`,
          },
          {
            kind: "note",
            content:
              "💡 **DrizzleORM 的两种 API**：`db.query.xxx.findFirst`（更直观、支持 relations）和 `db.select().from(xxx).where(...)`（更接近原生 SQL、更灵活）。本项目两种都用，你会看到。",
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

> **回顾**：上一章你能读懂 Drizzle 的查询代码了。  
> **本章**：讲 Migration —— 如何随着业务演进安全地改表结构。  
> **为什么**：生产环境的数据库不能像本地那样 drop & rebuild。Migration 是可持续演进数据库的必备技能。


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
            content:
              "💡 想直观看数据库内容？跑 `bun run db:studio`，会打开 Drizzle Studio 网页界面。",
          },
        ],
      },
    ],
  },
  {
    slug: "unit-testing",
    title: "单元测试",
    description: "为什么写测试、怎么写、用 Vitest 读懂本项目的测试文件",
    chapters: [
      {
        slug: "why-test",
        title: "为什么写测试",
        summary: "改一处炸一处 —— 没测试的代码越长越可怕",
        sections: [
          {
            kind: "text",
            content: `# 为什么写测试

> **回顾**：上一门课让你能读写数据库了。  
> **本章**：换个视角讲测试 —— 如何保证你写的代码"改一处不会炸另一处"。  
> **为什么**：任何长期维护的项目都必须有测试。学会写测试，你的代码才有"能持续演进"的能力。


## 一个真实场景

你刚写完一个功能，测了一下能跑，提交上线。三天后同事改了另一处代码，你的功能不知不觉挂了。**发现时可能已经过了一周**。

有测试就不一样：CI 里跑一遍测试，改坏了立刻红，问题当场发现。

## 三种测试

| 类型 | 测什么 | 特点 |
|---|---|---|
| **单元测试** | 一个函数、一个组件的独立行为 | 快、多、便宜 |
| **集成测试** | 多个模块的组合（比如"HTTP 请求 → 数据库落库"） | 中速、覆盖真实场景 |
| **E2E 测试** | 用浏览器模拟真实用户 | 慢、贵、但最真实 |

**经验法则**：单元测试占大头（70%）、集成测试次之（20%）、E2E 少而精（10%）。这个比例叫**测试金字塔**。

## 本项目做了什么

打开根 \`package.json\`：\`"test": "turbo test"\`。这一条命令能跑：

- \`packages/shared\`：zod schema 的**单元测试**（24 例）
- \`apps/web/src/lib/*\`：\`toc\`/\`utils\`/\`api\` 的**单元测试**（31 例）
- \`apps/api/src/routes/*\`：Hono 路由的**集成测试**，用 in-memory pg（16 例）
- \`apps/web/src/components/*\`：React 组件的**单元测试**，用 jsdom + testing-library（14 例）

总计 **85 个测试**，跑完约 3 秒。CI 里每次 PR 自动跑。

## 教学意义

传统教学项目"跑起来能用"就算完成了。本项目希望学生**能长期维护它** —— 加功能不改坏老功能。测试就是这个能力的保障。`,
          },
          {
            kind: "note",
            content:
              '💡 **反直觉**：写测试**看起来**多花时间，实际上会**省时间**。你调试 bug 的时间会大幅减少 —— 因为测试立即告诉你"哪里改坏了"。',
          },
        ],
      },
      {
        slug: "vitest-basics",
        title: "读懂本项目的第一个测试",
        summary: "打开 apps/web/src/lib/toc.test.ts，逐行讲 describe/it/expect",
        sections: [
          {
            kind: "text",
            content: `# 读懂本项目的第一个测试

> **回顾**：上一章讲了为什么写测试。  
> **本章**：打开本项目的 toc.test.ts，讲清楚 Vitest 三大 API：describe / it / expect。  
> **为什么**：掌握基本语法，你就能从任何测试文件读出"它在测什么"。


打开 \`apps/web/src/lib/toc.test.ts\`。这个文件测的是 \`toc.ts\` 里的 \`slugify\` 和 \`extractHeadings\` 两个纯函数。

## 三个关键词

\`\`\`ts
import { describe, expect, it } from "vitest";
import { slugify } from "./toc.js";

describe("slugify", () => {
  it("英文空格 → 连字符", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });
});
\`\`\`

- **describe** —— 一组相关的测试放一起（类似"测试套件"）
- **it** —— 一个具体的用例（describe 之下的一句"应该做什么"）
- **expect** —— 断言：某个值应该是什么

读起来像一句话：**"describe slugify, it should turn 空格 into 连字符"**。这就是 Vitest 的 API 设计哲学。

## 三个最常用的 matcher

- \`.toBe(x)\` —— 严格相等（===）
- \`.toEqual(x)\` —— 深层相等（对象/数组按内容比）
- \`.toHaveLength(n)\` —— 数组/字符串长度

其他常见：\`.toBeNull()\`、\`.toBeTruthy()\`、\`.toContain(x)\`、\`.toMatchObject({...})\`。

## 边界值思维

同一份 \`slugify\` 测试写了 9 个用例：英文 / 中文 / 连续空格 / 前后空白 / 特殊字符 / 连续连字符 / 首尾连字符 / 空串。

**核心思想**：不只测"正常情况"，还要测**边界**：

- 空输入
- 极长输入
- 特殊字符
- Unicode
- 逻辑边界（比如 = 0、=  最大值）

一个测试用例覆盖的边界越多，未来出 bug 的概率就越小。

## 跑测试

\`\`\`bash
# 全部
bun run test

# 只跑某个 workspace
bun --filter @app/web test

# 监听模式（改代码自动重跑）
bun --filter @app/web test:watch

# 覆盖率
bun --filter @app/web test -- --coverage
\`\`\``,
          },
          {
            kind: "note",
            content:
              '💡 **建议**：写一个函数之前，**先写一句测试描述**。就算不写实现细节，"it should return xxx when yyy" 这句话会帮你想清楚接口。这叫 TDD（测试驱动开发）思维。',
          },
        ],
      },
      {
        slug: "api-testing",
        title: "后端 API 集成测试",
        summary: "打开 courses.test.ts —— pglite + app.request() 无需真 pg",
        sections: [
          {
            kind: "text",
            content: `# 后端 API 集成测试

> **回顾**：上一章讲了纯函数测试。  
> **本章**：转到 API 集成测试 —— 用 pglite 起 in-memory pg，测完整的路由 → ORM → 数据库链路。  
> **为什么**：生产项目 60% 的 bug 出在集成层。学会集成测试能提前发现绝大多数问题。


打开 \`apps/api/src/routes/courses.test.ts\`。这里的测试**同时跑**：路由 → Drizzle ORM → PostgreSQL 三层。

## 关键：pglite

真起一个 PostgreSQL 容器测试太慢、CI 里也麻烦。本项目用 **\`@electric-sql/pglite\`** —— Postgres 编译成的 WASM，**跑在 Node 内存里**。

\`\`\`ts
// apps/api/test/setup.ts
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";

const pg = new PGlite();
export const testDb = drizzle(pg, { schema });

beforeAll(async () => {
  await migrate(testDb, { migrationsFolder });
});
beforeEach(async () => {
  await testDb.execute("TRUNCATE ... RESTART IDENTITY CASCADE");
});
\`\`\`

**特点：**
- **200ms 冷启动** —— 一个 CI 任务加起来仍在秒级
- **每个用例干净的库**（\`beforeEach\` 清表）
- **完整 Postgres 特性**（enum / jsonb / cascade delete 都能用）
- **零外部依赖** —— \`bun install\` 装上就能用

## 关键：hono/testing 风格

后端 Hono app **不启动 server**，直接构造 Request：

\`\`\`ts
const res = await app.request("/api/courses/frontend");
expect(res.status).toBe(200);
const body = await res.json();
\`\`\`

**\`app.request\`** 接受 URL 和 fetch 风格的 init，返回原生 \`Response\`。相当于**"内存里的 HTTP"**。

## 一个完整用例

\`\`\`ts
it("命中返回 course + chapters", async () => {
  await seedCourses();                          // 插测试数据
  const res = await app.request("/api/courses/frontend");
  expect(res.status).toBe(200);
  const body = await res.json();
  expect(body.chapters).toHaveLength(2);
});
\`\`\`

**这就是集成测试**：不 mock 数据库，用真 SQL + 真 ORM + 真路由跑，只是 pg 是内存版。

## 关键：可测试的架构

\`apps/api/src/index.ts\` 只做一件事：\`serve(app.fetch)\`。真正的 Hono 应用**定义在 \`app.ts\`**（\`export const app = new Hono()\`）。

这样测试能 \`import { app } from "../app.js"\` 拿到应用而**不启动 HTTP server**。

**教学要点**：把"应用定义"和"应用启动"分开 —— 是让代码可测试的关键设计。`,
          },
        ],
      },
      {
        slug: "component-testing",
        title: "React 组件测试",
        summary: "打开 Sidebar.test.tsx —— render + userEvent + MemoryRouter",
        sections: [
          {
            kind: "text",
            content: `# React 组件测试

> **回顾**：上一章讲了后端集成测试。  
> **本章**：介绍 React 组件测试 —— 用 testing-library 模拟真实用户点击输入。  
> **为什么**：前端组件的 bug 大都是"用户交互后状态错了"。组件测试专门解决这类问题。


打开 \`apps/web/src/components/Sidebar.test.tsx\`。这是测**渲染 + 点击交互**的完整例子。

## 三个核心 API

**\`render\`** —— 把组件"渲染到内存里的 DOM"（jsdom，不是真浏览器）

**\`screen\`** —— 查询渲染出来的元素

- \`screen.getByText("文本")\`
- \`screen.getByRole("button", { name: "点我" })\`
- \`screen.queryByRole(...)\` —— 找不到时**返回 null**（不抛异常）
- \`screen.findByText(...)\` —— **异步版本**，等待元素出现

**\`userEvent\`** —— 模拟真实用户操作（点击、输入、悬停）

\`\`\`tsx
const user = userEvent.setup();
await user.click(button);
await user.type(input, "hello");
\`\`\`

**为什么用 userEvent 而不是 fireEvent**：userEvent 更真实（会触发一系列事件：mousedown / focus / click），fireEvent 只发单个事件，容易漏 bug。

## MemoryRouter 包裹

Sidebar 用了 React Router 的 \`useLocation\` / \`useParams\`。测试时需要**假路由环境**：

\`\`\`tsx
function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/chapters/:slug" element={<Sidebar tree={tree} />} />
      </Routes>
    </MemoryRouter>,
  );
}
\`\`\`

**\`MemoryRouter\`** 不动浏览器 URL，只在内存维护一个假路由栈。测试里想模拟"用户在 /chapters/xxx 页"就传给它。

## jsdom 缺什么

React 组件测试跑在 **jsdom**（Node 里的 DOM 模拟器），它**不是真浏览器**，缺一些浏览器 API。本项目 \`test/setup.ts\` stub 了：

- \`IntersectionObserver\`（TableOfContents 用）
- \`ResizeObserver\`（shadcn ScrollArea 用）
- \`matchMedia\`（深色主题检测用）
- \`hasPointerCapture\` / \`scrollIntoView\`（Radix 组件用）

**遇到 "xxx is not defined" 报错**，通常就是要在 setup 里 stub 掉这个 API。

## Mock 外部依赖

组件测试**不应该真发 HTTP 请求**。用 \`vi.stubGlobal\`：

\`\`\`ts
vi.stubGlobal("fetch", vi.fn(async () => ({
  ok: true,
  json: async () => ({ message: "mocked" }),
  text: async () => "",
})));
\`\`\`

或 \`vi.mock\` 换整个模块（比如 \`sonner\` 的 \`toast\`）：

\`\`\`ts
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}));
\`\`\`

## 你能测什么

- **渲染断言**：某个元素在不在、有多少个
- **交互断言**：点击后状态变化、输入后值变化
- **副作用断言**：fetch 是否被调用、toast 是否被触发

**不测**：底层实现细节（比如 useState 具体值）—— 那是白盒，脆弱。**测行为**才有价值。`,
          },
          {
            kind: "note",
            content:
              "🎓 **完结**：走完这一章，你已经掌握了写测试的完整能力。写代码 → 写测试 → CI 自动跑 —— 这套循环让软件能长期健康演进。项目和它的作者一起长大。",
          },
        ],
      },
    ],
  },
  {
    slug: "project-overview",
    title: "本项目全景",
    description: "把前面学到的所有技术拼成一张完整的图 —— 这个项目到底是怎么运转的",
    chapters: [
      {
        slug: "tech-stack",
        title: "一张表看懂技术栈",
        summary: "从前端到数据库，每一层的选择及理由",
        sections: [
          {
            kind: "text",
            content: `# 一张表看懂技术栈

> **回顾**：上一门课让你能给项目加测试保护了。  
> **本章**：站得更高看一次 —— 用一张表快速回顾整个项目用了什么技术。  
> **为什么**：把前面学的东西整合成一张全景图，未来做真实项目选型时你有参照。


前面几门课分开讲了每一块技术，这里一次性列全。

| 层次 | 技术 | 为什么选它 |
|---|---|---|
| 包管理 / 运行时 | **Bun** | 装依赖飞快、直接跑 TS |
| 任务编排 | **Turborepo** | monorepo 里一条命令并行起服务，缓存构建 |
| 代码规范 | **Biome** | 替代 ESLint + Prettier，一份配置 |
| 前端构建 | **Vite 6** | 秒开的 dev、生态最好 |
| 前端框架 | **React 18** | 组件思维，事实标准 |
| 前端路由 | **React Router v7** | data-mode 路由（含 loader） |
| 前端样式 | **Tailwind CSS v4** | 类名即样式，v4 引擎 10× 快 |
| 前端组件库 | **shadcn/ui** | 组件源码复制，非黑盒 |
| 后端运行时 | **Bun on Node 20 兼容** | 直接跑 TS |
| 后端框架 | **Hono** | 现代极简，比 Express 快 |
| ORM | **Drizzle** | 贴近 SQL、类型安全 |
| 数据库 | **PostgreSQL 16** | 最经典的开源关系型数据库 |
| 请求校验 | **Zod** | 前后端共享 schema、运行时校验 |
| 部署 | **Docker + docker compose + 腾讯云 CVM** | 与本地开发一致的运行环境 |
| CI | **GitHub Actions**（含 self-hosted runner）| 构建走公网、部署走 CVM 本地 |
| 镜像仓库 | **腾讯云 TCR** | 国内快，私有仓库 |

## 数据是怎么流动的

\`\`\`
用户浏览器
    ↓ (点击 → fetch)
Vite 打包出的 SPA（React）
    ↓ (HTTP GET/POST，走 nginx 反代)
Hono API（apps/api）
    ↓ (Drizzle → SQL)
PostgreSQL
\`\`\`

每一段箭头都对应源码里的一处调用，可以逐一打开对照。`,
          },
        ],
      },
      {
        slug: "monorepo-anatomy",
        title: "目录里都有什么",
        summary: "monorepo 的每个目录、每个配置文件都在做什么事",
        sections: [
          {
            kind: "text",
            content: `# 目录里都有什么

> **回顾**：上一章你已经知道本项目用了哪些技术。  
> **本章**：打开目录看每个文件夹是做什么的。  
> **为什么**：读懂项目结构，你在 IDE 里找任何文件都心里有数。


\`\`\`
web-dev-tutorial/
├── apps/
│   ├── api/           # 后端 Hono 服务
│   └── web/           # 前端 React + Vite
├── packages/
│   └── shared/        # 前后端共享类型与 zod schema
├── deploy/            # 生产环境编排文件
│   ├── docker-compose.prod.yml
│   ├── .env.prod.example
│   └── README.md      # CVM 首次准备手册
├── .github/workflows/ # CI/CD
├── docker-compose.yml # 本地开发用（只跑 pg）
├── biome.json         # 代码规范
├── turbo.json         # 任务编排
├── tsconfig.base.json # 共享 TS 配置
└── package.json       # 工作区根
\`\`\`

## 三个包互相怎么依赖

- \`packages/shared\` **不依赖任何 workspace**，是最底层
- \`apps/api\` 依赖 \`@app/shared\` —— 后端拿类型
- \`apps/web\` 依赖 \`@app/shared\` —— 前端拿类型

打开 \`apps/api/package.json\`，会看到：
\`\`\`json
"dependencies": {
  "@app/shared": "workspace:*"
}
\`\`\`

\`workspace:*\` 是 Bun 认识的特殊语法：直接引用同仓库的另一个包，不经过 npm。

## 一份 schema 定义、两端使用

后端定义留言表的 zod schema（\`packages/shared/src/types.ts\`）：
- 前端提交表单前用它做客户端校验
- 后端接到请求用它做服务端校验（\`@hono/zod-validator\`）
- 两边校验规则**一定一致**，因为是同一份 schema

这是 monorepo 最真实的价值。`,
          },
        ],
      },
      {
        slug: "local-dev-flow",
        title: "本地开发流程",
        summary: "从 clone 到看到教程首页，中间发生了什么",
        sections: [
          {
            kind: "text",
            content: `# 本地开发流程

> **回顾**：上一章你熟悉了目录结构。  
> **本章**：拆解本地开发的 5 条命令 —— 每一步在幕后做了什么。  
> **为什么**：跑通了但不知道原理，遇到问题就抓瞎。这一章帮你把"跑起来"变成"我懂它为什么能跑"。


拉下代码后，学生需要 5 条命令：

\`\`\`bash
bun install              # 装依赖（3-5 秒）
bun run db:up            # 启动 postgres 容器
bun run db:migrate       # 建表
bun run db:seed          # 灌入教程内容
bun run dev              # 并行起前后端
\`\`\`

打开 http://localhost:5173 就是你现在看到的这个界面。

## 每一步在幕后

**bun install** —— Bun 读根 \`package.json\` 里的 \`workspaces\`，对每个子包装依赖。生成 \`bun.lock\` 锁版本。

**db:up** —— 等价于 \`docker compose up -d\`。启动 postgres 容器，5432 端口对本机映射。

**db:migrate** —— 跑 \`apps/api/src/db/migrate.ts\`，用 drizzle-orm 从 \`apps/api/drizzle/*.sql\` 逐个执行迁移。已执行过的会跳过（drizzle 用 \`__drizzle_migrations\` 表记录）。

**db:seed** —— 跑 \`apps/api/src/db/seed.ts\`，往 courses/chapters/sections 三张表灌入教程内容。**幂等的**：库里已有数据就跳过，加 \`--force\` 才会重灌。

**dev** —— 走 \`turbo dev\`，并行触发 \`apps/api\` 的 \`bun run --watch src/index.ts\` 和 \`apps/web\` 的 \`vite\`。前者是后端 hot-reload（改代码自动重启），后者是 Vite HMR（改代码浏览器自动刷新）。

## Vite 代理

前端跑在 5173，后端跑在 3000。浏览器直接访问 5173 时如果 \`fetch('/api/xxx')\` 会 404 —— 因为 5173 上没有 /api 路由。

Vite 在开发环境有一个 **proxy** 设置（\`apps/web/vite.config.ts\`）：把所有 \`/api/*\` 请求转到 3000。这样前端代码写相对路径就行，跟生产环境一致。`,
          },
        ],
      },
      {
        slug: "what-is-docker",
        title: "Docker 是什么：先建立直觉",
        summary: "容器、镜像、端口 —— 用比喻讲清楚，不看部署章会更懂",
        sections: [
          {
            kind: "text",
            content: `# Docker 是什么：先建立直觉

> **回顾**：上一章讲了本地开发链路。  
> **本章**：介绍 Docker —— 生产部署链路的关键工具。  
> **为什么**：部署章节大量用 Docker 概念。先建立"容器 / 镜像 / 端口"的直觉，后面才不迷糊。


后面部署章会大量提到 Docker、容器、镜像、compose。如果你没接触过，那些词就是黑话。这一章用比喻讲清楚，5 分钟。

## 一个类比

**Docker 就是"给应用打包成集装箱"的工具。**

现实世界里，一件商品从工厂到你家，中途要过卡车、船、火车。**集装箱**让所有环节使用同一个规格 —— 不管里面装什么，运输方式统一。

Docker 干一样的事：**把你的应用（代码 + 依赖 + 系统环境）打包成一个"集装箱"（叫容器）**，这个容器在你电脑上、在服务器上、在同事电脑上都能一模一样地跑。

## 三个核心概念

### 镜像（Image）—— 集装箱的模板

镜像是**只读**的：一份程序 + 它需要的所有环境。类比"集装箱蓝图"。

例如：\`postgres:16-alpine\` 是官方的 PostgreSQL 数据库镜像；\`node:20-alpine\` 是 Node.js 镜像；\`nginx:1.27\` 是 nginx 镜像。

镜像存在**镜像仓库**（Docker Hub / 腾讯云 TCR）里，用 \`docker pull\` 拉下来。

### 容器（Container）—— 集装箱的实例

**容器是镜像的运行时。** 一个镜像可以起多个容器（就像一个模板做出多个实物）。

命令：

\`\`\`bash
docker run postgres:16-alpine    # 从镜像起一个容器
docker ps                        # 看有哪些容器在跑
docker stop <id>                 # 停掉
\`\`\`

### 端口映射 —— 容器怎么和外界通信

容器里的服务默认**只对容器内部可见**。要让宿主机能访问，得**映射端口**：

\`\`\`bash
docker run -p 5432:5432 postgres:16-alpine
\`\`\`

这一行说："把容器里的 5432 端口 → 宿主机的 5432 端口"。之后你在宿主机连 \`localhost:5432\` 就能连到容器里的 pg。

## 为什么用 Docker

不用 Docker 你要手动做的事：

- 装 Node.js（版本对不对？）
- 装 PostgreSQL 16（服务启动了吗？）
- 装 nginx（配置写哪里？）
- 每个同事的电脑重来一遍
- 服务器上再来一遍
- 三个环境上有一个差异就炸

用 Docker 只做一件事：

\`\`\`bash
docker compose up
\`\`\`

上面所有服务瞬间启动到**完全一致的状态**。这是它彻底改变行业的原因。

## Docker Compose：多容器编排

单个 \`docker run\` 只能起一个容器。真实项目一般有多个：**pg + api + web**。

**Docker Compose** 让你用一个 \`docker-compose.yml\` 描述所有容器，一条命令起完。

看看本项目 \`docker-compose.yml\`（本地开发用，只跑 pg）：

\`\`\`yaml
services:
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
\`\`\`

再看 \`deploy/docker-compose.prod.yml\`（生产用，跑三个容器）：

\`\`\`yaml
services:
  postgres:
    image: postgres:16-alpine
  api:
    image: ghcr.io/xxx/web-dev-tutorial-api:latest
  web:
    image: ghcr.io/xxx/web-dev-tutorial-web:latest
    ports:
      - "80:80"
\`\`\`

一条 \`docker compose up -d\` 三个容器一起起来。

## 卷（Volume）—— 数据怎么保存

容器**默认无状态**：停掉容器 = 里面的数据全没。

但 pg 里的数据可不能没啊。所以有 **volume**：容器挂载一块宿主机的目录，数据存那里，容器重启数据还在。

看本项目 \`docker-compose.yml\` 的 \`volumes: - pgdata:/var/lib/postgresql/data\` —— 这就是给 pg 挂了一块持久化 volume。

## 现在你应该能读懂

有了这些概念，接下来看**部署链路**（下一章），或看本项目的 \`Dockerfile\` / \`docker-compose.yml\`，就都能读懂了。

**核心思维方式**：

- **一个进程 = 一个容器**（pg / api / web 各一个）
- **容器通信靠端口 + 网络**
- **数据持久化靠 volume**
- **镜像 = 蓝图，容器 = 实例**`,
          },
          {
            kind: "note",
            content:
              '💡 **玩一下 Docker**：跑 `docker run -it alpine:latest sh`，你会进入一个"小 Linux"的 shell。这是完全独立的容器，里面装什么都不会影响你的电脑。退出用 `exit`。这就是 Docker 的强大 —— 隔离且可弃用。',
          },
        ],
      },
      {
        slug: "deployment",
        title: "部署链路：从 push 到线上",
        summary: "GitHub Actions + 腾讯云 TCR + self-hosted runner 是怎么串起来的",
        sections: [
          {
            kind: "text",
            content: `# 部署链路：从 push 到线上

> **回顾**：上一章讲了 Docker 的基本概念。  
> **本章**：把它组合起来 —— 从 \`git push main\` 到线上访问，完整的部署链路。
> **为什么**：会部署 = 能把项目变成产品。这是从"学生"到"能独立做项目"的关键一步。


## 一图流

\`\`\`
本地             GitHub                     腾讯云 CVM
───────────────────────────────────────────────────
git push main
    ↓
    ├─→ GitHub Actions "build" job (ubuntu-latest)
    │      ├─ docker build apps/api
    │      ├─ docker build apps/web
    │      └─ push 镜像到 TCR
    │            imur-yuanpei.tencentcloudcr.com/...
    │
    └─→ GitHub Actions "deploy" job (self-hosted)
           ↓ (任务派发到 CVM 上的 runner)
           在 CVM 上执行：
           ├─ docker compose pull  ← 从 TCR 拉镜像
           ├─ docker compose run --rm api migrate
           ├─ docker compose run --rm api seed  (幂等)
           └─ docker compose up -d api web
                ↓
           nginx (:80) → api (:3000) → postgres (:5432)
                ↓
           http://<CVM 公网 IP>/ 可访问
\`\`\`

## 关键设计

**build 用 GitHub 免费机器、deploy 用 CVM 本地。** 构建镜像不需要碰服务器，走 GitHub 官方 runner 最简单；部署要在服务器上跑 docker 命令，用**自托管 runner**（跑在 CVM 上、主动连 GitHub、只出方向）—— 这样 CVM **不需要对公网开 SSH**，安全面最小。

**镜像去哪：腾讯云 TCR。** 之前用过 GHCR，但国内 CVM 拉 GHCR 慢；TCR 是腾讯云自家、CVM 走内网拉，速度快 10 倍以上。

**镜像 tag 策略：sha 短哈希 + latest。** 每次 push 产生 \`sha-abc1234\` 这样的**不可变**tag（回滚锚点）；同时 latest 指针指向最新。回滚时改 \`.env.prod\` 的 \`IMAGE_TAG\` 换成旧 sha 即可。

## 对照文件

- \`.github/workflows/deploy.yml\` —— 部署 workflow
- \`.github/workflows/ci.yml\` —— PR 时的质量门（lint + typecheck + build）
- \`deploy/docker-compose.prod.yml\` —— 生产用的 docker compose
- \`deploy/README.md\` —— CVM 首次准备手册`,
          },
        ],
      },
      {
        slug: "github-workflow",
        title: "GitHub Workflow 深入：怎么工作、怎么操作",
        summary: "CI/CD workflow 文件的语法、触发规则、日常运维（回滚、重试、seed）",
        sections: [
          {
            kind: "text",
            content: `# GitHub Workflow 深入：怎么工作、怎么操作

> **回顾**：上一章讲了部署链路的架构。  
> **本章**：深入 GitHub Actions workflow —— 日常怎么触发、观察、回滚、重跑。  
> **为什么**：架构懂了不够，还要会日常操作。这一章教你把 CI/CD 用起来。


上一章讲了部署的架构，这一章讲**你日常怎么和它互动**。

## Workflow 文件在哪

打开仓库的 \`.github/workflows/\` 目录，本项目有两个 workflow：

- \`ci.yml\` —— 触发条件：**非 main 分支的 push**、**PR 到 main**。做 lint + typecheck + build，是"质量门"，红了不能合并
- \`deploy.yml\` —— 触发条件：**main 分支 push**、**手动触发**。做构建镜像 + 部署到 CVM

一个 workflow 由多个 **job** 组成，每个 job 里若干 **step**。

## Workflow YAML 长什么样

打开 \`.github/workflows/deploy.yml\`，几个关键字段：

\`\`\`yaml
on:                    # 触发条件
  push:
    branches: [main]
  workflow_dispatch:   # 允许手动触发
    inputs:
      run_seed:
        type: choice
        options: ["false", "true"]

permissions:           # 这个 workflow 需要的权限
  contents: read
  packages: write

jobs:
  build:               # job 名
    runs-on: ubuntu-latest   # 跑在 GitHub 的免费机器
    strategy:
      matrix:
        service: [api, web]  # 并行两个：一个跑 api、一个跑 web
    steps:
      - uses: actions/checkout@v4
      - uses: docker/build-push-action@v6
        with: ...

  deploy:              # 另一个 job
    needs: build       # 等 build 完成
    runs-on: self-hosted   # 跑在 CVM 上（自托管 runner）
    steps:
      - run: docker compose ...
\`\`\`

## 触发方式与场景

| 你做的事 | 触发的 workflow | 结果 |
|---|---|---|
| \`git push origin feature-x\` | \`ci.yml\` | 跑 lint + typecheck + build |
| 开 PR 到 main | \`ci.yml\` | 同上，PR 页面会显示绿/红 |
| PR 合并（推到 main） | \`deploy.yml\` | 构建镜像 → 推 TCR → 派任务给 self-hosted runner → 部署 |
| 手动 Run workflow（Actions UI）| \`deploy.yml\` | 可以只跑 build+seed，跳过 deploy |

## 日常操作 1：观察进度

1. 打开 \`https://github.com/<owner>/<repo>/actions\`
2. 左侧选 workflow 名（Deploy / CI）
3. 点最新那次运行，能看到每个 job 的日志
4. 展开每一 step 看具体输出（比如 \`Build & push\` 里的 docker build 完整日志）

## 日常操作 2：Re-run 失败任务

任何一次运行如果失败：

- 打开那次 run 的详情页
- 右上角 **Re-run failed jobs** —— 只重跑失败的 job（build 成功、deploy 失败时最有用）
- 或 **Re-run all jobs** —— 全部重跑

**不需要重新 push**。适合"临时网络问题"、"上游 registry 抽风"这类。

## 日常操作 3：Rollback（回滚版本）

假设 main 的最新版本有 bug，想回退到上一 sha：

1. 打开 https://github.com/mur-yuanpei/web-dev-tutorial/actions 找到上一个绿色的 deploy run
2. 记住那次的 short SHA（比如 \`sha-a1b2c3d\`）
3. SSH（或 WebShell）到 CVM，作为 runner 用户：
   \`\`\`bash
   cd /opt/web-tutor
   sed -i 's|^IMAGE_TAG=.*|IMAGE_TAG=sha-a1b2c3d|' .env.prod
   docker compose --env-file .env.prod -f docker-compose.prod.yml pull api web
   docker compose --env-file .env.prod -f docker-compose.prod.yml up -d api web
   \`\`\`

镜像 tag 是不可变的，永远拉得回来。

## 日常操作 4：手动触发 seed

改了 seed.ts 的教程内容后，正常部署**不会重灌 seed**（幂等设计）。要同步到线上：

1. 打开 \`https://github.com/<owner>/<repo>/actions/workflows/deploy.yml\`
2. 右上角 **Run workflow** 按钮
3. \`run_seed\` 选 **true** → Run

这会触发独立的 seed job（\`docker compose run --rm api bun run apps/api/src/db/seed.ts --force\`），线上课程内容立即刷新。

## 日常操作 5：看 runner 状态

如果 deploy job 一直卡在 "Requested labels: self-hosted, Waiting for a runner"：

- 打开 \`https://github.com/<owner>/<repo>/settings/actions/runners\`
- 看你的 runner 是不是 **Idle 绿点**
- 如果 **Offline**，SSH 到 CVM 跑 \`sudo systemctl status "actions.runner.*"\`

## Secrets 与环境变量

Workflow 里的 \`\${{ secrets.TCR_PASSWORD }}\` 引用来自：

- 仓库 → Settings → Secrets and variables → Actions

**Secrets 不可查看**（只能覆盖或删除），这是 GitHub 的安全设计。

本项目现有的 secrets：

- \`TCR_USERNAME\` —— 腾讯云 TCR 登录用户名
- \`TCR_PASSWORD\` —— TCR 密码

\`GITHUB_TOKEN\` 是内建的、每次 workflow 自动生成、用完销毁 —— 不需要你配。

## Workflow 出错的调试思路

按顺序检查：

1. **哪个 step 红？** 展开日志看具体报错
2. **是网络问题吗？** 试 Re-run all jobs
3. **是 secret 过期吗？** 常见于 docker login 报 401 —— 更新对应 secret
4. **是代码错误吗？** 拉最新代码本地 \`bun run lint && bun run typecheck && bun run build\`
5. **是 runner 挂了吗？** 检查 CVM 上 \`systemctl status\`

## 对照文件

- \`.github/workflows/ci.yml\` —— CI 完整配置
- \`.github/workflows/deploy.yml\` —— Deploy 完整配置

打开来读，配合本章讲的语法即可看懂每一行。`,
          },
          {
            kind: "note",
            content:
              "💡 **推荐练习**：打开一个 PR 分支（`git checkout -b test-ci`），故意加一行有 lint 错误的代码 push 上去。观察 CI workflow 变红、错误信息、修正后变绿的整个流程。这是理解 CI 最快的方式。",
          },
        ],
      },
      {
        slug: "what-next",
        title: "下一步：拿这个脚手架做点什么",
        summary: "学完之后可以扩展的方向，以及给自己的小挑战",
        sections: [
          {
            kind: "text",
            content: `# 下一步：拿这个脚手架做点什么

> **回顾**：上一章讲完了部署的日常操作。  
> **本章**：本门课的收尾 —— 学完之后可以往哪些方向扩展。  
> **为什么**：教程只是起点。这一章帮你想清楚下一步。


学完本教程 = 你已经具备做一个**真实的、能上线的**全栈项目的能力。这个项目本身就是脚手架，clone 一份、改成你自己的业务就行。

## 建议的扩展方向

**用户认证**：加登录/注册、session cookie 或 JWT、\`/api/auth/*\` 路由。生产项目几乎必备。推荐先看 \`better-auth\` 或手写 session。

**测试**：加 Vitest 单元测试、Playwright 端到端测试。CI workflow 加一步测试就自动化了。

**监控**：接入 Sentry（错误上报）+ Better Stack（日志/正常运行时间）。

**多环境**：加 staging 环境。走一个 \`deploy-staging.yml\` 部署到不同域名/端口，改动先上 staging 验证。

**CDN**：前端静态资源走 CDN（如腾讯云 CDN 或 Cloudflare）。响应变快、CVM 减压。

**Redis 缓存**：加一个 redis 容器，热点查询（如首页课程列表）缓存 5 分钟。

## 小挑战

给自己出几道题：

1. **加一个 Demo**：在留言板 Demo 旁边加个"随机颜色"Demo —— 前端按钮，后端返回随机 hex 色。你能独立完成，就把 seed / 前端 / 后端 / API 客户端都摸清楚了。
2. **改一个页面**：把首页改成两栏布局，左边课程卡片、右边侧栏"最近学习"。
3. **写一门课**：seed.ts 里加一门你想学的东西的课程（比如 Docker 深入、Redis 入门）。
4. **改 CI**：加一步"如果测试失败自动创建 issue 通知我"。

**动手是最快的学习方式**。从这里出发，你已经上路了。`,
          },
          {
            kind: "note",
            content:
              "🎓 **恭喜你走完全程**。这个项目从零到部署上线，用到的每一个技术都是当下行业主流。把源码作为参考、把 seed 作为速查手册，去做你的第一个真实项目吧。",
          },
        ],
      },
    ],
  },
  {
    slug: "use-scaffold",
    title: "使用脚手架开发指南",
    description: "拿这个仓库起一个真实项目 —— 从 fork 到上线的每一步实操",
    chapters: [
      {
        slug: "overview",
        title: "开工前：想清楚你要做什么",
        summary: "脚手架不是万能的 —— 先确认适不适合，再动手",
        sections: [
          {
            kind: "text",
            content: `# 开工前：想清楚你要做什么

> **回顾**：上一门课让你从整体理解了这个项目。  
> **本章**：开始讲实操 —— 如何把这个仓库作为脚手架起你自己的真实项目。  
> **为什么**：教程学完，你需要"能从零开一个自己的项目"。这一课就是那个动手指南。


这个脚手架预装了什么：

- **前端**：React 18 + Vite + Tailwind v4 + React Router v7 + shadcn/ui
- **后端**：Hono + Drizzle ORM + PostgreSQL
- **工程化**：Bun + Turborepo + Biome + TypeScript
- **部署**：Docker + docker compose + 腾讯云 CVM + GitHub Actions (self-hosted runner) + 腾讯云 TCR

**什么时候适合用它？**

- 你要做一个"网页 + 服务端 + 数据库"的应用（博客、留言板、Todo、内容管理、后台管理...）
- 需要用户看到界面、能保存数据、能长期部署
- 想直接跳过"选技术栈、搭工程"，专注写业务

**什么时候不适合？**

- **只做纯静态站点**（个人主页、文档站）→ 用 Astro / Next.js Static Export 更轻
- **不需要数据库** → 你不需要 Drizzle / PostgreSQL 这一层
- **超高并发（万级 QPS）** → 需要 Redis、消息队列、分布式架构，本脚手架未包含
- **移动端 App** → 本脚手架是 Web，不是 React Native

## 你要做的准备

1. **本地**：装好 [Bun](https://bun.sh) 和 [Docker Desktop](https://www.docker.com/products/docker-desktop/)（前面工程化课程讲过 Bun；Docker 是"运行容器的软件"，装完开机启动即可）
2. **GitHub 账号**：托管代码、跑 Actions（免费够用）
3. **一台服务器**（可选，只在最后部署时才需要）：腾讯云 CVM 学生机月付百来块。**本地开发不需要**
4. **一小时不被打扰的时间**跑通完整流程

**不必现在就买服务器**。前面几章都能在本地跑，感觉合适再买。

## 学习节奏建议

这门课分 6 章，按顺序做能顺利跑通：

- **本章**：想清楚"要不要用"
- **第 1 步**：clone + 改远端
- **第 2-4 步**：改造业务代码（schema / API / 前端）
- **第 5 步**：服务器准备
- **第 6 步**：首次部署
- **第 7 步**：后续运维

每一章都是**能立即验证**的小步骤，卡住了停下来找问题，不要跳。`,
          },
          {
            kind: "note",
            content:
              '💡 **建议**：第一次用脚手架时，**不要**改任何配置，先端到端跑通"clone → 本地起 → 部署上线"这一遍。**跑通之后**再去改成你自己的业务，遇到问题你能定位到是哪一步出错。',
          },
        ],
      },
      {
        slug: "clone-and-init",
        title: "第 1 步：Clone 与初始化",
        summary: "把脚手架拉到本地、改远端仓库、改项目名",
        sections: [
          {
            kind: "text",
            content: `# 第 1 步：Clone 与初始化

> **回顾**：上一章讲了这门课的整体思路。  
> **本章**：第 1 步：clone 仓库、换远端、改项目名。  
> **为什么**：先把脚手架变成"你的项目名字"，再谈业务改造。


## 在 GitHub 上创建新仓库

先在 https://github.com/new 新建一个空仓库（**不要**初始化 README），叫 \`my-awesome-app\` 之类。

## Clone 脚手架，替换远端

\`\`\`bash
# 拉到你希望的位置
git clone https://github.com/mur-yuanpei/web-dev-tutorial.git my-awesome-app
cd my-awesome-app

# 把 origin 换成你自己的空仓库
git remote set-url origin https://github.com/<你的用户名>/my-awesome-app.git

# 首次推送
git push -u origin main
\`\`\`

现在 GitHub 上你的仓库有完整脚手架代码。

## 改项目名

用编辑器全局搜索替换 \`web-dev-tutorial\` 为 \`my-awesome-app\`，**主要涉及**：

- 根 \`package.json\` 的 \`"name"\`
- 根 \`README.md\` 顶部标题
- \`docker-compose.yml\` 的 \`container_name\` 与 \`volumes.pgdata.name\`
- \`deploy/docker-compose.prod.yml\` 的 \`container_name\` 与 \`volumes\`
- \`deploy/README.md\` 里出现的项目名

**不要**改的地方：

- workspace 包名 \`@app/api\` / \`@app/web\` / \`@app/shared\` 保持原样即可（本来就是通用名，改起来牵一发动全身）
- \`packages/shared/src/types.ts\` 里的字段名（这是你后面才要动的业务层）

## 验证

\`\`\`bash
bun install   # 装依赖，秒完成
\`\`\`

没报错就说明脚手架代码在你这里跑起来了。下一章开始动业务。`,
          },
        ],
      },
      {
        slug: "schema-and-seed",
        title: "第 2 步：定义你的业务数据",
        summary: "改 schema.ts + 清 seed.ts + 生成 migration",
        sections: [
          {
            kind: "text",
            content: `# 第 2 步：定义你的业务数据

> **回顾**：上一章你已经把仓库改名并 push 到自己的 GitHub 了。  
> **本章**：第 2 步：改 schema 定义你的业务数据 + 清空教程内容的 seed。  
> **为什么**：任何业务的基础都是"我要存什么数据"。先定数据模型，后面的 API 和前端就有了依据。


改造从"数据"开始。定义好数据长什么样，后面的 API 和前端就有了依据。

## 2.1 改 schema

打开 \`apps/api/src/db/schema.ts\`。里面现在有 4 张教学表（courses / chapters / sections / demo_events）。

**先全删**，换成你的业务表。示例做一个博客：

\`\`\`ts
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type PostRow = typeof posts.$inferSelect;
\`\`\`

## 2.2 清 seed

打开 \`apps/api/src/db/seed.ts\`，\`SEED\` 数组内容全删。有初始数据要灌就改成自己的插入逻辑；没有就留一个空 main 骨架也行。

## 2.3 应用到数据库

\`\`\`bash
bun run db:reset       # 推倒重来（会删掉现有数据）
bun run db:generate    # 生成新的 migration SQL
bun run db:migrate     # 应用
\`\`\`

## 2.4 验证

\`\`\`bash
docker exec -it web-tutor-postgres psql -U dev -d webtutor
\`\`\`

进去后：

\`\`\`sql
\\dt              -- 应该只看到 posts 表和 __drizzle_migrations
\\d posts         -- 看看字段是否正确
\`\`\`

## 一个陷阱

**\`db:reset\` 会清库**！只在开发早期项目还没上线时用。项目一旦上线，改 schema 要走**增量迁移**（新建 migration 文件而非 reset）。

## 走到这一步你做了什么

- ✅ 定义了业务数据模型
- ✅ 生成了迁移文件（\`apps/api/drizzle/*.sql\`）
- ✅ 本地数据库表结构已就位

下一步：写 API 和共享类型。`,
          },
        ],
      },
      {
        slug: "api-and-shared",
        title: "第 3 步：写你的 API 和共享类型",
        summary: "换掉 apps/api/src/routes/*、更新 packages/shared/src/types.ts",
        sections: [
          {
            kind: "text",
            content: `# 第 3 步：写你的 API 和共享类型

> **回顾**：上一章你定义了业务数据模型。  
> **本章**：第 3 步：写你自己的 API 路由 + 共享类型。  
> **为什么**：有了数据模型，接下来暴露 API 让前端能读写它。


数据模型定义好了，接下来暴露 API 让前端能用。

## 3.1 删掉教学路由

\`apps/api/src/routes/\` 目录下现在有：

- \`courses.ts\` —— 课程查询
- \`chapters.ts\` —— 章节查询
- \`demo-sandbox.ts\` —— 三个 Demo 用的接口

**全删掉**。

## 3.2 新建 posts 路由

新建 \`apps/api/src/routes/posts.ts\`：

\`\`\`ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db/client.js";
import { posts } from "../db/schema.js";
import { createPostInput } from "@app/shared";

export const postsRoute = new Hono();

// GET /api/posts —— 列表
postsRoute.get("/", async (c) => {
  const rows = await db.select().from(posts);
  return c.json(rows);
});

// POST /api/posts —— 新建
postsRoute.post("/", zValidator("json", createPostInput), async (c) => {
  const input = c.req.valid("json");
  const [row] = await db.insert(posts).values(input).returning();
  return c.json(row, 201);
});
\`\`\`

## 3.3 挂载到 app

打开 \`apps/api/src/index.ts\`：

- 删除 \`import { coursesRoute } / { chaptersRoute } / { demoRoute }\`
- 删除 \`app.route("/api/courses", ...)\` 等挂载语句
- 加上：

\`\`\`ts
import { postsRoute } from "./routes/posts.js";
app.route("/api/posts", postsRoute);
\`\`\`

## 3.4 改共享类型

打开 \`packages/shared/src/types.ts\`。删掉旧的 courseSchema / chapterSchema / messageSchema 等，加你自己的：

\`\`\`ts
import { z } from "zod";

export const createPostInput = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1),
});
export type CreatePostInput = z.infer<typeof createPostInput>;

export const postSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  createdAt: z.string(),
});
export type Post = z.infer<typeof postSchema>;
\`\`\`

**关键**：这里定义的 \`createPostInput\` 前面 posts 路由 import 了、后面前端表单也会 import 一份，前后端**共用同一份校验规则**。

## 3.5 验证

\`\`\`bash
bun run typecheck    # 类型全过
bun run dev          # 起后端
\`\`\`

另开一个终端测：

\`\`\`bash
curl http://localhost:3000/api/posts
# 返回 []

curl -X POST http://localhost:3000/api/posts \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Hello","body":"World"}'
# 返回 { id: 1, title: "Hello", body: "World", createdAt: "..." }
\`\`\`

有响应就说明后端跑通了。

## 走到这一步你做了什么

- ✅ 定义了业务 API 端点
- ✅ 前后端共享的 schema 有了
- ✅ 后端能读写数据库

下一步：把前端页面换成你自己的。`,
          },
        ],
      },
      {
        slug: "frontend",
        title: "第 4 步：改前端页面",
        summary: "删教程页面，加你的路由和组件",
        sections: [
          {
            kind: "text",
            content: `# 第 4 步：改前端页面

> **回顾**：上一章你写好了自己的 API。  
> **本章**：第 4 步：删掉教程页面、写你自己的前端。  
> **为什么**：前端是用户直接看到的东西。改完这一步，你已经有一个能本地跑的完整应用。


后端准备好了，最后一步把前端页面换成你的业务。

## 4.1 删掉教程页面

\`apps/web/src/routes/\` 下有：

- \`home.tsx\`
- \`course.tsx\`
- \`chapter.tsx\`

**都删掉**。

顺手清掉：

- \`apps/web/src/components/Sidebar.tsx\` —— 教程用的左侧目录树，你的业务大概率不需要
- \`apps/web/src/components/MarkdownRenderer.tsx\` —— 教程用的
- \`apps/web/src/components/demos/\` 整个目录 —— 三个教学 Demo

## 4.2 新建你的页面

新建 \`apps/web/src/routes/posts.tsx\`：

\`\`\`tsx
import { useLoaderData } from "react-router";
import type { Post } from "@app/shared";
import { api } from "../lib/api.js";

export async function postsLoader(): Promise<Post[]> {
  return await api.listPosts();
}

export function PostsPage() {
  const posts = useLoaderData() as Post[];
  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((p) => <li key={p.id}>{p.title}</li>)}
      </ul>
    </div>
  );
}
\`\`\`

## 4.3 注册路由

打开 \`apps/web/src/main.tsx\`。删掉教程路由 import，改成：

\`\`\`tsx
import { PostsPage, postsLoader } from "./routes/posts.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <PostsPage />, loader: postsLoader },
    ],
  },
]);
\`\`\`

## 4.4 更新 API 客户端

打开 \`apps/web/src/lib/api.ts\`。删掉旧的 listCourses / getCourse 等方法，加：

\`\`\`ts
import type { Post, CreatePostInput } from "@app/shared";

export const api = {
  listPosts: () => request<Post[]>("/api/posts"),
  createPost: (input: CreatePostInput) =>
    request<Post>("/api/posts", {
      method: "POST",
      body: JSON.stringify(input),
    }),
};
\`\`\`

## 4.5 精简 root.tsx

\`apps/web/src/root.tsx\` 里有教程用的顶栏 + 侧栏。把 Sidebar 相关 import 和 JSX 都删掉，改成简单的顶栏 + \`<Outlet />\`。

## 4.6 验证

\`\`\`bash
bun run dev
\`\`\`

浏览器打开 http://localhost:5173，看到你的 Posts 页面就成了。

## 一个建议

如果你想用 shadcn 组件（比如按钮、表单、卡片），随时：

\`\`\`bash
bunx shadcn add button card form input
\`\`\`

组件会到 \`apps/web/src/components/ui/\`，import 后直接用。

## 走到这一步你做了什么

- ✅ 前端只有你的业务代码，没有教程残留
- ✅ 页面能拉后端数据、能提交表单
- ✅ 本地端到端跑通

**这一步之后，你已经有一个可以工作的应用**。下面两步是让它跑到公网上让别人也能访问。`,
          },
          {
            kind: "note",
            content:
              "⚠️ **改动别一口气**：每完成一个步骤（2.1、2.2...）就 `bun run typecheck` 或刷新浏览器验证。一口气改完再启动，出错定位极痛苦。",
          },
        ],
      },
      {
        slug: "server-setup",
        title: "第 5 步：准备服务器",
        summary: "分三个 checkpoint：CVM 就绪 → runner 上线 → 镜像仓库对接",
        sections: [
          {
            kind: "text",
            content: `# 第 5 步：准备服务器

> **回顾**：上一章你已经有一个本地能跑的完整应用。  
> **本章**：第 5 步：准备服务器 —— 买 CVM、装 Docker、装 self-hosted runner、配 TCR。  
> **为什么**：有了服务器才能让别人访问你的项目。这一步分三个 checkpoint，一步步来。


这一步要做的事**看起来多**，但拆成 3 个 checkpoint 后每步都很短。每个 checkpoint 都能独立验证"是否走到位"，卡住了停下来查问题、不要跳。

## ✅ Checkpoint A：CVM 能装 Docker、能建目录

### A.1 买一台 CVM

登录 https://console.cloud.tencent.com/cvm 买一台：

- **系统**：Ubuntu 22.04 LTS 或 TencentOS 3
- **配置**：2 核 2G / 40G SSD（学生够用；生产项目按需升）
- **网络**：绑公网 IP，带宽 1-3 Mbps
- **安全组**：开 \`TCP:22\`（SSH）、\`TCP:80\`（HTTP）；后期可加 443（HTTPS）

### A.2 装 Docker

SSH 或用腾讯云 WebShell 登录后：

\`\`\`bash
curl -fsSL https://get.docker.com | sh
sudo systemctl enable --now docker
docker --version   # 验证
\`\`\`

### A.3 建 runner 用户 + 部署目录

\`\`\`bash
sudo useradd -m -s /bin/bash runner
sudo usermod -aG docker runner
sudo mkdir -p /opt/web-tutor
sudo chown -R runner:runner /opt/web-tutor
id runner   # 应看到 groups 里有 docker
\`\`\`

**⚠️ 关键**：\`chown\` 目标一定是 **runner**，不是你自己的登录用户。GitHub Actions 派任务后是以 runner 身份写这个目录的。

**Checkpoint A 验收**：
\`\`\`bash
docker version && ls -la /opt/web-tutor && id runner | grep docker
# docker 有版本、目录属于 runner、runner 在 docker 组
\`\`\`

三个都对 → Checkpoint A 通过 ✅

---

## ✅ Checkpoint B：GitHub Runner 连上、显示 Idle

### B.1 GitHub 侧创建 runner

打开你 GitHub 仓库 → **Settings → Actions → Runners → New self-hosted runner**。

选 Linux + x64。页面会给一段"三行命令"（download / config），复制备用。

### B.2 CVM 侧配置 runner

**以 runner 用户操作**：

\`\`\`bash
sudo -iu runner
mkdir actions-runner && cd actions-runner
# 粘贴 GitHub 给的 download 命令（curl -O ...）
# 粘贴 tar xzf ... 命令
./config.sh --url https://github.com/<你>/<你的仓库> --token <一次性 token>
# 一路回车用默认值
\`\`\`

### B.3 装成 systemd 服务

**退出 runner 用户**，用有 sudo 的用户：

\`\`\`bash
exit   # 退出 runner shell
cd /home/runner/actions-runner
sudo ./svc.sh install runner
sudo ./svc.sh start
sudo ./svc.sh status
\`\`\`

**Checkpoint B 验收**：
- 服务器上 \`sudo ./svc.sh status\` 显示 \`active (running)\`
- GitHub → Settings → Actions → Runners 页面看到你的 runner 显示 **🟢 Idle**

两个都对 → Checkpoint B 通过 ✅

---

## ✅ Checkpoint C：TCR 镜像仓库对接完成

### C.1 开通 TCR 实例

打开 https://console.cloud.tencent.com/tcr 开通企业版实例（个人版也行）。**在实例里新建一个命名空间**（比如 \`my-awesome-app\`）。

### C.2 生成长期访问凭证

进 **访问凭证**页面，生成一个**长期凭证**：

- 用户名：一串数字（UIN，例如 \`100037629375\`）
- 密码：一次生成、只显示一次的字符串 —— **立刻复制保存**

### C.3 凭据写到 GitHub secrets

打开仓库 → Settings → Secrets and variables → Actions：

- 新建 \`TCR_USERNAME\` = 你的 UIN
- 新建 \`TCR_PASSWORD\` = 你刚生成的密码

### C.4 凭据也写到 CVM 上（让 runner 能 pull）

以 runner 用户：

\`\`\`bash
sudo -iu runner
echo "你的密码" | docker login <你的实例>.tencentcloudcr.com -u <你的UIN> --password-stdin
# 看到 Login Succeeded 就成
\`\`\`

### C.5 写 .env.prod

**以 runner 用户**：

\`\`\`bash
cat > /opt/web-tutor/.env.prod <<'EOF'
POSTGRES_DB=my_app_db
POSTGRES_USER=dev
POSTGRES_PASSWORD=改成强密码
IMAGE_TAG=latest
IMAGE_REGISTRY=<你的 TCR 实例>.tencentcloudcr.com/<命名空间>/
EOF
\`\`\`

### C.6 改代码里的 registry 引用

打开 \`.github/workflows/deploy.yml\`，顶部 \`env\` 里改成你自己的 REGISTRY 和 NAMESPACE：

\`\`\`yaml
env:
  REGISTRY: <你的TCR>.tencentcloudcr.com
  NAMESPACE: <你的命名空间>
\`\`\`

打开 \`deploy/docker-compose.prod.yml\`，把镜像名 \`web-dev-tutorial-api\` / \`web-dev-tutorial-web\` 改成你的项目名（比如 \`my-app-api\` / \`my-app-web\`）。

**Checkpoint C 验收**：
- GitHub secrets 页面看到 \`TCR_USERNAME\`、\`TCR_PASSWORD\`
- CVM 上 \`sudo -iu runner cat ~/.docker/config.json\` 有 TCR 域名的条目
- \`cat /opt/web-tutor/.env.prod\` 有 \`IMAGE_REGISTRY\` 一行
- workflow 和 compose 文件里的镜像名都是你的项目名

四项都对 → Checkpoint C 通过 ✅

---

**服务器和 CI 都配好了**。下一章：push 触发首次部署。`,
          },
          {
            kind: "note",
            content:
              "🔒 **安全提醒**：这一步没让你在 CVM 上开公网 SSH 端口 —— 因为 self-hosted runner 是 CVM 主动连 GitHub 的**长连接**，服务器不需要对外开放。如果确实需要偶尔 SSH 上服务器排查，把 22 端口限制在你**自己的公网 IP**（安全组来源填 `你的IP/32`），不要 `0.0.0.0/0`。",
          },
        ],
      },
      {
        slug: "first-deploy",
        title: "第 6 步：首次部署与验证",
        summary: "从 push main 到浏览器访问 —— 端到端跑通一遍",
        sections: [
          {
            kind: "text",
            content: `# 第 6 步：首次部署与验证

> **回顾**：上一章你把服务器和 CI 都配好了。  
> **本章**：第 6 步：push main 触发首次自动部署，用 IP 访问看到你的应用。  
> **为什么**：见证脚手架的力量 —— 一条 push 命令，几分钟后你的应用就在公网上了。


前 5 步都做完了，现在见证脚手架的力量。

## 6.1 触发部署

\`\`\`bash
git add .
git commit -m "首次部署"
git push origin main
\`\`\`

## 6.2 观察 GitHub Actions

打开 \`https://github.com/<你>/<你的仓库>/actions\`

你会看到一个新 workflow run 开始跑：

- **build (api)** + **build (web)** 并行跑（3-5 分钟）—— 构建镜像并推到 TCR
- **deploy** —— 派到你 CVM 的 runner，本地跑 docker compose pull + migrate + up

如果哪一步红了，展开日志看错误，参考"GitHub Workflow 深入"那一章的调试思路。

## 6.3 首次部署时要额外做的事

**首次部署数据库是空的，需要跑一次 migrate**。

deploy workflow 里已经内建这一步（\`docker compose run --rm api bun run apps/api/src/db/migrate.ts\`），所以你什么都不用做，push 完 workflow 自动搞定。

**如果你有初始数据要灌（seed）**：

- 打开 \`https://github.com/<你>/<你的仓库>/actions/workflows/deploy.yml\`
- 右上角 **Run workflow**
- \`run_seed\` 选 **true** → Run

seed job 会独立跑，把你 seed.ts 里的数据灌到线上数据库。

## 6.4 访问验证

打开浏览器：

\`\`\`
http://<你的 CVM 公网 IP>/
\`\`\`

看到你的应用界面 = 🎉 成功。

同时测试 API：

\`\`\`bash
curl http://<你的 CVM 公网 IP>/api/health   # 应返回 {"ok":true}
curl http://<你的 CVM 公网 IP>/api/posts    # 你的业务 API
\`\`\`

## 6.5 后续每次 push

\`\`\`bash
git commit -am "改了 xxx"
git push origin main
\`\`\`

不需要任何额外操作，workflow 自动构建 + 部署。

## 6.6 如果部署失败了

按 "GitHub Workflow 深入" 那一章的调试思路：

1. 展开红色 step 的日志
2. 是网络问题 → Re-run failed jobs
3. 是代码问题 → 本地 \`bun run lint && bun run typecheck && bun run build\` 复现修复
4. 是配置问题 → 检查 secrets 是否正确
5. 是 runner 问题 → SSH 到 CVM 看 \`systemctl status "actions.runner.*"\`

## 你现在有了什么

- 一个可访问的公网应用
- push main 就自动部署的 CI/CD
- 一个能横向扩展的项目结构（加更多 api 路由 / 前端页面轻而易举）
- 一个可以按需回滚的部署链路（改 IMAGE_TAG 即可）

**这就是脚手架的价值**：把从 0 到 1 的琐碎配置压缩成 30 分钟，你专心写业务就好。

下一章：怎么持续维护和演进这个项目。`,
          },
        ],
      },
      {
        slug: "iterate-and-maintain",
        title: "第 7 步：持续迭代",
        summary: "加功能、加依赖、做数据库变更、维护和监控的日常",
        sections: [
          {
            kind: "text",
            content: `# 第 7 步：持续迭代

> **回顾**：上一章你的应用已经上线了。  
> **本章**：第 7 步：日常维护 —— 加功能、加依赖、改数据库、回滚、看日志、备份。  
> **为什么**：上线是开始，不是结束。这一章教你把项目当作长期资产持续演进。


上线只是开始。这一章讲**日常维护**中最常见的场景。

## 加一个新页面

- \`apps/web/src/routes/\` 加一个 \`.tsx\` 文件
- \`apps/web/src/main.tsx\` 里注册路由
- 前端 HMR 立即生效

## 加一个新 API 端点

- \`apps/api/src/routes/\` 加一个 \`.ts\` 文件或改现有的
- \`index.ts\` 里 \`app.route(...)\` 挂载
- Bun \`--watch\` 会自动重启

## 加一张数据库表

\`\`\`bash
# 1. 改 apps/api/src/db/schema.ts 加表定义
# 2. 生成迁移
bun run db:generate
# 会生成新的 drizzle/xxxx.sql
# 3. 本地应用
bun run db:migrate
# 4. commit + push
# 5. 生产环境 deploy workflow 会自动跑 migrate
\`\`\`

**关键规则**：drizzle 生成的 migration 文件**不要手动改**、**不要删**。它们代表数据库结构的历史。

## 加一个 shadcn 组件

\`\`\`bash
bunx shadcn add dialog
# 会把 dialog 源码复制到 apps/web/src/components/ui/dialog.tsx
\`\`\`

## 加一个依赖

\`\`\`bash
# 装到前端
cd apps/web && bun add lodash-es

# 装到后端
cd apps/api && bun add ioredis

# 装到共享
cd packages/shared && bun add zod
\`\`\`

装完 commit \`bun.lock\` 一起 push，CI 会用同样的锁文件装依赖。

## 改环境变量

- **本地**：改根 \`.env\`
- **生产**：SSH 到 CVM，改 \`/opt/web-tutor/.env.prod\`，然后：
  \`\`\`bash
  sudo -iu runner
  cd /opt/web-tutor
  docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --force-recreate api
  \`\`\`

## 回滚版本

上一版有 bug 要退回：

1. 打开 GitHub Actions 页面找上一个绿色 run 的 short SHA
2. SSH 到 CVM：
   \`\`\`bash
   sudo -iu runner
   cd /opt/web-tutor
   sed -i 's|^IMAGE_TAG=.*|IMAGE_TAG=sha-a1b2c3d|' .env.prod
   docker compose --env-file .env.prod -f docker-compose.prod.yml pull api web
   docker compose --env-file .env.prod -f docker-compose.prod.yml up -d api web
   \`\`\`

镜像 tag 是不可变的，永远拉得回来。

## 看日志

\`\`\`bash
# 以 runner 用户
cd /opt/web-tutor

# API 实时日志
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f api

# nginx access log
docker compose --env-file .env.prod -f docker-compose.prod.yml logs --tail 100 web

# pg 慢查询
docker compose --env-file .env.prod -f docker-compose.prod.yml logs postgres
\`\`\`

## 备份数据库

\`\`\`bash
# 手动 dump
docker exec web-tutor-postgres pg_dump -U dev <你的库名> | gzip > /backup/$(date +%F).sql.gz

# 定时（crontab -e 里）
0 3 * * * docker exec web-tutor-postgres pg_dump -U dev <你的库名> | gzip > /backup/$(date +\\%F).sql.gz
\`\`\`

## 何时考虑升级架构

以下信号出现时，考虑加东西：

- **CPU/内存持续 > 70%** → 加机器 or 切 K8s
- **DB 查询慢** → 加 Redis 缓存热点数据
- **前端资源慢** → 上 CDN
- **单节点风险高** → 加 nginx 前端 + 多台 CVM 冗余
- **需要认证** → 接入 better-auth 或写 session 层

脚手架不会阻止你演进 —— 前面每一步的选型都是"能长大的"。

## 恭喜

你已经具备了做一个真实全栈项目从 0 到线上、并且长期维护它的完整能力。**接下来最需要的不是学更多技术，而是做出你的第一个真实产品**。`,
          },
          {
            kind: "note",
            content:
              "🎓 **完结**：从 clone 到部署到迭代，脚手架帮你省下的时间应该都用来打磨产品体验。祝你早日做出让自己自豪的项目。",
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
  // 幂等：只在空库时灌入。这样每次部署都可以无脑跑一遍 seed，
  // 首次生效、之后自动跳过。
  //
  // 想强制重灌（比如你改了 seed.ts 的教程内容想同步到线上）？
  //   docker compose ... run --rm api bun run apps/api/src/db/seed.ts --force
  const force = process.argv.includes("--force");
  const [existing] = await db.select().from(courses).limit(1);
  if (existing && !force) {
    console.log("⏭  数据库已有课程数据，跳过 seed（如需重灌请加 --force）");
    process.exit(0);
  }

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
