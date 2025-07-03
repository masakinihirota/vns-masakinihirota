import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { userProfiles } from "./user_profiles";

// グループステータスのEnum定義
export const groupStatusEnum = pgEnum("group_status", [
  "active",
  "inactive",
  "suspended",
  "disbanded",
]);

// グループ可視性のEnum定義
export const groupVisibilityEnum = pgEnum("group_visibility", [
  "public",
  "private",
  "invite_only",
]);

/**
 * グループテーブル
 * ユーザーが参加するグループを管理
 */
export const groups = pgTable("groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  leaderUserProfileId: uuid("leader_user_profile_id")
    .references(() => userProfiles.id)
    .notNull(),
  rules: text("rules"),
  communicationMeans: text("communication_means"),
  isPublic: boolean("is_public").notNull().default(true),
  status: groupStatusEnum("status").notNull().default("active"),
  visibility: groupVisibilityEnum("visibility").notNull().default("public"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
