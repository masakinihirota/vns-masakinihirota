import { pgTable, uuid, integer, timestamp } from "drizzle-orm/pg-core";
import { userProfiles } from "./user_profiles";
import { works } from "./works";

export const workEvaluationHistory = pgTable("work_evaluation_history", {
  id: uuid("id").primaryKey().notNull(),
  userProfileId: uuid("user_profile_id")
    .references(() => userProfiles.id)
    .notNull(),
  workId: uuid("work_id")
    .references(() => works.id)
    .notNull(),
  tier: integer("tier"),
  evaluatedAt: timestamp("evaluated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  previousTier: integer("previous_tier"),
});
