import { relations, sql } from "drizzle-orm";
import { boolean, check, foreignKey, index, integer, jsonb, numeric, pgEnum, pgPolicy, pgSchema, pgTable, primaryKey, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

// --- Auth Schema ---
export const authSchema = pgSchema("auth");
export const users = authSchema.table("users", {
  id: uuid("id").primaryKey().notNull(),
});

// --- Enums ---
export const allianceStatus = pgEnum("alliance_status", ['requested', 'pre_partner', 'partner'])
export const followStatus = pgEnum("follow_status", ['watch', 'follow'])

// --- Tables ---

export const rootAccounts = pgTable("root_accounts", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  authUserId: uuid("auth_user_id").notNull(),
  points: integer().default(3000).notNull(),
  level: integer().default(1).notNull(),
  trustDays: integer("trust_days").default(0).notNull(),
  dataRetentionDays: integer("data_retention_days").default(30),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.authUserId],
    foreignColumns: [users.id],
    name: "root_accounts_auth_user_id_fkey"
  }).onDelete("cascade"),
  unique("root_accounts_auth_user_id_key").on(table.authUserId),
  pgPolicy("Users can update own root account", { as: "permissive", for: "update", to: ["public"], using: sql`(auth.uid() = auth_user_id)` }),
  pgPolicy("Users can view own root account", { as: "permissive", for: "select", to: ["public"] }),
  check("root_accounts_points_check", sql`points >= 0`),
  check("root_accounts_level_check", sql`level >= 1`),
  check("root_accounts_trust_days_check", sql`trust_days >= 0`),
]);

export const userProfiles = pgTable("user_profiles", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  rootAccountId: uuid("root_account_id").notNull(),
  displayName: text("display_name").notNull(),
  purpose: text(),
  roleType: text("role_type").default('member').notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  lastInteractedRecordId: uuid("last_interacted_record_id"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  index("idx_user_profiles_root_account_id").using("btree", table.rootAccountId.asc().nullsLast().op("uuid_ops")),
  foreignKey({
    columns: [table.rootAccountId],
    foreignColumns: [rootAccounts.id],
    name: "user_profiles_root_account_id_fkey"
  }).onDelete("cascade"),
  pgPolicy("Users can delete own profiles", {
    as: "permissive", for: "delete", to: ["public"], using: sql`(root_account_id IN ( SELECT root_accounts.id
   FROM root_accounts
  WHERE (root_accounts.auth_user_id = auth.uid())))` }),
  pgPolicy("Users can update own profiles", { as: "permissive", for: "update", to: ["public"] }),
  pgPolicy("Users can insert own profiles", { as: "permissive", for: "insert", to: ["public"] }),
  pgPolicy("Users can view own profiles", { as: "permissive", for: "select", to: ["public"] }),
  check("role_type_check", sql`role_type = ANY (ARRAY['leader'::text, 'member'::text, 'admin'::text, 'mediator'::text])`),
]);

export const businessCards = pgTable("business_cards", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userProfileId: uuid("user_profile_id").notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  displayConfig: jsonb("display_config").default({}).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, now())`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, now())`).notNull(),
  content: jsonb().default({}).notNull(),
}, (table) => [
  index("business_cards_user_profile_id_idx").using("btree", table.userProfileId.asc().nullsLast().op("uuid_ops")),
  foreignKey({
    columns: [table.userProfileId],
    foreignColumns: [userProfiles.id],
    name: "business_cards_user_profile_id_fkey"
  }).onDelete("cascade"),
  unique("business_cards_user_profile_id_key").on(table.userProfileId),
  pgPolicy("Owners can create their own business card", {
    as: "permissive", for: "insert", to: ["public"], withCheck: sql`(EXISTS ( SELECT 1
   FROM (user_profiles
     JOIN root_accounts ON ((user_profiles.root_account_id = root_accounts.id)))
  WHERE ((user_profiles.id = business_cards.user_profile_id) AND (root_accounts.auth_user_id = auth.uid()))))`  }),
  pgPolicy("Owners can update their own business card", { as: "permissive", for: "update", to: ["public"] }),
  pgPolicy("Public can view published business cards", { as: "permissive", for: "select", to: ["public"] }),
  pgPolicy("Owners can view their own business card", { as: "permissive", for: "select", to: ["public"] }),
]);

