import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base-page";

/**
 * グループ機能のページオブジェクト
 *
 * グループ一覧、作成、編集、詳細ページの要素と操作を定義します。
 */
export class GroupsPage extends BasePage {
  // ページ要素のロケーター
  private readonly groupsList: Locator;
  private readonly groupItem: Locator;
  private readonly createButton: Locator;
  private readonly groupForm: Locator;
  private readonly nameInput: Locator;
  private readonly descriptionInput: Locator;
  private readonly categorySelect: Locator;
  private readonly privacySelect: Locator;
  private readonly membersSection: Locator;
  private readonly addMemberButton: Locator;
  private readonly memberSearchInput: Locator;
  private readonly memberItem: Locator;
  private readonly saveButton: Locator;
  private readonly cancelButton: Locator;
  private readonly deleteButton: Locator;
  private readonly confirmDeleteButton: Locator;
  private readonly groupImage: Locator;
  private readonly uploadButton: Locator;
  private readonly successMessage: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    // 要素のロケーターを初期化
    this.groupsList = page.locator('[data-testid="groups-list"], .groups-list');
    this.groupItem = page.locator('[data-testid="group-item"], .group-item');
    this.createButton = page.locator(
      'button:has-text("グループを作成"), button:has-text("Create Group"), a:has-text("グループを作成"), a:has-text("Create Group")',
    );
    this.groupForm = page.locator(
      'form[data-testid="group-form"], form:has([name="name"])',
    );
    this.nameInput = page.locator(
      'input[name="name"], input[placeholder*="グループ名"], input[placeholder*="Group name"]',
    );
    this.descriptionInput = page.locator(
      'textarea[name="description"], textarea[placeholder*="説明"], textarea[placeholder*="Description"]',
    );
    this.categorySelect = page.locator(
      'select[name="category"], [role="combobox"][aria-label*="カテゴリ"], [role="combobox"][aria-label*="Category"]',
    );
    this.privacySelect = page.locator(
      'select[name="privacy"], [role="combobox"][aria-label*="公開設定"], [role="combobox"][aria-label*="Privacy"]',
    );
    this.membersSection = page.locator(
      '[data-testid="members-section"], .members-section',
    );
    this.addMemberButton = page.locator(
      'button:has-text("メンバーを追加"), button:has-text("Add Member")',
    );
    this.memberSearchInput = page.locator(
      'input[placeholder*="検索"], input[placeholder*="Search"]',
    );
    this.memberItem = page.locator('[data-testid="member-item"], .member-item');
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
    this.groupImage = page.locator(
      'img[alt*="グループ"], img[alt*="group"], [data-testid="group-image"]',
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
   * グループ一覧ページに移動
   */
  async navigateToGroupsList(): Promise<void> {
    await this.goto("/groups");
  }

  /**
   * グループ作成ページに移動
   */
  async navigateToCreateGroup(): Promise<void> {
    await this.goto("/groups/create");
  }

  /**
   * グループ編集ページに移動
   */
  async navigateToEditGroup(groupId: string): Promise<void> {
    await this.goto(`/groups/edit/${groupId}`);
  }

  /**
   * グループ詳細ページに移動
   */
  async navigateToGroupDetail(groupId: string): Promise<void> {
    await this.goto(`/groups/${groupId}`);
  }

  /**
   * グループを作成ボタンをクリック
   */
  async clickCreateButton(): Promise<void> {
    await this.clickElement(this.createButton);
  }

  /**
   * グループ名を入力
   */
  async enterName(name: string): Promise<void> {
    await this.fillText(this.nameInput, name);
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
   * 公開設定を選択
   */
  async selectPrivacy(privacy: string): Promise<void> {
    await this.privacySelect.selectOption({ label: privacy });
  }

  /**
   * メンバーを追加ボタンをクリック
   */
  async clickAddMemberButton(): Promise<void> {
    await this.clickElement(this.addMemberButton);
  }

  /**
   * メンバー検索
   */
  async searchMember(keyword: string): Promise<void> {
    await this.fillText(this.memberSearchInput, keyword);
    // 検索結果が表示されるまで待機
    await this.page.waitForTimeout(500);
  }

  /**
   * メンバーを選択
   */
  async selectMember(index = 0): Promise<void> {
    await this.memberItem.nth(index).click();
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
   * グループ情報を入力して保存
   */
  async fillAndSaveGroup(
    name: string,
    description: string,
    privacy?: string,
    category?: string,
  ): Promise<void> {
    await this.enterName(name);
    await this.enterDescription(description);
    if (privacy) {
      await this.selectPrivacy(privacy);
    }
    if (category) {
      await this.selectCategory(category);
    }
    await this.clickSaveButton();
    await this.waitForPageLoad();
  }

  /**
   * グループ画像をアップロード
   */
  async uploadGroupImage(filePath: string): Promise<void> {
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
   * メンバーを追加
   */
  async addMember(keyword: string): Promise<void> {
    await this.clickAddMemberButton();
    await this.searchMember(keyword);
    await this.selectMember(0);
    await this.waitForPageLoad();
  }

  /**
   * グループを削除
   */
  async deleteGroup(): Promise<void> {
    await this.clickDeleteButton();
    // 確認ダイアログが表示される場合
    if (await this.isElementVisible(this.confirmDeleteButton)) {
      await this.clickConfirmDeleteButton();
    }
    await this.waitForPageLoad();
  }

  /**
   * グループ一覧の件数を取得
   */
  async getGroupsCount(): Promise<number> {
    return await this.groupItem.count();
  }

  /**
   * 特定のインデックスのグループをクリック
   */
  async clickGroupItem(index = 0): Promise<void> {
    await this.groupItem.nth(index).click();
    await this.waitForPageLoad();
  }

  /**
   * メンバー数を取得
   */
  async getMembersCount(): Promise<number> {
    return await this.memberItem.count();
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
   * グループフォームが表示されているかチェック
   */
  async isGroupFormVisible(): Promise<boolean> {
    return await this.isElementVisible(this.groupForm);
  }

  /**
   * グループ一覧が表示されているかチェック
   */
  async isGroupsListVisible(): Promise<boolean> {
    return await this.isElementVisible(this.groupsList);
  }

  /**
   * メンバーセクションが表示されているかチェック
   */
  async isMembersSectionVisible(): Promise<boolean> {
    return await this.isElementVisible(this.membersSection);
  }

  /**
   * グループ画像が表示されているかチェック
   */
  async isGroupImageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.groupImage);
  }
}
