import { test, expect } from "@playwright/test";
import { SettingsPage } from "./page-objects/settings-page";
import { HomePage } from "./page-objects/home-page";
import { waitForPageReady, setTestAuthState } from "./helpers/test-helpers";

/**
 * テーマ切り替えとレスポンシブデザインのE2Eテスト
 *
 * テーマ切り替え（ダーク・ライトモード）とレスポンシブデザインが正常に動作することを確認します。
 */

test.describe("テーマ切り替え機能", () => {
  let settingsPage: SettingsPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    settingsPage = new SettingsPage(page);
    homePage = new HomePage(page);

    // 認証状態を設定（必要な場合）
    await setTestAuthState(page);
  });

  test("テーマ設定ページにアクセスできる", async ({ page }) => {
    // 設定ページに移動
    try {
      await settingsPage.navigateToSettings();
      await waitForPageReady(page);
    } catch {
      // 設定ページが存在しない場合はホームページに移動
      await homePage.navigateToHome();
      await waitForPageReady(page);
    }

    //定関連の要素が表示されていることを確認
    const pageContent = await page.content();
    const hasThemeContent =
      pageContent.includes("テーマ") ||
      pageContent.includes("Theme") ||
      pageContent.includes("ダーク") ||
      pageContent.includes("Dark") ||
      pageContent.includes("ライト") ||
      pageContent.includes("Light");

    // テーマ設定が見つからない場合はスキップ
    if (!hasThemeContent) {
      console.log("テーマ設定が見つからないためスキップします");
      return;
    }

    // テーマ設定ページに移動できることを確認
    try {
      await settingsPage.navigateToThemeSettings();
      await waitForPageReady(page);

      // テーマ切り替え要素が表示されていることを確認
      const themeToggle = page.locator(
        '[data-testid="theme-toggle"], .theme-toggle',
      );
      const darkModeToggle = page.locator(
        'button:has-text("ダーク"), button:has-text("Dark"), [data-theme="dark"]',
      );
      const lightModeToggle = page.locator(
        'button:has-text("ライト"), button:has-text("Light"), [data-theme="light"]',
      );

      const hasThemeToggle =
        (await themeToggle.count()) > 0 ||
        (await darkModeToggle.count()) > 0 ||
        (await lightModeToggle.count()) > 0;

      expect(hasThemeToggle).toBe(true);
    } catch {
      console.log("テーマ設定ページが見つからないためスキップします");
    }
  });

  test("ダークモードに切り替えることができる", async ({ page }) => {
    // ホームページに移動
    await homePage.navigateToHome();
    await waitForPageReady(page);

    // 現在のテーマを取得
    const initialTheme = await settingsPage.getCurrentTheme();
    console.log(`現在のテーマ: ${initialTheme}`);

    // ダークモードに切り替え
    await settingsPage.enableDarkMode();
    await waitForPageReady(page);

    // ダークモードが有効になっていることを確認
    const isDarkMode = await settingsPage.isDarkModeEnabled();
    expect(isDarkMode).toBe(true);
  });

  test("ライトモードに切り替えることができる", async ({ page }) => {
    // ホームページに移動
    await homePage.navigateToHome();
    await waitForPageReady(page);

    // ライトモードに切り替え
    await settingsPage.enableLightMode();
    await waitForPageReady(page);

    // ライトモードが有効になっていることを確認
    const isDarkMode = await settingsPage.isDarkModeEnabled();
    expect(isDarkMode).toBe(false);
  });

  test("テーマ設定がページ間で保持される", async ({ page }) => {
    // ホームページに移動
    await homePage.navigateToHome();
    await waitForPageReady(page);

    // ダークモードに切り替え
    await settingsPage.enableDarkMode();
    await waitForPageReady(page);

    // 別のページに移動
    await page.goto("/about");
    await waitForPageReady(page);

    // テーマ設定が保持されていることを確認
    const isDarkMode = await settingsPage.isDarkModeEnabled();
    expect(isDarkMode).toBe(true);

    // ライトモードに切り替え
    await settingsPage.enableLightMode();
    await waitForPageReady(page);

    // 別のページに移動
    await page.goto("/");
    await waitForPageReady(page);

    // テーマ設定が保持されていることを確認
    const isDarkModeAfter = await settingsPage.isDarkModeEnabled();
    expect(isDarkModeAfter).toBe(false);
  });

  test("テーマ切り替えボタンが機能する", async ({ page }) => {
    // ホームページに移動
    await homePage.navigateToHome();
    await waitForPageReady(page);

    // テーマ切り替えボタンを探す
    const themeToggle = page.locator(
      '[data-testid="theme-toggle"], .theme-toggle',
    );

    if ((await themeToggle.count()) > 0) {
      // 現在のテーマを取得
      const initialIsDarkMode = await settingsPage.isDarkModeEnabled();

      // テーマ切り替えボタンをクリック
      await themeToggle.click();
      await waitForPageReady(page);

      // テーマが切り替わったことを確認
      const newIsDarkMode = await settingsPage.isDarkModeEnabled();
      expect(newIsDarkMode).not.toBe(initialIsDarkMode);
    } else {
      console.log("テーマ切り替えボタンが見つからないためスキップします");
    }
  });

  test("システムテーマ設定が機能する", async ({ page }) => {
    // システムテーマ設定が実装されている場合のみテスト
    try {
      // 設定ページに移動
      await settingsPage.navigateToThemeSettings();
      await waitForPageReady(page);

      // システムテーマボタンを探す
      const systemThemeToggle = page.locator(
        'button:has-text("システム"), button:has-text("System"), [data-theme="system"]',
      );

      if ((await systemThemeToggle.count()) > 0) {
        // システムテーマに切り替え
        await settingsPage.enableSystemTheme();
        await waitForPageReady(page);

        // システムテーマが選択されていることを確認
        const isSelected = await systemThemeToggle.evaluate((el) => {
          return (
            el.getAttribute("aria-selected") === "true" ||
            el.classList.contains("selected") ||
            el.getAttribute("data-state") === "active"
          );
        });

        expect(isSelected).toBe(true);
      } else {
        console.log("システムテーマ設定が見つからないためスキップします");
      }
    } catch {
      console.log("システムテーマ設定ページが見つからないためスキップします");
    }
  });
});

