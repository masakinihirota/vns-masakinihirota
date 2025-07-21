/**
 * テストデータ生成関連のヘルパー
 *
 * このモジュールは、テストで使用するデータを生成するためのヘルパー関数を提供します。
 */

/**
 * テスト用のユーザーデータを作成
 *
 * @param overrides デフォルト値をオーバーライドするオブジェクト
 * @returns テスト用のユーザーオブジェクト
 */
export const createTestUser = (overrides = {}) => ({
  id: "test-user-id",
  email: "test@example.com",
  name: "テストユーザー",
  ...overrides,
});

/**
 * テスト用のプロファイルデータを作成
 *
 * @param overrides デフォルト値をオーバーライドするオブジェクト
 * @returns テスト用のプロファイルオブジェクト
 */
export const createTestProfile = (overrides = {}) => ({
  id: "test-profile-id",
  userId: "test-user-id",
  displayName: "テストプロフィール",
  bio: "これはテスト用のプロフィールです。",
  avatarUrl: "https://example.com/avatar.png",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

/**
 * テスト用の作品データを作成
 *
 * @param overrides デフォルト値をオーバーライドするオブジェクト
 * @returns テスト用の作品オブジェクト
 */
export const createTestWork = (overrides = {}) => ({
  id: "test-work-id",
  profileId: "test-profile-id",
  title: "テスト作品",
  description: "これはテスト用の作品です。",
  thumbnailUrl: "https://example.com/thumbnail.png",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

/**
 * テスト用のスキルデータを作成
 *
 * @param overrides デフォルト値をオーバーライドするオブジェクト
 * @returns テスト用のスキルオブジェクト
 */
export const createTestSkill = (overrides = {}) => ({
  id: "test-skill-id",
  profileId: "test-profile-id",
  name: "テストスキル",
  level: 3,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

/**
 * テスト用のグループデータを作成
 *
 * @param overrides デフォルト値をオーバーライドするオブジェクト
 * @returns テスト用のグループオブジェクト
 */
export const createTestGroup = (overrides = {}) => ({
  id: "test-group-id",
  name: "テストグループ",
  description: "これはテスト用のグループです。",
  avatarUrl: "https://example.com/group-avatar.png",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

/**
 * 複数のテストデータを一度に生成
 *
 * @param count 生成するデータの数
 * @param factory データ生成関数
 * @param overrides デフォルト値をオーバーライドするオブジェクト
 * @returns テストデータの配列
 */
export const createTestDataArray = <T>(
  count: number,
  factory: (overrides?: any) => T,
  overrides = {},
): T[] => {
  return Array.from({ length: count }, (_, index) =>
    factory({ ...overrides, id: `${overrides.id || "test"}-${index}` }),
  );
};
