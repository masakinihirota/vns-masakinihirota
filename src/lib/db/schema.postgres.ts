import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  foreignKey,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
// --- Auth Schema (Better-Auth Standard) ---

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: text("role"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires", { withTimezone: true }),
  isAnonymous: boolean("is_anonymous").default(false),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
});

export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// --- User Preferences (広告・言語・テーマ) ---
export const userPreferences = pgTable("user_preferences", {
  userId: text("user_id")
    .primaryKey()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  adsEnabled: boolean("ads_enabled").default(true).notNull(),
  locale: text("locale").default("ja").notNull(),
  theme: text("theme").default("system").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});


// --- User Auth Methods (複数認証記録) ---
export const userAuthMethods = pgTable(
  "user_auth_methods",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    authType: text("auth_type").notNull(), // google, github, anonymous
    providerAccountId: text("provider_account_id"), // OAuth provider user ID
    sessionId: text("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    validatedAt: timestamp("validated_at", { withTimezone: true, mode: "string" }), // 最後の署名検証成功時刻
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_user_auth_methods_user_id").using(
      "btree",
      table.userId.asc().nullsLast().op("text_ops")
    ),
    index("idx_user_auth_methods_created_at").using(
      "btree",
      table.createdAt.desc().nullsLast()
    ),
    unique("user_auth_methods_unique_oauth").on(
      table.userId,
      table.authType,
      table.providerAccountId
    ), // OAuth は同じユーザーで同じ provider は1回のみ
    unique("user_auth_methods_unique_auth_type").on(
      table.userId,
      table.authType
    ), // 同一ユーザーが同じ認証方法を複数登録することを防止
  ]
);

// --- Enums ---
export const allianceStatus = pgEnum("alliance_status", [
  "requested",
  "pre_partner",
  "partner",
]);
export const followStatus = pgEnum("follow_status", ["watch", "follow"]);

// --- Tables ---

export const rootAccounts = pgTable(
  "root_accounts",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    authUserId: text("auth_user_id").notNull(), // References user.id
    activeProfileId: uuid("active_profile_id"), // References user_profiles.id (現在アクティブな仮面)
    trustDays: integer("trust_days").default(0).notNull(),
    dataRetentionDays: integer("data_retention_days").default(30),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.authUserId],
      foreignColumns: [users.id],
      name: "root_accounts_auth_user_id_fkey",
    }).onDelete("cascade"),
    unique("root_accounts_auth_user_id_key").on(table.authUserId),
    check("root_accounts_trust_days_check", sql`trust_days >= 0`),
  ]
);

// Mask Category Enum: 幽霊（観測者）vs ペルソナ（受肉）
export const maskCategory = pgEnum("mask_category", ["ghost", "persona"]);

export const userProfiles = pgTable(
  "user_profiles",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    rootAccountId: uuid("root_account_id").notNull(),
    displayName: text("display_name").notNull(),
    purpose: text(),
    roleType: text("role_type").default("member").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    maskCategory: maskCategory("mask_category").default("persona").notNull(),
    isDefault: boolean("is_default").default(false).notNull(), // システム生成の幽霊かどうか
    lastInteractedRecordId: uuid("last_interacted_record_id"),
    // Added columns to match usage
    profileFormat: text("profile_format").default("profile"),
    role: text("role").default("member"),
    purposes: text("purposes").array().default([]),
    profileType: text("profile_type").default("self"),
    avatarUrl: text("avatar_url"),
    externalLinks: jsonb("external_links"),
    // ゲーミフィケーション (仮面ごとに独立したポイント・レベル)
    points: integer().default(0).notNull(),
    level: integer().default(1).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_user_profiles_root_account_id").using(
      "btree",
      table.rootAccountId.asc().nullsLast().op("uuid_ops")
    ),
    foreignKey({
      columns: [table.rootAccountId],
      foreignColumns: [rootAccounts.id],
      name: "user_profiles_root_account_id_fkey",
    }).onDelete("cascade"),
    check(
      "role_type_check",
      sql`role_type = ANY (ARRAY['leader'::text, 'member'::text, 'admin'::text, 'mediator'::text])`
    ),
    check("user_profiles_points_check", sql`points >= 0`),
    check("user_profiles_level_check", sql`level >= 1`),
  ]
);

