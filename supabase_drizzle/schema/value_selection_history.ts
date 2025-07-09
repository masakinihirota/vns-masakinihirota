import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { userProfiles } from "./user_profiles";
import { valueThemes } from "./value_themes";

export const valueSelectionHistory = pgTable("value_selection_history", {
  id: uuid("id").primaryKey().notNull(),
  userProfileId: uuid("user_profile_id")
    .references(() => userProfiles.id)
    .notNull(),
  valueId: uuid("value_id")
    .references(() => valueThemes.id)
    .notNull(),
  selectedOption: text("selected_option"),
  selectedAt: timestamp("selected_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  previousOption: text("previous_option"),
});
