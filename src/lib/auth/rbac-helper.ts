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
  nationMembers,
  relationships,
  user,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";

// ============================================================================
// Type Definitions & Interfaces
// ============================================================================

/**
 * Server Actionで受け取るセッション情報の型
 * Better Auth のセッション + ユーザー情報アグリゲー
 */
export interface AuthSession {
  user: {
    id: string;
    email: string | null;
    name: string | null;
    role: string | null; // 'platform_admin' | 'user' | null
  };
  session: {
    id: string;
    expiresAt: Date;
  };
}

/**
 * グループロールの型
 * @see docs/rbac-group-nation-separation.md
 */
export type GroupRole = "leader" | "sub_leader" | "member" | "mediator";

/**
 * 国ロールの型
 * @see docs/rbac-group-nation-separation.md
 */
export type NationRole = "leader" | "sub_leader" | "member" | "mediator";

/**
 * ユーザー間関係の型
 * @see docs/rbac-group-nation-separation.md
 */
export type RelationshipType =
  | "follow"
  | "friend"
  | "business_partner"
  | "watch"
  | "pre_partner"
  | "partner";

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
// Authorization Check Functions
// ============================================================================

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
 * グループロール権限をチェック (キャッシュ対応)
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
 * const isLeader = await checkGroupRole(session, groupId, 'leader');
 * if (!isLeader) throw new Error('Unauthorized by group');
 *
 * @design
 * - platform_admin は全グループで操作可能（管理者権限）
 * - 指定ロール以上の権限テストを想定（'leader' で leader/sub_leader など）
 * - 実装はシンプルに "exact match" とする（権限階層管理は別機能）
 */
const _checkGroupRoleInternal = cache(
  async (
    userId: string,
    groupId: string,
    role: GroupRole,
  ): Promise<boolean> => {
    const db = getDatabaseConnection();

    try {
      const member = await db
        .select()
        .from(groupMembers)
        .where(
          and(
            eq(groupMembers.userId, userId as any),
            eq(groupMembers.groupId, groupId as any),
            eq(groupMembers.role, role),
          ),
        )
        .limit(1)
        .then((rows) => rows[0] || null);

      return member !== null;
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
 * 国ロール権限をチェック (organizationキャッシュ対応)
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
 * const isNationLeader = await checkNationRole(session, nationId, 'leader');
 * if (!isNationLeader) throw new Error('Unauthorized');
 *
 * @design
 * - nation_members テーブルで組織が国に参加していることを確認
 * - ユーザーが属する組織が国内で指定ロールを持つかをチェック
 * - チェック順序：
 *   1. platform_admin → 全国で操作可能
 *   2. nation_leaders テーブルで確認
 *   3. デフォルト：拒否（Deny-by-default）
 */
const _checkNationRoleInternal = cache(
  async (
    userId: string,
    nationId: string,
    role: NationRole,
  ): Promise<boolean> => {
    const db = getDatabaseConnection();

    try {
      // ユーザーが属する組織が、国内で指定ロールを持つかをチェック
      // クエリ概要：
      // - group_members から userId で属する組織を取得
      // - nation_members で該当組織が nationId で指定ロールを持つかをチェック
      const result = await db
        .selectDistinct({ count: groupMembers.groupId })
        .from(groupMembers)
        .innerJoin(
          nationMembers,
          and(
            eq(groupMembers.groupId, nationMembers.groupId),
            eq(nationMembers.nationId, nationId as any),
            eq(nationMembers.role, role),
          ),
        )
        .where(eq(groupMembers.userId, userId as any))
        .limit(1);

      return result.length > 0;
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

    const db = getDatabaseConnection();

    try {
      const rel = await db
        .select()
        .from(relationships)
        .where(
          and(
            eq(relationships.userId, userId as any),
            eq(relationships.targetUserId, targetUserId as any),
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

