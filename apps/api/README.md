# @app/api · 后端 API

> Hono + Drizzle + PostgreSQL 的现代 Node/Bun 后端

## 技术栈

| 用途 | 技术 | 说明 |
|---|---|---|
| 运行时 | **Bun 1.3.11**（生产 Docker 用 `oven/bun:1.3.11-alpine`） | 直接跑 TS，dev 用 `bun run --watch` 自动重启 |
| Web 框架 | **[Hono](https://hono.dev) 4.6** | 现代极简，跨运行时（Bun/Node/Deno/Cloudflare 都能跑） |
| Node 兼容 | **`@hono/node-server`** | 让 Hono 在 Bun / Node 里当 HTTP server |
| 请求校验 | **`@hono/zod-validator`** + **Zod 3.24** | body/query 用 zod schema 声明式校验 |
| ORM | **[Drizzle ORM](https://orm.drizzle.team) 0.38** | 类型安全的 SQL 构造器（贴近 SQL、不做黑盒抽象） |
| 数据库 | **PostgreSQL 16-alpine**（Docker） | 生产用真 pg；测试用 [pglite](https://pglite.dev)（WASM in-memory） |
| DB 可视化 | **[pgweb](https://sosedoff.github.io/pgweb/)** | 本地开发环境的浏览器数据库管理界面（http://localhost:8081，零登录） |
| pg 客户端 | **`postgres` 3.4**（postgres-js） | Drizzle 底下的连接池 |
| 迁移工具 | **drizzle-kit 0.30** | 由 `schema.ts` 生成 SQL migration |
| 共享类型 | **`@app/shared`**（workspace） | zod schema + TS 类型，前后端复用 |
| 环境变量 | **dotenv 16** + zod 启动校验 | 缺关键变量启动即报错 |
| 测试 | **Vitest 2** | 单测 + 集成测试 |
| 测试 DB | **`@electric-sql/pglite` 0.2** | in-memory Postgres WASM，测试用 |

## 目录结构

```
apps/api/
├── src/
│   ├── app.ts              # Hono app 定义（导出 app，无 server 启动）
│   ├── index.ts            # 入口 · 只做 serve(app.fetch)
│   ├── env.ts              # 环境变量 + zod 校验
│   ├── db/
│   │   ├── client.ts       # Drizzle client（支持测试注入）
│   │   ├── schema.ts       # 表定义（Drizzle）+ relations
│   │   ├── migrate.ts      # migration 执行器
│   │   └── seed.ts         # 教程内容 seed（幂等，支持 --force）
│   └── routes/
│       ├── courses.ts      # /api/courses 课程
│       ├── chapters.ts     # /api/chapters/:slug 章节详情
│       ├── demo-sandbox.ts # /api/demo/* Demo 沙盒（hello/click/messages）
│       └── *.test.ts       # 每个路由的集成测试（用 pglite）
├── test/
│   └── setup.ts            # vitest setup · 起 pglite、注入 db、清表
├── drizzle/                # drizzle-kit 生成的 migration SQL（提交到 git）
├── Dockerfile              # 多阶段构建：deps → builder → runner
├── drizzle.config.ts       # drizzle-kit 配置
├── vitest.config.ts        # 单 fork + 环境变量兜底
├── package.json
└── tsconfig.json
```

## 快速开始

**前提**：先在仓库根跑 `bun install`、`bun run db:up`。

```bash
# 从仓库根跑
bun --filter @app/api dev          # 启动 API（http://localhost:3000）
bun --filter @app/api typecheck    # 类型检查
bun --filter @app/api test         # 跑测试

# 数据库相关（从根跑）
bun run db:generate    # schema 变更后生成 migration
bun run db:migrate     # 应用 migration
bun run db:seed        # 灌入教程内容
```

## 关键设计

### app.ts / index.ts 拆分

**`app.ts`** 只定义 Hono app（挂中间件 + 路由），**导出 `app`**。
**`index.ts`** 只做 `serve(app.fetch)` 启动 HTTP server。

这样测试能 `import { app } from "./app.js"` 用 `app.request()` 内存里发请求，**不启动 server**。

### db/client.ts 的可测试设计

生产环境 `db` 是 postgres-js + Drizzle 组合；测试环境 `test/setup.ts` 用 pglite 替换整个 db 实例。用一个 `setTestDb()` + Proxy 实现，**不侵入业务代码**（业务代码永远只 `import { db }`）。

### 前后端共享 schema

`@app/shared` 里定义的 zod schema（如 `createMessageInput`）：
- **前端**：表单校验、TypeScript 类型推导
- **后端**：`zValidator("json", createMessageInput)` 中间件自动校验请求

一份定义，两端使用。

## API 端点一览

| 方法 | 路径 | 用途 |
|---|---|---|
| GET | `/api/health` | 健康检查 |
| GET | `/api/courses` | 课程列表 |
| GET | `/api/courses/tree` | 完整课程 + 章节树（侧栏用） |
| GET | `/api/courses/:slug` | 单课程详情 + 章节列表 |
| GET | `/api/chapters/:slug` | 章节详情 + 前后导航 |
| GET | `/api/demo/hello` | Demo · hello 世界 |
| GET | `/api/demo/click` | Demo · 读点击数 |
| POST | `/api/demo/click` | Demo · +1 点击数 |
| GET | `/api/demo/messages` | Demo · 留言板列表 |
| POST | `/api/demo/messages` | Demo · 发一条留言 |

## 数据库表

| 表 | 用途 |
|---|---|
| `courses` | 课程（本次教程 11 门） |
| `chapters` | 章节（每门课程若干章） |
| `sections` | 段落（章节内的 markdown 段：text/code/note） |
| `demo_events` | Demo 交互数据（click 计数 / 留言等） |

关系：`courses` 1..N `chapters` 1..N `sections`。级联删除。

## Docker

生产镜像用**多阶段构建**：
1. `deps` 阶段：装依赖
2. `builder` 阶段：typecheck
3. `runner` 阶段：只保留生产运行时（`oven/bun:1.3.11-alpine`）

镜像里 `CMD ["bun", "run", "apps/api/src/index.ts"]`，暴露 3000 端口，带 `HEALTHCHECK` 打 `/api/health`。

## 教学附加值

- `src/db/schema.ts` —— 数据库设计课的活样例（主键 / 外键 / 索引 / jsonb / pgEnum）
- `src/routes/demo-sandbox.ts` —— 请求校验（zValidator）实战
- `test/setup.ts` —— pglite 集成测试模式
- `app.ts` / `index.ts` 拆分 —— 可测试架构范式

每个文件顶部都有中文注释。
