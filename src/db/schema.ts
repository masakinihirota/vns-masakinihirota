import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";

/**
 * Better Auth スキーマ
 *
 * @security
 * すべてのテーブルで Row Level Security (RLS) の有効化を推奨します。
 * RLS ポリシーの定義は drizzle/rls-policies.sql を参照してください。
 *
 * 初期セットアップ: psql -d $DATABASE_URL -f drizzle/rls-policies.sql
 */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const schema = { user, session, account, verification };

/**
 * @note セキュリティ注記
 *
 * Better Auth + PostgreSQL を使用する場合、以下のセキュリティ対策が必須です：
 *
 * 1. Row Level Security (RLS)
 *    - すべてのテーブルで ENABLE ROW LEVEL SECURITY を実行
 *    - ポリシーは drizzle/rls-policies.sql を参照
 *    - jwt_secret を使用した auth.uid() の JWT 検証が推奨
 *
 * 2. アカウントテーブル保護
 *    - OAuth トークン (accessToken, refreshToken, idToken) を含むため最高レベルの保護が必要
 *    - アプリケーションロジックでも userId チェックを行う
 *
 * 3. セッション管理
 *    - token は unique 制約で保護されている
 *    - expiresAt の自動削除ポリシーを定義することを推奨
 *
 * 4. インデックス戦略
 *    - user.email には unique 制約があり、自動的にインデックスが作成される
 *    - user_id 外部キーには明示的なインデックスが必要 (既に定義済み)
 *
 * より詳細な実装方法は、AI Design ドキュメントまたは Better Auth の公式ガイドを参照してください。
 */
