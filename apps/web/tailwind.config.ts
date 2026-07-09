// --------------------------------------------------------------
// Tailwind CSS 配置
// content: 告诉 Tailwind 去哪找类名（未在文件里出现的类会被摇树掉）
// darkMode: 'class' → 通过给 <html> 加 class="dark" 切换深色模式
// --------------------------------------------------------------

import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [typography],
} satisfies Config;
