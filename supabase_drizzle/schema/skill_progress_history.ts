import { pgTable, uuid, integer, timestamp } from "drizzle-orm/pg-core";
import { userProfiles } from "./user_profiles";
import { skills } from "./skills";

export const skillProgressHistory = pgTable("skill_progress_history", {
  id: uuid("id").primaryKey().notNull(),
  userProfileId: uuid("user_profile_id")
    .references(() => userProfiles.id)
    .notNull(),
  skillId: uuid("skill_id")
    .references(() => skills.id)
    .notNull(),
  level: integer("level").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  previousLevel: integer("previous_level"),
});
