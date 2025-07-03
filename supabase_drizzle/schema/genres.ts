import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { categories } from "./categories";

/**
 * ジャンルテーブル
 * カテゴリの詳細分類を管理
 */
export const genres = pgTable("genres", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: uuid("category_id")
    .references(() => categories.id)
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