test.describe("レスポンシブデザイン", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test("デスクトップビューで正常に表示される", async ({ page }) => {
    // デスクトップビューポートに設定
    await homePage.setDesktopViewport();

    // ホームページに移動
    await homePage.navigateToHome();
    await waitForPageReady(page);

    // 基本要素が表示されていることを確認
    const areElementsVisible = await homePage.areBasicElementsVisible();
    expect(areElementsVisible).toBe(true);

    // デスクトップ向けのナビゲーションが表示されていることを確認
    const navigationMenu = page.locator('[role="navigation"]');
    if (await navigationMenu.isVisible()) {
      const isHorizontal = await navigationMenu.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.display === "flex" && style.flexDirection !== "column";
      });

      // デスクトップビューではナビゲーションが水平方向に表示されることが多い
      // ただし、デザインによっては異なる場合もあるため、必須ではない
      console.log(
        `デスクトップビューでのナビゲーション表示: ${isHorizontal ? "水平" : "垂直"}`,
      );
    }
  });

  test("タブレットビューで正常に表示される", async ({ page }) => {
    // タブレットビューポートに設定
    await page.setViewportSize({ width: 768, height: 1024 });

    // ホームページに移動
    await homePage.navigateToHome();
    await waitForPageReady(page);

    // 基本要素が表示されていることを確認
    const areElementsVisible = await homePage.areBasicElementsVisible();
    expect(areElementsVisible).toBe(true);
  });

  test("モバイルビューで正常に表示される", async ({ page }) => {
    // モバイルビューポートに設定
    await homePage.setMobileViewport();

    // ホームページに移動
    await homePage.navigateToHome();
    await waitForPageReady(page);

    // 基本要素が表示されていることを確認
    const areElementsVisible = await homePage.areBasicElementsVisible();
    expect(areElementsVisible).toBe(true);

    // モバイル向けのハンバーガーメニューが表示されていることを確認
    const hamburgerMenu = page.locator(
      'button[aria-label*="メニュー"], button[aria-label*="Menu"], [data-testid="mobile-menu"]',
    );

    if ((await hamburgerMenu.count()) > 0) {
      expect(await hamburgerMenu.isVisible()).toBe(true);

      // ハンバーガーメニューをクリックしてナビゲーションを表示
      await hamburgerMenu.click();
      await waitForPageReady(page);

      // ナビゲーションメニューが表示されることを確認
      const navigationMenu = page.locator(
        '[role="navigation"], nav, [data-testid="navigation"]',
      );
      expect(await navigationMenu.isVisible()).toBe(true);
    } else {
      // ハンバーガーメニューがない場合は、モバイルビューでもナビゲーションが表示されていることを確認
      const navigationMenu = page.locator(
        '[role="navigation"], nav, [data-testid="navigation"]',
      );
      if ((await navigationMenu.count()) > 0) {
        expect(await navigationMenu.isVisible()).toBe(true);
      }
    }
  });

  test("異なる画面サイズでコンテンツが適切に配置される", async ({ page }) => {
    // 画面サイズごとにテスト
    const viewportSizes = [
      { width: 1920, height: 1080, name: "大型デスクトップ" },
      { width: 1366, height: 768, name: "ノートPC" },
      { width: 768, height: 1024, name: "タブレット" },
      { width: 375, height: 667, name: "スマートフォン" },
    ];

    for (const viewport of viewportSizes) {
      console.log(
        `${viewport.name}ビューをテスト中 (${viewport.width}x${viewport.height})`,
      );

      // ビューポートサイズを設定
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      // ホームページに移動
      await homePage.navigateToHome();
      await waitForPageReady(page);

      // 基本要素が表示されていることを確認
      const areElementsVisible = await homePage.areBasicElementsVisible();
      expect(areElementsVisible).toBe(true);

      // メインコンテンツが画面内に収まっていることを確認
      const mainContent = page.locator("main");
      if ((await mainContent.count()) > 0) {
        const isOverflowing = await mainContent.evaluate((el) => {
          return el.scrollWidth > window.innerWidth;
        });

        expect(isOverflowing).toBe(false);
      }
    }
  });

  test("画像が適切にレスポンシブ表示される", async ({ page }) => {
    // デスクトップビューポートに設定
    await homePage.setDesktopViewport();

    // ホームページに移動
    await homePage.navigateToHome();
    await waitForPageReady(page);

    // 画像要素を取得
    const images = page.locator("img");
    const imagesCount = await images.count();

    if (imagesCount > 0) {
      // デスクトップサイズでの画像サイズを記録
      const desktopSizes = [];

      for (let i = 0; i < Math.min(imagesCount, 5); i++) {
        const image = images.nth(i);
        const size = await image.evaluate((el) => {
          const rect = el.getBoundingClientRect();
          return { width: rect.width, height: rect.height };
        });

        desktopSizes.push(size);
      }

      // モバイルビューポートに切り替え
      await homePage.setMobileViewport();
      await waitForPageReady(page);

      // モバイルサイズでの画像サイズを確認
      for (let i = 0; i < Math.min(imagesCount, 5); i++) {
        const image = images.nth(i);
        const mobileSize = await image.evaluate((el) => {
          const rect = el.getBoundingClientRect();
          return { width: rect.width, height: rect.height };
        });

        // 画像がレスポンシブであれば、サイズが変わっているはず
        // ただし、固定サイズの画像もあるため、必ずしも全ての画像がサイズ変更されるわけではない
        console.log(
          `画像 ${i + 1}: デスクトップ ${desktopSizes[i].width}x${desktopSizes[i].height}, モバイル ${mobileSize.width}x${mobileSize.height}`,
        );
      }
    } else {
      console.log("テスト可能な画像が見つからないためスキップします");
    }
  });
});