export const alliances = pgTable("alliances", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  profileAId: uuid("profile_a_id").notNull(),
  profileBId: uuid("profile_b_id").notNull(),
  status: allianceStatus().default('requested').notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }),
  metadata: jsonb().default({}),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  index("idx_alliances_profile_a").using("btree", table.profileAId.asc().nullsLast().op("uuid_ops")),
  index("idx_alliances_profile_b").using("btree", table.profileBId.asc().nullsLast().op("uuid_ops")),
  foreignKey({
    columns: [table.profileAId],
    foreignColumns: [userProfiles.id],
    name: "alliances_profile_a_id_fkey"
  }).onDelete("cascade"),
  foreignKey({
    columns: [table.profileBId],
    foreignColumns: [userProfiles.id],
    name: "alliances_profile_b_id_fkey"
  }).onDelete("cascade"),
  unique("alliances_unique_pair").on(table.profileAId, table.profileBId),
  pgPolicy("Users can delete their own profiles' alliances", {
    as: "permissive", for: "delete", to: ["public"], using: sql`((profile_a_id IN ( SELECT user_profiles.id
   FROM user_profiles
  WHERE (user_profiles.root_account_id IN ( SELECT root_accounts.id
           FROM root_accounts
          WHERE (root_accounts.auth_user_id = auth.uid()))))) OR (profile_b_id IN ( SELECT user_profiles.id
   FROM user_profiles
  WHERE (user_profiles.root_account_id IN ( SELECT root_accounts.id
           FROM root_accounts
          WHERE (root_accounts.auth_user_id = auth.uid()))))))` }),
  pgPolicy("Users can update their own profiles' alliances", { as: "permissive", for: "update", to: ["public"] }),
  pgPolicy("Users can initiate alliances for their own profiles", { as: "permissive", for: "insert", to: ["public"] }),
  pgPolicy("Users can view their own profiles' alliances", { as: "permissive", for: "select", to: ["public"] }),
  check("alliances_profile_order_check", sql`profile_a_id < profile_b_id`),
]);

export const works = pgTable("works", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  title: text().notNull(),
  author: text(),
  category: text().notNull(),
  isOfficial: boolean("is_official").default(false).notNull(),
  ownerUserId: uuid("owner_user_id"),
  status: text().default('pending').notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  description: text(),
  tags: text().array().default([""]),
  externalUrl: text("external_url"),
  affiliateUrl: text("affiliate_url"),
  releaseYear: text("release_year"),
  scale: text(),
  isPurchasable: boolean("is_purchasable").default(true),
}, (table) => [
  index("idx_works_owner_status").using("btree", table.ownerUserId.asc().nullsLast().op("text_ops"), table.status.asc().nullsLast().op("text_ops")),
  foreignKey({
    columns: [table.ownerUserId],
    foreignColumns: [users.id],
    name: "works_owner_user_id_fkey"
  }).onDelete("set null"),
  pgPolicy("Users can view their own pending/private works", { as: "permissive", for: "select", to: ["public"], using: sql`(auth.uid() = owner_user_id)` }),
  pgPolicy("Public works are viewable by everyone", { as: "permissive", for: "select", to: ["public"] }),
  pgPolicy("Users can update their own works", { as: "permissive", for: "update", to: ["public"] }),
  pgPolicy("Users can insert their own works", { as: "permissive", for: "insert", to: ["public"] }),
  check("works_category_check", sql`category = ANY (ARRAY['anime'::text, 'manga'::text, 'other'::text])`),
  check("works_status_check", sql`status = ANY (ARRAY['public'::text, 'pending'::text, 'private'::text])`),
  check("works_scale_check", sql`scale = ANY (ARRAY['half_day'::text, 'one_day'::text, 'one_week'::text, 'one_month'::text, 'one_cour'::text, 'long_term'::text])`),
]);