export const businessCards = pgTable(
  "business_cards",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userProfileId: uuid("user_profile_id").notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    displayConfig: jsonb("display_config").default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .default(sql`timezone('utc'::text, now())`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .default(sql`timezone('utc'::text, now())`)
      .notNull(),
    content: jsonb().default({}).notNull(),
  },
  (table) => [
    index("business_cards_user_profile_id_idx").using(
      "btree",
      table.userProfileId.asc().nullsLast().op("uuid_ops")
    ),
    foreignKey({
      columns: [table.userProfileId],
      foreignColumns: [userProfiles.id],
      name: "business_cards_user_profile_id_fkey",
    }).onDelete("cascade"),
    unique("business_cards_user_profile_id_key").on(table.userProfileId),
  ]
);

export const alliances = pgTable(
  "alliances",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    profileAId: uuid("profile_a_id").notNull(),
    profileBId: uuid("profile_b_id").notNull(),
    status: allianceStatus().default("requested").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "string" }),
    metadata: jsonb().default({}),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_alliances_profile_a").using(
      "btree",
      table.profileAId.asc().nullsLast().op("uuid_ops")
    ),
    index("idx_alliances_profile_b").using(
      "btree",
      table.profileBId.asc().nullsLast().op("uuid_ops")
    ),
    foreignKey({
      columns: [table.profileAId],
      foreignColumns: [userProfiles.id],
      name: "alliances_profile_a_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.profileBId],
      foreignColumns: [userProfiles.id],
      name: "alliances_profile_b_id_fkey",
    }).onDelete("cascade"),
    unique("alliances_unique_pair").on(table.profileAId, table.profileBId),
    check("alliances_profile_order_check", sql`profile_a_id < profile_b_id`),
  ]
);

export const works = pgTable(
  "works",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    title: text().notNull(),
    author: text(),
    category: text().notNull(),
    isOfficial: boolean("is_official").default(false).notNull(),
    ownerUserId: text("owner_user_id"),
    status: text().default("pending").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    description: text(),
    tags: text().array().default([""]),
    externalUrl: text("external_url"),
    affiliateUrl: text("affiliate_url"),
    releaseYear: text("release_year"),
    scale: text(),
    isPurchasable: boolean("is_purchasable").default(true),
  },
  (table) => [
    index("idx_works_owner_status").using(
      "btree",
      table.ownerUserId.asc().nullsLast().op("text_ops"),
      table.status.asc().nullsLast().op("text_ops")
    ),
    foreignKey({
      columns: [table.ownerUserId],
      foreignColumns: [users.id],
      name: "works_owner_user_id_fkey",
    }).onDelete("set null"),
    check(
      "works_category_check",
      sql`category = ANY (ARRAY['anime'::text, 'manga'::text, 'other'::text])`
    ),
    check(
      "works_status_check",
      sql`status = ANY (ARRAY['public'::text, 'pending'::text, 'private'::text])`
    ),
    check(
      "works_scale_check",
      sql`scale = ANY (ARRAY['half_day'::text, 'one_day'::text, 'one_week'::text, 'one_month'::text, 'one_cour'::text, 'long_term'::text])`
    ),
  ]
);

export const groups = pgTable(
  "groups",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    description: text(),
    isOfficial: boolean("is_official").default(false),
    avatarUrl: text("avatar_url"),
    coverUrl: text("cover_url"),
    leaderId: uuid("leader_id"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.leaderId],
      foreignColumns: [userProfiles.id],
      name: "groups_leader_id_fkey",
    }),
  ]
);

export const nations = pgTable(
  "nations",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    description: text(),
    isOfficial: boolean("is_official").default(false),
    avatarUrl: text("avatar_url"),
    coverUrl: text("cover_url"),
    ownerUserId: uuid("owner_user_id"),
    ownerGroupId: uuid("owner_group_id"),
    transactionFeeRate: numeric("transaction_fee_rate").default("10.0"),
    foundationFee: integer("foundation_fee").default(1000),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.ownerUserId],
      foreignColumns: [userProfiles.id],
      name: "nations_owner_user_id_fkey",
    }),
    foreignKey({
      columns: [table.ownerGroupId],
      foreignColumns: [groups.id],
      name: "nations_owner_group_id_fkey",
    }),
  ]
);

