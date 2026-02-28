import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

/**
 * Better Auth スキーマ + RBAC（組織・国）スキーマ
 *
 * @security
 * すべてのテーブルで Row Level Security (RLS) の有効化を推奨します。
 * RLS ポリシーの定義は drizzle/rls-policies.sql を参照してください。
 *
 * 初期セットアップ: psql -d $DATABASE_URL -f drizzle/rls-policies.sql
 *
 * @design
 * 組織（Group）: ボトムアップで作成される実行単位（ユーザーが集まり具体的なタスクを遂行）
 * 国（Nation）: トップダウンで作成される上位コミュニティ（複数組織の連携）
 * 詳細は docs/rbac-group-nation-separation.md を参照
 */

export const user = pgTable(
  "user",
  {
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
  },
  (table) => [index("user_email_idx").on(table.email)],
);

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

// ============================================================================
// RBAC Schema (Groups, Nations, Relationships)
// ============================================================================

/**
 * Groups Table（組織）
 *
 * ユーザーが作成し、メンバーを招待する実行単位の組織。
 * ボトムアップで組織を作成し、国に参加させることが可能。
 *
 * @design
 * - 作成者は自動的に group_leader ロールを持つ
 * - is_public=false の場合、招待制による参加
 * - policy は JSON フォーマット（組織ポリシー・ガバナンス保持用）
 */
export const groups = pgTable(
  "groups",
  {
    id: text("id")
      .primaryKey()
      .$default(() => createId()), // UUID
    name: text("name").notNull(), // 組織名
    description: text("description"), // 組織説明
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }), // 作成者（最初の group_leader）
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    isPublic: boolean("is_public").default(true).notNull(), // 公開/非公開
    policy: text("policy"), // 組織ポリシー（JSON）
  },
  (table) => [
    index("groups_createdBy_idx").on(table.createdBy),
    index("groups_isPublic_idx").on(table.isPublic),
  ],
);

/**
 * Group Members Table（組織メンバーシップ）
 *
 * ユーザーが組織に属するための中間テーブル。
 * 各ユーザーは複数の組織に属することが可能。
 *
 * @design
 * - role: 'group_leader' | 'group_sub_leader' | 'group_member' | 'group_mediator'
 * - 同一ユーザー・同一グループの重複登録は不可（UNIQUE制約）
 * - joinedAt は自動記録
 */
