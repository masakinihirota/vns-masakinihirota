import { FullConfig } from "@playwright/test";

/**
 * Playwright グローバルティアダウン
 *
 * テスト実行後のクリーンアップ処理を行います。
 * テスト用データの削除やリソースの解放などを実行します。
 */

async function globalTeardown(config: FullConfig) {
  console.log("🧹 E2Eテストのグローバルティアダウンを開始します...");

  // テスト用データのクリーンアップ
  // 必要に応じてデータベースのクリーンアップ処理を追加

  console.log("✅ グローバルティアダウンが完了しました");
}

export default globalTeardown;