export const groups = pgTable("groups", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text().notNull(),
  description: text(),
  isOfficial: boolean("is_official").default(false),
  avatarUrl: text("avatar_url"),
  coverUrl: text("cover_url"),
  leaderId: uuid("leader_id"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.leaderId],
    foreignColumns: [userProfiles.id],
    name: "groups_leader_id_fkey"
  }),
  pgPolicy("Leaders can delete groups", {
    as: "permissive", for: "delete", to: ["public"], using: sql`(leader_id IN ( SELECT user_profiles.id
   FROM user_profiles
  WHERE (user_profiles.root_account_id IN ( SELECT root_accounts.id
           FROM root_accounts
          WHERE (root_accounts.auth_user_id = auth.uid())))))` }),
  pgPolicy("Leaders can update groups", { as: "permissive", for: "update", to: ["public"] }),
  pgPolicy("Authenticated users can create groups", { as: "permissive", for: "insert", to: ["public"] }),
  pgPolicy("Public read access for groups", { as: "permissive", for: "select", to: ["public"] }),
]);

export const nations = pgTable("nations", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text().notNull(),
  description: text(),
  isOfficial: boolean("is_official").default(false),
  avatarUrl: text("avatar_url"),
  coverUrl: text("cover_url"),
  ownerUserId: uuid("owner_user_id"),
  ownerGroupId: uuid("owner_group_id"),
  transactionFeeRate: numeric("transaction_fee_rate").default('10.0'),
  foundationFee: integer("foundation_fee").default(1000),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.ownerUserId],
    foreignColumns: [userProfiles.id],
    name: "nations_owner_user_id_fkey"
  }),
  foreignKey({
    columns: [table.ownerGroupId],
    foreignColumns: [groups.id],
    name: "nations_owner_group_id_fkey"
  }),
  pgPolicy("Public read access for nations", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const marketItems = pgTable("market_items", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  nationId: uuid("nation_id").notNull(),
  sellerId: uuid("seller_id"),
  sellerGroupId: uuid("seller_group_id"),
  title: text().notNull(),
  description: text(),
  price: integer().notNull(),
  currency: text().default('point'),
  type: text().default('sell'),
  status: text().default('open'),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.nationId],
    foreignColumns: [nations.id],
    name: "market_items_nation_id_fkey"
  }).onDelete("cascade"),
  foreignKey({
    columns: [table.sellerId],
    foreignColumns: [userProfiles.id],
    name: "market_items_seller_id_fkey"
  }).onDelete("set null"),
  foreignKey({
    columns: [table.sellerGroupId],
    foreignColumns: [groups.id],
    name: "market_items_seller_group_id_fkey"
  }).onDelete("set null"),
  pgPolicy("Public read access for market items", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
  check("market_items_price_check", sql`price >= 0`),
  check("market_items_type_check", sql`type = ANY (ARRAY['sell'::text, 'buy_request'::text])`),
  check("market_items_status_check", sql`status = ANY (ARRAY['open'::text, 'sold'::text, 'closed'::text])`),
]);

export const marketTransactions = pgTable("market_transactions", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  itemId: uuid("item_id").notNull(),
  buyerId: uuid("buyer_id"),
  sellerId: uuid("seller_id"),
  price: integer().notNull(),
  feeRate: numeric("fee_rate").notNull(),
  feeAmount: integer("fee_amount").notNull(),
  sellerRevenue: integer("seller_revenue").notNull(),
  status: text().default('pending'),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
  foreignKey({
    columns: [table.itemId],
    foreignColumns: [marketItems.id],
    name: "market_transactions_item_id_fkey"
  }),
  foreignKey({
    columns: [table.buyerId],
    foreignColumns: [userProfiles.id],
    name: "market_transactions_buyer_id_fkey"
  }),
  foreignKey({
    columns: [table.sellerId],
    foreignColumns: [userProfiles.id],
    name: "market_transactions_seller_id_fkey"
  }),
  check("market_transactions_status_check", sql`status = ANY (ARRAY['pending'::text, 'completed'::text, 'cancelled'::text])`),
]);

