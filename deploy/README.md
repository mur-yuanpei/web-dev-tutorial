# 部署到腾讯云 CVM 手册

本项目支持从 GitHub Actions 一键部署到一台 Ubuntu 云服务器。这份文档给学生 & 运维新手看，讲清楚"服务器上到底发生了什么"。

## 架构总览

```
┌──────────────────────────────────────────────────────────────┐
│  你的电脑 → git push origin main                              │
└──────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│  GitHub Actions                                              │
│  1. 构建 apps/api 镜像 → push 到 ghcr.io                     │
│  2. 构建 apps/web 镜像 → push 到 ghcr.io                     │
│  3. SSH 到腾讯云 CVM → 拉最新镜像 → docker compose up        │
└──────────────────────────────────────────────────────────────┘
                        │  SSH
                        ▼
┌──────────────────────────────────────────────────────────────┐
│  腾讯云 CVM (Ubuntu)                                          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Docker Compose                                        │  │
│  │  ┌─────────┐   ┌─────────┐   ┌─────────────────────┐   │  │
│  │  │postgres │ ← │   api   │ ← │  web (nginx :80)    │← 公网 80
│  │  └─────────┘   └─────────┘   └─────────────────────┘   │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**关键：** 只有 `web` 容器把 80 端口对公网开放。用户浏览器访问 `http://<CVM 公网 IP>/`，nginx 直接返回前端静态资源；访问 `/api/*` 时 nginx 内部反代到 `api:3000`。数据库端口（5432）从不对公网暴露。

## 首次准备（第一次部署这个项目时做一遍）

### 1. 买一台 CVM

- 系统：Ubuntu 22.04 LTS 或更新
- 配置：最低 2 核 2G 就够跑这个教学项目
- 网络：绑一个公网 IP
- **安全组只开两个端口**：`22`（SSH）和 `80`（HTTP）

### 2. 安装 Docker

SSH 登进去以后：

```bash
# 官方一键脚本
curl -fsSL https://get.docker.com | sh

# 把当前用户加入 docker 组，之后就不用 sudo
sudo usermod -aG docker $USER

# 生效需要重新登录，或执行
newgrp docker

# 验证
docker --version
docker compose version
```

### 3. 准备部署目录

```bash
sudo mkdir -p /opt/web-tutor
sudo chown $USER:$USER /opt/web-tutor
cd /opt/web-tutor
```

### 4. 放入 compose 文件与环境变量

有两种方式让 `docker-compose.prod.yml` 到服务器上：

- **推荐**：让 GitHub Actions 首次部署时通过 SCP 自动送过来（详见"配置 GitHub Secrets"）
- **手动**：直接 `curl -O https://raw.githubusercontent.com/mur-yuanpei/web-dev-tutorial/main/deploy/docker-compose.prod.yml`

`.env.prod` 需要**手工**创建（含密码，不进 git）：

```bash
# 拉个模板下来
curl -o .env.prod https://raw.githubusercontent.com/mur-yuanpei/web-dev-tutorial/main/deploy/.env.prod.example

# 编辑：改 POSTGRES_PASSWORD 为一个强密码
vim .env.prod
```

### 5. 首次登录 GHCR（若镜像仓库是 private）

推荐先把 GHCR 上的两个包（web-dev-tutorial-api / web-dev-tutorial-web）设为 **public**，能省这一步；教学项目没什么秘密。设法：GitHub → 你头像 → Your Packages → 每个包 → Package settings → Change visibility → Public。

如果保持 private，服务器上需要：

```bash
# 生成一个 GitHub Personal Access Token，scope 只勾 read:packages
# https://github.com/settings/tokens/new
echo "<你的 token>" | docker login ghcr.io -u <你的 GitHub 用户名> --password-stdin
```

### 6. 生成 GitHub Actions 专用的 SSH 密钥

**不要**复用你本机的私钥。为 CI 专门造一把：

```bash
# 在 CVM 上
ssh-keygen -t ed25519 -f ~/.ssh/gh-actions -N "" -C "gh-actions@web-tutor"

# 把公钥加到 authorized_keys
cat ~/.ssh/gh-actions.pub >> ~/.ssh/authorized_keys

# 输出私钥内容 —— 待会儿复制到 GitHub Secret
cat ~/.ssh/gh-actions
```

### 7. 首次手动部署一次（确认服务器侧没问题）

```bash
cd /opt/web-tutor

# 拉镜像（默认标签 latest 会存在，因为 CI 每次 push main 都会打）
docker compose --env-file .env.prod -f docker-compose.prod.yml pull

# 起 pg
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d postgres

# 等它 healthy（约 5 秒）
sleep 6

# 建表
docker compose --env-file .env.prod -f docker-compose.prod.yml \
  run --rm api bun run apps/api/src/db/migrate.ts

# 灌初始教程内容（**只在首次跑**）
docker compose --env-file .env.prod -f docker-compose.prod.yml \
  run --rm api bun run apps/api/src/db/seed.ts

# 启动 api + web
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d api web

# 验证
curl http://localhost/         # 应该返回 HTML
curl http://localhost/api/health   # 应该返回 {"ok":true,...}
```

打开浏览器访问 `http://<CVM 公网 IP>/`，能看到教程首页就成功了。

### 8. 配置 GitHub Secrets

在 GitHub 仓库 → Settings → Secrets and variables → Actions → 新建：

| Secret 名 | 内容 |
|---|---|
| `CVM_HOST` | CVM 公网 IP |
| `CVM_USER` | 登录用户名（通常 `ubuntu` 或你的自建用户） |
| `CVM_SSH_KEY` | 上一步 `~/.ssh/gh-actions` 私钥文件的**完整内容**（包括开头 `-----BEGIN` 和结尾 `-----END` 那两行） |

