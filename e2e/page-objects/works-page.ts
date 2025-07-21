import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base-page";

/**
 * 作品管理ページのページオブジェクト
 *
 * 作品一覧、作成、編集、詳細ページの要素と操作を定義します。
 */
export class WorksPage extends BasePage {
  // ページ要素のロケーター
  private readonly worksList: Locator;
  private readonly workItem: Locator;
  private readonly createButton: Locator;
  private readonly workForm: Locator;
  private readonly titleInput: Locator;
  private readonly descriptionInput: Locator;
  private readonly categorySelect: Locator;
  private readonly tagsInput: Locator;
  private readonly saveButton: Locator;
  private readonly cancelButton: Locator;
  private readonly deleteButton: Locator;
  private readonly confirmDeleteButton: Locator;
  private readonly workImage: Locator;
  private readonly uploadButton: Locator;
  private readonly successMessage: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    // 要素のロケーターを初期化
    this.worksList = page.locator('[data-testid="works-list"], .works-list');
    this.workItem = page.locator('[data-testid="work-item"], .work-item');
    this.createButton = page.locator(
      'button:has-text("作品を追加"), button:has-text("Add Work"), a:has-text("作品を追加"), a:has-text("Add Work")',
    );
    this.workForm = page.locator(
      'form[data-testid="work-form"], form:has([name="title"])',
    );
    this.titleInput = page.locator(
      'input[name="title"], input[placeholder*="タイトル"], input[placeholder*="Title"]',
    );
    this.descriptionInput = page.locator(
      'textarea[name="description"], textarea[placeholder*="説明"], textarea[placeholder*="Description"]',
    );
    this.categorySelect = page.locator(
      'select[name="category"], [role="combobox"][aria-label*="カテゴリ"], [role="combobox"][aria-label*="Category"]',
    );
    this.tagsInput = page.locator(
      'input[name="tags"], input[placeholder*="タグ"], input[placeholder*="Tags"]',
    );
    this.saveButton = page.locator(
      'button[type="submit"], button:has-text("保存"), button:has-text("Save")',
    );
    this.cancelButton = page.locator(
      'button:has-text("キャンセル"), button:has-text("Cancel")',
    );
    this.deleteButton = page.locator(
      'button:has-text("削除"), button:has-text("Delete")',
    );
    this.confirmDeleteButton = page.locator(
      'button:has-text("確認"), button:has-text("Confirm")',
    );
    this.workImage = page.locator(
      'img[alt*="作品"], img[alt*="work"], [data-testid="work-image"]',
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
   * 作品一覧ページに移動
   */
  async navigateToWorksList(): Promise<void> {
    await this.goto("/works");
  }

  /**
   * 作品作成ページに移動
   */
  async navigateToCreateWork(): Promise<void> {
    await this.goto("/works/create");
  }

  /**
   * 作品編集ページに移動
   */
  async navigateToEditWork(workId: string): Promise<void> {
    await this.goto(`/works/edit/${workId}`);
  }

  /**
   * 作品詳細ページに移動
   */
  async navigateToWorkDetail(workId: string): Promise<void> {
    await this.goto(`/works/${workId}`);
  }

  /**
   * 作品を作成ボタンをクリック
   */
  async clickCreateButton(): Promise<void> {
    await this.clickElement(this.createButton);
  }

  /**
   * タイトルを入力
   */
  async enterTitle(title: string): Promise<void> {
    await this.fillText(this.titleInput, title);
  }

  /**
   * 説明を入力
   */
  async enterDescription(description: string): Promise<void> {
    await this.fillText(this.descriptionInput, description);
  }

  /**
   * カテゴリを選択
   */
  async selectCategory(category: string): Promise<void> {
    await this.categorySelect.selectOption({ label: category });
  }

  /**
   * タグを入力
   */
  async enterTags(tags: string): Promise<void> {
    await this.fillText(this.tagsInput, tags);
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
   * 削除ボタンをクリック
   */
  async clickDeleteButton(): Promise<void> {
    await this.clickElement(this.deleteButton);
  }

  /**
   * 削除確認ボタンをクリック
   */
  async clickConfirmDeleteButton(): Promise<void> {
    await this.clickElement(this.confirmDeleteButton);
  }

  /**
   * 作品情報を入力して保存
   */
  async fillAndSaveWork(
    title: string,
    description: string,
    category?: string,
  ): Promise<void> {
    await this.enterTitle(title);
    await this.enterDescription(description);
    if (category) {
      await this.selectCategory(category);
    }
    await this.clickSaveButton();
    await this.waitForPageLoad();
  }

  /**
   * 作品画像をアップロード
   */
  async uploadWorkImage(filePath: string): Promise<void> {
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
   * 作品を削除
   */
  async deleteWork(): Promise<void> {
    await this.clickDeleteButton();
    // 確認ダイアログが表示される場合
    if (await this.isElementVisible(this.confirmDeleteButton)) {
      await this.clickConfirmDeleteButton();
    }
    await this.waitForPageLoad();
  }

  /**
   * 作品一覧の件数を取得
   */
  async getWorksCount(): Promise<number> {
    return await this.workItem.count();
  }

  /**
   * 特定のインデックスの作品をクリック
   */
  async clickWorkItem(index = 0): Promise<void> {
    await this.workItem.nth(index).click();
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
   * 作品フォームが表示されているかチェック
   */
  async isWorkFormVisible(): Promise<boolean> {
    return await this.isElementVisible(this.workForm);
  }

  /**
   * 作品一覧が表示されているかチェック
   */
  async isWorksListVisible(): Promise<boolean> {
    return await this.isElementVisible(this.worksList);
  }

  /**
   * 作品画像が表示されているかチェック
   */
  async isWorkImageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.workImage);
  }

  /**
   * 現在の作品タイトルを取得
   */
  async getCurrentWorkTitle(): Promise<string> {
    if (await this.isElementVisible(this.titleInput)) {
      return await this.titleInput.inputValue();
    }
    return "";
  }

  /**
   * 現在の作品説明を取得
   */
  async getCurrentWorkDescription(): Promise<string> {
    if (await this.isElementVisible(this.descriptionInput)) {
      return await this.descriptionInput.inputValue();
    }
    return "";
  }
}
