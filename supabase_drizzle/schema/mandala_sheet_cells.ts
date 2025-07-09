import { pgTable, uuid, integer, text, timestamp } from "drizzle-orm/pg-core";
import { mandalaSheets } from "./mandala_sheets";
import { skills } from "./skills";

export const mandalaSheetCells = pgTable("mandala_sheet_cells", {
  id: uuid("id").primaryKey().notNull(),
  mandalaSheetId: uuid("mandala_sheet_id")
    .references(() => mandalaSheets.id)
    .notNull(),
  rowIndex: integer("row_index").notNull(),
  columnIndex: integer("column_index").notNull(),
  contentType: text("content_type").notNull(),
  contentSkillId: uuid("content_skill_id").references(() => skills.id),
  contentText: text("content_text"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
