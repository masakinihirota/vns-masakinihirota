import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { userProfiles } from "./user_profiles";

/**
 * チェーンテーブル
 * 関連作品を繋げたチェーンを管理
 */
export const chains = pgTable("chains", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  creatorType: text("creator_type").notNull(),
  userProfileId: uuid("user_profile_id")
    .references(() => userProfiles.id)
    .notNull(),
  isPublic: boolean("is_public").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
