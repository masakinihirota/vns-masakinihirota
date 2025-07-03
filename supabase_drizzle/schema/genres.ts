import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { categories } from "./categories";

// genresテーブル定義
export const genres = pgTable("genres", {
  id: uuid("id").primaryKey(),
  categoryId: uuid("category_id").references(() => categories.id),
  name: text("name"),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
