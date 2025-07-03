import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const deletedWorksLog = pgTable("deleted_works_log", {
  id: uuid("id").primaryKey().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }).notNull(),
  deletedBy: uuid("deleted_by"),
  data: text("data"),
});
