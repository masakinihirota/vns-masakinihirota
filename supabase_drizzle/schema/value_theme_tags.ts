import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { valueThemes } from "./value_themes";
import { tags } from "./tags";

/**
 * 価値観お題_タグテーブル
 * 価値観お題に付与されたタグを管理
 */
export const valueThemeTags = pgTable(
  "value_theme_tags",
  {
    valueThemeId: uuid("value_theme_id")
      .references(() => valueThemes.id)
      .notNull(),
    tagId: uuid("tag_id")
      .references(() => tags.id)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.valueThemeId, t.tagId] }),
  }),
);
