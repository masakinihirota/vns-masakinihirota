/**
 * RBAC Audit Logger
 *
 * @description
 * アクセス拒否時の監査ログを記録するヘルパー関数群
 * 構造化ログにより、誰が・何に・なぜアクセスを拒否されたかを追跡可能にする
 */

import { logger } from "@/lib/logger";

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

export interface RBACAccessGrantedLog {
  timestamp: string;
  userId: string;
  userProfileId: string | null;
  resourceType: string;
  resourceId: string | null;
  permission: string;
  action: string;
}

/**
 * タイミング攻撃対策: 一定時間の遅延を追加
 * 権限チェックの成功・失敗で処理時間が異なることを防ぐ
 *
 * @param minMs - 最小遅延時間（ミリ秒、デフォルト10ms）
 * @param maxMs - 最大遅延時間（ミリ秒、デフォルト50ms）
 */
async function addTimingAttackProtection(minMs = 10, maxMs = 50): Promise<void> {
  // 本番環境でのみ有効化（開発環境ではテスト速度を優先）
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  await new Promise((resolve) => setTimeout(resolve, delay));
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
  logger.warn('[RBAC_ACCESS_DENIED]', { log: fullLog });

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

/**
 * アクセス成功監査ログを出力（監査証跡）
 *
 * @param log - 成功ログデータ
 *
 * @security
 * セキュリティクリティカルな操作（削除、管理者権限実行など）の記録用
 *
 * @example
 * logAccessGranted({
 *   userId: 'user-123',
 *   userProfileId: 'profile-456',
 *   resourceType: 'group',
 *   resourceId: 'group-789',
 *   permission: 'admin',
 *   action: 'delete_group'
 * });
 */
export function logAccessGranted(log: Omit<RBACAccessGrantedLog, 'timestamp'>): void {
  const fullLog: RBACAccessGrantedLog = {
    ...log,
    timestamp: new Date().toISOString(),
  };

  // セキュリティクリティカルな操作のみログ出力（負荷軽減）
  const criticalActions = [
    'delete',
    'ban',
    'promote_admin',
    'demote_admin',
    'transfer_ownership',
    'force_delete',
  ];

  const isCritical = criticalActions.some((action) =>
    log.action.toLowerCase().includes(action)
  );

  if (isCritical) {
    console.info('[RBAC_ACCESS_GRANTED]', JSON.stringify(fullLog, null, 2));
  }

  // 本番環境では全アクセス成功を記録（監査証跡）
  // if (process.env.NODE_ENV === 'production') {
  //   await logService.send('rbac_access_granted', fullLog);
  // }
}

/**
 * タイミング攻撃対策を実行
 * 外部から呼び出し可能にするためのエクスポート関数
 */
export async function applyTimingAttackProtection(): Promise<void> {
  await addTimingAttackProtection();
}