export const marketItems = pgTable(
  "market_items",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    nationId: uuid("nation_id").notNull(),
    sellerId: uuid("seller_id"),
    sellerGroupId: uuid("seller_group_id"),
    title: text().notNull(),
    description: text(),
    price: integer().notNull(),
    currency: text().default("point"),
    type: text().default("sell"),
    status: text().default("open"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.nationId],
      foreignColumns: [nations.id],
      name: "market_items_nation_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.sellerId],
      foreignColumns: [userProfiles.id],
      name: "market_items_seller_id_fkey",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.sellerGroupId],
      foreignColumns: [groups.id],
      name: "market_items_seller_group_id_fkey",
    }).onDelete("set null"),
    check("market_items_price_check", sql`price >= 0`),
    check(
      "market_items_type_check",
      sql`type = ANY (ARRAY['sell'::text, 'buy_request'::text])`
    ),
    check(
      "market_items_status_check",
      sql`status = ANY (ARRAY['open'::text, 'sold'::text, 'closed'::text])`
    ),
  ]
);

export const marketTransactions = pgTable(
  "market_transactions",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    itemId: uuid("item_id").notNull(),
    buyerId: uuid("buyer_id"),
    sellerId: uuid("seller_id"),
    price: integer().notNull(),
    feeRate: numeric("fee_rate").notNull(),
    feeAmount: integer("fee_amount").notNull(),
    sellerRevenue: integer("seller_revenue").notNull(),
    status: text().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    completedAt: timestamp("completed_at", {
      withTimezone: true,
      mode: "string",
    }),
  },
  (table) => [
    foreignKey({
      columns: [table.itemId],
      foreignColumns: [marketItems.id],
      name: "market_transactions_item_id_fkey",
    }),
    foreignKey({
      columns: [table.buyerId],
      foreignColumns: [userProfiles.id],
      name: "market_transactions_buyer_id_fkey",
    }),
    foreignKey({
      columns: [table.sellerId],
      foreignColumns: [userProfiles.id],
      name: "market_transactions_seller_id_fkey",
    }),
    check(
      "market_transactions_status_check",
      sql`status = ANY (ARRAY['pending'::text, 'completed'::text, 'cancelled'::text])`
    ),
  ]
);

export const nationEvents = pgTable(
  "nation_events",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    nationId: uuid("nation_id").notNull(),
    organizerId: uuid("organizer_id"),
    title: text().notNull(),
    description: text(),
    imageUrl: text("image_url"),
    startAt: timestamp("start_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    endAt: timestamp("end_at", { withTimezone: true, mode: "string" }),
    recruitmentStartAt: timestamp("recruitment_start_at", {
      withTimezone: true,
      mode: "string",
    }),
    recruitmentEndAt: timestamp("recruitment_end_at", {
      withTimezone: true,
      mode: "string",
    }),
    maxParticipants: integer("max_participants"),
    conditions: text(),
    sponsors: text(),
    type: text().default("free"),
    status: text().default("published"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.nationId],
      foreignColumns: [nations.id],
      name: "nation_events_nation_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.organizerId],
      foreignColumns: [userProfiles.id],
      name: "nation_events_organizer_id_fkey",
    }),
    check(
      "nation_events_type_check",
      sql`type = ANY (ARRAY['product_required'::text, 'free'::text, 'other'::text])`
    ),
    check(
      "nation_events_status_check",
      sql`status = ANY (ARRAY['draft'::text, 'published'::text, 'cancelled'::text, 'completed'::text])`
    ),
  ]
);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userProfileId: uuid("user_profile_id").notNull(),
    title: text().notNull(),
    message: text().notNull(),
    linkUrl: text("link_url"),
    type: text().notNull(),
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_notifications_user_profile_id_is_read").using(
      "btree",
      table.userProfileId.asc().nullsLast().op("uuid_ops"),
      table.isRead.asc().nullsLast().op("bool_ops")
    ),
    foreignKey({
      columns: [table.userProfileId],
      foreignColumns: [userProfiles.id],
      name: "notifications_user_profile_id_fkey",
    }).onDelete("cascade"),
  ]
);

