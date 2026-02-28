import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db/client";
import * as schema from "@/db/schema";
import { admin } from "better-auth/plugins/admin";
import { nextCookies } from "better-auth/next-js";
import { startRateLimitCleanup } from "@/lib/auth/rate-limiter";
// import { rateLimit } from "better-auth/plugins"; // TODO: Better Auth 1.4.19 では利用不可 v1.5+ で対応予定

/**
 * データベース接続文字列の検証
 *
 * @description
 * PostgreSQL への接続に必須な DATABASE_URL が正しく設定されているかを検証します。
 * 設定がない場合は、明示的にエラーを投げます。
 */
function validateDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      '[DATABASE] DATABASE_URL is not set. Please configure it in your .env.local or production environment.\n' +
      'Example: postgresql://user:password@localhost:5432/vns_app'
    );
  }

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
  const providers = [
    { name: 'Google', idVar: 'GOOGLE_CLIENT_ID', secretVar: 'GOOGLE_CLIENT_SECRET' },
    { name: 'GitHub', idVar: 'GITHUB_CLIENT_ID', secretVar: 'GITHUB_CLIENT_SECRET' },
  ];

  const errors: string[] = [];

  for (const provider of providers) {
    const clientId = process.env[provider.idVar];
    const clientSecret = process.env[provider.secretVar];

    if (!clientId || !clientSecret) {
      errors.push(
        `${provider.name}: ${provider.idVar} and ${provider.secretVar} are required`
      );
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
  const secret = process.env.BETTER_AUTH_SECRET;
  const authUrl = process.env.BETTER_AUTH_URL;

  if (!secret) {
    throw new Error(
      '[AUTH] BETTER_AUTH_SECRET is not set. Please configure it in your .env.local or production environment.'
    );
  }

  if (secret.length < 32) {
    throw new Error(
      '[AUTH] BETTER_AUTH_SECRET must be at least 32 characters for production-safe security.'
    );
  }

  if (!authUrl) {
    throw new Error(
      '[AUTH] BETTER_AUTH_URL is not set. Please configure it in your .env.local or production environment.'
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
    schema: schema,
  }),

  // ❌ メール/パスワード認証は無効化（OAuth-only）
  // emailAndPassword: { enabled: false },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7日 (seconds)
    updateAge: 60 * 60 * 24 * 1, // 1日ごとに有効期限を更新
  },

  plugins: [
    admin(),
    nextCookies(), // 常に最後に配置
  ],

  // OAuth プロバイダー設定
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
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
