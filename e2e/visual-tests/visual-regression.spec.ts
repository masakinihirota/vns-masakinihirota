import { test, expect } from "@playwright/test";
import { HomePage } from "../page-objects/home-page";

/**
 * ビジュアルリグレッションテスト
 *
 * スクリーンショット比較によるビジュアルテストを実行します。
 * UIの意図しない変更を検出するために使用されます。
 */

test.describe("ビジュアルリグレッションテスト", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test("ホームページのビジュアル比較 - デスクトップ", async ({ page }) => {
    // デスクトップサイズに設定
    await homePage.setDesktopViewport();

    // ホームページに移動
    await homePage.navigateToHome();

    // ページの読み込み完了を待機
    await homePage.waitForPageLoad();

    // スクリーンショット比較
    await expect(page).toHaveScreenshot("home-desktop.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("ホームページのビジュアル比較 - モバイル", async ({ page }) => {
    // モバイルサイズに設定
    await homePage.setMobileViewport();

    // ホームページに移動
    await homePage.navigateToHome();

    // ページの読み込み完了を待機
    await homePage.waitForPageLoad();

    // スクリーンショット比較
    await expect(page).toHaveScreenshot("home-mobile.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("ダークモードのビジュアル比較", async ({ page }) => {
    // ホームページに移動
    await homePage.navigateToHome();

    // ダークモードに切り替え
    await homePage.enableDarkMode();

    // ページの読み込み完了を待機
    await homePage.waitForPageLoad();

    // スクリーンショット比較
    await expect(page).toHaveScreenshot("home-dark-mode.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("ライトモードのビジュアル比較", async ({ page }) => {
    // ホームページに移動
    await homePage.navigateToHome();

    // ライトモードに切り替え
    await homePage.enableLightMode();

    // ページの読み込み完了を待機
    await homePage.waitForPageLoad();

    // スクリーンショット比較
    await expect(page).toHaveScreenshot("home-light-mode.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("コンポーネント単位のビジュアル比較", async ({ page }) => {
    // ホームページに移動
    await homePage.navigateToHome();

    // 特定のコンポーネントのスクリーンショット
    const navigation = page.locator('[role="navigation"]');
    if (await navigation.isVisible()) {
      await expect(navigation).toHaveScreenshot("navigation-component.png");
    }

    const mainContent = page.locator("main");
    if (await mainContent.isVisible()) {
      await expect(mainContent).toHaveScreenshot("main-content-component.png");
    }

    const footer = page.locator("footer");
    if (await footer.isVisible()) {
      await expect(footer).toHaveScreenshot("footer-component.png");
    }
  });

  test("レスポンシブデザインのビジュアル比較", async ({ page }) => {
    const viewports = [
      { name: "mobile", width: 375, height: 667 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "desktop", width: 1280, height: 720 },
      { name: "large-desktop", width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      // ビューポートサイズを設定
      await homePage.setViewportSize(viewport.width, viewport.height);

      // ホームページに移動
      await homePage.navigateToHome();

      // ページの読み込み完了を待機
      await homePage.waitForPageLoad();

      // スクリーンショット比較
      await expect(page).toHaveScreenshot(`home-${viewport.name}.png`, {
        fullPage: true,
        animations: "disabled",
      });
    }
  });

  test("インタラクション状態のビジュアル比較", async ({ page }) => {
    // ホームページに移動
    await homePage.navigateToHome();

    // ホバー状態のテスト（ボタンがある場合）
    const buttons = page.locator("button");
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      const firstButton = buttons.first();
      await firstButton.hover();

      await expect(page).toHaveScreenshot("button-hover-state.png", {
        animations: "disabled",
      });
    }

    // フォーカス状態のテスト（入力フィールドがある場合）
    const inputs = page.locator("input");
    const inputCount = await inputs.count();

    if (inputCount > 0) {
      const firstInput = inputs.first();
      await firstInput.focus();

      await expect(page).toHaveScreenshot("input-focus-state.png", {
        animations: "disabled",
      });
    }
  });

  test("エラー状態のビジュアル比較", async ({ page }) => {
    // エラー状態を意図的に作成
    await page.goto("/non-existent-page");

    // 404ページのスクリーンショット
    await expect(page).toHaveScreenshot("404-error-page.png", {
      fullPage: true,
      animations: "disabled",
    });
  });
});
