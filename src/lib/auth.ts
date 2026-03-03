import { startRateLimitCleanup } from "@/lib/auth/rate-limiter";
import { db } from "@/lib/db/client";
import * as schema from "@/lib/db/schema.postgres";
import { env } from "@/lib/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";

/**
 * データベース接続文字列の検証
 *
 * @description
 * PostgreSQL への接続に必須な DATABASE_URL が正しく設定されているかを検証します。
 * 設定がない場合は、明示的にエラーを投げます。
 */
function validateDatabaseUrl() {
  const databaseUrl = env.DATABASE_URL;

  // 基本的な URL フォーマット検証
  if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
    throw new Error(
      '[DATABASE] Invalid DATABASE_URL format. It must start with "postgresql://" or "postgres://"'
    );
  }
}

/**
 * OAuth 環境変数の検証
 *
 * @description
 * OAuth プロバイダーの認証情報が正しく設定されているかを検証します。
 * 設定がない場合は、明示的にエラーを投げて Silent Failure を防止します。
 */
function validateOAuthCredentials() {
  if (!env.useRealAuth && env.NODE_ENV !== 'production') {
    return;
  }

  const providers = [
    { name: 'Google', clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET },
    { name: 'GitHub', clientId: env.GITHUB_CLIENT_ID, clientSecret: env.GITHUB_CLIENT_SECRET },
  ];

  const errors: string[] = [];

  for (const provider of providers) {
    if (!provider.clientId || !provider.clientSecret) {
      errors.push(`${provider.name}: credentials are required`);
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `[AUTH] OAuth credential validation failed:\n${errors.join('\n')}\n` +
      `Please set all OAuth credentials in your .env.local or production environment.`
    );
  }
}

/**
 * Better Auth コア環境変数の検証
 */
function validateBetterAuthCoreEnv() {
  const secret = env.BETTER_AUTH_SECRET;
  const authUrl = env.BETTER_AUTH_URL;

  if (secret.length < 32) {
    throw new Error(
      '[AUTH] BETTER_AUTH_SECRET must be at least 32 characters for production-safe security.'
    );
  }

  if (!authUrl.startsWith('http://') && !authUrl.startsWith('https://')) {
    throw new Error(
      '[AUTH] BETTER_AUTH_URL must start with "http://" or "https://".'
    );
  }
}

// 起動時に環境変数をチェック
validateDatabaseUrl();
validateBetterAuthCoreEnv();
validateOAuthCredentials();

/**
 * OAuth特化型の Better Auth 設定
 *
 * @description
 * メール/パスワード認証を無効化し、OAuth（Google/GitHub）のみを使用します。
 * 将来的に他のOAuth（Facebook, Twitterなど）を追加する場合は、
 * socialProviders オブジェクトに追加してください。
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),

  // ❌ メール/パスワード認証は無効化（OAuth-only）
  // emailAndPassword: { enabled: false },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7日 (seconds)
    updateAge: 60 * 60 * 24 * 1, // 1日ごとに有効期限を更新

    // Session callback: activeProfileId を追加
    // (現在被っている仮面のIDをセッションに含める)
    async callback({
      session,
      user,
    }: {
      session: { user: { id: string; email: string; role?: string } };
      user: { id: string; email: string };
    }) {
      try {
        // rootAccount から activeProfileId を取得
        const rootAccount = await db
          .select({ activeProfileId: schema.rootAccounts.activeProfileId })
          .from(schema.rootAccounts)
          .where(eq(schema.rootAccounts.authUserId, user.id))
          .limit(1)
          .then((rows) => rows[0]);

        const activeProfileId = rootAccount?.activeProfileId ?? null;

        return {
          ...session,
          user: {
            ...session.user,
            activeProfileId,
          },
        };
      } catch (error) {
        // ✅ FIXED: エラー時はデフォルトで ghost を設定
        // activeProfileId がない場合、ghost mask として扱う（conservative approach）
        logger.error('[AUTH] Failed to get activeProfileId - defaulting to ghost', undefined, {
          userId: user.id,
          error: error instanceof Error ? error.message : String(error),
        });

        return {
          ...session,
          user: {
            ...session.user,
            activeProfileId: null, // Ghost as default
          },
        };
      }
    },
  },

  plugins: [
    admin(),
    nextCookies(), // 常に最後に配置
  ],

  // OAuth プロバイダー設定
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID ?? 'dev-google-client-id',
      clientSecret: env.GOOGLE_CLIENT_SECRET ?? 'dev-google-client-secret',
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID ?? 'dev-github-client-id',
      clientSecret: env.GITHUB_CLIENT_SECRET ?? 'dev-github-client-secret',
    },
    // 将来の拡張例:
    // facebook: {
    //   clientId: process.env.FACEBOOK_CLIENT_ID!,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    // },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
/**
 * サーバー起動時にレート制限のクリーンアップを初期化
 * (メモリリーク防止)
 */
if (typeof window === 'undefined') {
  startRateLimitCleanup();
}
