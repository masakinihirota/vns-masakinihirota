import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { userProfiles } from "./user_profiles";
import { valueThemes } from "./value_themes";
import { valueChoices } from "./value_choices";

export const userProfileSelectedValues = pgTable(
  "user_profile_selected_values",
  {
    userProfileId: uuid("user_profile_id")
      .notNull()
      .references(() => userProfiles.id),
    valueThemeId: uuid("value_theme_id")
      .notNull()
      .references(() => valueThemes.id),
    valueChoiceId: uuid("value_choice_id")
      .notNull()
      .references(() => valueChoices.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.userProfileId, t.valueThemeId, t.valueChoiceId],
    }),
  }),
);