export const nationPosts = pgTable(
  "nation_posts",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    nationId: uuid("nation_id").notNull(),
    authorId: uuid("author_id"),
    authorGroupId: uuid("author_group_id"),
    content: text().notNull(),
    type: text().default("chat"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.nationId],
      foreignColumns: [nations.id],
      name: "nation_posts_nation_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.authorId],
      foreignColumns: [userProfiles.id],
      name: "nation_posts_author_id_fkey",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.authorGroupId],
      foreignColumns: [groups.id],
      name: "nation_posts_author_group_id_fkey",
    }).onDelete("set null"),
    check(
      "nation_posts_type_check",
      sql`type = ANY (ARRAY['announcement'::text, 'chat'::text])`
    ),
    check(
      "check_author_exclusive",
      sql`((author_id IS NOT NULL) AND (author_group_id IS NULL)) OR ((author_id IS NULL) AND (author_group_id IS NOT NULL))`
    ),
  ]
);

export const follows = pgTable(
  "follows",
  {
    followerProfileId: uuid("follower_profile_id").notNull(),
    followedProfileId: uuid("followed_profile_id").notNull(),
    status: followStatus().default("follow").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_follows_followed_profile").using(
      "btree",
      table.followedProfileId.asc().nullsLast().op("uuid_ops")
    ),
    index("idx_follows_follower_profile").using(
      "btree",
      table.followerProfileId.asc().nullsLast().op("uuid_ops")
    ),
    foreignKey({
      columns: [table.followerProfileId],
      foreignColumns: [userProfiles.id],
      name: "follows_follower_profile_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.followedProfileId],
      foreignColumns: [userProfiles.id],
      name: "follows_followed_profile_id_fkey",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.followerProfileId, table.followedProfileId],
      name: "follows_pkey",
    }),
    check(
      "follows_self_check",
      sql`follower_profile_id <> followed_profile_id`
    ),
  ]
);

/**
 * Relationships Table（ユーザー間の関係）
 *
 * 2ユーザー間の多様な関係性を記録するテーブル。
 * 関係性は非対称（方向性あり）：ユーザーAからユーザーBへの関係と、ユーザーBからユーザーAへの関係は異なる。
 *
 * @design
 * - relationship: 'follow' | 'friend' | 'business_partner' | 'watch' | 'pre_partner' | 'partner'
 * - 同一ユーザー・同一相手・同一関係の重複は不可（UNIQUE制約）
 * - userId と targetUserId は異なる必要がある（CHECK制約）
 * - 関係性のスケーリングや拡張を考慮した設計
 *
 * @example
 * UserA -（follow）-> UserB: ユーザーAがユーザーBをフォロー
 * UserB -（friend）-> UserA: ユーザーBとユーザーAが友達関係
 * UserA -（business_partner）-> UserC: ユーザーAとユーザーCがビジネスパートナー
 */
export const relationships = pgTable(
  "relationships",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userProfileId: uuid("user_profile_id")
      .notNull()
      .references(() => userProfiles.id, { onDelete: "cascade" }), // 関係性の発端ユーザー
    targetProfileId: uuid("target_profile_id")
      .notNull()
      .references(() => userProfiles.id, { onDelete: "cascade" }), // 関係対象ユーザー
    relationship: text("relationship").notNull(), // 'follow', 'friend', 'business_partner', 'watch', 'pre_partner', 'partner'
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_relationships_userProfileId").using(
      "btree",
      table.userProfileId.asc().nullsLast().op("uuid_ops")
    ),
    index("idx_relationships_targetProfileId").using(
      "btree",
      table.targetProfileId.asc().nullsLast().op("uuid_ops")
    ),
    index("idx_relationships_relationship").using(
      "btree",
      table.relationship.asc().nullsLast().op("text_ops")
    ),
    // 同一ユーザーが同一相手に同じ関係を重複設定することを防止
    unique("relationships_userProfileId_targetProfileId_relationship_unique").on(
      table.userProfileId,
      table.targetProfileId,
      table.relationship,
    ),
    // 自分自身を関係対象にすることを防止
    check(
      "relationships_self_check",
      sql`user_profile_id <> target_profile_id`,
    ),
  ]
);

export const groupMembers = pgTable(
  "group_members",
  {
    groupId: uuid("group_id").notNull(),
    userProfileId: uuid("user_profile_id").notNull(),
    role: text().default("member"),
    joinedAt: timestamp("joined_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.groupId],
      foreignColumns: [groups.id],
      name: "group_members_group_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userProfileId],
      foreignColumns: [userProfiles.id],
      name: "group_members_user_profile_id_fkey",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.groupId, table.userProfileId],
      name: "group_members_pkey",
    }),
    check(
      "group_members_role_check",
      sql`role = ANY (ARRAY['leader'::text, 'mediator'::text, 'member'::text])`
    ),
  ]
);

