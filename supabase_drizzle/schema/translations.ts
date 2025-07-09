import { pgTable, uuid, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { languages } from "./languages";

export const translations = pgTable("translations", {
  id: uuid("id").primaryKey().notNull(),
  tableName: text("table_name").notNull(),
  columnName: text("column_name").notNull(),
  rowId: uuid("row_id").notNull(),
  languageCode: varchar("language_code", { length: 10 })
    .references(() => languages.id)
    .notNull(),
  translationText: text("translation_text"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