export const groupMembers = pgTable(
  "group_members",
  {
    id: text("id")
      .primaryKey()
      .$default(() => createId()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    groupId: text("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    role: text("role").notNull(), // 'group_leader', 'group_sub_leader', 'group_member', 'group_mediator'
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => [
    index("group_members_userId_idx").on(table.userId),
    index("group_members_groupId_idx").on(table.groupId),
    index("group_members_role_idx").on(table.role),
    // 同一ユーザーが同一グループに重複参加することを防止
    uniqueIndex("group_members_userId_groupId_unique").on(table.userId, table.groupId),
  ],
);

/**
 * Nations Table（国）
 *
 * 複数の組織が参加する上位コミュニティ。
 * 組織リーダーがトップダウンで作成。
 *
 * @design
 * - 作成者は自動的に nation_leader ロールを持つ
 * - is_public=false の場合、招待制による参加
 * - policy は JSON フォーマット（国家ポリシー・ガバナンス保持用）
 */
export const nations = pgTable(
  "nations",
  {
    id: text("id")
      .primaryKey()
      .$default(() => createId()),
    name: text("name").notNull(), // 国名
    description: text("description"), // 国説明
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }), // 作成者（最初の nation_leader）
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    isPublic: boolean("is_public").default(true).notNull(), // 公開/非公開
    policy: text("policy"), // 国ポリシー（JSON）
  },
  (table) => [
    index("nations_createdBy_idx").on(table.createdBy),
    index("nations_isPublic_idx").on(table.isPublic),
  ],
);

/**
 * Nation Members Table（国メンバーシップ）
 *
 * 組織が国に属するための中間テーブル。
 * 国は組織の集合体として運営される。
 *
 * @design
 * - role: 'nation_leader' | 'nation_sub_leader' | 'nation_member' | 'nation_mediator'
 * - nation_leader は、その国の主要組織のリーダーのみ
 * - 同一グループが同一国に重複参加することは不可（UNIQUE制約）
 */
export const nationMembers = pgTable(
  "nation_members",
  {
    id: text("id")
      .primaryKey()
      .$default(() => createId()),
    groupId: text("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }), // 参加組織
    nationId: text("nation_id")
      .notNull()
      .references(() => nations.id, { onDelete: "cascade" }), // 国
    role: text("role").notNull(), // 'nation_leader', 'nation_sub_leader', 'nation_member', 'nation_mediator'
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => [
    index("nation_members_groupId_idx").on(table.groupId),
    index("nation_members_nationId_idx").on(table.nationId),
    index("nation_members_role_idx").on(table.role),
    // 同一グループが同一国に重複参加することを防止
    uniqueIndex("nation_members_groupId_nationId_unique").on(table.groupId, table.nationId),
  ],
);

/**
 * Relationships Table（ユーザー間の関係）
 *
 * 2ユーザー間の関係性を記録。
 * 関係性は非対称（方向性あり）。
 *
 * @design
 * - relationship: 'follow' | 'friend' | 'business_partner' | 'watch' | 'pre_partner' | 'partner'
 * - 同一ユーザー・同一相手・同一関係の重複は不可（UNIQUE制約）
 * - userId と targetUserId は異なる必要がある（CHECK制約は RLS ポリシーで実装）
 */
export const relationships = pgTable(
  "relationships",
  {
    id: text("id")
      .primaryKey()
      .$default(() => createId()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }), // 関係性の発端ユーザー
    targetUserId: text("target_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }), // 関係対象ユーザー
    relationship: text("relationship").notNull(), // 'follow', 'friend', 'business_partner', 'watch', 'pre_partner', 'partner'
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("relationships_userId_idx").on(table.userId),
    index("relationships_targetUserId_idx").on(table.targetUserId),
    index("relationships_relationship_idx").on(table.relationship),
    // 同一ユーザーが同一相手に同じ関係を重複設定することを防止
    uniqueIndex("relationships_userId_targetUserId_relationship_unique").on(
      table.userId,
      table.targetUserId,
      table.relationship,
    ),
  ],
);

// ============================================================================
// Relations
// ============================================================================

export const groupsRelations = relations(groups, ({ one, many }) => ({
  createdByUser: one(user, {
    fields: [groups.createdBy],
    references: [user.id],
  }),
  members: many(groupMembers),
  nationMemberships: many(nationMembers),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  user: one(user, {
    fields: [groupMembers.userId],
    references: [user.id],
  }),
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
}));

export const nationsRelations = relations(nations, ({ one, many }) => ({
  createdByUser: one(user, {
    fields: [nations.createdBy],
    references: [user.id],
  }),
  members: many(nationMembers),
}));

export const nationMembersRelations = relations(nationMembers, ({ one }) => ({
  group: one(groups, {
    fields: [nationMembers.groupId],
    references: [groups.id],
  }),
  nation: one(nations, {
    fields: [nationMembers.nationId],
    references: [nations.id],
  }),
}));

export const relationshipsRelations = relations(relationships, ({ one }) => ({
  fromUser: one(user, {
    fields: [relationships.userId],
    references: [user.id],
  }),
  toUser: one(user, {
    fields: [relationships.targetUserId],
    references: [user.id],
  }),
}));

export const schema = {
  user,
  session,
  account,
  verification,
  groups,
  groupMembers,
  nations,
  nationMembers,
  relationships,
};

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
 *    - RBAC テーブルには必要なインデックスをすべて明示的に定義
 *
 * 5. RBAC テーブル保護
 *    - groups / nation_members / relationships テーブルは RLS ポリシーで保護
 *    - 組織メンバーはメンバーのみが閲覧可能（auth.uid() による制限）
 *    - 国メンバーは参加組織のメンバーのみが閲覧可能
 *
 * 詳細実装方法:
 *    - AI Design ドキュメント: docs/rbac-group-nation-separation.md
 *    - Better Auth公式ガイド: https://better-auth.com
 *    - Drizzle ORM: https://orm.drizzle.team
 */

