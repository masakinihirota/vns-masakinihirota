import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    // テスト環境の設定
    environment: "jsdom",

    // セットアップファイルの指定
    setupFiles: ["./vitest.setup.ts"],

    // グローバル設定
    globals: true,

    // CSS の処理をスキップ
    css: false,

    // カバレッジ設定
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        ".next/",
        "coverage/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/types/**",
        "src/app/globals.css",
        "public/**",
        ".kiro/**",
        "supabase/**",
        "utils/**",
        "**/__tests__/**",
        "**/__mocks__/**",
        "**/test-utils.tsx",
        "vitest.setup.ts",
        "vitest.config.ts",
      ],
      thresholds: {
        functions: 90,
        branches: 85,
        lines: 90,
        statements: 90,
      },
    },

    // テストファイルのパターン
    include: [
      "**/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],

    // 除外するファイル
    exclude: [
      "node_modules/",
      ".next/",
      "coverage/",
      "dist/",
      "build/",
      "public/",
      ".kiro/",
      "supabase/",
      "utils/",
      "e2e/**",
      "playwright/**",
      "test-results/**",
      "playwright-report/**",
    ],

    // テストタイムアウト
    testTimeout: 10000,

    // 並列実行の設定
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: false,
        minThreads: 1,
        maxThreads: 4,
      },
    },
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "~": resolve(__dirname, "./"),
    },
  },

  // Next.js の環境変数を模擬
  define: {
    "process.env.NODE_ENV": JSON.stringify("test"),
  },
});
