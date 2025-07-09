import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

/**
 * スキルテーブル
 * システム内で管理されるスキルの定義
 */
export const skills = pgTable("skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  creatorType: text("creator_type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
