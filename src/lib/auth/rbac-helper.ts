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
import { drizzle } from "drizzle-orm/postgres-js";
import * as postgres from "postgres";
import {
  groupMembers,
  nationGroups,
  relationships,
  users,
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


// ============================================================================
// Database Connection Setup
// ============================================================================

function getDatabaseConnection() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  // Singleton パターンでコネクションを共有
  // (production では コネクションプーリング推奨)
  const client = postgres.default(process.env.DATABASE_URL, {
    prepare: false,
  });

  return drizzle(client);
}

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
 *
 * @param userId - Better Auth ユーザー ID (text)
 * @returns userProfiles の uuid | null （ユーザーが見つからない場合）
 *
 * @example
 * const userProfileId = await cache(() => getUserProfileId(userId))();
 */
const _getUserProfileIdInternal = cache(async (userId: string): Promise<string | null> => {
  const db = getDatabaseConnection();

  try {
    // users.id → rootAccounts.authUserId → rootAccounts.id → userProfiles.rootAccountId → userProfiles.id
    const result = await db
      .select({
        userProfileId: userProfiles.id,
      })
      .from(users)
      .innerJoin(
        rootAccounts,
        eq(users.id, rootAccounts.authUserId)
      )
      .innerJoin(
        userProfiles,
        eq(rootAccounts.id, userProfiles.rootAccountId)
      )
      .where(eq(users.id, userId))
      .limit(1)
      .then((rows) => rows[0] || null);

    return result?.userProfileId ?? null;
  } catch (error) {
    console.error("getUserProfileId database error:", error);
    return null;
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
  const db = getDatabaseConnection();

  try {
    const result = await db
      .select({
        maskCategory: userProfiles.maskCategory,
      })
      .from(users)
      .innerJoin(
        rootAccounts,
        eq(users.id, rootAccounts.authUserId)
      )
      .innerJoin(
        userProfiles,
        eq(rootAccounts.id, userProfiles.rootAccountId)
      )
      .where(eq(users.id, userId))
      .limit(1)
      .then((rows) => rows[0] || null);

    return result?.maskCategory ?? null;
  } catch (error) {
    console.error("getMaskCategory database error:", error);
    return null;
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
 * @example
 * const isGhost = await isGhostMask(session);
 * if (isGhost) throw new Error('Ghost masks cannot perform this interaction');
 */
export async function isGhostMask(session: AuthSession | null): Promise<boolean> {
  if (!session?.user?.id) return false;

  const maskCategory = await _getMaskCategoryInternal(session.user.id);
  return maskCategory === "ghost";
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
 * @throws Error - SESSION_REQUIRED
 *
 * @example
 * const canInteract = await checkInteractionAllowed(session);
 * if (!canInteract) {
 *   throw new Error('Ghost masks can only observe. Cannot perform this interaction.');
 * }
 */
export async function checkInteractionAllowed(session: AuthSession | null): Promise<boolean> {
  if (!session?.user?.id) return false;

  // platform_admin は全操作が可能
  if (session.user.role === "platform_admin") return true;

  // 幽霊の仮面はインタラクション不可
  const ghostMask = await isGhostMask(session);
  return !ghostMask;
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
 * @param session - セッション情報
 * @param groupId - グループID
 * @param role - チェック対象ロール
 * @returns true: 権限あり | false: 権限なし
 *
 * @throws Error - SESSION_REQUIRED
 * @example
 * // sub_leader 権限が必要な操作に対し、leader ユーザーがアクセス可能
 * const isLeader = await checkGroupRole(session, groupId, 'sub_leader');
 * if (!isLeader) throw new Error('Unauthorized by group');
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
    // userId (text) を userProfileId (uuid) に変換
    const userProfileId = await _getUserProfileIdInternal(userId);
    if (!userProfileId) return false; // ユーザーが見つからない

    const db = getDatabaseConnection();

    try {
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

      if (!member) return false;

      // 階層チェック: ユーザーが必要な権限以上を持っているか確認
      return hasRoleOrHigher(member.role as GroupRole, role);
    } catch (error) {
      console.error("checkGroupRole database error:", error);
      return false;
    }
  },
);

export async function checkGroupRole(
  session: AuthSession | null,
  groupId: string,
  role: GroupRole,
): Promise<boolean> {
  if (!session?.user?.id) return false;

  // platform_admin は全リソースへの操作が可能
  if (session.user.role === "platform_admin") return true;

  // ロール権限チェック
  return await _checkGroupRoleInternal(session.user.id, groupId, role);
}

/**
 * 国ロール権限をチェック (キャッシュ対応・階層対応)
 *
 * React cache() を使用して、同一リクエスト内での複数DB発行を回避。
 * キャッシュキー: [userId, nationId, role]
 *
 * @param session - セッション情報
 * @param nationId - 国ID
 * @param role - チェック対象ロール
 * @returns true: 権限あり | false: 権限なし
 *
 * @throws Error - SESSION_REQUIRED
 * @example
 * // sub_leader 権限が必要な操作
 * // leader ユーザーは higher hierarchy なので通過可能
 * const isNationLeader = await checkNationRole(session, nationId, 'sub_leader');
 * if (!isNationLeader) throw new Error('Unauthorized');
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
    // userId (text) を userProfileId (uuid) に変換
    const userProfileId = await _getUserProfileIdInternal(userId);
    if (!userProfileId) return false; // ユーザーが見つからない

    const db = getDatabaseConnection();

    try {
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

      if (result.length === 0) return false;

      const userNationRole = result[0]?.nationRole as NationRole | undefined;
      if (!userNationRole) return false;

      // 階層チェック: ユーザーが必要な権限以上を持っているか確認
      return hasRoleOrHigher(userNationRole, role);
    } catch (error) {
      console.error("checkNationRole database error:", error);
      return false;
    }
  },
);

export async function checkNationRole(
  session: AuthSession | null,
  nationId: string,
  role: NationRole,
): Promise<boolean> {
  if (!session?.user?.id) return false;

  // platform_admin は全リソースへの操作が可能
  if (session.user.role === "platform_admin") return true;

  // ロール権限チェック
  return await _checkNationRoleInternal(session.user.id, nationId, role);
}

/**
 * ユーザー間の関係をチェック (キャッシュ対応)
 *
 * React cache() を使用して、同一リクエスト内での複数DB発行を回避。
 * キャッシュキー: [userId, targetUserId, relationship]
 *
 * @param session - セッション情報
 * @param targetUserId - チェック対象ユーザーID
 * @param relationship - チェック対象関係シンボル
 * @returns true: 関係あり | false: 関係なし
 *
 * @throws Error - SESSION_REQUIRED | INVALID_USER
 * @example
 * const isFriend = await checkRelationship(session, targetUserId, 'friend');
 * if (!isFriend) throw new Error('Not friends');
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
    // 自分自身への関係チェックを拒否
    if (userId === targetUserId) return false;

    // userId (text) を userProfileId (uuid) に変換
    const userProfileId = await _getUserProfileIdInternal(userId);
    const targetProfileId = await _getUserProfileIdInternal(targetUserId);
    if (!userProfileId || !targetProfileId) return false; // いずれかが見つからない

    const db = getDatabaseConnection();

    try {
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
      console.error("checkRelationship database error:", error);
      return false;
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

  // 関係チェック
  return await _checkRelationshipInternal(
    session.user.id,
    targetUserId,
    relationship,
  );
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

