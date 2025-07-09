import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

/**
 * タグテーブル
 * 作品や価値観お題に付与するタグを管理
 */
export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  tagType: text("tag_type").notNull(),
  creatorType: text("creator_type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
