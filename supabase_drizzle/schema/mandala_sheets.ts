import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { userProfiles } from "./user_profiles";

export const mandalaSheets = pgTable("mandala_sheets", {
  id: uuid("id").primaryKey().notNull(),
  userProfileId: uuid("user_profile_id")
    .references(() => userProfiles.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
