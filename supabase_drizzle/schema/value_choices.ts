import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { valueThemes } from "./value_themes";

// value_choicesテーブル定義
export const valueChoices = pgTable("value_choices", {
  id: uuid("id").primaryKey(),
  valueThemeId: uuid("value_theme_id").references(() => valueThemes.id),
  choiceText: text("choice_text"),
  displayOrder: integer("display_order"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
