import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { categories } from "./categories";
import { userProfiles } from "./user_profiles";

// コメント表示タイプのEnum定義
export const commentDisplayTypeEnum = pgEnum("comment_display_type", [
  "public",
  "private",
  "limited",
]);

/**
 * 価値観お題テーブル
 * ユーザーが回答する価値観に関するお題を管理
 */
export const valueThemes = pgTable("value_themes", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  categoryId: uuid("category_id").references(() => categories.id),
  creatorType: text("creator_type").notNull(),
  userProfileId: uuid("user_profile_id").references(() => userProfiles.id),
  commentDisplayType: commentDisplayTypeEnum("comment_display_type")
    .notNull()
    .default("public"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
