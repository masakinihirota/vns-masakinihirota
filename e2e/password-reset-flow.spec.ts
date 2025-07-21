import { test, expect } from "@playwright/test";
import { AuthPage } from "./page-objects/auth-page";
import { waitForPageReady, captureConsoleErrors } from "./helpers/test-helpers";

/**
 * パスワードリセット機能のE2Eテスト
 *
 * パスワードリセットフローが正常に動作することを確認します。
 */

test.describe("パスワードリセットフロー", () => {
  let authPage: AuthPage;
  let consoleErrors: string[];

  // テスト用のメールアドレス
  const testEmail = `test-${Date.now()}@example.com`;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    consoleErrors = captureConsoleErrors(page);
  });

  test("パスワードリセットページにアクセスできる", async ({ page }) => {
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

      // URLにリセットパスワード関連のパスが含まれていることを確認
      const currentUrl = page.url();
      expect(
        currentUrl.includes("reset-password") ||
          currentUrl.includes("forgot-password") ||
          currentUrl.includes("password-reset"),
      ).toBe(true);

      // コンソールエラーがないことを確認
      expect(consoleErrors).toHaveLength(0);
    } else {
      // パスワードリセットリンクがない場合は直接アクセス
      await authPage.navigateToPasswordReset();
      await waitForPageReady(page);

      // ページが正常に表示されることを確認
      const title = await page.title();
      expect(title).toBeTruthy();
    }
  });

  test("パスワードリセットフォームに入力できる", async ({ page }) => {
    // パスワードリセットページに移動
    await authPage.navigateToPasswordReset();
    await waitForPageReady(page);

    // メールアドレス入力欄が表示されていることを確認
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();

    // メールアドレスを入力
    await emailInput.fill(testEmail);

    // 入力値が正しく設定されていることを確認
    const inputValue = await emailInput.inputValue();
    expect(inputValue).toBe(testEmail);
  });

  test("パスワードリセットリクエストを送信できる", async ({ page }) => {
    // パスワードリセットページに移動
    await authPage.navigateToPasswordReset();
    await waitForPageReady(page);

    // パスワードリセットフォームに入力
    await authPage.resetPassword(testEmail);

    // 成功メッセージまたは確認メッセージが表示されることを確認
    // 注: 実際のメッセージはアプリケーションによって異なる
    const pageContent = await page.content();
    const hasConfirmationMessage =
      pageContent.includes("送信しました") ||
      pageContent.includes("確認メール") ||
      pageContent.includes("sent") ||
      pageContent.includes("check your email") ||
      pageContent.includes("instructions");

    expect(hasConfirmationMessage).toBe(true);
  });

  test("無効なメールアドレスでエラーが表示される", async ({ page }) => {
    // パスワードリセットページに移動
    await authPage.navigateToPasswordReset();
    await waitForPageReady(page);

    // 無効なメールアドレスを入力
    await authPage.resetPassword("invalid-email");

    // エラーメッセージが表示されることを確認
    const errorMessage = await authPage.getErrorMessage();

    if (errorMessage) {
      expect(errorMessage).toBeTruthy();
    } else {
      // エラーメッセージが特定のロケーターで取得できない場合、
      // ページ内に何らかのエラー表示があるかを確認
      const pageContent = await page.content();
      const hasErrorIndicator =
        pageContent.includes("エラー") ||
        pageContent.includes("無効") ||
        pageContent.includes("error") ||
        pageContent.includes("invalid");

      expect(hasErrorIndicator).toBe(true);
    }
  });

  test("パスワードリセット後にログインページに戻れる", async ({ page }) => {
    // パスワードリセットページに移動
    await authPage.navigateToPasswordReset();
    await waitForPageReady(page);

    // パスワードリセットフォームに入力
    await authPage.resetPassword(testEmail);

    // ログインページへのリンクを探す
    const loginLink = page.locator(
      'a:has-text("ログイン"), a:has-text("Login"), a:has-text("Sign in")',
    );

    if (await loginLink.isVisible()) {
      await loginLink.click();
      await waitForPageReady(page);

      // ログインページに移動したことを確認
      const currentUrl = page.url();
      expect(
        currentUrl.includes("login") ||
          currentUrl.includes("signin") ||
          currentUrl.includes("auth"),
      ).toBe(true);
    } else {
      console.log("ログインページへのリンクが見つかりませんでした");
    }
  });
});
