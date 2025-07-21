import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base-page";

/**
 * スキル管理ページのページオブジェクト
 *
 * スキル一覧、作成、編集ページの要素と操作を定義します。
 */
export class SkillsPage extends BasePage {
  // ページ要素のロケーター
  private readonly skillsList: Locator;
  private readonly skillItem: Locator;
  private readonly addButton: Locator;
  private readonly skillForm: Locator;
  private readonly nameInput: Locator;
  private readonly categorySelect: Locator;
  private readonly levelSelect: Locator;
  private readonly descriptionInput: Locator;
  private readonly saveButton: Locator;
  private readonly cancelButton: Locator;
  private readonly deleteButton: Locator;
  private readonly confirmDeleteButton: Locator;
  private readonly successMessage: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    // 要素のロケーターを初期化
    this.skillsList = page.locator('[data-testid="skills-list"], .skills-list');
    this.skillItem = page.locator('[data-testid="skill-item"], .skill-item');
    this.addButton = page.locator(
      'button:has-text("スキルを追加"), button:has-text("Add Skill"), a:has-text("スキルを追加"), a:has-text("Add Skill")',
    );
    this.skillForm = page.locator(
      'form[data-testid="skill-form"], form:has([name="name"])',
    );
    this.nameInput = page.locator(
      'input[name="name"], input[placeholder*="スキル名"], input[placeholder*="Skill name"]',
    );
    this.categorySelect = page.locator(
      'select[name="category"], [role="combobox"][aria-label*="カテゴリ"], [role="combobox"][aria-label*="Category"]',
    );
    this.levelSelect = page.locator(
      'select[name="level"], [role="combobox"][aria-label*="レベル"], [role="combobox"][aria-label*="Level"]',
    );
    this.descriptionInput = page.locator(
      'textarea[name="description"], textarea[placeholder*="説明"], textarea[placeholder*="Description"]',
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
    this.successMessage = page.locator(
      '[data-testid="success-message"], .success-message',
    );
    this.errorMessage = page.locator(
      '[data-testid="error-message"], .error-message',
    );
  }

  /**
   * スキル一覧ページに移動
   */
  async navigateToSkillsList(): Promise<void> {
    await this.goto("/skills");
  }

  /**
   * スキル追加ページに移動
   */
  async navigateToAddSkill(): Promise<void> {
    await this.goto("/skills/add");
  }

  /**
   * スキル編集ページに移動
   */
  async navigateToEditSkill(skillId: string): Promise<void> {
    await this.goto(`/skills/edit/${skillId}`);
  }

  /**
   * スキルを追加ボタンをクリック
   */
  async clickAddButton(): Promise<void> {
    await this.clickElement(this.addButton);
  }

  /**
   * スキル名を入力
   */
  async enterName(name: string): Promise<void> {
    await this.fillText(this.nameInput, name);
  }

  /**
   * カテゴリを選択
   */
  async selectCategory(category: string): Promise<void> {
    await this.categorySelect.selectOption({ label: category });
  }

  /**
   * レベルを選択
   */
  async selectLevel(level: string): Promise<void> {
    await this.levelSelect.selectOption({ label: level });
  }

  /**
   * 説明を入力
   */
  async enterDescription(description: string): Promise<void> {
    await this.fillText(this.descriptionInput, description);
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
   * スキル情報を入力して保存
   */
  async fillAndSaveSkill(
    name: string,
    level: string,
    category?: string,
    description?: string,
  ): Promise<void> {
    await this.enterName(name);
    await this.selectLevel(level);
    if (category) {
      await this.selectCategory(category);
    }
    if (description) {
      await this.enterDescription(description);
    }
    await this.clickSaveButton();
    await this.waitForPageLoad();
  }

  /**
   * スキルを削除
   */
  async deleteSkill(): Promise<void> {
    await this.clickDeleteButton();
    // 確認ダイアログが表示される場合
    if (await this.isElementVisible(this.confirmDeleteButton)) {
      await this.clickConfirmDeleteButton();
    }
    await this.waitForPageLoad();
  }

  /**
   * スキル一覧の件数を取得
   */
  async getSkillsCount(): Promise<number> {
    return await this.skillItem.count();
  }

  /**
   * 特定のインデックスのスキルをクリック
   */
  async clickSkillItem(index = 0): Promise<void> {
    await this.skillItem.nth(index).click();
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
   * スキルフォームが表示されているかチェック
   */
  async isSkillFormVisible(): Promise<boolean> {
    return await this.isElementVisible(this.skillForm);
  }

  /**
   * スキル一覧が表示されているかチェック
   */
  async isSkillsListVisible(): Promise<boolean> {
    return await this.isElementVisible(this.skillsList);
  }
}