配好之后，`main` 分支每次 push 都会自动触发部署。

## 日常运维

### 部署一个新版本

推 main 分支就行。GitHub Actions 会自动：
1. 构建两个新镜像并打上 `sha-<7 位 commit hash>` 和 `latest` 两个 tag
2. 推到 GHCR
3. SSH 到 CVM，改 `.env.prod` 的 `IMAGE_TAG` 为新 sha，然后 pull + migrate + up

### 回滚到旧版本

如果新版有问题：

```bash
ssh <你的 CVM>
cd /opt/web-tutor

# 看 GHCR 上有哪些 tag：GitHub → Packages → 每个包能看到列表
# 假设要回到 sha-a1b2c3d

vim .env.prod
# 把 IMAGE_TAG 改成 sha-a1b2c3d

docker compose --env-file .env.prod -f docker-compose.prod.yml pull api web
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d api web
```

**镜像 tag 是不可变的**（不像 npm 那样有 unpublish 时间窗口），永远拉得回来。这就是为什么每次构建都要打 sha tag。

### 手动重灌 seed

GitHub → Actions → Deploy workflow → Run workflow → 把 `run_seed` 选成 `true` → Run。

**警告**：seed 会**清空**所有课程/章节/段落，重新灌入代码里 `seed.ts` 的内容。如果生产环境有别人贡献的内容，会全部丢失。教学项目里通常无所谓。

### 看日志

```bash
# 实时看 api 日志（含每次 HTTP 请求）
docker compose --env-file .env.prod -f /opt/web-tutor/docker-compose.prod.yml logs -f api

# 看最近的 nginx access log
docker compose --env-file .env.prod -f /opt/web-tutor/docker-compose.prod.yml logs --tail 100 web

# 看 pg 慢查询
docker compose --env-file .env.prod -f /opt/web-tutor/docker-compose.prod.yml logs postgres
```

### 直接连 pg 排查

```bash
docker exec -it web-tutor-postgres psql -U dev -d webtutor
# 然后就是标准的 psql 命令行了
```

## FAQ

### 为什么用多阶段 Dockerfile？

看 `apps/api/Dockerfile` 或 `apps/web/Dockerfile`。构建时需要完整的开发工具链（bun、tsc、vite），但**运行时**只需要少量必需品。多阶段构建让最终镜像只包含运行时需要的东西：

- 更小：api 从 800MB 缩到 ~260MB，web 从 1.2GB 缩到 ~50MB（nginx 静态托管）
- 更安全：攻击者进了容器也没有编译器可以用
- 拉镜像更快 = 部署更快

`docker images` 对比一下就懂了。

### 为什么用 nginx 同域反代？

- **解决 CORS**：前端 `fetch('/api/xxx')` 是相对路径，浏览器认为是同域请求，不需要预检
- **前端代码一份 URL 通用**：开发用 vite proxy、生产用 nginx 反代，前端代码里都写相对路径 `/api/xxx`，不用管环境
- **静态资源性能高**：nginx 处理静态文件比 Node 快 10 倍以上

### 为什么 migration 单独跑一步？

如果把 `bun run migrate && bun run start` 塞进 api 容器 entrypoint，看起来简单，但：

- **多副本竞争**：未来横向扩容成 3 副本时，3 个都会同时跑 migration，数据库变异行为难以预料
- **失败被吞**：migration 失败了 restart policy 会一直重启，日志淹没
- **发布流程不透明**：改数据库结构是重大操作，应该在**部署流程**里显式一步；出错就停止发布

单独一步跑 migration 是行业最佳实践。学生要记住这个模式。

### 为什么 `.env.prod` 不进 git？

密码/连接串是**环境相关**的秘密，代码是**环境无关**的资产。把秘密写死在代码里 = 上传 GitHub = 全网可见。这类事故每周都在发生。

`.env.prod` 只在 CVM 上存在，只有服务器登录权限的人能看。GitHub Actions 不通过 git 拿它，而是通过 secrets 机制注入。

### 为什么不用 GHCR Personal Access Token？

GitHub Actions 内置一个 `GITHUB_TOKEN`，每次 workflow 运行时**自动生成、用完销毁**。它对同 repo 的 GHCR 包有默认的读写权限。这比配一个长期 PAT 更安全（PAT 泄漏了就是长期风险；`GITHUB_TOKEN` 只在这次 workflow 有效）。

### 为什么把 pg 也跑在 CVM 上，不用云 RDS？

教学考虑：让学生看到"pg 就是一个跑在服务器上的进程"，而不是"云上的黑盒"。生产环境如果规模大了，应该迁到 TencentDB / Neon 这类托管服务，那时候只需改 `DATABASE_URL` 即可。

### 数据备份怎么做？

目前**没做**。教学项目丢数据也就 seed 一下的事。真实项目至少要：

```bash
# 每天定时 dump 到独立 volume 或对象存储
docker exec web-tutor-postgres pg_dump -U dev webtutor | gzip > /backup/$(date +%F).sql.gz
```

配 crontab + 上传到腾讯云 COS 就行。留作学生扩展点。

### 怎么加 HTTPS？

需要域名。步骤：
1. 买域名，A 记录指向 CVM 公网 IP
2. **备案**（.cn 域名或指向大陆服务器的域名都要）
3. 把 web 容器的 nginx 换成 caddy —— caddy 会自动申请 & 续期 Let's Encrypt 证书

留作学生的下一个项目。
