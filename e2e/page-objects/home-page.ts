import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base-page";

/**
 * ホームページのページオブジェクト
 *
 * ホームページの要素と操作を定義します。
 */

export class HomePage extends BasePage {
  // ページ要素のロケーター
  private readonly navigationMenu: Locator;
  private readonly themeToggle: Locator;
  private readonly languageSelector: Locator;
  private readonly mainContent: Locator;
  private readonly footer: Locator;

  constructor(page: Page) {
    super(page);

    // 要素のロケーターを初期化
    this.navigationMenu = page.locator('[role="navigation"]');
    this.themeToggle = page.locator('[data-testid="theme-toggle"]');
    this.languageSelector = page.locator('[data-testid="language-selector"]');
    this.mainContent = page.locator("main");
    this.footer = page.locator("footer");
  }

  /**
   * ホームページに移動
   */
  async navigateToHome(): Promise<void> {
    await this.goto("/");
  }

  /**
   * ナビゲーションメニューが表示されているかチェック
   */
  async isNavigationVisible(): Promise<boolean> {
    return await this.isElementVisible(this.navigationMenu);
  }

  /**
   * テーマ切り替えボタンをクリック
   */
  async toggleTheme(): Promise<void> {
    await this.clickElement(this.themeToggle);
  }

  /**
   * 言語を変更
   */
  async selectLanguage(language: string): Promise<void> {
    if (await this.isElementVisible(this.languageSelector)) {
      await this.clickElement(this.languageSelector);
      const languageOption = this.page.locator(`[data-value="${language}"]`);
      await this.clickElement(languageOption);
    }
  }

  /**
   * メインコンテンツが表示されているかチェック
   */
  async isMainContentVisible(): Promise<boolean> {
    return await this.isElementVisible(this.mainContent);
  }

  /**
   * フッターが表示されているかチェック
   */
  async isFooterVisible(): Promise<boolean> {
    return await this.isElementVisible(this.footer);
  }

  /**
   * ページの基本要素が全て表示されているかチェック
   */
  async areBasicElementsVisible(): Promise<boolean> {
    const elements = [this.isMainContentVisible()];

    const results = await Promise.all(elements);
    return results.every((result) => result === true);
  }

  /**
   * ダークモードが適用されているかチェック
   */
  async isDarkModeActive(): Promise<boolean> {
    const darkClass = await this.page.evaluate(() => {
      return document.documentElement.classList.contains("dark");
    });
    return darkClass;
  }

  /**
   * 現在の言語設定を取得
   */
  async getCurrentLanguage(): Promise<string> {
    return await this.page.evaluate(() => {
      return document.documentElement.lang || "ja";
    });
  }
}
