import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base-page";

/**
 * 認証ページのページオブジェクト
 *
 * ログイン、登録、パスワードリセットなどの認証関連ページの要素と操作を定義します。
 */
export class AuthPage extends BasePage {
  // ページ要素のロケーター
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly signupButton: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly resetPasswordButton: Locator;
  private readonly googleLoginButton: Locator;
  private readonly githubLoginButton: Locator;
  private readonly logoutButton: Locator;
  private readonly errorMessage: Locator;
  private readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);

    // 要素のロケーターを初期化
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton = page.locator(
      'button:has-text("ログイン"), button:has-text("Login")',
    );
    this.signupButton = page.locator(
      'button:has-text("登録"), button:has-text("Sign up")',
    );
    this.forgotPasswordLink = page.locator(
      'a:has-text("パスワードをお忘れですか？"), a:has-text("Forgot password?")',
    );
    this.resetPasswordButton = page.locator(
      'button:has-text("パスワードをリセット"), button:has-text("Reset password")',
    );
    this.googleLoginButton = page.locator('button:has-text("Google")');
    this.githubLoginButton = page.locator('button:has-text("GitHub")');
    this.logoutButton = page.locator(
      'button:has-text("ログアウト"), button:has-text("Logout")',
    );
    this.errorMessage = page.locator(
      '[data-testid="error-message"], .error-message',
    );
    this.successMessage = page.locator(
      '[data-testid="success-message"], .success-message',
    );
  }

  /**
   * ログインページに移動
   */
  async navigateToLogin(): Promise<void> {
    await this.goto("/login");
  }

  /**
   * 登録ページに移動
   */
  async navigateToSignup(): Promise<void> {
    await this.goto("/signup");
  }

  /**
   * パスワードリセットページに移動
   */
  async navigateToPasswordReset(): Promise<void> {
    await this.goto("/reset-password");
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
  async clickLoginButton(): Promise<void> {
    await this.clickElement(this.loginButton);
  }

  /**
   * 登録ボタンをクリック
   */
  async clickSignupButton(): Promise<void> {
    await this.clickElement(this.signupButton);
  }

  /**
   * パスワードをお忘れですか？リンクをクリック
   */
  async clickForgotPasswordLink(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink);
  }

  /**
   * パスワードリセットボタンをクリック
   */
  async clickResetPasswordButton(): Promise<void> {
    await this.clickElement(this.resetPasswordButton);
  }

  /**
   * Googleログインボタンをクリック
   */
  async clickGoogleLoginButton(): Promise<void> {
    await this.clickElement(this.googleLoginButton);
  }

  /**
   * GitHubログインボタンをクリック
   */
  async clickGithubLoginButton(): Promise<void> {
    await this.clickElement(this.githubLoginButton);
  }

  /**
   * ログアウトボタンをクリック
   */
  async clickLogoutButton(): Promise<void> {
    await this.clickElement(this.logoutButton);
  }

  /**
   * ログインフォームに入力してログイン
   */
  async login(email: string, password: string): Promise<void> {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLoginButton();
    await this.waitForPageLoad();
  }

  /**
   * 登録フォームに入力して登録
   */
  async signup(email: string, password: string): Promise<void> {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickSignupButton();
    await this.waitForPageLoad();
  }

  /**
   * パスワードリセットフォームに入力してリセット
   */
  async resetPassword(email: string): Promise<void> {
    await this.enterEmail(email);
    await this.clickResetPasswordButton();
    await this.waitForPageLoad();
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
   * ログイン状態かどうかを確認
   */
  async isLoggedIn(): Promise<boolean> {
    // ログイン状態の確認方法はアプリケーションによって異なる
    // 例: ログアウトボタンが表示されているかどうかで判断
    return await this.isElementVisible(this.logoutButton);
  }

  /**
   * テスト用の認証状態を設定
   */
  async setTestAuthState(): Promise<void> {
    await this.page.evaluate(() => {
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
    await this.page.reload();
    await this.waitForPageLoad();
  }

  /**
   * 認証状態をクリア
   */
  async clearAuthState(): Promise<void> {
    await this.page.evaluate(() => {
      localStorage.removeItem("sb-127.0.0.1:54321-auth-token");
    });
    await this.page.reload();
    await this.waitForPageLoad();
  }
}
