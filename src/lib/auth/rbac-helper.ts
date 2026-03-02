"use server";

/**
 * RBAC Server Action権限チェックヘルパー関数
 *
 * このモジュールは所有権チェック関数を Server Action で使用するための
 * 権限チェックロジックを提供します。
 *
 * @design
 * - 4層評価の順序: platform_admin → context role → relationship → deny
 * - Deny-by-default: 明示的に許可されない限り拒否
 * - React cache() による同一リクエスト内キャッシュで、複数のDB発行を最適化
 * - すべてのkeyについて、セッションとDBロールの両方を比較
 *
 * @security
 * - SessionData の役割がmysqlを信頼できるため、DBから回収したロールと照合
 * - Server Actionでの権限チェックは必須（UIガード + Server Actionガード二重防御）
 * - コンテキスト検証: groupId / nationId の入力値を必ず検証
 */

import { cache } from "react";
import { db } from "@/lib/db/client";
import {
  groupMembers,
  nationGroups,
  relationships,
  rootAccounts,
  userProfiles,
} from "@/lib/db/schema.postgres";
import { eq, and } from "drizzle-orm";
import { RBAC_HIERARCHY } from "./rbac-constants";
import type {
  GroupRole,
  NationRole,
  RelationshipType,
  AuthSession,
} from "./types";
import {
  logAuthenticationFailed,
  logInsufficientPermission,
  logGhostModeRestriction,
  logAccessGranted,
  applyTimingAttackProtection,
} from "./audit-logger";
import {
  validateAuthUserId,
  validateUUID,
  validateSession,
  RBACValidationError,
} from "./rbac-validation";

/**
 * RBACエラークラス
 *
 * @design
 * - キャッシュやDB接続以外の予期しないエラーを区別可能
 * - ユーザー向けとログ用で異なるメッセージを保持
 */
class RBACError extends Error {
  constructor(
    public message: string,
    public code: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'RBACError';
  }
}


// Database client is imported from @/lib/db/client (singleton with connection pooling)

// ============================================================================
// User ID Conversion (userId → userProfileId)
// ============================================================================

/**
 * ユーザーの text ID (users.id) から uuid ID (userProfiles.id) に変換
 *
 * @design
 * - users.id (text) は Better Auth が提供する認証用 ID
 * - userProfiles.id (uuid) はビジネスロジック（RBAC）の基本単位
 * - 1ユーザー = 1 rootAccount = 1 userProfile という1対1関係
 * - React cache() による同一リクエスト内キャッシュで複数呼び出しを最適化
 *
 * @caching
 * - Strategy: React cache() によるリクエスト内キャッシュ
 * - Scope: 同一 Server Action エクスキューション内
 * - TTL: request end でリセット（明示的な削除なし）
 *
 * @param userId - Better Auth ユーザー ID (text)
 * @returns userProfiles の uuid | null （ユーザーが見つからない場合）
 *
 * @throws RBACError - DB接続やクエリが失敗した場合
 *
 * @example
 * const userProfileId = await getUserProfileId(userId);
 */
const _getUserProfileIdInternal = cache(async (userId: string): Promise<string | null> => {
  try {
    // 入力検証: userId の形式チェック
    if (!userId) {
      return null;
    }

    // Better Auth User ID の検証（英数字、ハイフン、アンダースコアのみ）
    try {
      validateAuthUserId(userId, 'userId');
    } catch (error) {
      if (error instanceof RBACValidationError) {
        logAuthenticationFailed('user_profile', null, `Invalid userId format: ${error.message}`);
        return null;
      }
      throw error;
    }

    // users.id(text) → root_accounts.auth_user_id → active_profile_id(uuid) を優先利用
    // active_profile_id が null の場合は deny-by-default で null を返す
    const result = await db
      .select({
        userProfileId: userProfiles.id,
      })
      .from(rootAccounts)
      .innerJoin(
        userProfiles,
        and(
          eq(rootAccounts.activeProfileId, userProfiles.id),
          eq(userProfiles.rootAccountId, rootAccounts.id)
        )
      )
      .where(eq(rootAccounts.authUserId, userId))
      .limit(1)
      .then((rows) => rows[0] || null);

    if (!result) {
      // ユーザーが見つからない場合は構成エラー
      console.warn(`[RBAC] User profile not found for userId: ${userId}`);
      return null;
    }

    return result.userProfileId;
  } catch (error) {
    console.error('[RBAC] Failed to get user profile', {
      userId,
      errorType: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
    });

    throw new RBACError(
      'Failed to verify user profile. Please try again.',
      'PROFILE_LOOKUP_FAILED',
      { userId }
    );
  }
});

