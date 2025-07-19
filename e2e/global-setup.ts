import { chromium, FullConfig } from "@playwright/test";

/**
 * Playwright グローバルセットアップ
 *
 * テスト実行前の初期化処理を行います。
 * データベースの初期化やテスト用データの準備などを実行します。
 */

async function globalSetup(config: FullConfig) {
  console.log("🚀 E2Eテストのグローバルセットアップを開始します...");

  // ブラウザを起動してヘルスチェック
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // アプリケーションのヘルスチェック
    await page.goto("http://127.0.0.1:3000");
    await page.waitForLoadState("networkidle");

    console.log("✅ アプリケーションが正常に起動しています");
  } catch (error) {
    console.error("❌ アプリケーションの起動に失敗しました:", error);
    throw error;
  } finally {
    await browser.close();
  }

  console.log("✅ グローバルセットアップが完了しました");
}

export default globalSetup;