export const nationGroups = pgTable(
  "nation_groups",
  {
    nationId: uuid("nation_id").notNull(),
    groupId: uuid("group_id").notNull(),
    role: text().default("member"),
    joinedAt: timestamp("joined_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.nationId],
      foreignColumns: [nations.id],
      name: "nation_groups_nation_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.groupId],
      foreignColumns: [groups.id],
      name: "nation_groups_group_id_fkey",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.nationId, table.groupId],
      name: "nation_groups_pkey",
    }),
    check(
      "nation_groups_role_check",
      sql`role = ANY (ARRAY['deputy'::text, 'member'::text])`
    ),
  ]
);

export const nationCitizens = pgTable(
  "nation_citizens",
  {
    nationId: uuid("nation_id").notNull(),
    userProfileId: uuid("user_profile_id").notNull(),
    role: text().default("citizen"),
    joinedAt: timestamp("joined_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.nationId],
      foreignColumns: [nations.id],
      name: "nation_citizens_nation_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userProfileId],
      foreignColumns: [userProfiles.id],
      name: "nation_citizens_user_profile_id_fkey",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.nationId, table.userProfileId],
      name: "nation_citizens_pkey",
    }),
    check(
      "nation_citizens_role_check",
      sql`role = ANY (ARRAY['official'::text, 'citizen'::text, 'governor'::text])`
    ),
  ]
);

export const nationEventParticipants = pgTable(
  "nation_event_participants",
  {
    eventId: uuid("event_id").notNull(),
    userProfileId: uuid("user_profile_id").notNull(),
    status: text().default("going"),
    joinedAt: timestamp("joined_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.eventId],
      foreignColumns: [nationEvents.id],
      name: "nation_event_participants_event_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userProfileId],
      foreignColumns: [userProfiles.id],
      name: "nation_event_participants_user_profile_id_fkey",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.eventId, table.userProfileId],
      name: "nation_event_participants_pkey",
    }),
    check(
      "nation_event_participants_status_check",
      sql`status = ANY (ARRAY['going'::text, 'cancelled'::text, 'waitlist'::text])`
    ),
  ]
);

export const userWorkRatings = pgTable(
  "user_work_ratings",
  {
    userId: text("user_id").notNull(),
    workId: uuid("work_id").notNull(),
    rating: text().notNull(),
    lastTier: text("last_tier"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_user_work_ratings_user_work").using(
      "btree",
      table.userId.asc().nullsLast().op("text_ops"),
      table.workId.asc().nullsLast().op("uuid_ops")
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "user_work_ratings_user_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.workId],
      foreignColumns: [works.id],
      name: "user_work_ratings_work_id_fkey",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.userId, table.workId],
      name: "user_work_ratings_pkey",
    }),
  ]
);

export const userWorkEntries = pgTable(
  "user_work_entries",
  {
    userId: text("user_id").notNull(),
    workId: uuid("work_id").notNull(),
    status: text().notNull(),
    tier: integer(),
    memo: text(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_user_work_entries_user_work").using(
      "btree",
      table.userId.asc().nullsLast().op("text_ops"),
      table.workId.asc().nullsLast().op("uuid_ops")
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "user_work_entries_user_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.workId],
      foreignColumns: [works.id],
      name: "user_work_entries_work_id_fkey",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.userId, table.workId],
      name: "user_work_entries_pkey",
    }),
    check(
      "user_work_entries_status_check",
      sql`status = ANY (ARRAY['expecting'::text, 'reading'::text, 'interesting'::text])`
    ),
  ]
);

export const pointTransactions = pgTable(
  "point_transactions",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userProfileId: uuid("user_profile_id").notNull(), // ポイントは仮面ごとに独立
    amount: integer().notNull(),
    type: text().notNull(), // 'daily_login', 'content_creation', 'connection', 'system_adjustment'
    description: text(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_point_transactions_user_profile").using(
      "btree",
      table.userProfileId.asc().nullsLast().op("uuid_ops")
    ),
    foreignKey({
      columns: [table.userProfileId],
      foreignColumns: [userProfiles.id],
      name: "point_transactions_user_profile_id_fkey",
    }).onDelete("cascade"),
  ]
);

