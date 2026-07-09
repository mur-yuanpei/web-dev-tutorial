# @app/shared —— 前后端共享包

## 为什么要有这个包？

在 monorepo 里，前端（`apps/web`）和后端（`apps/api`）经常需要用**同一份数据形状**：

- 后端 API 返回什么字段？
- 前端接口调用时期望什么类型？
- 表单提交前如何做前端校验？校验规则如何和后端保持一致？

如果每一端都自己写一份类型定义，两边就会随着时间**慢慢漂移**，最终出现"前端以为返回 `name`，后端返回的却是 `title`"这种线上事故。

把类型/校验放在这个共享包里，任何一端修改都会立刻被 TypeScript 编译器"看见"，从源头上避免不一致。

## 里面有什么？

- **`Course` / `Chapter` / `Section`** —— 教程数据模型
- **`Message` / `ClickCount`** —— Demo 用到的接口数据
- **`courseSchema` / `chapterSchema` ...** —— 对应的 `zod` schema，可以在**运行时**做数据校验（后端收到请求时用得上）

## 一次定义，两处使用

```ts
// apps/api/src/routes/courses.ts
import type { Course } from "@app/shared";

// apps/web/src/lib/api.ts
import type { Course } from "@app/shared";
```

前端和后端 import 的是**同一个文件**。这就是共享包的意义。
