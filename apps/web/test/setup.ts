// --------------------------------------------------------------
// apps/web 测试环境 setup
// - 扩展 @testing-library/jest-dom 的 matchers
// - 每个 case 后 cleanup + 恢复 mock
// - stub jsdom 缺失的 API（IntersectionObserver / matchMedia / pointerCapture / scrollIntoView）
//   —— 缺这些会导致 shadcn Sheet / ScrollArea / 我们的 TableOfContents 挂
// --------------------------------------------------------------

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// biome-ignore lint/suspicious/noExplicitAny: test-only globals
globalThis.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
} as any;

// Radix ScrollArea 用到 ResizeObserver，jsdom 没提供
// biome-ignore lint/suspicious/noExplicitAny: test-only globals
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;

if (!window.matchMedia) {
  window.matchMedia = (() =>
    ({
      matches: false,
      media: "",
      onchange: null,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
}

if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
