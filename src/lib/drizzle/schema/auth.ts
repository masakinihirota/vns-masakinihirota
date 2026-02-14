import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

/**
 * Auth.js用テーブル定義
 * テーブル名に authjs_ プレフィックスを付けて
 * Supabaseの既存テーブルとの名前衝突を回避する
 *
 * 参考: https://authjs.dev/getting-started/adapters/drizzle
 */

/** Auth.js ユーザーテーブル */
export const authjsUsers = pgTable("authjs_users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

/** Auth.js アカウントテーブル（OAuthプロバイダーリンク） */
export const authjsAccounts = pgTable(
  "authjs_accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => authjsUsers.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ],
);

/** Auth.js セッションテーブル */
export const authjsSessions = pgTable("authjs_sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => authjsUsers.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

/** Auth.js 検証トークンテーブル */
export const authjsVerificationTokens = pgTable(
  "authjs_verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  ],
);
