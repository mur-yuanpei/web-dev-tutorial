# =========================================================================
# 后端 API 生产镜像 · 多阶段构建
#
# 为什么用多阶段？
#   构建时需要完整依赖（drizzle-kit / TypeScript / 源码），
#   但运行时只需最小依赖 + 编译产物。多阶段能把构建工具链留在中间层，
#   最终镜像只带必需品 —— 体积小、攻击面小。
#
# build context 是仓库根目录（因为 monorepo 用了 workspaces，
# 装依赖需要看得到 packages/shared 和 apps/api 两处的 package.json）。
# 从根目录构建：
#   docker build -f apps/api/Dockerfile -t api:local .
# =========================================================================


# -------------------- 阶段 1：deps 装依赖 --------------------
FROM oven/bun:1.3.11-alpine AS deps
WORKDIR /app

# 先只 COPY 所有 package.json 与锁文件 —— 只要它们不变，
# 后续 bun install 就能命中 Docker 层缓存，代码修改不会导致重装依赖
COPY package.json bun.lock ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/

# --frozen-lockfile：只装锁文件里已确定的版本，绝不升级
# 生产构建要的就是 100% 可复现
RUN bun install --frozen-lockfile


# -------------------- 阶段 2：builder 类型检查 --------------------
# 后端由 Bun 直接跑 TypeScript，不需要编译成 JS。
# 这一步只做 typecheck，让"类型错的代码构不出镜像"。
FROM oven/bun:1.3.11-alpine AS builder
WORKDIR /app

# bun workspaces 下每个包各自有 node_modules（不做 hoisting），
# 三处都要从 deps 阶段拷过来
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY . .

RUN bun --filter @app/api typecheck


# -------------------- 阶段 3：runner 最小运行时 --------------------
# 注意：从 builder 阶段（而不是 deps）拿依赖 —— 让 typecheck 成为发布的强制门槛。
# 如果 builder 里的 typecheck 失败，本阶段构建也会失败。
FROM oven/bun:1.3.11-alpine AS runner
WORKDIR /app

# 生产依赖 + 源码 + drizzle migration 目录
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/packages/shared/node_modules ./packages/shared/node_modules
COPY package.json bun.lock ./
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared

# oven/bun 镜像默认自带非 root 用户 "bun"
USER bun

ENV NODE_ENV=production
ENV API_PORT=3000
EXPOSE 3000

# 健康检查 —— docker compose / K8s / 云控制台都会读它决定服务是否就绪
# 用 wget 是因为 alpine 自带；curl 需要另装
HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["bun", "run", "apps/api/src/index.ts"]