export const nationEvents = pgTable("nation_events", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  nationId: uuid("nation_id").notNull(),
  organizerId: uuid("organizer_id"),
  title: text().notNull(),
  description: text(),
  imageUrl: text("image_url"),
  startAt: timestamp("start_at", { withTimezone: true, mode: 'string' }).notNull(),
  endAt: timestamp("end_at", { withTimezone: true, mode: 'string' }),
  recruitmentStartAt: timestamp("recruitment_start_at", { withTimezone: true, mode: 'string' }),
  recruitmentEndAt: timestamp("recruitment_end_at", { withTimezone: true, mode: 'string' }),
  maxParticipants: integer("max_participants"),
  conditions: text(),
  sponsors: text(),
  type: text().default('free'),
  status: text().default('published'),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.nationId],
    foreignColumns: [nations.id],
    name: "nation_events_nation_id_fkey"
  }).onDelete("cascade"),
  foreignKey({
    columns: [table.organizerId],
    foreignColumns: [userProfiles.id],
    name: "nation_events_organizer_id_fkey"
  }),
  pgPolicy("Public read access for events", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
  check("nation_events_type_check", sql`type = ANY (ARRAY['product_required'::text, 'free'::text, 'other'::text])`),
  check("nation_events_status_check", sql`status = ANY (ARRAY['draft'::text, 'published'::text, 'cancelled'::text, 'completed'::text])`),
]);

export const notifications = pgTable("notifications", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userProfileId: uuid("user_profile_id").notNull(),
  title: text().notNull(),
  message: text().notNull(),
  linkUrl: text("link_url"),
  type: text().notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  index("idx_notifications_user_profile_id_is_read").using("btree", table.userProfileId.asc().nullsLast().op("bool_ops"), table.isRead.asc().nullsLast().op("bool_ops")),
  foreignKey({
    columns: [table.userProfileId],
    foreignColumns: [userProfiles.id],
    name: "notifications_user_profile_id_fkey"
  }).onDelete("cascade"),
]);

export const nationPosts = pgTable("nation_posts", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  nationId: uuid("nation_id").notNull(),
  authorId: uuid("author_id"),
  authorGroupId: uuid("author_group_id"),
  content: text().notNull(),
  type: text().default('chat'),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.nationId],
    foreignColumns: [nations.id],
    name: "nation_posts_nation_id_fkey"
  }).onDelete("cascade"),
  foreignKey({
    columns: [table.authorId],
    foreignColumns: [userProfiles.id],
    name: "nation_posts_author_id_fkey"
  }).onDelete("set null"),
  foreignKey({
    columns: [table.authorGroupId],
    foreignColumns: [groups.id],
    name: "nation_posts_author_group_id_fkey"
  }).onDelete("set null"),
  check("nation_posts_type_check", sql`type = ANY (ARRAY['announcement'::text, 'chat'::text])`),
  check("check_author_exclusive", sql`((author_id IS NOT NULL) AND (author_group_id IS NULL)) OR ((author_id IS NULL) AND (author_group_id IS NOT NULL))`),
]);

