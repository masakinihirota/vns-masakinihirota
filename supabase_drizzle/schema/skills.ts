import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

// skillsテーブル定義
export const skills = pgTable("skills", {
  id: uuid("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  creatorType: text("creator_type"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
