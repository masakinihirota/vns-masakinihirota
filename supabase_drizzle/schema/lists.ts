import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { userProfiles } from "./user_profiles";

// リストタイプのEnum定義
export const listTypeEnum = pgEnum("list_type", [
  "favorite",
  "watchlist",
  "completed",
  "custom",
]);

/**
 * リストテーブル
 * ユーザーが作成する作品リストを管理
 */
export const lists = pgTable("lists", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  creatorType: text("creator_type").notNull(),
  userProfileId: uuid("user_profile_id")
    .references(() => userProfiles.id)
    .notNull(),
  isPublic: boolean("is_public").notNull().default(false),
  listType: listTypeEnum("list_type").notNull().default("custom"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