// キャッシュ化したGetterを外部でも使用可能にする
export async function getUserProfileId(userId: string): Promise<string | null> {
  return await _getUserProfileIdInternal(userId);
}

// ============================================================================
// Ghost Mask Interaction Check (幽霊権限チェック)
// ============================================================================

/**
 * ユーザーの現在のマスク（userProfile）の mask_category を取得
 *
 * @param userId - Better Auth ユーザー ID (text)
 * @returns mask_category ('ghost' | 'persona') | null
 *
 * @design
 * - 1ユーザー = 1 rootAccount = 1 userProfile（デフォルト）
 * - 幽霊の仮面が自動作成される
 */
const _getMaskCategoryInternal = cache(async (userId: string): Promise<string | null> => {
  try {
    if (!userId) {
      return null;
    }

    const result = await db
      .select({
        maskCategory: userProfiles.maskCategory,
      })
      .from(rootAccounts)
      .innerJoin(
        userProfiles,
        and(
          eq(rootAccounts.activeProfileId, userProfiles.id),
          eq(userProfiles.rootAccountId, rootAccounts.id)
        )
      )
      .where(eq(rootAccounts.authUserId, userId))
      .limit(1)
      .then((rows) => rows[0] || null);

    if (!result) {
      console.warn(`[RBAC] Mask category not found for userId: ${userId}`);
      return null;
    }

    return result.maskCategory;
  } catch (error) {
    console.error('[RBAC] Failed to get mask category', {
      userId,
      errorType: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
    });

    throw new RBACError(
      'Failed to verify account type.',
      'MASK_LOOKUP_FAILED',
      { userId }
    );
  }
});

export async function getMaskCategory(userId: string): Promise<string | null> {
  return await _getMaskCategoryInternal(userId);
}

/**
 * ユーザーが「幽霊」（観測者）ロールかどうかをチェック
 *
 * @param session - セッション情報
 * @returns true: 幽霊（観測者）| false: ペルソナ（受肉）
 *
 * @design
 * 幽霊権限の境界:
 * - ALLOWED: 自身のルートアカウント設定（幽霊プロフィール自体の基本情報）の編集
 * - DENIED: 他者への評価（ティア付与）、コメント、作品投稿、組織（国）への参加
 *
 * @throws RBACError - ユーザープロフィール取得失敗時
 * @example
 * const isGhost = await isGhostMask(session);
 * if (isGhost) throw new Error('Ghost masks cannot perform this interaction');
 */