export const follows = pgTable("follows", {
  followerProfileId: uuid("follower_profile_id").notNull(),
  followedProfileId: uuid("followed_profile_id").notNull(),
  status: followStatus().default('follow').notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  index("idx_follows_followed_profile").using("btree", table.followedProfileId.asc().nullsLast().op("uuid_ops")),
  index("idx_follows_follower_profile").using("btree", table.followerProfileId.asc().nullsLast().op("uuid_ops")),
  foreignKey({
    columns: [table.followerProfileId],
    foreignColumns: [userProfiles.id],
    name: "follows_follower_profile_id_fkey"
  }).onDelete("cascade"),
  foreignKey({
    columns: [table.followedProfileId],
    foreignColumns: [userProfiles.id],
    name: "follows_followed_profile_id_fkey"
  }).onDelete("cascade"),
  primaryKey({ columns: [table.followerProfileId, table.followedProfileId], name: "follows_pkey" }),
  pgPolicy("Users can delete follows for their own profiles", {
    as: "permissive", for: "delete", to: ["public"], using: sql`(follower_profile_id IN ( SELECT user_profiles.id
   FROM user_profiles
  WHERE (user_profiles.root_account_id IN ( SELECT root_accounts.id
           FROM root_accounts
          WHERE (root_accounts.auth_user_id = auth.uid())))))` }),
  pgPolicy("Users can update follows for their own profiles", { as: "permissive", for: "update", to: ["public"] }),
  pgPolicy("Users can create follows for their own profiles", { as: "permissive", for: "insert", to: ["public"] }),
  pgPolicy("Users can view their profiles' followers (excluding watches)", { as: "permissive", for: "select", to: ["public"] }),
  pgPolicy("Users can view their own profiles' follows and watches", { as: "permissive", for: "select", to: ["public"] }),
  check("follows_self_check", sql`follower_profile_id <> followed_profile_id`),
]);

export const groupMembers = pgTable("group_members", {
  groupId: uuid("group_id").notNull(),
  userProfileId: uuid("user_profile_id").notNull(),
  role: text().default('member'),
  joinedAt: timestamp("joined_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.groupId],
    foreignColumns: [groups.id],
    name: "group_members_group_id_fkey"
  }).onDelete("cascade"),
  foreignKey({
    columns: [table.userProfileId],
    foreignColumns: [userProfiles.id],
    name: "group_members_user_profile_id_fkey"
  }).onDelete("cascade"),
  primaryKey({ columns: [table.groupId, table.userProfileId], name: "group_members_pkey" }),
  pgPolicy("Users can leave groups", {
    as: "permissive", for: "delete", to: ["public"], using: sql`(user_profile_id IN ( SELECT user_profiles.id
   FROM user_profiles
  WHERE (user_profiles.root_account_id IN ( SELECT root_accounts.id
           FROM root_accounts
          WHERE (root_accounts.auth_user_id = auth.uid())))))` }),
  pgPolicy("Users can join groups", { as: "permissive", for: "insert", to: ["public"] }),
  pgPolicy("Leaders can remove members", { as: "permissive", for: "delete", to: ["public"] }),
  pgPolicy("Leaders can update members", { as: "permissive", for: "update", to: ["public"] }),
  pgPolicy("Leaders can add members", { as: "permissive", for: "insert", to: ["public"] }),
  pgPolicy("Public read access for group_members", { as: "permissive", for: "select", to: ["public"] }),
  check("group_members_role_check", sql`role = ANY (ARRAY['leader'::text, 'mediator'::text, 'member'::text])`),
]);

export const nationGroups = pgTable("nation_groups", {
  nationId: uuid("nation_id").notNull(),
  groupId: uuid("group_id").notNull(),
  role: text().default('member'),
  joinedAt: timestamp("joined_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.nationId],
    foreignColumns: [nations.id],
    name: "nation_groups_nation_id_fkey"
  }).onDelete("cascade"),
  foreignKey({
    columns: [table.groupId],
    foreignColumns: [groups.id],
    name: "nation_groups_group_id_fkey"
  }).onDelete("cascade"),
  primaryKey({ columns: [table.nationId, table.groupId], name: "nation_groups_pkey" }),
  check("nation_groups_role_check", sql`role = ANY (ARRAY['deputy'::text, 'member'::text])`),
]);

export const nationCitizens = pgTable("nation_citizens", {
  nationId: uuid("nation_id").notNull(),
  userProfileId: uuid("user_profile_id").notNull(),
  role: text().default('citizen'),
  joinedAt: timestamp("joined_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.nationId],
    foreignColumns: [nations.id],
    name: "nation_citizens_nation_id_fkey"
  }).onDelete("cascade"),
  foreignKey({
    columns: [table.userProfileId],
    foreignColumns: [userProfiles.id],
    name: "nation_citizens_user_profile_id_fkey"
  }).onDelete("cascade"),
  primaryKey({ columns: [table.nationId, table.userProfileId], name: "nation_citizens_pkey" }),
  check("nation_citizens_role_check", sql`role = ANY (ARRAY['official'::text, 'citizen'::text])`),
]);

