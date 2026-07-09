# Web 开发启蒙教程 · 项目脚手架

面向大一学生的 Web 全栈开发启蒙项目。

**它有双重身份：**

1. **教学内容载体** —— 项目跑起来之后，学生打开浏览器就能看到成体系的教程（前端基础 → React/Tailwind → 工程化 → 后端 → 数据库 → ORM），每章带可交互 Demo
2. **技术栈实战范本** —— 项目源码本身就是学生要学的现代 Web 工程。读源码就是读"如何搭一个真实项目"，未来可以直接把它 clone 下来当脚手架，做自己的第一个真实项目

## 技术栈

| 领域 | 选择 | 为什么 |
|---|---|---|
| 包管理 | **Bun** | 装依赖极快、原生支持 workspaces、能直接跑 TS 无需编译 |
| 任务编排 | **Turborepo** | 一条 `turbo dev` 起前后端；缓存构建产物；行业标准 |
| 前端构建 | **Vite** | 秒开的 dev 服务、原生 ESM、生态最好 |
| 前端框架 | **React 18** + **React Router v7** | 组件思维 + data-mode 路由，现代前端事实标准 |
| 前端样式 | **Tailwind CSS** | 在 HTML 里写 CSS，学生看得见每一行的效果 |
| 后端运行时 | **Node.js**（通过 Bun 跑 TS） | 生态最广，学生最容易上手 |
| 后端框架 | **Hono** | 现代、极简、类型强、比 Express 快 |
| 数据库 | **PostgreSQL 16** | 最经典的开源关系型数据库 |
| ORM | **Drizzle** | 贴近 SQL、类型安全、生成的查询你能看懂 |
| 请求校验 | **Zod** | 一份 schema 前后端都能用，运行时校验 + TS 类型 |

## 目录结构

```
web-dev-tutorial/
├── apps/
│   ├── web/                # React 前端 (Vite + Tailwind)
│   └── api/                # Hono 后端 (Drizzle + PostgreSQL)
├── packages/
│   └── shared/             # 前后端共享的类型与 zod schema
├── docker-compose.yml      # 一条命令起 PostgreSQL
├── turbo.json              # 任务编排
├── package.json            # workspaces 根
└── tsconfig.base.json      # 共享 TS 配置
```

## 学生上手三步

**准备：** 你需要装好 [Bun](https://bun.sh)、[Docker Desktop](https://www.docker.com/products/docker-desktop/)。

```bash
# 1. 装依赖
bun install

# 2. 复制环境变量文件（默认配置就能跑，不用改）
cp .env.example .env

# 3. 初始化数据库（起 pg → 建表 → 灌教程内容）
bun run db:up          # 启动 postgres 容器
bun run db:generate    # 首次运行：根据 schema 生成 migration SQL
bun run db:migrate     # 执行 migration，建表
bun run db:seed        # 灌入教程内容

# 4. 启动前后端
bun run dev
```

打开 [http://localhost:5173](http://localhost:5173)，你会看到教程首页。

后端 API 在 [http://localhost:3000](http://localhost:3000)，试试直接访问 [http://localhost:3000/api/health](http://localhost:3000/api/health) 看看后端在返回什么。

## 常用命令

```bash
# 开发
bun run dev              # 并行起前后端
bun run typecheck        # 全仓库类型检查
bun run build            # 生产构建

# 数据库
bun run db:up            # 启动 postgres 容器
bun run db:down          # 停止
bun run db:studio        # 打开 Drizzle Studio 可视化查看表
bun run db:reset         # 一键推倒重来（删库 → 重建 → 灌数据）

# 直接连数据库
docker exec -it web-tutor-postgres psql -U dev -d webtutor
```

## 学习路径建议

按项目内教程课程顺序：

1. **前端基础** —— HTML/CSS/JS 三件套
2. **React 与 Tailwind** —— 组件思维、Props/State、Tailwind 实用类
3. **工程化** —— Vite、Bun、monorepo、Turborepo
4. **后端入门** —— HTTP、Hono
5. **数据库设计** —— 为什么要用数据库、表关系、SQL
6. **Drizzle ORM 实战** —— 从字符串 SQL 到类型安全的查询

每章读完之后，**打开对应的源码文件**看一遍真实实现（README 中提到的路径都可以直接跳过去）。看代码是学习最快的方式。

## 部署到腾讯云

项目已配好完整的 GitHub Actions CI/CD：push 到 `main` 就会自动构建 Docker 镜像、推到 GHCR、SSH 到腾讯云 CVM 上完成 pull + migrate + up。详见 **[deploy/README.md](./deploy/README.md)** —— 里面讲清楚了：

- CVM 首次准备（装 Docker、生成 SSH 密钥、配 GitHub Secrets）
- 每次部署会发生什么
- 如何回滚
- 各种"为什么"的 FAQ

## 项目本身如何演进

想让学生做贡献？他们可以：

- **改章节内容**：编辑 `apps/api/src/db/seed.ts`，重跑 `bun run db:seed`
- **加一个新 Demo**：
  1. 在 `apps/api/src/routes/demo-sandbox.ts` 加一个新端点
  2. 在 `apps/web/src/components/demos/` 加一个新组件
  3. 在 `apps/web/src/components/demos/index.tsx` 注册它
  4. 在 seed 里给某个章节挂上这个 `demoKey`
- **改前端外观**：Tailwind 类名直接在 tsx 里改，保存立刻生效

## 常见问题

**Q: 为什么用 Bun 而不是 npm/pnpm？**
A: Bun 装依赖快、能直接跑 TypeScript 不用先编译、内置 workspaces。作为启蒙工具链最简单。

**Q: 为什么加 Turborepo？只用 workspaces 不够吗？**
A: workspaces 只管"包组织"，跑起来还是要开多个终端。Turborepo 让 `bun run dev` 一条命令并行起前后端；构建时还有缓存。企业项目基本都用。

**Q: 为什么用 Drizzle 而不是 Prisma？**
A: Prisma 生态最好但抽象层重，学生用了不知道底层 SQL 是什么。Drizzle 写的代码和最终 SQL 几乎一一对应，学 SQL 和学 ORM 能同步进行。

**Q: 为什么不加认证？**
A: 认证是一个独立的大主题（session/JWT/OAuth...），加进来会稀释项目的教学焦点。留作学生后续项目的扩展点。

## 项目源码就是活教材

- `apps/api/src/db/schema.ts` —— 数据库设计课的活样例（主键、外键、索引、jsonb、pgEnum）
- `apps/api/src/routes/` —— HTTP 路由怎么组织
- `apps/api/src/routes/demo-sandbox.ts` —— 请求校验（`zValidator`）如何工作
- `packages/shared/src/types.ts` —— 前后端如何共享类型
- `apps/web/src/lib/api.ts` —— 前端如何组织 API 调用
- `apps/web/src/routes/chapter.tsx` —— React Router v7 loader 模式
- `apps/web/src/components/demos/` —— 真实的可交互组件

每个配置文件顶部都有中文注释，讲清楚它是干什么的。

祝学习愉快 🌱
