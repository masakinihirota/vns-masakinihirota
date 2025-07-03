import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { userProfiles } from "./user_profiles";
import { works } from "./works";

export const userProfileFavoriteWorks = pgTable("user_profile_favorite_works", {
  userProfileId: uuid("user_profile_id")
    .notNull()
    .references(() => userProfiles.id),
  workId: uuid("work_id")
    .notNull()
    .references(() => works.id),
  evaluationTier: text("evaluation_tier"),
  timeSegment: text("time_segment"),
  reactionType: text("reaction_type"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
