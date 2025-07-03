import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { userProfiles } from "./user_profiles";
import { valueThemes } from "./value_themes";
import { valueChoices } from "./value_choices";

/**
 * ユーザープロフィール_選択した価値観テーブル
 * ユーザーが選択した価値観の回答を管理
 */
export const userProfileSelectedValues = pgTable(
  "user_profile_selected_values",
  {
    userProfileId: uuid("user_profile_id")
      .references(() => userProfiles.id)
      .notNull(),
    valueThemeId: uuid("value_theme_id")
      .references(() => valueThemes.id)
      .notNull(),
    valueChoiceId: uuid("value_choice_id")
      .references(() => valueChoices.id)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.userProfileId, t.valueThemeId, t.valueChoiceId],
    }),
  }),
);