export const nationEventParticipants = pgTable("nation_event_participants", {
  eventId: uuid("event_id").notNull(),
  userProfileId: uuid("user_profile_id").notNull(),
  status: text().default('going'),
  joinedAt: timestamp("joined_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.eventId],
    foreignColumns: [nationEvents.id],
    name: "nation_event_participants_event_id_fkey"
  }).onDelete("cascade"),
  foreignKey({
    columns: [table.userProfileId],
    foreignColumns: [userProfiles.id],
    name: "nation_event_participants_user_profile_id_fkey"
  }).onDelete("cascade"),
  primaryKey({ columns: [table.eventId, table.userProfileId], name: "nation_event_participants_pkey" }),
  check("nation_event_participants_status_check", sql`status = ANY (ARRAY['going'::text, 'cancelled'::text, 'waitlist'::text])`),
]);

export const userWorkRatings = pgTable("user_work_ratings", {
  userId: uuid("user_id").notNull(),
  workId: uuid("work_id").notNull(),
  rating: text().notNull(),
  lastTier: text("last_tier"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  index("idx_user_work_ratings_user_work").using("btree", table.userId.asc().nullsLast().op("uuid_ops"), table.workId.asc().nullsLast().op("uuid_ops")),
  foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: "user_work_ratings_user_id_fkey"
  }).onDelete("cascade"),
  foreignKey({
    columns: [table.workId],
    foreignColumns: [works.id],
    name: "user_work_ratings_work_id_fkey"
  }).onDelete("cascade"),
  primaryKey({ columns: [table.userId, table.workId], name: "user_work_ratings_pkey" }),
  pgPolicy("Users can delete their own ratings", { as: "permissive", for: "delete", to: ["public"], using: sql`(auth.uid() = user_id)` }),
  pgPolicy("Users can update their own ratings", { as: "permissive", for: "update", to: ["public"] }),
  pgPolicy("Users can insert their own ratings", { as: "permissive", for: "insert", to: ["public"] }),
  pgPolicy("Users can view their own ratings", { as: "permissive", for: "select", to: ["public"] }),
]);

export const userWorkEntries = pgTable("user_work_entries", {
  userId: uuid("user_id").notNull(),
  workId: uuid("work_id").notNull(),
  status: text().notNull(),
  tier: integer(),
  memo: text(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  index("idx_user_work_entries_user_work").using("btree", table.userId.asc().nullsLast().op("uuid_ops"), table.workId.asc().nullsLast().op("uuid_ops")),
  foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: "user_work_entries_user_id_fkey"
  }).onDelete("cascade"),
  foreignKey({
    columns: [table.workId],
    foreignColumns: [works.id],
    name: "user_work_entries_work_id_fkey"
  }).onDelete("cascade"),
  primaryKey({ columns: [table.userId, table.workId], name: "user_work_entries_pkey" }),
  pgPolicy("Users can delete their own entries", { as: "permissive", for: "delete", to: ["public"], using: sql`(auth.uid() = user_id)` }),
  pgPolicy("Users can update their own entries", { as: "permissive", for: "update", to: ["public"] }),
  pgPolicy("Users can insert their own entries", { as: "permissive", for: "insert", to: ["public"] }),
  pgPolicy("Users can view their own entries", { as: "permissive", for: "select", to: ["public"] }),
  check("user_work_entries_status_check", sql`status = ANY (ARRAY['expecting'::text, 'reading'::text, 'interesting'::text])`),
]);

// --- Relations ---

export const rootAccountsRelations = relations(rootAccounts, ({ one, many }) => ({
  user: one(users, {
    fields: [rootAccounts.authUserId],
    references: [users.id]
  }),
  userProfiles: many(userProfiles),
  pointTransactions: many(pointTransactions),
}));