// --- Relations ---

export const usersRelations = relations(users, ({ one, many }) => ({
  preference: one(userPreferences, {
    fields: [users.id],
    references: [userPreferences.userId],
  }),
  accounts: many(accounts),
  sessions: many(sessions),
  rootAccounts: many(rootAccounts),
  works: many(works),
  userWorkRatings: many(userWorkRatings),
  userWorkEntries: many(userWorkEntries),
}));

export const rootAccountsRelations = relations(
  rootAccounts,
  ({ one, many }) => ({
    user: one(users, {
      fields: [rootAccounts.authUserId],
      references: [users.id],
    }),
    userProfiles: many(userProfiles),
  })
);

export const userProfilesRelations = relations(
  userProfiles,
  ({ one, many }) => ({
    rootAccount: one(rootAccounts, {
      fields: [userProfiles.rootAccountId],
      references: [rootAccounts.id],
    }),
    businessCards: many(businessCards),
    alliances_profileAId: many(alliances, {
      relationName: "alliances_profileAId_userProfiles_id",
    }),
    alliances_profileBId: many(alliances, {
      relationName: "alliances_profileBId_userProfiles_id",
    }),
    groups: many(groups),
    nations: many(nations),
    marketItems: many(marketItems),
    marketTransactions_buyerId: many(marketTransactions, {
      relationName: "marketTransactions_buyerId_userProfiles_id",
    }),
    marketTransactions_sellerId: many(marketTransactions, {
      relationName: "marketTransactions_sellerId_userProfiles_id",
    }),
    nationEvents: many(nationEvents),
    notifications: many(notifications),
    nationPosts: many(nationPosts),
    follows_followerProfileId: many(follows, {
      relationName: "follows_followerProfileId_userProfiles_id",
    }),
    follows_followedProfileId: many(follows, {
      relationName: "follows_followedProfileId_userProfiles_id",
    }),
    groupMembers: many(groupMembers),
    nationCitizens: many(nationCitizens),
    nationEventParticipants: many(nationEventParticipants),
    relationships_userProfile: many(relationships, {
      relationName: "relationships_userProfile",
    }),
    relationships_targetProfile: many(relationships, {
      relationName: "relationships_targetProfile",
    }),
    pointTransactions: many(pointTransactions), // ポイント履歴（仮面ごと）
  })
);

export const businessCardsRelations = relations(businessCards, ({ one }) => ({
  userProfile: one(userProfiles, {
    fields: [businessCards.userProfileId],
    references: [userProfiles.id],
  }),
}));

export const pointTransactionsRelations = relations(
  pointTransactions,
  ({ one }) => ({
    userProfile: one(userProfiles, {
      fields: [pointTransactions.userProfileId],
      references: [userProfiles.id],
    }),
  })
);

export const alliancesRelations = relations(alliances, ({ one }) => ({
  userProfile_profileAId: one(userProfiles, {
    fields: [alliances.profileAId],
    references: [userProfiles.id],
    relationName: "alliances_profileAId_userProfiles_id",
  }),
  userProfile_profileBId: one(userProfiles, {
    fields: [alliances.profileBId],
    references: [userProfiles.id],
    relationName: "alliances_profileBId_userProfiles_id",
  }),
}));

export const worksRelations = relations(works, ({ one, many }) => ({
  user: one(users, {
    fields: [works.ownerUserId],
    references: [users.id],
  }),
  userWorkRatings: many(userWorkRatings),
  userWorkEntries: many(userWorkEntries),
}));

export const groupsRelations = relations(groups, ({ one, many }) => ({
  userProfile: one(userProfiles, {
    fields: [groups.leaderId],
    references: [userProfiles.id],
  }),
  nations: many(nations),
  marketItems: many(marketItems),
  nationPosts: many(nationPosts),
  groupMembers: many(groupMembers),
  nationGroups: many(nationGroups),
}));

export const nationsRelations = relations(nations, ({ one, many }) => ({
  userProfile: one(userProfiles, {
    fields: [nations.ownerUserId],
    references: [userProfiles.id],
  }),
  group: one(groups, {
    fields: [nations.ownerGroupId],
    references: [groups.id],
  }),
  marketItems: many(marketItems),
  nationEvents: many(nationEvents),
  nationPosts: many(nationPosts),
  nationGroups: many(nationGroups),
  nationCitizens: many(nationCitizens),
}));

