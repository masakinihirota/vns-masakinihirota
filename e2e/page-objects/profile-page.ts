import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base-page";

/**
 * プロファイルページのページオブジェクト
 *
 * プロファイル関連ページの要素と操作を定義します。
 */
export class ProfilePage extends BasePage {
  // ページ要素のロケーター
  private readonly profileForm: Locator;
  private readonly nameInput: Locator;
  private readonly bioInput: Locator;
  private readonly saveButton: Locator;
  private readonly cancelButton: Locator;
  private readonly profileImage: Locator;
  private readonly uploadButton: Locator;
  private readonly successMessage: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    // 要素のロケーターを初期化
    this.profileForm = page.locator(
      'form[data-testid="profile-form"], form:has([name="name"])',
    );
    this.nameInput = page.locator(
      'input[name="name"], input[placeholder*="名前"]',
    );
    this.bioInput = page.locator(
      'textarea[name="bio"], textarea[placeholder*="自己紹介"]',
    );
    this.saveButton = page.locator(
      'button[type="submit"], button:has-text("保存"), button:has-text("Save")',
    );
    this.cancelButton = page.locator(
      'button:has-text("キャンセル"), button:has-text("Cancel")',
    );
    this.profileImage = page.locator(
      'img[alt*="プロフィール"], img[alt*="profile"], [data-testid="profile-image"]',
    );
    this.uploadButton = page.locator(
      'button:has-text("アップロード"), button:has-text("Upload"), input[type="file"]',
    );
    this.successMessage = page.locator(
      '[data-testid="success-message"], .success-message',
    );
    this.errorMessage = page.locator(
      '[data-testid="error-message"], .error-message',
    );
  }

  /**
   * プロファイルページに移動
   */
  async navigateToProfile(): Promise<void> {
    await this.goto("/profile");
  }

  /**
   * プロファイル作成ページに移動
   */
  async navigateToCreateProfile(): Promise<void> {
    await this.goto("/profile/create");
  }

  /**
   * プロファイル編集ページに移動
   */
  async navigateToEditProfile(): Promise<void> {
    await this.goto("/profile/edit");
  }

  /**
   * 名前を入力
   */
  async enterName(name: string): Promise<void> {
    await this.fillText(this.nameInput, name);
  }

  /**
   * 自己紹介を入力
   */
  async enterBio(bio: string): Promise<void> {
    await this.fillText(this.bioInput, bio);
  }

  /**
   * 保存ボタンをクリック
   */
  async clickSaveButton(): Promise<void> {
    await this.clickElement(this.saveButton);
  }

  /**
   * キャンセルボタンをクリック
   */
  async clickCancelButton(): Promise<void> {
    await this.clickElement(this.cancelButton);
  }

  /**
   * プロファイル情報を入力して保存
   */
  async fillAndSaveProfile(name: string, bio: string): Promise<void> {
    await this.enterName(name);
    await this.enterBio(bio);
    await this.clickSaveButton();
    await this.waitForPageLoad();
  }

  /**
   * プロファイル画像をアップロード
   */
  async uploadProfileImage(filePath: string): Promise<void> {
    // ファイルアップロード入力が表示されている場合
    const fileInput = this.page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      await fileInput.setInputFiles(filePath);
    } else {
      // アップロードボタンをクリックしてファイル選択ダイアログを開く
      await this.clickElement(this.uploadButton);
      // ファイル選択ダイアログが開いたら、ファイルをアップロード
      await this.page.setInputFiles('input[type="file"]', filePath);
    }
    await this.waitForPageLoad();
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

  /**
   * プロファイルフォームが表示されているかチェック
   */
  async isProfileFormVisible(): Promise<boolean> {
    return await this.isElementVisible(this.profileForm);
  }

  /**
   * プロファイル画像が表示されているかチェック
   */
  async isProfileImageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.profileImage);
  }

  /**
   * 現在のプロファイル名を取得
   */
  async getCurrentProfileName(): Promise<string> {
    if (await this.isElementVisible(this.nameInput)) {
      return await this.nameInput.inputValue();
    }
    return "";
  }

  /**
   * 現在のプロファイル自己紹介を取得
   */
  async getCurrentProfileBio(): Promise<string> {
    if (await this.isElementVisible(this.bioInput)) {
      return await this.bioInput.inputValue();
    }
    return "";
  }
}
