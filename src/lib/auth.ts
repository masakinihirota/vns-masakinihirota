import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db/client";
import * as schema from "@/lib/db/schema.postgres";
import { admin } from "better-auth/plugins/admin";
import { nextCookies } from "better-auth/next-js";
// import { rateLimit } from "better-auth/plugins"; // TODO: Better Auth 1.4.19 では利用不可 v1.5+ で対応予定

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
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
    // 将来の拡張例:
    // facebook: {
    //   clientId: process.env.FACEBOOK_CLIENT_ID || "",
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    // },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