export const marketItemsRelations = relations(marketItems, ({ one, many }) => ({
  nation: one(nations, {
    fields: [marketItems.nationId],
    references: [nations.id],
  }),
  userProfile: one(userProfiles, {
    fields: [marketItems.sellerId],
    references: [userProfiles.id],
  }),
  group: one(groups, {
    fields: [marketItems.sellerGroupId],
    references: [groups.id],
  }),
  marketTransactions: many(marketTransactions),
}));

export const marketTransactionsRelations = relations(
  marketTransactions,
  ({ one }) => ({
    marketItem: one(marketItems, {
      fields: [marketTransactions.itemId],
      references: [marketItems.id],
    }),
    userProfile_buyerId: one(userProfiles, {
      fields: [marketTransactions.buyerId],
      references: [userProfiles.id],
      relationName: "marketTransactions_buyerId_userProfiles_id",
    }),
    userProfile_sellerId: one(userProfiles, {
      fields: [marketTransactions.sellerId],
      references: [userProfiles.id],
      relationName: "marketTransactions_sellerId_userProfiles_id",
    }),
  })
);

export const nationEventsRelations = relations(
  nationEvents,
  ({ one, many }) => ({
    nation: one(nations, {
      fields: [nationEvents.nationId],
      references: [nations.id],
    }),
    userProfile: one(userProfiles, {
      fields: [nationEvents.organizerId],
      references: [userProfiles.id],
    }),
    nationEventParticipants: many(nationEventParticipants),
  })
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  userProfile: one(userProfiles, {
    fields: [notifications.userProfileId],
    references: [userProfiles.id],
  }),
}));

export const nationPostsRelations = relations(nationPosts, ({ one }) => ({
  nation: one(nations, {
    fields: [nationPosts.nationId],
    references: [nations.id],
  }),
  userProfile: one(userProfiles, {
    fields: [nationPosts.authorId],
    references: [userProfiles.id],
  }),
  group: one(groups, {
    fields: [nationPosts.authorGroupId],
    references: [groups.id],
  }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  userProfile_followerProfileId: one(userProfiles, {
    fields: [follows.followerProfileId],
    references: [userProfiles.id],
    relationName: "follows_followerProfileId_userProfiles_id",
  }),
  userProfile_followedProfileId: one(userProfiles, {
    fields: [follows.followedProfileId],
    references: [userProfiles.id],
    relationName: "follows_followedProfileId_userProfiles_id",
  }),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  userProfile: one(userProfiles, {
    fields: [groupMembers.userProfileId],
    references: [userProfiles.id],
  }),
}));

export const relationshipsRelations = relations(relationships, ({ one }) => ({
  userProfile: one(userProfiles, {
    fields: [relationships.userProfileId],
    references: [userProfiles.id],
    relationName: "relationships_userProfile",
  }),
  targetProfile: one(userProfiles, {
    fields: [relationships.targetProfileId],
    references: [userProfiles.id],
    relationName: "relationships_targetProfile",
  }),
}));

export const nationGroupsRelations = relations(nationGroups, ({ one }) => ({
  nation: one(nations, {
    fields: [nationGroups.nationId],
    references: [nations.id],
  }),
  group: one(groups, {
    fields: [nationGroups.groupId],
    references: [groups.id],
  }),
}));

export const nationCitizensRelations = relations(nationCitizens, ({ one }) => ({
  nation: one(nations, {
    fields: [nationCitizens.nationId],
    references: [nations.id],
  }),
  userProfile: one(userProfiles, {
    fields: [nationCitizens.userProfileId],
    references: [userProfiles.id],
  }),
}));

export const nationEventParticipantsRelations = relations(
  nationEventParticipants,
  ({ one }) => ({
    nationEvent: one(nationEvents, {
      fields: [nationEventParticipants.eventId],
      references: [nationEvents.id],
    }),
    userProfile: one(userProfiles, {
      fields: [nationEventParticipants.userProfileId],
      references: [userProfiles.id],
    }),
  })
);

export const userWorkRatingsRelations = relations(
  userWorkRatings,
  ({ one }) => ({
    user: one(users, {
      fields: [userWorkRatings.userId],
      references: [users.id],
    }),
    work: one(works, {
      fields: [userWorkRatings.workId],
      references: [works.id],
    }),
  })
);

export const userWorkEntriesRelations = relations(
  userWorkEntries,
  ({ one }) => ({
    user: one(users, {
      fields: [userWorkEntries.userId],
      references: [users.id],
    }),
    work: one(works, {
      fields: [userWorkEntries.workId],
      references: [works.id],
    }),
  })
);
// --- Admin Management Tables ---

// ペナルティテーブル
export const penalties = pgTable(
  "penalties",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    targetProfileId: uuid("target_profile_id").notNull(),
    issuerId: uuid("issuer_id"),
    type: text("type", { enum: ["notice", "warning", "card", "leave", "another_dimension"] }).notNull(),
    reason: text("reason").notNull(),
    issuedAt: timestamp("issued_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
    activateUntil: timestamp("activate_until", { withTimezone: true, mode: "string" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_penalties_target_profile_id").using("btree", table.targetProfileId.asc()),
    index("idx_penalties_issued_at").using("btree", table.issuedAt.desc()),
    foreignKey({
      columns: [table.targetProfileId],
      foreignColumns: [userProfiles.id],
      name: "penalties_target_profile_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.issuerId],
      foreignColumns: [userProfiles.id],
      name: "penalties_issuer_id_fkey",
    }).onDelete("set null"),
  ]
);

// 作品承認キューテーブル
export const approvals = pgTable(
  "approvals",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    workId: uuid("work_id").notNull(),
    creatorId: uuid("creator_id").notNull(),
    title: text("title").notNull(),
    status: text("status", { enum: ["pending", "approved", "rejected"] }).default("pending").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true, mode: "string" }),
    reviewerId: uuid("reviewer_id"),
    reviewNote: text("review_note"),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_approvals_status").using("btree", table.status.asc()),
    index("idx_approvals_created_at").using("btree", table.createdAt.desc()),
    foreignKey({
      columns: [table.creatorId],
      foreignColumns: [userProfiles.id],
      name: "approvals_creator_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.reviewerId],
      foreignColumns: [userProfiles.id],
      name: "approvals_reviewer_id_fkey",
    }).onDelete("set null"),
  ]
);

