import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base-page";

/**
 * 認証ページのページオブジェクト
 *
 * ログイン・サインアップページの要素と操作を定義します。
 */

export class AuthPage extends BasePage {
  // ページ要素のロケーター
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly signupButton: Locator;
  private readonly googleAuthButton: Locator;
  private readonly githubAuthButton: Locator;
  private readonly errorMessage: Locator;
  private readonly successMessage: Locator;
  private readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    super(page);

    // 要素のロケーターを初期化
    this.emailInput = page.locator('inppe="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton = page.locator('button:has-text("ログイン")');
    this.signupButton = page.locator('button:has-text("サインアップ")');
    this.googleAuthButton = page.locator('button:has-text("Google")');
    this.githubAuthButton = page.locator('button:has-text("GitHub")');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.successMessage = page.locator('[data-testid="success-message"]');
    this.forgotPasswordLink = page.locator('a:has-text("パスワードを忘れた")');
  }

  /**
   * ログインページに移動
   */
  async navigateToLogin(): Promise<void> {
    await this.goto("/login");
  }

  /**
   * サインアップページに移動
   */
  async navigateToSignup(): Promise<void> {
    await this.goto("/signup");
  }

  /**
   * メールアドレスを入力
   */
  async enterEmail(email: string): Promise<void> {
    await this.fillText(this.emailInput, email);
  }

  /**
   * パスワードを入力
   */
  async enterPassword(password: string): Promise<void> {
    await this.fillText(this.passwordInput, password);
  }

  /**
   * ログインボタンをクリック
   */
  async clickLogin(): Promise<void> {
    await this.clickElement(this.loginButton);
  }

  /**
   * サインアップボタンをクリック
   */
  async clickSignup(): Promise<void> {
    await this.clickElement(this.signupButton);
  }

  /**
   * Google認証ボタンをクリック
   */
  async clickGoogleAuth(): Promise<void> {
    await this.clickElement(this.googleAuthButton);
  }

  /**
   * GitHub認証ボタンをクリック
   */
  async clickGithubAuth(): Promise<void> {
    await this.clickElement(this.githubAuthButton);
  }

  /**
   * メールとパスワードでログイン
   */
  async loginWithCredentials(email: string, password: string): Promise<void> {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  /**
   * メールとパスワードでサインアップ
   */
  async signupWithCredentials(email: string, password: string): Promise<void> {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickSignup();
  }

  /**
   * エラーメッセージが表示されているかチェック
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  /**
   * 成功メッセージが表示されているかチェック
   */
  async isSuccessMessageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.successMessage);
  }

  /**
   * エラーメッセージのテキストを取得
   */
  async getErrorMessage(): Promise<string> {
    return await this.getElementText(this.errorMessage);
  }

  /**
   * 成功メッセージのテキストを取得
   */
  async getSuccessMessage(): Promise<string> {
    return await this.getElementText(this.successMessage);
  }

  /**
   * パスワード忘れリンクをクリック
   */
  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink);
  }

  /**
   * 認証フォームが表示されているかチェック
   */
  async isAuthFormVisible(): Promise<boolean> {
    const elements = [
      this.isElementVisible(this.emailInput),
      this.isElementVisible(this.passwordInput),
    ];

    const results = await Promise.all(elements);
    return results.every((result) => result === true);
  }

  /**
   * OAuth ボタンが表示されているかチェック
   */
  async areOAuthButtonsVisible(): Promise<boolean> {
    const googleVisible = await this.isElementVisible(this.googleAuthButton);
    const githubVisible = await this.isElementVisible(this.githubAuthButton);

    return googleVisible || githubVisible;
  }
}