export async function isGhostMask(session: AuthSession | null): Promise<boolean> {
  if (!session?.user?.id) return false;

  try {
    const maskCategory = await _getMaskCategoryInternal(session.user.id);
    return maskCategory === "ghost";
  } catch (error) {
    // ✅ FIXED: DB エラー時は安全側に倒す（false ではなく throw）
    // 幽霊チェックが失敗した場合、その操作を拒否すべき
    console.error('[RBAC] Ghost mask check failed - BLOCKING INTERACTION', {
      userId: session.user.id,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error; // 呼び出し元で処理させる
  }
}

/**
 * インタラクション操作が許可されているかをチェック
 *
 * 幽霊の仮面は以下のインタラクションは実行不可:
 * - 他者への評価（tier/rating 付与）
 * - コメント投稿
 * - 作品投稿
 * - グループ/国への参加
 *
 * @param session - セッション情報
 * @returns true: インタラクション可能(ペルソナ) | false: インタラクション不可(幽霊)
 *
 * @throws RBACError - ユーザープロフィール取得失敗時
 *
 * @example
 * const canInteract = await checkInteractionAllowed(session);
 * if (!canInteract) {
 *   throw new RBACError('Ghost masks can only observe.', 'GHOST_MASK_INTERACTION_DENIED');
 * }
 */
export async function checkInteractionAllowed(session: AuthSession | null): Promise<boolean> {
  try {
    // セッション検証
    if (!session?.user?.id) {
      logAuthenticationFailed('interaction', null, 'Session not found');
      await applyTimingAttackProtection(); // タイミング攻撃対策
      return false;
    }

    // 入力検証: userId の形式チェック
    try {
      validateAuthUserId(session.user.id, 'session.user.id');
    } catch (error) {
      if (error instanceof RBACValidationError) {
        logAuthenticationFailed('interaction', null, `Invalid input: ${error.message}`);
        await applyTimingAttackProtection(); // タイミング攻撃対策
        return false;
      }
      throw error;
    }

    // platform_admin は全操作が可能
    if (session.user.role === "platform_admin") return true;

    // 幽霊の仮面はインタラクション不可
    const ghostMask = await isGhostMask(session);
    if (ghostMask) {
      // Ghost モード制限の監査ログ
      const userProfileId = await getUserProfileId(session.user.id);
      logGhostModeRestriction(
        session.user.id,
        userProfileId,
        'interaction',
        'interact'
      );
      await applyTimingAttackProtection(); // タイミング攻撃対策
    }
    return !ghostMask;
  } catch (error) {
    // エラー時は安全側に倒す（拒否）
    if (error instanceof RBACError) {
      await applyTimingAttackProtection(); // タイミング攻撃対策
      throw error;
    }
    await applyTimingAttackProtection(); // タイミング攻撃対策
    throw new RBACError(
      'Unable to verify interaction permissions.',
      'INTERACTION_CHECK_FAILED',
      { userId: session?.user?.id || 'unknown' }
    );
  }
}

/**
 * プラットフォーム管理者かどうかをチェック
 *
 * @param session - 継り受けたセッション ( Server Action パラメータ)
 * @returns true: プラットフォーム管理者 | false: 非管理者
 *
 * @example
 * const isAdmin = checkPlatformAdmin(session);
 * if (!isAdmin) throw new Error('Unauthorized: admin only');
 */
export async function checkPlatformAdmin(session: AuthSession | null): Promise<boolean> {
  if (!session?.user) return false;

  // セッションのロール情報で判定
  // (キャッシュで複数回の呼び出しを回避)
  return session.user.role === "platform_admin";
}

/**
 * ユーザーが必要な権限以上のロールを持っているかをチェック (階層判定)
 *
 * @param userRole - ユーザーの現在のロール
 * @param requiredRole - 必要な権限レベル
 * @returns true: 権限あり | false: 権限不足
 *
 * @example
 * // leader は sub_leader 権限が必要な操作に使用可
 * hasRoleOrHigher('leader', 'sub_leader') // true
 *
 * // member は sub_leader 権限に使用不可
 * hasRoleOrHigher('member', 'sub_leader') // false
 *
 * @design
 * - RBAC_HIERARCHY を使用した階層比較
 * - インデックスが高いほど、より多くの権限を持つ
 */
function hasRoleOrHigher(
  userRole: GroupRole | NationRole,
  requiredRole: GroupRole | NationRole,
): boolean {
  const userLevel = RBAC_HIERARCHY[userRole];
  const requiredLevel = RBAC_HIERARCHY[requiredRole];
  return userLevel >= requiredLevel;
}


/**
 * グループロール権限をチェック (キャッシュ対応・階層対応)
 *
 * React cache() を使用して、同一リクエスト内での複数DB発行を回避します。
 * キャッシュキーは [userId, groupId, role] の組みなっています。
 *
 * @caching
 * - Strategy: React cache() によるリクエスト内キャッシュ
 * - Scope: 同一 Server Action エクスキューション内
 * - 注意: 取り消し不可の操作（削除等）については checkGroupRoleWithoutCache() を使用推奨
 *
 * @param session - セッション情報
 * @param groupId - グループID
 * @param role - チェック対象ロール
 * @returns true: 権限あり | false: 権限なし
 *
 * @throws RBACError - DB接続またはユーザープロフィール取得失敗時
 * @example
 * // sub_leader 権限が必要な操作に対し、leader ユーザーがアクセス可能
 * const isLeader = await checkGroupRole(session, groupId, 'sub_leader');
 * if (!isLeader) throw new RBACError('Unauthorized by group', 'FORBIDDEN_GROUP_ROLE');
 *
 * @design
 * - platform_admin は全グループで操作可能（管理者権限）
 * - 階層チェック: userRole >= requiredRole を比較
 * - 例）leader は sub_leader, mediator, member 権限で操作可能
 * - React cache() による同一リクエスト内キャッシュで、複数のDB発行を最適化
 */
const _checkGroupRoleInternal = cache(
  async (
    userId: string,
    groupId: string,
    role: GroupRole,
  ): Promise<boolean> => {
    try {
      // userId (text) を userProfileId (uuid) に変換
      const userProfileId = await _getUserProfileIdInternal(userId);
      if (!userProfileId) {
        return false;  // ユーザーが見つからない
      }

      const member = await db
        .select()
        .from(groupMembers)
        .where(
          and(
            eq(groupMembers.userProfileId, userProfileId),
            eq(groupMembers.groupId, groupId),
          ),
        )
        .limit(1)
        .then((rows) => rows[0] || null);

      if (!member) {
        return false;  // グループメンバーシップがない
      }

      // 階層チェック: ユーザーが必要な権限以上を持っているか確認
      return hasRoleOrHigher(member.role as GroupRole, role);
    } catch (error) {
      console.error('[RBAC] Failed to check group role', {
        userId,
        groupId,
        role,
        errorType: error instanceof Error ? error.name : 'Unknown',
        errorMessage: error instanceof Error ? error.message : String(error),
      });

      throw new RBACError(
        'Failed to verify group permission.',
        'GROUP_ROLE_CHECK_FAILED',
        { userId, groupId, role }
      );
    }
  },
);

export async function checkGroupRole(
  session: AuthSession | null,
  groupId: string,
  role: GroupRole,
): Promise<boolean> {
  try {
    // セッション検証
    if (!session?.user?.id) {
      logAuthenticationFailed('group', groupId, 'Session not found');
      await applyTimingAttackProtection(); // タイミング攻撃対策
      return false;
    }

    // 入力検証: groupId の UUID 形式チェック
    try {
      validateUUID(groupId, 'groupId');
      validateAuthUserId(session.user.id, 'session.user.id');
    } catch (error) {
      if (error instanceof RBACValidationError) {
        logAuthenticationFailed('group', groupId, `Invalid input: ${error.message}`);
        await applyTimingAttackProtection(); // タイミング攻撃対策
        return false;
      }
      throw error;
    }

    // platform_admin は全リソースへの操作が可能
    if (session.user.role === "platform_admin") {
      // クリティカルな操作は成功ログも記録
      const userProfileId = await getUserProfileId(session.user.id).catch(() => null);
      logAccessGranted({
        userId: session.user.id,
        userProfileId,
        resourceType: 'group',
        resourceId: groupId,
        permission: 'platform_admin',
        action: `check_group_role_${role}`,
      });
      return true;
    }

    // ロール権限チェック
    const hasRole = await _checkGroupRoleInternal(session.user.id, groupId, role);

    if (!hasRole) {
      // 権限不足の監査ログ
      const userProfileId = await getUserProfileId(session.user.id);
      logInsufficientPermission(
        session.user.id,
        userProfileId,
        'group',
        groupId,
        role,
        'Insufficient group role',
        { requiredRole: role }
      );
      await applyTimingAttackProtection(); // タイミング攻撃対策
    }

    return hasRole;
  } catch (error) {
    // エラーが発生した場合は安全側に倒す（拒否）
    if (error instanceof RBACError) {
      console.error('[RBAC] Group role check error', error.context);
      const userProfileId = session?.user?.id
        ? await getUserProfileId(session.user.id).catch(() => null)
        : null;
      logInsufficientPermission(
        session?.user?.id || 'unknown',
        userProfileId,
        'group',
        groupId,
        role,
        'Group role check failed',
        { error: error.message }
      );
      await applyTimingAttackProtection(); // タイミング攻撃対策
      return false;  // デフォルト: 権限なし
    }
    throw error;
  }
}

/**
 * 国ロール権限をチェック (キャッシュ対応・階層対応)
 *
 * React cache() を使用して、同一リクエスト内での複数DB発行を回避。
 * キャッシュキー: [userId, nationId, role]
 *
 * @caching
 * - Strategy: React cache() によるリクエスト内キャッシュ
 * - Scope: 同一 Server Action エクスキューション内
 * - 注意: 取り消し不可の操作（削除等）については checkNationRoleWithoutCache() を使用推奨
 *
 * @param session - セッション情報
 * @param nationId - 国ID
 * @param role - チェック対象ロール
 * @returns true: 権限あり | false: 権限なし
 *
 * @throws RBACError - DB接続またはユーザープロフィール取得失敗時
 * @example
 * // sub_leader 権限が必要な操作
 * // leader ユーザーは higher hierarchy なので通過可能
 * const isNationLeader = await checkNationRole(session, nationId, 'sub_leader');
 * if (!isNationLeader) throw new RBACError('Unauthorized', 'FORBIDDEN_NATION_ROLE');
 *
 * @design
 * - nation_groups テーブルで組織が国に参加していることを確認
 * - ユーザーが属する組織のロール >= requiredRole を比較
 * - 階層チェック: higher role = より大きな権限
 *   leader (3) > sub_leader (2) > mediator (1) > member (0)
 * - チェック順序：
 *   1. platform_admin → 全国で操作可能
 *   2. nation_groups で確認 (階層付き)
 *   3. デフォルト：拒否（Deny-by-default）
 */
const _checkNationRoleInternal = cache(
  async (
    userId: string,
    nationId: string,
    role: NationRole,
  ): Promise<boolean> => {
    try {
      // userId (text) を userProfileId (uuid) に変換
      const userProfileId = await _getUserProfileIdInternal(userId);
      if (!userProfileId) {
        return false;  // ユーザーが見つからない
      }

      // ユーザーが属する組織が、国内でどのロールを持っているかを取得
      // クエリ概要：
      // - group_members から userProfileId で属する組織を取得
      // - nation_groups で該当組織が nationId に属するかチェック
      const result = await db
        .select({ nationRole: nationGroups.role })
        .from(groupMembers)
        .innerJoin(
          nationGroups,
          and(
            eq(groupMembers.groupId, nationGroups.groupId),
            eq(nationGroups.nationId, nationId),
          ),
        )
        .where(eq(groupMembers.userProfileId, userProfileId))
        .limit(1);

      if (result.length === 0) {
        return false;  // 組織が国に属していない
      }

      const userNationRole = result[0]?.nationRole as NationRole | undefined;
      if (!userNationRole) {
        return false;  // ロール情報がない
      }

      // 階層チェック: ユーザーが必要な権限以上を持っているか確認
      return hasRoleOrHigher(userNationRole, role);
    } catch (error) {
      console.error('[RBAC] Failed to check nation role', {
        userId,
        nationId,
        role,
        errorType: error instanceof Error ? error.name : 'Unknown',
        errorMessage: error instanceof Error ? error.message : String(error),
      });

      throw new RBACError(
        'Failed to verify nation permission.',
        'NATION_ROLE_CHECK_FAILED',
        { userId, nationId, role }
      );
    }
  },
);

export async function checkNationRole(
  session: AuthSession | null,
  nationId: string,
  role: NationRole,
): Promise<boolean> {
  try {
    // セッション検証
    if (!session?.user?.id) {
      logAuthenticationFailed('nation', nationId, 'Session not found');
      await applyTimingAttackProtection(); // タイミング攻撃対策
      return false;
    }

    // 入力検証: nationId の UUID 形式チェック
    try {
      validateUUID(nationId, 'nationId');
      validateAuthUserId(session.user.id, 'session.user.id');
    } catch (error) {
      if (error instanceof RBACValidationError) {
        logAuthenticationFailed('nation', nationId, `Invalid input: ${error.message}`);
        await applyTimingAttackProtection(); // タイミング攻撃対策
        return false;
      }
      throw error;
    }

    // platform_admin は全リソースへの操作が可能
    if (session.user.role === "platform_admin") {
      // クリティカルな操作は成功ログも記録
      const userProfileId = await getUserProfileId(session.user.id).catch(() => null);
      logAccessGranted({
        userId: session.user.id,
        userProfileId,
        resourceType: 'nation',
        resourceId: nationId,
        permission: 'platform_admin',
        action: `check_nation_role_${role}`,
      });
      return true;
    }

    // ロール権限チェック
    const hasRole = await _checkNationRoleInternal(session.user.id, nationId, role);

    if (!hasRole) {
      // 権限不足の監査ログ
      const userProfileId = await getUserProfileId(session.user.id);
      logInsufficientPermission(
        session.user.id,
        userProfileId,
        'nation',
        nationId,
        role,
        'Insufficient nation role',
        { requiredRole: role }
      );
      await applyTimingAttackProtection(); // タイミング攻撃対策
    }

    return hasRole;
  } catch (error) {
    // エラーが発生した場合は安全側に倒す（拒否）
    if (error instanceof RBACError) {
      console.error('[RBAC] Nation role check error', error.context);
      const userProfileId = session?.user?.id
        ? await getUserProfileId(session.user.id).catch(() => null)
        : null;
      logInsufficientPermission(
        session?.user?.id || 'unknown',
        userProfileId,
        'nation',
        nationId,
        role,
        'Nation role check failed',
        { error: error.message }
      );
      await applyTimingAttackProtection(); // タイミング攻撃対策
      return false;  // デフォルト: 権限なし
    }
    throw error;
  }
}

/**
 * ユーザー間の関係をチェック (キャッシュ対応)
 *
 * React cache() を使用して、同一リクエスト内での複数DB発行を回避。
 * キャッシュキー: [userId, targetUserId, relationship]
 *
 * @caching
 * - Strategy: React cache() によるリクエスト内キャッシュ
 * - Scope: 同一 Server Action エクスキューション内
 * - 注意: 取り消し不可の操作（削除等）については checkRelationshipWithoutCache() を使用推奨
 *
 * @param session - セッション情報
 * @param targetUserId - チェック対象ユーザーID
 * @param relationship - チェック対象関係シンボル
 * @returns true: 関係あり | false: 関係なし
 *
 * @throws RBACError - DB接続またはユーザープロフィール取得失敗時
 * @example
 * const isFriend = await checkRelationship(session, targetUserId, 'friend');
 * if (!isFriend) throw new RBACError('Not friends', 'RELATIONSHIP_NOT_FOUND');
 *
 * @design
 * - 非対称関係：ユーザーAからBへの 'friend' と、BからAへの 'friend' は異なる
 * - platform_admin は全ユーザー間の関係にアクセス可能
 * - relationships テーブルで direction を保ちながらチェック
 * - チェック順序：
 *   1. platform_admin → すべての関係にアクセス可能
 *   2. relationships で該当関係を確認
 *   3. デフォルト：拒否（Deny-by-default）
 */
const _checkRelationshipInternal = cache(
  async (
    userId: string,
    targetUserId: string,
    relationship: RelationshipType,
  ): Promise<boolean> => {
    try {
      // 自分自身への関係チェックを拒否
      if (userId === targetUserId) return false;

      // userId (text) を userProfileId (uuid) に変換
      const userProfileId = await _getUserProfileIdInternal(userId);
      const targetProfileId = await _getUserProfileIdInternal(targetUserId);
      if (!userProfileId || !targetProfileId) {
        return false;  // いずれかが見つからない
      }

      const rel = await db
        .select()
        .from(relationships)
        .where(
          and(
            eq(relationships.userProfileId, userProfileId),
            eq(relationships.targetProfileId, targetProfileId),
            eq(relationships.relationship, relationship),
          ),
        )
        .limit(1)
        .then((rows) => rows[0] || null);

      return rel !== null;
    } catch (error) {
      console.error('[RBAC] Failed to check relationship', {
        userId,
        targetUserId,
        relationship,
        errorType: error instanceof Error ? error.name : 'Unknown',
        errorMessage: error instanceof Error ? error.message : String(error),
      });

      throw new RBACError(
        'Failed to verify user relationship.',
        'RELATIONSHIP_CHECK_FAILED',
        { userId, targetUserId, relationship }
      );
    }
  },
);

export async function checkRelationship(
  session: AuthSession | null,
  targetUserId: string,
  relationship: RelationshipType,
): Promise<boolean> {
  if (!session?.user?.id) return false;

  // platform_admin は全ユーザー間の関係にアクセス可能
  if (session.user.role === "platform_admin") return true;

  try {
    // 関係チェック
    return await _checkRelationshipInternal(
      session.user.id,
      targetUserId,
      relationship,
    );
  } catch (error) {
    // エラーが発生した場合は安全側に倒す（拒否）
    if (error instanceof RBACError) {
      console.error('[RBAC] Relationship check error', error.context);
      return false;  // デフォルト: 関係なし
    }
    throw error;
  }
}

// ============================================================================
// Batch Authorization Checks
// ============================================================================

/**
 * 複数の権限チェックを並行実行するヘルパー関数
 *
 * @param session - セッション情報
 * @param checks - チェックリスト
 * @returns 全チェックの結果
 *
 * @example
 * const results = await checkMultiple(session, [
 *   { type: 'platformAdmin' },
 *   { type: 'groupRole', groupId: 'group-1', role: 'leader' },
 *   { type: 'relationship', targetUserId: 'user-2', relationship: 'friend' }
 * ]);
 * if (!results.all) throw new Error('Unauthorized');
 *
 * @design
 * - Promise.all() で並行実行、パフォーマンス最適化
 * - each チェックの結果を保持
 * - 全チェックの `all` フラグで全体判定を実装
 */
export interface AuthCheck {
  type: "platformAdmin" | "groupRole" | "nationRole" | "relationship";
  groupId?: string;
  nationId?: string;
  role?: GroupRole | NationRole;
  targetUserId?: string;
  relationship?: RelationshipType;
}

export interface AuthCheckResult {
  passed: boolean[];
  all: boolean;
  any: boolean;
}

export async function checkMultiple(
  session: AuthSession | null,
  checks: AuthCheck[],
): Promise<AuthCheckResult> {
  const results = await Promise.all(
    checks.map(async (check) => {
      switch (check.type) {
        case "platformAdmin":
          return await checkPlatformAdmin(session);
        case "groupRole":
          if (!check.groupId || !check.role) return false;
          return await checkGroupRole(
            session,
            check.groupId,
            check.role as GroupRole,
          );
        case "nationRole":
          if (!check.nationId || !check.role) return false;
          return await checkNationRole(
            session,
            check.nationId,
            check.role as NationRole,
          );
        case "relationship":
          if (!check.targetUserId || !check.relationship) return false;
          return await checkRelationship(
            session,
            check.targetUserId,
            check.relationship,
          );
        default:
          return false;
      }
    }),
  );

  return {
    passed: results,
    all: results.every((r) => r),
    any: results.some((r) => r),
  };
}

// ============================================================================
// Export Types and Functions
// ============================================================================

// withAuth は別ファイルに分離されています (./with-auth.ts から直接インポートしてください)

// 関数は定義時に export されています
// "use server" ファイルでは async 関数のみエクスポート可能なため、オブジェクトのエクスポートは削除しました

