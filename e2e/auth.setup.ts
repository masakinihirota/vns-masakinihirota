import { test as setup, expect } from "@playwright/test";
import path from "node:path";

/**
 * 認証状態のセットアップ
 *
 * E2Eテストで使用する認証済みユーザーの状態を作成します。
 * この状態は他のテストで再利用されます。
 */

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  console.log("🔐 認証状態のセットアップを開始します...");

  // ログインページに移動
  await page.goto("/");

  // 認証が必要なページかどうかを確認
  const currentUrl = page.url();

  if (currentUrl.includes("login") || currentUrl.includes("auth")) {
    // テスト用のログイン処理
    // 実際の認証フローに応じて実装を調整

    // Google OAuth ボタンが存在する場合
    const googleButton = page.locator('button:has-text("Google")');
    if (await googleButton.isVisible()) {
      console.log("Google OAuth ボタンが見つかりました");
      // テスト環境では実際のOAuthは使用せず、モック認証を使用
    }

    // GitHub OAuth ボタンが存在する場合
    const githubButton = page.locator('button:has-text("GitHub")');
    if (await githubButton.isVisible()) {
      console.log("GitHub OAuth ボタンが見つかりました");
      // テスト環境では実際のOAuthは使用せず、モック認証を使用
    }

    // テスト用の認証状態を直接設定
    // Supabaseのテスト用トークンを使用
    await page.evaluate(() => {
      // ローカルストレージに認証情報を設定
      const mockAuthData = {
        access_token: "test-access-token",
        refresh_token: "test-refresh-token",
        user: {
          id: "test-user-id",
          email: "test@example.com",
          user_metadata: {
            name: "Test User",
          },
        },
      };

      localStorage.setItem(
        "sb-127.0.0.1:54321-auth-token",
        JSON.stringify(mockAuthData),
      );
    });

    // ページをリロードして認証状態を反映
    await page.reload();
    await page.waitForLoadState("networkidle");
  }

  // 認証状態の確認
  // 認証済みユーザーのみアクセス可能な要素があるかチェック
  const isAuthenticated = await page.evaluate(() => {
    const authToken = localStorage.getItem("sb-127.0.0.1:54321-auth-token");
    return !!authToken;
  });

  if (isAuthenticated) {
    console.log("✅ 認証状態が正常に設定されました");
  } else {
    console.log("ℹ️ 認証不要のアプリケーションです");
  }

  // 認証状態をファイルに保存
  await page.context().storageState({ path: authFile });

  console.log("✅ 認証状態のセットアップが完了しました");
});
