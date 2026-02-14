import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { userProfiles } from "./user-profiles";

/** groups テーブル定義 */
export const groups = pgTable("groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  avatarUrl: text("avatar_url"),
  coverUrl: text("cover_url"),
  isOfficial: boolean("is_official").default(false),
  leaderId: uuid("leader_id").references(() => userProfiles.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** group_members テーブル定義 */
export const groupMembers = pgTable("group_members", {
  groupId: uuid("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  userProfileId: uuid("user_profile_id")
    .notNull()
    .references(() => userProfiles.id, { onDelete: "cascade" }),
  role: text("role").default("member"),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
});

/** nations テーブル定義 */
export const nations = pgTable("nations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  avatarUrl: text("avatar_url"),
  coverUrl: text("cover_url"),
  isOfficial: boolean("is_official").default(false),
  ownerUserId: uuid("owner_user_id").references(() => userProfiles.id, { onDelete: "set null" }),
  ownerGroupId: uuid("owner_group_id").references(() => groups.id, { onDelete: "set null" }),
  transactionFeeRate: integer("transaction_fee_rate"),
  foundationFee: integer("foundation_fee"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** nation_citizens テーブル定義 */
export const nationCitizens = pgTable("nation_citizens", {
  nationId: uuid("nation_id")
    .notNull()
    .references(() => nations.id, { onDelete: "cascade" }),
  userProfileId: uuid("user_profile_id")
    .notNull()
    .references(() => userProfiles.id, { onDelete: "cascade" }),
  role: text("role"),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
});

/** nation_groups テーブル定義 */
export const nationGroups = pgTable("nation_groups", {
  nationId: uuid("nation_id")
    .notNull()
    .references(() => nations.id, { onDelete: "cascade" }),
  groupId: uuid("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  role: text("role"),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
});

/** nation_posts テーブル定義 */
export const nationPosts = pgTable("nation_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  nationId: uuid("nation_id")
    .notNull()
    .references(() => nations.id, { onDelete: "cascade" }),
  authorId: uuid("author_id").references(() => userProfiles.id, { onDelete: "set null" }),
  authorGroupId: uuid("author_group_id").references(() => groups.id, { onDelete: "set null" }),
  content: text("content").notNull(),
  type: text("type"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
