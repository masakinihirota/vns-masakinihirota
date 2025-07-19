import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2Eテスト設定
 *
 * このファイルは包括的テストスイートの一部として、
 * ブラウザ自動化によるE2Eテストの設定を行います。
 */

export default defineConfig({
  // テストディレクトリの指定
  testDir: "./e2e",

  // 並列実行の設定
  fullyParallel: true,

  // CI環境での設定
  forbidOnly: !!process.env.CI,

  // 失敗時のリトライ回数
  retries: process.env.CI ? 2 : 0,

  // 並列実行するワーカー数
  workers: process.env.CI ? 1 : undefined,

  // レポーター設定
  reporter: [
    ["html"],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/results.xml" }],
  ],

  // グローバル設定
  use: {
    // ベースURL（開発サーバー）
    baseURL: "http://127.0.0.1:3000",

    // トレース設定（失敗時のみ）
    trace: "on-first-retry",

    // スクリーンショット設定
    screenshot: "only-on-failure",

    // ビデオ録画設定
    video: "retain-on-failure",

    // ブラウザコンテキストの設定
    locale: "ja-JP",
    timezoneId: "Asia/Tokyo",

    // ビューポートサイズ
    viewport: { width: 1280, height: 720 },

    // ナビゲーションタイムアウト
    navigationTimeout: 30000,

    // アクションタイムアウト
    actionTimeout: 10000,
  },

  // プロジェクト設定（ブラウザ別）
  projects: [
    // 認証状態のセットアップ
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },

    // デスクトップブラウザ
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // 認証状態を使用
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
    },

    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
    },

    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
    },

    // モバイルブラウザ
    {
      name: "Mobile Chrome",
      use: {
        ...devices["Pixel 5"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
    },

    {
      name: "Mobile Safari",
      use: {
        ...devices["iPhone 12"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
    },

    // 認証なしのテスト用プロジェクト
    {
      name: "chromium-unauthenticated",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /.*\.unauth\.spec\.ts/,
    },
  ],

  // 開発サーバーの設定
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  // 出力ディレクトリ
  outputDir: "test-results/",

  // テストタイムアウト
  timeout: 30000,

  // expect設定
  expect: {
    // アサーションタイムアウト
    timeout: 5000,

    // ビジュアル比較の閾値
    threshold: 0.2,

    // スクリーンショット比較の設定
    toHaveScreenshot: {
      animations: "disabled",
    },

    // テキスト比較の設定
    toMatchSnapshot: {
      threshold: 0.2,
    },
  },

  // グローバルセットアップ・ティアダウン
  globalSetup: require.resolve("./e2e/global-setup.ts"),
  globalTeardown: require.resolve("./e2e/global-teardown.ts"),
});
