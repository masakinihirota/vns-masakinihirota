import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db/drizzle-postgres";
import * as schema from "./db/schema.postgres";

/**
 * Better-Auth サーバーサイド設定
 *
 * Drizzle Adapter を使用して PostgreSQL と接続します。
 * ソーシャルログイン (GitHub, Google) をサポートしています。
 *
 * 以下の環境変数が必須です:
 * - BETTER_AUTH_SECRET: セッション暗号化キー
 * - GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET: GitHub OAuth
 * - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET: Google OAuth
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
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  plugins: [
    nextCookies(), // Next.js Server Components / Actions 用
  ],
});
