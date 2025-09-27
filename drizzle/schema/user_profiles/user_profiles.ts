import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { rootAccounts } from "../root_accounts/root_accounts";

/**
 * ユーザープロフィールテーブル
 * 1つのルートアカウントは複数のプロフィールを持つことができる
 */
export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  rootAccountId: uuid("root_account_id")
    .references(() => rootAccounts.id, { onDelete: 'cascade' })
    .notNull(),
  
  title: text("title").notNull(),
  type: text("type").notNull(), //例: '仕事用', '学習用'
  description: text("description"),
  
  isActive: boolean("is_active").notNull().default(true),
  isPublic: boolean("is_public").notNull().default(true),

  // UI表示用の色情報など
  badgeColor: text("badge_color").default("gray"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});