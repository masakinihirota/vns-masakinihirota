/* eslint-disable no-console */

import { headers } from "next/headers";
import { eq } from "drizzle-orm";

import { auth as serverAuth } from "@/lib/auth";
import { db as database } from "@/lib/db/client";
import * as schema from "@/lib/db/schema.postgres";

/**
 * ユーザーの認証方法情報を取得（優先順位付き）
 *
 * @description OAuth (Google/GitHub) を優先的に返します。
 * これにより、匿名ログインからOAuthへ移行したユーザーに対して
 * より信頼性の高い認証情報を提供します。
 *
 * @param {string} userId - ユーザーID
 * @returns {Promise<Array>} 優先順位付き認証方法の配列
 *
 * @example
 * const methods = await getUserAuthMethods("user123");
 * // [{provider: "google", ...}, {provider: "anonymous", ...}]
 */
async function getUserAuthMethods(userId: string) {
  try {
    const authMethods = await database.query.userAuthMethods.findMany({
      where: eq(schema.userAuthMethods.userId, userId),
    });

    // 優先順位: oauth > anonymous (Google/GitHub を最初に)
    const sorted = authMethods.sort((a, b) => {
      const isOAuthA = a.authType === "google" || a.authType === "github";
      const isOAuthB = b.authType === "google" || b.authType === "github";

      if (isOAuthA && !isOAuthB) return -1;
      if (!isOAuthA && isOAuthB) return 1;

      // 同じカテゴリなら last_used_at で並べ替え
      const timeA = a.lastUsedAt ? new Date(a.lastUsedAt).getTime() : 0;
      const timeB = b.lastUsedAt ? new Date(b.lastUsedAt).getTime() : 0;
      return timeB - timeA;
    });

    return sorted;
  } catch (error) {
    console.warn("[getUserAuthMethods] Error:", error instanceof Error ? error.message : String(error));
    return [];
  }
}

/**
 * サーバーサイドで現在のセッション情報を取得します。
 *
 * @description
 * Better-Auth の `api.getSession` を使用してセッションを検証します。
 * Better Auth が失敗する場合、DBで直接セッショントークンを検証します。
 *
 * **優先順位ルール:**
 * 1. OAuth (Google/GitHub) > 匿名
 * 2. 同じカテゴリなら last_used_at が新しい順
 *
 * **セキュリティ注意事項:**
 * - セッショントークンは絶対にログに出力しないこと
 * - PII (個人識別情報) は本番環境でログ出力禁止
 * - セッション有効期限を必ずチェック
 *
 * @returns {Promise<Object|null>} セッション情報、または無効な場合は null
 * @returns {Object} return.session - セッションデータ
 * @returns {Object} return.user - ユーザーデータ
 *
 * @example
 * const session = await getSession();
 * if (session?.user) {
 *   console.log("ログイン済み:", session.user.email);
 * }
 *
 * @see {@link https://better-auth.com/docs/session Better Auth Session Docs}
 */
export const getSession = async () => {
  try {
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie');

    // Extract token from cookie
    const tokenMatch = cookieHeader?.match(/better-auth\.session_token=([^;]+)/);
    const tokenFromCookie = tokenMatch?.[1];

    // Try Better Auth first
    let betterAuthResult = await serverAuth.api.getSession({
      headers: headersList,
    });

    // If Better Auth fails but we have a token, try direct DB lookup
    if (!betterAuthResult && tokenFromCookie) {
      const session = await database.query.sessions.findFirst({
        where: (sessions, { eq }) => eq(sessions.token, tokenFromCookie),
      });

      if (session) {

        // Check expiration
        if (new Date(session.expiresAt) < new Date()) {
          return null;
        }

        // Development環境: 24時間以上前のセッションは除外（起動時の古いセッション排除）
        if (process.env.NODE_ENV === "development") {
          const createdAtTime = new Date(session.createdAt).getTime();
          const nowTime = new Date().getTime();
          const ageInHours = (nowTime - createdAtTime) / (1000 * 60 * 60);
          if (ageInHours > 24) {
            return null;
          }
        }
        // If session is valid, fetch the user
        const user = await database.query.users.findFirst({
          where: (users, { eq }) => eq(users.id, session.userId),
        });

        if (user) {
          console.log("[getSession] Custom session valid for user (cookie):", user.id);
          betterAuthResult = { user: user as any, session };
        }
      }
    }

    // セッション取得後、認証方法の優先順位情報を追加
    if (betterAuthResult?.user) {
      const authMethods = await getUserAuthMethods(betterAuthResult.user.id);

      if (authMethods.length > 0) {
        console.log(
          "[getSession] Auth methods for user:",
          authMethods.map(m => `${m.authType}(used:${m.lastUsedAt})`).join(", ")
        );

        // セッションに認証方法情報を追加
        return {
          ...betterAuthResult,
          authMethods,
          primaryAuthType: authMethods[0]?.authType || "unknown",
        };
      }
    }

    return betterAuthResult;
  } catch (error) {
    console.error(
      "[getSession] Error:",
      error instanceof Error ? error.message : String(error),
      error instanceof Error ? error.stack : ""
    );
    return null;
  }
};

/**
 * 互換性のための auth エクスポート (getSession と同等)
 * @deprecated `getSession` を直接使用することを推奨します
 */
export const auth = getSession;

/**
 * 現在のユーザー情報を取得します。
 * セッションが存在しない場合は null を返します。
 * @returns ユーザー情報 (User) または null
 */
export const getCurrentUser = async () => {
  const session = await getSession();
  return session?.user ?? null;
};
/**
 * ユーザーのみが有効な認証方法を取得（複数の場合と単一の場合を区別）
 * @param userId ユーザーID
 * @returns 認証方法の配列（優先順位付き）
 */
export const getAuthMethodsForUser = async (userId: string) => {
  try {
    const authMethods = await database.query.userAuthMethods.findMany({
      where: eq(schema.userAuthMethods.userId, userId),
    });

    // 優先順位でソート
    return authMethods.sort((a, b) => {
      const isOAuthA = a.authType === "google" || a.authType === "github";
      const isOAuthB = b.authType === "google" || b.authType === "github";

      if (isOAuthA && !isOAuthB) return -1;
      if (!isOAuthA && isOAuthB) return 1;

      const timeA = a.lastUsedAt ? new Date(a.lastUsedAt).getTime() : 0;
      const timeB = b.lastUsedAt ? new Date(b.lastUsedAt).getTime() : 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.warn("[getAuthMethodsForUser] Error:", error instanceof Error ? error.message : String(error));
    return [];
  }
};
