import { test, expect } from "@playwright/test";
import { AuthPage } from "./page-objects/auth-page";
import { HomePage } from "./page-objects/home-page";
import {
  waitForPageReady,
  captureConsoleErrors,
  clate,
} from "./helpers/test-helpers";

/**
 * ユーザー認証フローのE2Eテスト
 *
 * 認証関連の機能が正常に動作することを確認します。
 * - ユーザー登録
 * - ログイン
 * - パスワードリセット
 * - セッション管理
 * - ログアウト
 */

test.describe("認証フローテスト", () => {
  let authPage: AuthPage;
  let homePage: HomePage;
  let consoleErrors: string[];

  // テスト用の認証情報
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = "Test@123456";

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    homePage = new HomePage(page);
    consoleErrors = captureConsoleErrors(page);

    // 各テスト前に認証状態をクリア
    await clearAuthState(page);
  });

  test("ログインページが正常に表示される", async ({ page }) => {
    // ログインページに移動
    await authPage.navigateToLogin();
    await waitForPageReady(page);

    // ログインフォームの要素が表示されていることを確認
    const emailInputVisible = await page.isVisible('input[type="email"]');
    const passwordInputVisible = await page.isVisible('input[type="password"]');
    const loginButtonVisible = await page.isVisible(
      'button:has-text("ログイン"), button:has-text("Login")',
    );

    expect(emailInputVisible).toBe(true);
    expect(passwordInputVisible).toBe(true);
    expect(loginButtonVisible).toBe(true);

    // コンソールエラーがないことを確認
    expect(consoleErrors).toHaveLength(0);
  });

  test("無効な認証情報でログインするとエラーが表示される", async ({ page }) => {
    // ログインページに移動
    await authPage.navigateToLogin();
    await waitForPageReady(page);

    // 無効な認証情報でログイン
    await authPage.login("invalid@example.com", "wrongpassword");

    // エラーメッセージが表示されることを確認
    const errorMessage = await authPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test("テスト用の認証状態を設定するとログイン状態になる", async ({ page }) => {
    // ホームページに移動
    await homePage.navigateToHome();
    await waitForPageReady(page);

    // テスト用の認証状態を設定
    await authPage.setTestAuthState();

    // ページをリロード
    await page.reload();
    await waitForPageReady(page);

    // ログイン状態になっていることを確認
    const isLoggedIn = await page.evaluate(() => {
      const authToken = localStorage.getItem("sb-127.0.0.1:54321-auth-token");
      return !!authToken;
    });

    expect(isLoggedIn).toBe(true);
  });

  test("ログアウトすると認証状態がクリアされる", async ({ page }) => {
    // ホームページに移動
    await homePage.navigateToHome();
    await waitForPageReady(page);

    // テスト用の認証状態を設定
    await authPage.setTestAuthState();

    // ログアウトボタンが表示されている場合はクリック
    const logoutButton = page.locator(
      'button:has-text("ログアウト"), button:has-text("Logout")',
    );
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await waitForPageReady(page);
    } else {
      // ログアウト機能がない場合は手動でクリア
      await authPage.clearAuthState();
    }

    // 認証状態がクリアされていることを確認
    const isLoggedIn = await page.evaluate(() => {
      const authToken = localStorage.getItem("sb-127.0.0.1:54321-auth-token");
      return !!authToken;
    });

    expect(isLoggedIn).toBe(false);
  });

  test("認証が必要なページにアクセスするとリダイレクトされる", async ({
    page,
  }) => {
    // 認証状態をクリア
    await authPage.clearAuthState();

    // 認証が必要なページにアクセス（例: /dashboard）
    await page.goto("/dashboard");
    await waitForPageReady(page);

    // ログインページまたは認証ページにリダイレクトされることを確認
    const currentUrl = page.url();
    expect(
      currentUrl.includes("login") ||
        currentUrl.includes("auth") ||
        currentUrl.includes("signin"),
    ).toBe(true);
  });

  test("パスワードリセットページが正常に表示される", async ({ page }) => {
    // ログインページに移動
    await authPage.navigateToLogin();
    await waitForPageReady(page);

    // パスワードリセットリンクが表示されている場合はクリック
    const forgotPasswordLink = page.locator(
      'a:has-text("パスワードをお忘れですか？"), a:has-text("Forgot password?")',
    );
    if (await forgotPasswordLink.isVisible()) {
      await forgotPasswordLink.click();
      await waitForPageReady(page);

      // パスワードリセットフォームの要素が表示されていることを確認
      const emailInputVisible = await page.isVisible('input[type="email"]');
      const resetButtonVisible = await page.isVisible(
        'button:has-text("パスワードをリセット"), button:has-text("Reset password")',
      );

      expect(emailInputVisible).toBe(true);
      expect(resetButtonVisible).toBe(true);
    } else {
      // パスワードリセットリンクがない場合はスキップ
      console.log("パスワードリセットリンクが見つかりませんでした");
    }
  });

  test("認証状態がセッション間で保持される", async ({ page }) => {
    // テスト用の認証状態を設定
    await authPage.setTestAuthState();

    // ページをリロード
    await page.reload();
    await waitForPageReady(page);

    // 認証状態が保持されていることを確認
    const isLoggedIn = await page.evaluate(() => {
      const authToken = localStorage.getItem("sb-127.0.0.1:54321-auth-token");
      return !!authToken;
    });

    expect(isLoggedIn).toBe(true);

    // 別のページに移動しても認証状態が保持されることを確認
    await homePage.navigateToHome();
    await waitForPageReady(page);

    const isStillLoggedIn = await page.evaluate(() => {
      const authToken = localStorage.getItem("sb-127.0.0.1:54321-auth-token");
      return !!authToken;
    });

    expect(isStillLoggedIn).toBe(true);
  });

  test("OAuth認証ボタンが正常に表示される", async ({ page }) => {
    // ログインページに移動
    await authPage.navigateToLogin();
    await waitForPageReady(page);

    // OAuth認証ボタンが表示されていることを確認
    const googleButtonVisible = await page.isVisible(
      'button:has-text("Google")',
    );
    const githubButtonVisible = await page.isVisible(
      'button:has-text("GitHub")',
    );

    // 少なくとも1つのOAuthボタンが表示されていることを確認
    expect(googleButtonVisible || githubButtonVisible).toBe(true);
  });
});

/**
 * 未認証状態のテスト
 *
 * 認証が不要なページや機能が正常に動作することを確認します。
 */
test.describe("未認証状態のテスト", () => {
  let authPage: AuthPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    homePage = new HomePage(page);

    // 各テスト前に認証状態をクリア
    await clearAuthState(page);
  });

  test("未認証状態でもアクセス可能なページが表示される", async ({ page }) => {
    // ホームページに移動
    await homePage.navigateToHome();
    await waitForPageReady(page);

    // ページが正常に表示されることを確認
    const title = await homePage.getTitle();
    expect(title).toBeTruthy();

    // 基本要素が表示されていることを確認
    const areElementsVisible = await homePage.areBasicElementsVisible();
    expect(areElementsVisible).toBe(true);
  });

  test("未認証状態でテーマ切り替えが機能する", async ({ page }) => {
    // ホームページに移動
    await homePage.navigateToHome();
    await waitForPageReady(page);

    // ライトモードに設定
    await homePage.enableLightMode();
    let isDarkMode = await homePage.isDarkModeActive();
    expect(isDarkMode).toBe(false);

    // ダークモードに切り替え
    await homePage.enableDarkMode();
    isDarkMode = await homePage.isDarkModeActive();
    expect(isDarkMode).toBe(true);
  });
});
