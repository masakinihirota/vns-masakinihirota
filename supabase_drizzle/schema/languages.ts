import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";

/**
 * 言語テーブル
 * システムでサポートする言語の定義
 */
export const languages = pgTable("languages", {
  id: varchar("id", { length: 10 }).primaryKey(),
  name: text("name").notNull(),
  nativeName: text("native_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
