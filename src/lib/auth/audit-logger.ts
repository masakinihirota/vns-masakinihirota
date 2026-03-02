/**
 * RBAC Audit Logger
 *
 * @description
 * アクセス拒否時の監査ログを記録するヘルパー関数群
 * 構造化ログにより、誰が・何に・なぜアクセスを拒否されたかを追跡可能にする
 */

export interface RBACAccessDeniedLog {
  timestamp: string;
  userId: string | null;
  userProfileId: string | null;
  resourceType: string;
  resourceId: string | null;
  requiredPermission: string;
  reason: string;
  context?: Record<string, unknown>;
}

/**
 * アクセス拒否監査ログを出力
 *
 * @param log - 監査ログデータ
 *
 * @example
 * logAccessDenied({
 *   userId: 'user-123',
 *   userProfileId: 'profile-456',
 *   resourceType: 'group',
 *   resourceId: 'group-789',
 *   requiredPermission: 'leader',
 *   reason: 'Insufficient role: user has member, requires leader',
 *   context: { userRole: 'member', requiredRole: 'leader' }
 * });
 */
export function logAccessDenied(log: Omit<RBACAccessDeniedLog, 'timestamp'>): void {
  const fullLog: RBACAccessDeniedLog = {
    ...log,
    timestamp: new Date().toISOString(),
  };

  // 構造化ログとして出力
  console.warn('[RBAC_ACCESS_DENIED]', JSON.stringify(fullLog, null, 2));

  // 本番環境では、ログ収集サービス（Datadog, Sentry, CloudWatch）に送信
  // if (process.env.NODE_ENV === 'production') {
  //   await logService.send('rbac_access_denied', fullLog);
  // }
}

/**
 * 認証失敗監査ログを出力（401 Unauthorized）
 *
 * @param resourceType - アクセス試行したリソースタイプ
 * @param resourceId - アクセス試行したリソースID
 * @param reason - 認証失敗理由
 *
 * @example
 * logAuthenticationFailed('group', 'group-123', 'Session not found');
 */
export function logAuthenticationFailed(
  resourceType: string,
  resourceId: string | null,
  reason: string
): void {
  logAccessDenied({
    userId: null,
    userProfileId: null,
    resourceType,
    resourceId,
    requiredPermission: 'authenticated',
    reason: `Authentication failed: ${reason}`,
  });
}

/**
 * 権限不足監査ログを出力（403 Forbidden）
 *
 * @param userId - ユーザーID
 * @param userProfileId - ユーザープロフィールID
 * @param resourceType - アクセス試行したリソースタイプ
 * @param resourceId - アクセス試行したリソースID
 * @param requiredPermission - 必要な権限
 * @param reason - 権限不足の理由
 * @param context - 追加コンテキスト
 *
 * @example
 * logInsufficientPermission(
 *   'user-123',
 *   'profile-456',
 *   'group',
 *   'group-789',
 *   'leader',
 *   'Insufficient role',
 *   { userRole: 'member', requiredRole: 'leader' }
 * );
 */
export function logInsufficientPermission(
  userId: string,
  userProfileId: string | null,
  resourceType: string,
  resourceId: string | null,
  requiredPermission: string,
  reason: string,
  context?: Record<string, unknown>
): void {
  logAccessDenied({
    userId,
    userProfileId,
    resourceType,
    resourceId,
    requiredPermission,
    reason: `Insufficient permission: ${reason}`,
    context,
  });
}

/**
 * Ghost モード制限監査ログを出力（403 Forbidden）
 *
 * @param userId - ユーザーID
 * @param userProfileId - ユーザープロフィールID
 * @param resourceType - アクセス試行したリソースタイプ
 * @param operation - 試行した操作
 *
 * @example
 * logGhostModeRestriction('user-123', 'profile-456', 'post', 'create');
 */
export function logGhostModeRestriction(
  userId: string,
  userProfileId: string | null,
  resourceType: string,
  operation: string
): void {
  logAccessDenied({
    userId,
    userProfileId,
    resourceType,
    resourceId: null,
    requiredPermission: 'persona_mode',
    reason: `Ghost mode restriction: cannot ${operation} ${resourceType}`,
    context: { maskCategory: 'ghost', operation },
  });
}
