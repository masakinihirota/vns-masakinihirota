import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

// categoriesテーブル定義
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