export const usersRelations = relations(users, ({ many }) => ({
  rootAccounts: many(rootAccounts),
  works: many(works),
  userWorkRatings: many(userWorkRatings),
  userWorkEntries: many(userWorkEntries),
}));

export const userProfilesRelations = relations(userProfiles, ({ one, many }) => ({
  rootAccount: one(rootAccounts, {
    fields: [userProfiles.rootAccountId],
    references: [rootAccounts.id]
  }),
  businessCards: many(businessCards),
  alliances_profileAId: many(alliances, {
    relationName: "alliances_profileAId_userProfiles_id"
  }),
  alliances_profileBId: many(alliances, {
    relationName: "alliances_profileBId_userProfiles_id"
  }),
  groups: many(groups),
  nations: many(nations),
  marketItems: many(marketItems),
  marketTransactions_buyerId: many(marketTransactions, {
    relationName: "marketTransactions_buyerId_userProfiles_id"
  }),
  marketTransactions_sellerId: many(marketTransactions, {
    relationName: "marketTransactions_sellerId_userProfiles_id"
  }),
  nationEvents: many(nationEvents),
  notifications: many(notifications),
  nationPosts: many(nationPosts),
  follows_followerProfileId: many(follows, {
    relationName: "follows_followerProfileId_userProfiles_id"
  }),
  follows_followedProfileId: many(follows, {
    relationName: "follows_followedProfileId_userProfiles_id"
  }),
  groupMembers: many(groupMembers),
  nationCitizens: many(nationCitizens),
  nationEventParticipants: many(nationEventParticipants),
}));

export const businessCardsRelations = relations(businessCards, ({ one }) => ({
  userProfile: one(userProfiles, {
    fields: [businessCards.userProfileId],
    references: [userProfiles.id]
  }),
}));

export const pointTransactions = pgTable("point_transactions", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  rootAccountId: uuid("root_account_id").notNull(),
  amount: integer().notNull(),
  type: text().notNull(), // 'daily_login', 'content_creation', 'connection', 'system_adjustment'
  description: text(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  index("idx_point_transactions_root_account").using("btree", table.rootAccountId.asc().nullsLast().op("uuid_ops")),
  foreignKey({
    columns: [table.rootAccountId],
    foreignColumns: [rootAccounts.id],
    name: "point_transactions_root_account_id_fkey"
  }).onDelete("cascade"),
  pgPolicy("Users can view own point transactions", { as: "permissive", for: "select", to: ["public"], using: sql`(root_account_id IN ( SELECT root_accounts.id FROM root_accounts WHERE root_accounts.auth_user_id = auth.uid() ))` }),
]);

export const pointTransactionsRelations = relations(pointTransactions, ({ one }) => ({
  rootAccount: one(rootAccounts, {
    fields: [pointTransactions.rootAccountId],
    references: [rootAccounts.id]
  }),
}));

export const alliancesRelations = relations(alliances, ({ one }) => ({
  userProfile_profileAId: one(userProfiles, {
    fields: [alliances.profileAId],
    references: [userProfiles.id],
    relationName: "alliances_profileAId_userProfiles_id"
  }),
  userProfile_profileBId: one(userProfiles, {
    fields: [alliances.profileBId],
    references: [userProfiles.id],
    relationName: "alliances_profileBId_userProfiles_id"
  }),
}));

export const worksRelations = relations(works, ({ one, many }) => ({
  user: one(users, {
    fields: [works.ownerUserId],
    references: [users.id]
  }),
  userWorkRatings: many(userWorkRatings),
  userWorkEntries: many(userWorkEntries),
}));