// 監査ログテーブル
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    adminId: uuid("admin_id").notNull(),
    action: text("action").notNull(),
    targetId: uuid("target_id"),
    targetType: text("target_type"),
    result: text("result", { enum: ["success", "failure"] }).notNull(),
    riskLevel: text("risk_level", { enum: ["high", "medium", "low"] }).notNull(),
    details: jsonb("details"),
    timestamp: timestamp("timestamp", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
    ipAddress: text("ip_address"),
  },
  (table) => [
    index("idx_audit_logs_admin_id").using("btree", table.adminId.asc()),
    index("idx_audit_logs_timestamp").using("btree", table.timestamp.desc()),
    index("idx_audit_logs_risk_level").using("btree", table.riskLevel.asc()),
    foreignKey({
      columns: [table.adminId],
      foreignColumns: [userProfiles.id],
      name: "audit_logs_admin_id_fkey",
    }).onDelete("cascade"),
  ]
);

// 情報ボック（待機ユーザー情報等）
export const adminDashboardCache = pgTable(
  "admin_dashboard_cache",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    key: text("key").unique().notNull(),
    value: jsonb("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  }
);

// --- Relations ---



export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));


export const penaltiesRelations = relations(penalties, ({ one }) => ({
  targetProfile: one(userProfiles, {
    fields: [penalties.targetProfileId],
    references: [userProfiles.id],
    relationName: "penalties_targetProfile",
  }),
  issuer: one(userProfiles, {
    fields: [penalties.issuerId],
    references: [userProfiles.id],
    relationName: "penalties_issuer",
  }),
}));

export const approvalsRelations = relations(approvals, ({ one }) => ({
  creator: one(userProfiles, {
    fields: [approvals.creatorId],
    references: [userProfiles.id],
    relationName: "approvals_creator",
  }),
  reviewer: one(userProfiles, {
    fields: [approvals.reviewerId],
    references: [userProfiles.id],
    relationName: "approvals_reviewer",
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  admin: one(userProfiles, {
    fields: [auditLogs.adminId],
    references: [userProfiles.id],
    relationName: "auditLogs_admin",
  }),
}));
