import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { rootAccounts } from "./root_accounts";

// プロフィールタイプのEnum定義
export const profileTypeEnum = pgEnum("profile_type", [
  "main",
  "sub",
  "anonymous",
  "self",
]);

// ステータスのEnum定義
export const profileStatusEnum = pgEnum("profile_status", [
  "active",
  "inactive",
  "suspended",
]);

/**
 * ユーザープロフィールテーブル
 * ユーザーの公開プロフィール情報を管理
 */
export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  rootAccountId: uuid("root_account_id")
    .references(() => rootAccounts.id)
    .notNull(),
  profileName: text("profile_name").notNull(),
  profileType: profileTypeEnum("profile_type").notNull().default("main"),
  status: profileStatusEnum("status").notNull().default("active"),
  purpose: text("purpose"),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
