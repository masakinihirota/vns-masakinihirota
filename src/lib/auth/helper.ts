/* eslint-disable no-console */

import { headers } from "next/headers";
import { cache } from "react";
import { eq } from "drizzle-orm";

import { auth as serverAuth } from "@/lib/auth";
import { db as database } from "@/lib/db/client";
import * as schema from "@/lib/db/schema.postgres";
import { createDummySession, DUMMY_USERS } from "@/lib/dev-auth";
import {
  checkPlatformAdmin,
  checkGroupRole,
  checkNationRole,
  checkRelationship,
} from "./rbac-helper";
import { withAuth } from "./with-auth";

/**
 * サーバーサイドで現在のセッション情報を取得します（キャッシュ付き）
 *
 * @description
 * React の `cache()` を使用して、同一リクエスト内でのDB問い合わせを1回に制限します。
 * これにより、複数のコンポーネント で getSession() を呼び出した場合でも、
 * DB へのアクセスは1度のみになります。
 *
 * **開発時ダミー機能:**
 * NEXT_PUBLIC_USE_REAL_AUTH=false の場合、ダミー認証を使用します。
 *
 *
 * **優先順位ルール:**
 * 1. OAuth (Google/GitHub) > 匿名
 * 2. 同じカテゴリなら last_used_at が新しい順
 */

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
 * React の cache() で同一リクエスト内では1回のみ実行されます。
 *
 * @see https://react.dev/reference/react/cache
 */
export const getSession = cache(async () => {
  try {
    // 開発時ダミー認証機能
    if (process.env.NEXT_PUBLIC_USE_REAL_AUTH !== "true" && process.env.NODE_ENV === "development") {
      const dummySession = createDummySession("user");
      console.log("[getSession] MOCK AUTH - Using dummy user:", dummySession.user.email);
      return dummySession;
    }

    const headersList = await headers();
    const cookieHeader = headersList.get("cookie");

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
        where: (sessions, { eq: eqDrizzle }) => eqDrizzle(sessions.token, tokenFromCookie),
      });

      if (session) {
        // Check expiration
        if (new Date(session.expiresAt) < new Date()) {
          return null;
        }

        // Development環境: 24時間以上前のセッションは除外
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
          where: (users, { eq: eqDrizzle }) => eqDrizzle(users.id, session.userId),
        });

        if (user) {
          betterAuthResult = { user: user as any, session };
        }
      }
    }

    // Add auth methods priority info
    if (betterAuthResult?.user) {
      const authMethods = await getUserAuthMethods(betterAuthResult.user.id);

      return {
        ...betterAuthResult,
        authMethods,
        primaryAuthType: authMethods[0]?.authType || "oauth",
      };
    }

    return betterAuthResult;
  } catch (error) {
    console.error(
      "[getSession] Error:",
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
});

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

export {
  checkPlatformAdmin,
  checkGroupRole,
  checkNationRole,
  checkRelationship,
  withAuth,
};
