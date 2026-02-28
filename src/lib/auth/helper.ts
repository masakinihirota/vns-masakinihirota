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
 * ユーザーの OAuth provider を取得
 *
 * @description account テーブルから OAuth provider 情報を取得
 * @param {string} userId - ユーザーID
 * @returns {Promise<string>} 'google'|'github'|'email'|'anonymous'
 */
async function getPrimaryAuthProvider(userId: string): Promise<string> {
  try {
    const accountRecords = await database
      .select()
      .from(schema.accounts)
      .where(eq(schema.accounts.userId, userId));

    // OAuth account を探す
    const oauthAccount = accountRecords.find(
      (acc) => acc.providerId === "google" || acc.providerId === "github"
    );

    if (oauthAccount) {
      return oauthAccount.providerId;
    }

    // OAuth がない場合
    return "email";
  } catch (error) {
    console.warn("[getPrimaryAuthProvider] Error:", error instanceof Error ? error.message : String(error));
    return "email";
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

    // Add auth provider info
    if (betterAuthResult?.user) {
      const primaryAuthProvider = await getPrimaryAuthProvider(betterAuthResult.user.id);

      return {
        ...betterAuthResult,
        primaryAuthProvider,
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

export {
  checkPlatformAdmin,
  checkGroupRole,
  checkNationRole,
  checkRelationship,
  withAuth,
};
