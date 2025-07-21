import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base-page";

/**
 * 設定ページのページオブジェクト
 *
 * 言語設定やテーマ設定などの設定ページの要素と操作を定義します。
 */
export class SettingsPage extends BasePage {
  // ページ要素のロケーター
  private readonly languageSelect: Locator;
  private readonly themeToggle: Locator;
  private readonly darkModeToggle: Locator;
  private readonly lightModeToggle: Locator;
  private readonly systemThemeToggle: Locator;
  private readonly saveButton: Locator;
  private readonly resetButton: Locator;
  private readonly successMessage: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    // 要素のロケーターを初期化
    this.languageSelect = page.locator(
      'select[name="language"], [role="combobox"][aria-label*="言語"], [role="combobox"][aria-label*="Language"], [data-testid="language-selector"]',
    );
    this.themeToggle = page.locator(
      '[data-testid="theme-toggle"], .theme-toggle',
    );
    this.darkModeToggle = page.locator(
      'button:has-text("ダーク"), button:has-text("Dark"), [data-theme="dark"]',
    );
    this.lightModeToggle = page.locator(
      'button:has-text("ライト"), button:has-text("Light"), [data-theme="light"]',
    );
    this.systemThemeToggle = page.locator(
      'button:has-text("システム"), button:has-text("System"), [data-theme="system"]',
    );
    this.saveButton = page.locator(
      'button[type="submit"], button:has-text("保存"), button:has-text("Save")',
    );
    this.resetButton = page.locator(
      'button:has-text("リセット"), button:has-text("Reset")',
    );
    this.successMessage = page.locator(
      '[data-testid="success-message"], .success-message',
    );
    this.errorMessage = page.locator(
      '[data-testid="error-message"], .error-message',
    );
  }

  /**
   * 設定ページに移動
   */
  async navigateToSettings(): Promise<void> {
    await this.goto("/settings");
  }

  /**
   * 言語設定ページに移動
   */
  async navigateToLanguageSettings(): Promise<void> {
    await this.goto("/settings/language");
  }

  /**
   * テーマ設定ページに移動
   */
  async navigateToThemeSettings(): Promise<void> {
    await this.goto("/settings/theme");
  }

  /**
   * 言語を選択
   */
  async selectLanguage(language: string): Promise<void> {
    if (await this.isElementVisible(this.languageSelect)) {
      await this.languageSelect.selectOption({ value: language });
    } else {
      // 言語選択ボタンを探す
      const languageButton = this.page.locator(
        `button:has-text("${language}")`,
      );
      if (await languageButton.isVisible()) {
        await languageButton.click();
      }
    }
    await this.waitForPageLoad();
  }

  /**
   * テーマトグルをクリック
   */
  async clickThemeToggle(): Promise<void> {
    if (await this.isElementVisible(this.themeToggle)) {
      await this.clickElement(this.themeToggle);
      await this.waitForPageLoad();
    }
  }

  /**
   * ダークモードを有効化
   */
  async enableDarkMode(): Promise<void> {
    if (await this.isElementVisible(this.darkModeToggle)) {
      await this.clickElement(this.darkModeToggle);
    } else {
      // ダークモードを直接設定
      await this.page.evaluate(() => {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      });
    }
    await this.waitForPageLoad();
  }

  /**
   * ライトモードを有効化
   */
  async enableLightMode(): Promise<void> {
    if (await this.isElementVisible(this.lightModeToggle)) {
      await this.clickElement(this.lightModeToggle);
    } else {
      // ライトモードを直接設定
      await this.page.evaluate(() => {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      });
    }
    await this.waitForPageLoad();
  }

  /**
   * システムテーマを有効化
   */
  async enableSystemTheme(): Promise<void> {
    if (await this.isElementVisible(this.systemThemeToggle)) {
      await this.clickElement(this.systemThemeToggle);
      await this.waitForPageLoad();
    }
  }

  /**
   * 保存ボタンをクリック
   */
  async clickSaveButton(): Promise<void> {
    if (await this.isElementVisible(this.saveButton)) {
      await this.clickElement(this.saveButton);
      await this.waitForPageLoad();
    }
  }

  /**
   * リセットボタンをクリック
   */
  async clickResetButton(): Promise<void> {
    if (await this.isElementVisible(this.resetButton)) {
      await this.clickElement(this.resetButton);
      await this.waitForPageLoad();
    }
  }

  /**
   * 現在の言語設定を取得
   */
  async getCurrentLanguage(): Promise<string> {
    return await this.page.evaluate(() => {
      return document.documentElement.lang || navigator.language || "ja";
    });
  }

  /**
   * 現在のテーマ設定を取得
   */
  async getCurrentTheme(): Promise<string> {
    return await this.page.evaluate(() => {
      if (document.documentElement.classList.contains("dark")) {
        return "dark";
      } else {
        return "light";
      }
    });
  }

  /**
   * ダークモードが有効かチェック
   */
  async isDarkModeEnabled(): Promise<boolean> {
    return await this.page.evaluate(() => {
      return document.documentElement.classList.contains("dark");
    });
  }

  /**
   * 成功メッセージを取得
   */
  async getSuccessMessage(): Promise<string> {
    if (await this.isElementVisible(this.successMessage)) {
      return await this.getElementText(this.successMessage);
    }
    return "";
  }

  /**
   * エラーメッセージを取得
   */
  async getErrorMessage(): Promise<string> {
    if (await this.isElementVisible(this.errorMessage)) {
      return await this.getElementText(this.errorMessage);
    }
    return "";
  }
}
