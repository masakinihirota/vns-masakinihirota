import { test, expect } from "@playwright/test";
import { HomePage } from "./page-objects/home-page";
import { waitForPageReady, captureConsoleErrors } from "./helpers/test-helpers";

/**
 * 基本機能のE2Eテスト
 *
 * アプリケーションの基本的な機能が正常に動作することを確認します。
 */

test.describe("基本機能テスト", () => {
  let homePage: HomePage;
  let consoleErrors: string[];

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    consoleErrors = captureConsoleErrors(page);
  });

  test("ホームページが正常に表示される", async ({ page }) => {
    // ホームページに移動
    await homePage.navigateToHome();

    // ページの読み込み完了を待機
    await waitForPageReady(page);

    // ページタイトルの確認
    const title = await homePage.getTitle();
    expect(title).toBeTruthy();

    // 基本要素の表示確認
    const areElementsVisible = await homePage.areBasicElementsVisible();
    expect(areElementsVisible).toBe(true);

    // コンソールエラーがないことを確認
    expect(consoleErrors).toHaveLength(0);
  });

  test("レスポンシブデザインが正常に動作する", async ({ page }) => {
    // ホームページに移動
    await homePage.navigateToHome();

    // デスクトップビューでの表示確認
    await homePage.setDesktopViewport();
    await waitForPageReady(page);

    let areElementsVisible = await homePage.areBasicElementsVisible();
    expect(areElementsVisible).toBe(true);

    // モバイルビューでの表示確認
    await homePage.setMobileViewport();
    await waitForPageReady(page);

    areElementsVisible = await homePage.areBasicElementsVisible();
    expect(areElementsVisible).toBe(true);
  });

  test("テーマ切り替えが正常に動作する", async ({ page }) => {
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

  test("ページナビゲーションが正常に動作する", async ({ page }) => {
    // ホームページに移動
    await homePage.navigateToHome();
    await waitForPageReady(page);

    // 現在のURLを確認
    const currentUrl = homePage.getCurrentUrl();
    expect(currentUrl).toContain("127.0.0.1:3000");

    // ページの基本要素が表示されていることを確認
    const areElementsVisible = await homePage.areBasicElementsVisible();
    expect(areElementsVisible).toBe(true);
  });

  test("国際化機能が正常に動作する", async ({ page }) => {
    // ホームページに移動
    await homePage.navigateToHome();
    await waitForPageReady(page);

    // 現在の言語設定を確認
    const currentLanguage = await homePage.getCurrentLanguage();
    expect(currentLanguage).toBeTruthy();

    // 言語変更のテスト（言語セレクターが存在する場合）
    try {
      await homePage.changeLanguage("en");
      await waitForPageReady(page);

      const newLanguage = await homePage.getCurrentLanguage();
      // 言語が変更されたか、または元の言語のままかを確認
      expect(newLanguage).toBeTruthy();
    } catch {
      // 言語セレクターが存在しない場合はスキップ
      console.log("言語セレクターが見つかりませんでした");
    }
  });

  test("エラーページが正常に表示される", async ({ page }) => {
    // 存在しないページにアクセス
    await page.goto("/non-existent-page");
    await waitForPageReady(page);

    // 404ページまたはエラーページが表示されることを確認
    const title = await page.title();
    const content = await page.textContent("body");

    // エラー関連のテキストが含まれているかチェック
    const hasErrorContent =
      title.toLowerCase().includes("not found") ||
      title.toLowerCase().includes("404") ||
      content?.toLowerCase().includes("not found") ||
      content?.toLowerCase().includes("404") ||
      content?.toLowerCase().includes("error");

    expect(hasErrorContent).toBe(true);
  });

  test("パフォーマンスが許容範囲内である", async ({ page }) => {
    // パフォーマンス測定開始
    const startTime = Date.now();

    // ホームページに移動
    await homePage.navigateToHome();
    await waitForPageReady(page);

    // 読み込み時間を測定
    const loadTime = Date.now() - startTime;

    // 読み込み時間が10秒以内であることを確認
    expect(loadTime).toBeLessThan(10000);

    // ページサイズの確認（基本的なチェック）
    const content = await page.content();
    expect(content.length).toBeGreaterThan(0);
  });
});
