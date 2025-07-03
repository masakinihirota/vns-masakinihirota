import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

// tagsテーブル定義
export const tags = pgTable("tags", {
  id: uuid("id").primaryKey(),
  name: text("name"),
  tagType: text("tag_type"),
  creatorType: text("creator_type"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
