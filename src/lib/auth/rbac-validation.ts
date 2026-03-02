/**
 * RBAC Input Validation
 *
 * @description
 * RBAC関連の入力パラメータを検証するヘルパー関数群
 * SQLインジェクション、不正ID、権限昇格攻撃を防ぐ
 *
 * @security
 * - UUID形式の厳密な検証（v4のみ許可）
 * - 文字列長の制限
 * - 特殊文字のサニタイズ
 * - NULL/undefined/空文字の拒否
 */

// UUID v4 の正規表現（RFC 4122準拠）
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Auth User ID の正規表現（Better Authが生成する形式）
// 英数字、ハイフン、アンダースコアのみ（最大64文字）
const AUTH_USER_ID_REGEX = /^[a-zA-Z0-9_-]{1,64}$/;

/**
 * RBAC入力検証エラー
 */
export class RBACValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: unknown
  ) {
    super(message);
    this.name = 'RBACValidationError';
  }
}

/**
 * UUID v4形式の検証
 *
 * @param value - 検証対象の値
 * @param fieldName - フィールド名（エラーメッセージ用）
 * @returns 検証済みのUUID文字列
 * @throws RBACValidationError - 検証失敗時
 *
 * @example
 * const groupId = validateUUID(req.param('groupId'), 'groupId');
 */
export function validateUUID(value: unknown, fieldName: string): string {
  if (typeof value !== 'string') {
    throw new RBACValidationError(
      `${fieldName} must be a string`,
      fieldName,
      value
    );
  }

  if (!value || value.trim() === '') {
    throw new RBACValidationError(
      `${fieldName} cannot be empty`,
      fieldName,
      value
    );
  }

  if (!UUID_V4_REGEX.test(value)) {
    throw new RBACValidationError(
      `${fieldName} must be a valid UUID v4`,
      fieldName,
      value
    );
  }

  return value;
}

/**
 * Auth User ID形式の検証
 *
 * @param value - 検証対象の値
 * @param fieldName - フィールド名（エラーメッセージ用）
 * @returns 検証済みのUser ID文字列
 * @throws RBACValidationError - 検証失敗時
 *
 * @example
 * const userId = validateAuthUserId(session.user.id, 'userId');
 */
export function validateAuthUserId(value: unknown, fieldName: string): string {
  if (typeof value !== 'string') {
    throw new RBACValidationError(
      `${fieldName} must be a string`,
      fieldName,
      value
    );
  }

  if (!value || value.trim() === '') {
    throw new RBACValidationError(
      `${fieldName} cannot be empty`,
      fieldName,
      value
    );
  }

  if (!AUTH_USER_ID_REGEX.test(value)) {
    throw new RBACValidationError(
      `${fieldName} contains invalid characters`,
      fieldName,
      '[REDACTED]' // セキュリティ: 実際の値をログに残さない
    );
  }

  return value;
}

/**
 * セッションの有効性を検証
 *
 * @param session - セッション情報
 * @throws RBACValidationError - セッション無効時
 *
 * @security
 * - セッション存在チェック
 * - ユーザー情報存在チェック
 * - セッション有効期限チェック
 *
 * @example
 * validateSession(session);
 */
export function validateSession(session: unknown): asserts session is {
  user: { id: string; email: string; role?: string };
  session: { id: string; expiresAt: Date };
} {
  if (!session || typeof session !== 'object') {
    throw new RBACValidationError(
      'Session is required',
      'session',
      null
    );
  }

  const s = session as any;

  if (!s.user || typeof s.user !== 'object') {
    throw new RBACValidationError(
      'Session user is required',
      'session.user',
      null
    );
  }

  if (!s.user.id || typeof s.user.id !== 'string') {
    throw new RBACValidationError(
      'Session user.id is required',
      'session.user.id',
      null
    );
  }

  if (!s.session || typeof s.session !== 'object') {
    throw new RBACValidationError(
      'Session data is required',
      'session.session',
      null
    );
  }

  // セッション有効期限チェック
  if (s.session.expiresAt) {
    const expiresAt = new Date(s.session.expiresAt);
    if (expiresAt < new Date()) {
      throw new RBACValidationError(
        'Session has expired',
        'session.expiresAt',
        expiresAt
      );
    }
  }
}

/**
 * ロール値の検証
 *
 * @param role - ロール値
 * @param allowedRoles - 許可されるロール一覧
 * @param fieldName - フィールド名
 * @throws RBACValidationError - 検証失敗時
 */
export function validateRole<T extends string>(
  role: unknown,
  allowedRoles: readonly T[],
  fieldName: string
): T {
  if (typeof role !== 'string') {
    throw new RBACValidationError(
      `${fieldName} must be a string`,
      fieldName,
      role
    );
  }

  if (!allowedRoles.includes(role as T)) {
    throw new RBACValidationError(
      `${fieldName} must be one of: ${allowedRoles.join(', ')}`,
      fieldName,
      '[REDACTED]'
    );
  }

  return role as T;
}

/**
 * 複数のIDを一括検証
 *
 * @param ids - ID配列
 * @param fieldName - フィールド名
 * @returns 検証済みのID配列
 * @throws RBACValidationError - 検証失敗時
 */
export function validateUUIDs(ids: unknown[], fieldName: string): string[] {
  if (!Array.isArray(ids)) {
    throw new RBACValidationError(
      `${fieldName} must be an array`,
      fieldName,
      ids
    );
  }

  if (ids.length === 0) {
    throw new RBACValidationError(
      `${fieldName} cannot be empty`,
      fieldName,
      ids
    );
  }

  // 最大100件まで（DoS攻撃防止）
  if (ids.length > 100) {
    throw new RBACValidationError(
      `${fieldName} cannot exceed 100 items`,
      fieldName,
      `[${ids.length} items]`
    );
  }

  return ids.map((id, index) => 
    validateUUID(id, `${fieldName}[${index}]`)
  );
}
