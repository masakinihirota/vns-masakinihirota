import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { works } from "./works";

export const workAuthors = pgTable("work_authors", {
  id: uuid("id").primaryKey().notNull(),
  workId: uuid("work_id")
    .references(() => works.id)
    .notNull(),
  authorName: text("author_name").notNull(),
  role: text("role"),
  displayOrder: integer("display_order"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
