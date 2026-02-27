import { eq, and } from "drizzle-orm";
import { db as database } from "@/lib/db/client";
import * as schema from "@/lib/db/schema.postgres";

/**
 * 複数認証方法の管理サービス
 *
 * ## 概要
 * user_auth_methods テーブルと sessions テーブルを統合して、複数の認証方法を管理します。
 *
 * ## 現在の使用状況
 * - 主にログイン時の認証方法の記録に使用
 * - ログアウト時の全認証方法削除に使用
 * - 認証状態の表示（MultiAuthStatus コンポーネント）に使用
 *
 * ## 将来の拡張計画
 * このモジュールは以下の将来的な機能拡張を想定して設計されています：
 * 1. ユーザーによる認証方法の切り替え（Google ↔ GitHub ↔ 匿名）
 * 2. 複数のOAuthアカウントの紐付け（例: Google + GitHub の両方でログイン可能）
 * 3. 匿名アカウントからOAuthアカウントへのアップグレード
 * 4. 認証履歴の追跡とセキュリティ監査
 *
 * ## 注意事項
 * 現時点では、ユーザーが複数の認証方法を使い分けるUIは実装されていません。
 * このため、優先順位管理などの一部機能は現在のところ使用されていませんが、
 * 将来の拡張性のために保持しています。
 *
 * @module auth-hierarchy
 */

/**
 * 認証方法のタイプ定義
 */
export type AuthMethodType = "google" | "github" | "anonymous";

/**
 * 認証方法情報
 */
export interface AuthMethodInfo {
  id: string;
  userId: string;
  authType: AuthMethodType;
  providerAccountId: string | null;
  sessionId: string;
  validatedAt: string | null; // 署名検証タイムスタンプ（匿名用）
  createdAt: string;
  lastUsedAt: string;
}

/**
 * ユーザーの全認証方法を取得（優先順位付き）
 * @param userId ユーザーID
 * @returns 認証方法の配列（OAuth > 匿名の順）
 */
