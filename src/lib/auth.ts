import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle"; // your drizzle instance
import { admin } from "better-auth/plugins/admin";
import { nextCookies } from "better-auth/next-js";
import { schema } from "@/db/schema";

export const auth = betterAuth({
    // 1) 認証情報は `drizzle` 経由の `Postgres` へ格納する（Better Authが自動でテーブルを管理）
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: schema,
    }),

  // 防衛ライン②: メール/パスワード認証 (bcrypt等は内部で自動処理)
    // 認証はemail + パスワードで行う（必要に応じてOAuthも追加可能）
  emailAndPassword: {
    enabled: true,
  },

    // 防衛ライン③: セッション管理 (自動ログアウト)
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7日 (seconds)
    updateAge: 60 * 60 * 24 * 1, // 1日ごとに有効期限を更新

    // 短期サンプル
    // expiresIn: 60 * 30, // 30分 (seconds)
    // updateAge: 60 * 5,  // 5分ごとに有効期限を更新
  },

    // 防衛ライン④: 認可 (Role管理)
  // NextAuthのように手動で型拡張せずとも、プラグインを入れるだけで完了
  plugins: [
    admin(),
    nextCookies(), // 常に配列の最後に配置
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});
