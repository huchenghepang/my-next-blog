import {defineConfig} from "vitest/config"

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"], // 可选：全局 mock 设置
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/**", "**/*.d.ts", "**/index.ts"],
    },
  },
})
