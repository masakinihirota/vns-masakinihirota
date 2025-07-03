import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { categories } from "./categories";
import { userProfiles } from "./user_profiles";

// ENUM定義
export const commentDisplayTypeEnum = pgEnum("comment_display_type", [
  "public",
  "private",
]);

// value_themesテーブル定義
export const valueThemes = pgTable("value_themes", {
  id: uuid("id").primaryKey(),
  title: text("title"),
  description: text("description"),
  categoryId: uuid("category_id").references(() => categories.id),
  creatorType: text("creator_type"),
  userProfileId: uuid("user_profile_id").references(() => userProfiles.id),
  commentDisplayType: commentDisplayTypeEnum("comment_display_type"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