export async function getAllAuthMethods(userId: string): Promise<AuthMethodInfo[]> {
  try {
    const authMethods = await database.query.userAuthMethods.findMany({
      where: eq(schema.userAuthMethods.userId, userId),
    });

    // 優先順位付きでソート
    const sorted = authMethods.map((m) => ({
      ...m,
      authType: m.authType as AuthMethodType,
    })) as AuthMethodInfo[];

    return sorted.sort((a, b) => {
      const priorityA = getPriorityScore(a.authType);
      const priorityB = getPriorityScore(b.authType);

      if (priorityA !== priorityB) {
        return priorityB - priorityA; // 高いスコアが先
      }

      // 同優先度なら last_used_at で比較
      const timeA = a.lastUsedAt ? new Date(a.lastUsedAt).getTime() : 0;
      const timeB = b.lastUsedAt ? new Date(b.lastUsedAt).getTime() : 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.error("[getAllAuthMethods] Error:", error);
    return [];
  }
}

/**
 * ユーザーの主要な認証方法を取得
 * OAuth がある場合は OAuth を、ない場合は匿名を返す
 * @param userId ユーザーID
 * @returns 最優先の認証方法、またはない場合は null
 */
export async function getActiveAuthMethod(userId: string): Promise<AuthMethodInfo | null> {
  try {
    const methods = await getAllAuthMethods(userId);
    return methods.length > 0 ? methods[0] : null;
  } catch (error) {
    console.error("[getActiveAuthMethod] Error:", error);
    return null;
  }
}

/**
 * ユーザーが特定の認証方法を持っているか確認
 * @param userId ユーザーID
 * @param authType 認証方法タイプ
 * @param providerAccountId プロバイダーアカウントID（OAuth用）
 * @returns 認証方法が存在する場合は true
 */
export async function hasAuthMethod(
  userId: string,
  authType: AuthMethodType,
  providerAccountId?: string
): Promise<boolean> {
  try {
    const conditions = [eq(schema.userAuthMethods.userId, userId), eq(schema.userAuthMethods.authType, authType)];

    if (providerAccountId && (authType === "google" || authType === "github")) {
      conditions.push(eq(schema.userAuthMethods.providerAccountId, providerAccountId));
    }

    const method = await database.query.userAuthMethods.findFirst({
      where: and(...conditions),
    });

    return !!method;
  } catch (error) {
    console.error("[hasAuthMethod] Error:", error);
    return false;
  }
}

/**
 * 新しい認証方法をユーザーに記録
 * @param userId ユーザーID
 * @param authType 認証方法タイプ
 * @param sessionId セッションID
 * @param providerAccountId プロバイダーアカウントID（OAuth用）
 * @param validatedAt 署名検証タイムスタンプ（匿名用）
 * @returns 作成された認証方法情報
 */
export async function recordAuthMethod(
  userId: string,
  authType: AuthMethodType,
  sessionId: string,
  providerAccountId?: string,
  validatedAt?: string
): Promise<AuthMethodInfo | null> {
  try {
    const { v4: uuidv4 } = await import("uuid");
    const now = new Date().toISOString();

    const result = await database
      .insert(schema.userAuthMethods)
      .values({
        id: uuidv4(),
        userId,
        authType,
        providerAccountId: providerAccountId || null,
        sessionId,
        validatedAt: validatedAt || null,
        createdAt: now,
        lastUsedAt: now,
      })
      .returning();

    if (!result || result.length === 0) return null;

    const authInfo: AuthMethodInfo = {
      ...result[0],
      authType: result[0].authType as AuthMethodType,
    };

    return authInfo;
  } catch (error) {
    console.error("[recordAuthMethod] Error:", error);
    return null;
  }
}

/**
 * ユーザーの特定の認証方法を削除
 * @param userId ユーザーID
 * @param authType 認証方法タイプ
 * @param providerAccountId プロバイダーアカウントID（OAuth用）
 * @returns 削除された行数
 */
export async function removeAuthMethod(
  userId: string,
  authType: AuthMethodType,
  providerAccountId?: string
): Promise<number> {
  try {
    const conditions = [
      eq(schema.userAuthMethods.userId, userId),
      eq(schema.userAuthMethods.authType, authType),
    ];

    if (providerAccountId && (authType === "google" || authType === "github")) {
      conditions.push(eq(schema.userAuthMethods.providerAccountId, providerAccountId));
    }

    await database.delete(schema.userAuthMethods).where(and(...conditions));

    return 1; // 削除成功とみなす
  } catch (error) {
    console.error("[removeAuthMethod] Error:", error);
    return 0;
  }
}

/**
 * ユーザーの全認証方法を削除（ログアウト時）
 * @param userId ユーザーID
 * @returns 削除された行数
 */
export async function removeAllAuthMethods(userId: string): Promise<number> {
  try {
    await database
      .delete(schema.userAuthMethods)
      .where(eq(schema.userAuthMethods.userId, userId));

    return 1; // 削除成功とみなす
  } catch (error) {
    console.error("[removeAllAuthMethods] Error:", error);
    return 0;
  }
}

/**
 * ユーザーの認証方法の最終使用時刻を更新
 * @param authMethodId 認証方法ID
 * @returns 更新成功
 */
export async function updateAuthMethodLastUsed(authMethodId: string): Promise<boolean> {
  try {
    const now = new Date().toISOString();
    await database
      .update(schema.userAuthMethods)
      .set({ lastUsedAt: now })
      .where(eq(schema.userAuthMethods.id, authMethodId));

    return true;
  } catch (error) {
    console.error("[updateAuthMethodLastUsed] Error:", error);
    return false;
  }
}

/**
 * 認証方法の優先度スコアを取得
 * (内部用：OAuth > 匿名)
 * @param authType 認証方法タイプ
 * @returns 優先度スコア（高いほど優先）
 */
function getPriorityScore(authType: AuthMethodType): number {
  const scores: Record<AuthMethodType, number> = {
    google: 100,
    github: 100,
    anonymous: 10,
  };
  return scores[authType] || 0;
}

/**
 * OAuth と匿名の両方を持つユーザーの認証状態を取得
 * @param userId ユーザーID
 * @returns { hasOAuth, hasAnonymous, primaryAuthType }
 */
export async function getAuthState(userId: string): Promise<{
  hasOAuth: boolean;
  hasAnonymous: boolean;
  primaryAuthType: AuthMethodType | null;
}> {
  try {
    const methods = await getAllAuthMethods(userId);
    const hasOAuth = methods.some((m) => m.authType === "google" || m.authType === "github");
    const hasAnonymous = methods.some((m) => m.authType === "anonymous");
    const primaryAuthType = (methods[0]?.authType as AuthMethodType) || null;

    return { hasOAuth, hasAnonymous, primaryAuthType };
  } catch (error) {
    console.error("[getAuthState] Error:", error);
    return { hasOAuth: false, hasAnonymous: false, primaryAuthType: null };
  }
}
