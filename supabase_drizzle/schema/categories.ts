import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

/**
 * カテゴリテーブル
 * 作品やコンテンツの大分類を管理
 */
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
