# @app/shared · 前后端共享包

> 前后端共享的 zod schema 与 TypeScript 类型

## 技术栈

| 用途 | 技术 | 说明 |
|---|---|---|
| Runtime schema | **[Zod](https://zod.dev) 3.24** | 运行时数据校验 + 编译期类型推导 |
| 类型 | **TypeScript 5.9** | 通过 `z.infer<>` 从 schema 反推 TS 类型 |
| 测试 | **Vitest 2** | schema 边界测试 |

**零 UI / 零业务 / 零副作用**。整个包只导出：
- `z.object({...})` schema 定义
- `type Foo = z.infer<typeof fooSchema>` 反推类型

## 为什么要有这个包？

在 monorepo 里，前端（`apps/web`）和后端（`apps/api`）经常需要用**同一份数据形状**：

- 后端 API 返回什么字段？
- 前端接口调用时期望什么类型？
- 表单提交前如何做前端校验？校验规则如何和后端保持一致？

如果每一端都自己写一份类型定义，两边会慢慢**漂移**，最终出现"前端以为返回 `name`，后端返回 `title`"的线上事故。

把类型/校验放在这个共享包里，任何一端修改都会立刻被 TypeScript 编译器"看见"，从源头上避免不一致。

## 里面有什么

**教程数据模型：**
- `courseSchema` / `Course`
- `chapterSchema` / `Chapter`
- `sectionSchema` / `Section`（kind: text / code / note）
- `courseWithChaptersSchema` / `CourseWithChapters`
- `chapterDetailSchema` / `ChapterDetail`
- `navCourseSchema` / `NavCourse`（Sidebar 树）

**Demo 交互：**
- `createMessageInput` / `CreateMessageInput`（POST 请求体校验，min/max 长度）
- `messageSchema` / `Message`
- `clickCountSchema` / `ClickCount`

## 一次定义，两处使用

```ts
// 后端：apps/api/src/routes/demo-sandbox.ts
import { createMessageInput, type Message } from "@app/shared";
demoRoute.post("/messages", zValidator("json", createMessageInput), async (c) => {
  const input = c.req.valid("json");  // 已通过 zod 校验
  // ...
});

// 前端：apps/web/src/lib/api.ts
import type { Message, CreateMessageInput } from "@app/shared";
export const api = {
  postMessage: (input: CreateMessageInput) =>
    request<Message>("/api/demo/messages", { method: "POST", body: JSON.stringify(input) }),
};
```

前端和后端 import 的**是同一个文件**。改一次，两端同步。

## 目录结构

```
packages/shared/
├── src/
│   ├── index.ts         # 只导出 types.ts
│   ├── types.ts         # 所有 schema + 类型
│   └── types.test.ts    # zod schema 边界测试
├── vitest.config.ts     # node 环境
├── package.json
└── tsconfig.json
```

## 快速开始

```bash
# 从仓库根跑
bun --filter @app/shared typecheck
bun --filter @app/shared test
```

**不需要 build** —— `package.json` 里 `"main": "./src/index.ts"` 直接引用源码，Bun 和 Vite 都能直接消费 TS。

## 教学附加值

- `src/types.ts` —— zod schema 与 TypeScript 类型的**双向绑定**范式
- 后端 `zValidator + createMessageInput` —— 声明式请求校验
- 前端 `import type { Message }` —— 无缝拿到接口契约
- monorepo `workspace:*` 依赖机制的活样例

每个 schema 顶部都有中文注释，说明用途。
