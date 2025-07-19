import { Page, Locator, expect } from "@playwright/test";

/**
 * ベースページクラス
 *
 * 全てのページオブジェクトの基底クラスです。
 * 共通の機能とユーティリティメソッドを提供します。
 */

export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * ページに移動
   */
  async goto(path = ""): Promise<void> {
    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  /**
   * ページの読み込み完了を待機
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * 要素が表示されるまで待機
   */
  async waitForElement(locator: Locator, timeout = 5000): Promise<void> {
    await locator.waitFor({ state: "visible", timeout });
  }

  /**
   * 要素をクリック
   */
  async clickElement(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.click();
  }

  /**
   * テキストを入力
   */
  async fillText(locator: Locator, text: string): Promise<void> {
    await this.waitForElement(locator);
    await locator.fill(text);
  }

  /**
   * ページタイトルを取得
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * 現在のURLを取得
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * スクリーンショットを撮影
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage: true,
    });
  }

  /**
   * 要素のテキストを取得
   */
  async getElementText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return (await locator.textContent()) || "";
  }

  /**
   * 要素が表示されているかチェック
   */
  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: "visible", timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * ページの読み込み状態をチェック
   */
  async isPageLoaded(): Promise<boolean> {
    const readyState = await this.page.evaluate(() => document.readyState);
    return readyState === "complete";
  }

  /**
   * エラーメッセージの表示をチェック
   */
  async checkForErrors(): Promise<string[]> {
    const errors: string[] = [];

    // コンソールエラーをチェック
    this.page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(`Console Error: ${msg.text()}`);
      }
    });

    // ページエラーをチェック
    this.page.on("pageerror", (error) => {
      errors.push(`Page Error: ${error.message}`);
    });

    return errors;
  }

  /**
   * レスポンシブデザインのテスト用にビューポートを変更
   */
  async setViewportSize(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
  }

  /**
   * モバイルビューポートに設定
   */
  async setMobileViewport(): Promise<void> {
    await this.setViewportSize(375, 667); // iPhone SE サイズ
  }

  /**
   * デスクトップビューポートに設定
   */
  async setDesktopViewport(): Promise<void> {
    await this.setViewportSize(1280, 720);
  }

  /**
   * ダークモードに切り替え
   */
  async enableDarkMode(): Promise<void> {
    await this.page.evaluate(() => {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    });
  }

  /**
   * ライトモードに切り替え
   */
  async enableLightMode(): Promise<void> {
    await this.page.evaluate(() => {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    });
  }

  /**
   * 言語を変更（国際化テスト用）
   */
  async changeLanguage(locale: string): Promise<void> {
    await this.page.evaluate((locale) => {
      localStorage.setItem("locale", locale);
    }, locale);
    await this.page.reload();
    await this.waitForPageLoad();
  }
}
