import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { valueThemes } from "./value_themes";

/**
 * 価値観選択肢テーブル
 * 価値観お題に対する選択肢を管理
 */
export const valueChoices = pgTable("value_choices", {
  id: uuid("id").primaryKey().defaultRandom(),
  valueThemeId: uuid("value_theme_id")
    .references(() => valueThemes.id)
    .notNull(),
  choiceText: text("choice_text").notNull(),
  displayOrder: integer("display_order").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