export const groupsRelations = relations(groups, ({ one, many }) => ({
  userProfile: one(userProfiles, {
    fields: [groups.leaderId],
    references: [userProfiles.id]
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
    references: [userProfiles.id]
  }),
  group: one(groups, {
    fields: [nations.ownerGroupId],
    references: [groups.id]
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
    references: [nations.id]
  }),
  userProfile: one(userProfiles, {
    fields: [marketItems.sellerId],
    references: [userProfiles.id]
  }),
  group: one(groups, {
    fields: [marketItems.sellerGroupId],
    references: [groups.id]
  }),
  marketTransactions: many(marketTransactions),
}));

export const marketTransactionsRelations = relations(marketTransactions, ({ one }) => ({
  marketItem: one(marketItems, {
    fields: [marketTransactions.itemId],
    references: [marketItems.id]
  }),
  userProfile_buyerId: one(userProfiles, {
    fields: [marketTransactions.buyerId],
    references: [userProfiles.id],
    relationName: "marketTransactions_buyerId_userProfiles_id"
  }),
  userProfile_sellerId: one(userProfiles, {
    fields: [marketTransactions.sellerId],
    references: [userProfiles.id],
    relationName: "marketTransactions_sellerId_userProfiles_id"
  }),
}));

export const nationEventsRelations = relations(nationEvents, ({ one, many }) => ({
  nation: one(nations, {
    fields: [nationEvents.nationId],
    references: [nations.id]
  }),
  userProfile: one(userProfiles, {
    fields: [nationEvents.organizerId],
    references: [userProfiles.id]
  }),
  nationEventParticipants: many(nationEventParticipants),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  userProfile: one(userProfiles, {
    fields: [notifications.userProfileId],
    references: [userProfiles.id]
  }),
}));

export const nationPostsRelations = relations(nationPosts, ({ one }) => ({
  nation: one(nations, {
    fields: [nationPosts.nationId],
    references: [nations.id]
  }),
  userProfile: one(userProfiles, {
    fields: [nationPosts.authorId],
    references: [userProfiles.id]
  }),
  group: one(groups, {
    fields: [nationPosts.authorGroupId],
    references: [groups.id]
  }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  userProfile_followerProfileId: one(userProfiles, {
    fields: [follows.followerProfileId],
    references: [userProfiles.id],
    relationName: "follows_followerProfileId_userProfiles_id"
  }),
  userProfile_followedProfileId: one(userProfiles, {
    fields: [follows.followedProfileId],
    references: [userProfiles.id],
    relationName: "follows_followedProfileId_userProfiles_id"
  }),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id]
  }),
  userProfile: one(userProfiles, {
    fields: [groupMembers.userProfileId],
    references: [userProfiles.id]
  }),
}));

export const nationGroupsRelations = relations(nationGroups, ({ one }) => ({
  nation: one(nations, {
    fields: [nationGroups.nationId],
    references: [nations.id]
  }),
  group: one(groups, {
    fields: [nationGroups.groupId],
    references: [groups.id]
  }),
}));

export const nationCitizensRelations = relations(nationCitizens, ({ one }) => ({
  nation: one(nations, {
    fields: [nationCitizens.nationId],
    references: [nations.id]
  }),
  userProfile: one(userProfiles, {
    fields: [nationCitizens.userProfileId],
    references: [userProfiles.id]
  }),
}));

export const nationEventParticipantsRelations = relations(nationEventParticipants, ({ one }) => ({
  nationEvent: one(nationEvents, {
    fields: [nationEventParticipants.eventId],
    references: [nationEvents.id]
  }),
  userProfile: one(userProfiles, {
    fields: [nationEventParticipants.userProfileId],
    references: [userProfiles.id]
  }),
}));

export const userWorkRatingsRelations = relations(userWorkRatings, ({ one }) => ({
  user: one(users, {
    fields: [userWorkRatings.userId],
    references: [users.id]
  }),
  work: one(works, {
    fields: [userWorkRatings.workId],
    references: [works.id]
  }),
}));

export const userWorkEntriesRelations = relations(userWorkEntries, ({ one }) => ({
  user: one(users, {
    fields: [userWorkEntries.userId],
    references: [users.id]
  }),
  work: one(works, {
    fields: [userWorkEntries.workId],
    references: [works.id]
  }),
}));
