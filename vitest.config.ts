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

    // カバレッジ設定（要件7.1, 7.4に基づく）
    coverage: {
      // カバレッジプロバイダーの設定
      provider: "v8",

      // レポート形式の設定（要件7.2, 7.3に基づく）
      reporter: [
        "text", // コンソール出力用
        "json", // JSON形式のデータ出力
        "html", // HTML形式の詳細レポート
        "lcov", // CI/CDツール連携用
        "text-summary", // 要約レポート
      ],

      // レポート出力ディレクトリ
      reportsDirectory: "./coverage",

      // 除外するファイルとディレクトリ
      exclude: [
        // 依存関係とビルド成果物
        "node_modules/",
        ".next/",
        "coverage/",
        "dist/",
        "build/",
        "public/",

        // 設定ファイル
        "**/*.config.*",
        "**/*.d.ts",
        "*.config.*",

        // テスト関連ファイル
        "**/__tests__/**",
        "**/__mocks__/**",
        "**/test-utils.tsx",
        "vitest.setup.ts",
        "vitest.config.ts",
        "e2e/**",
        "playwright/**",
        "test-results/**",
        "playwright-report/**",

        // プロジェクト固有の除外
        ".kiro/**",
        "supabase/**",
        "utils/**",
        "**/types/**",
        "src/app/globals.css",
        "src/styles/**",

        // 自動生成ファイル
        "src/lib/db/schema.ts",
        "drizzle.config.ts",
        "next-env.d.ts",

        // ミドルウェアとAPI設定（別途統合テストでカバー）
        "src/middleware.ts",
        "src/app/api/**",
      ],

      // カバレッジ閾値の設定（要件7.1, 7.4に基づく）
      thresholds: {
        // 関数カバレッジ: 90%以上
        functions: 90,
        // 分岐カバレッジ: 85%以上
        branches: 85,
        // 行カバレッジ: 90%以上
        lines: 90,
        // ステートメントカバレッジ: 90%以上
        statements: 90,
        // ファイルごとの最小カバレッジ
        perFile: true,
      },

      // カバレッジ収集の詳細設定
      all: true, // すべてのソースファイルを対象に
      clean: true, // 実行前にレポートディレクトリをクリーン
      cleanOnRerun: true, // 再実行時にクリーン

      // カバレッジ対象ファイルの指定
      include: [
        "src/**/*.{ts,tsx}",
        "!src/**/*.d.ts",
        "!src/**/*.config.*",
        "!src/app/globals.css",
        "!src/styles/**",
      ],

      // 詳細なレポート設定
      reportOnFailure: true, // 失敗時もレポート生成
      skipFull: false, // 100%カバレッジのファイルも表示
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
