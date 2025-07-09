import {
  pgTable,
  uuid,
  text,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";
import { userProfiles } from "./user_profiles";
import { works } from "./works";

/**
 * ユーザープロフィール_好きな作品テーブル
 * ユーザーがお気に入り登録した作品を管理
 */
export const userProfileFavoriteWorks = pgTable(
  "user_profile_favorite_works",
  {
    userProfileId: uuid("user_profile_id")
      .references(() => userProfiles.id)
      .notNull(),
    workId: uuid("work_id")
      .references(() => works.id)
      .notNull(),
    evaluationTier: text("evaluation_tier"),
    timeSegment: text("time_segment"),
    reactionType: text("reaction_type"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userProfileId, t.workId] }),
  }),
);
