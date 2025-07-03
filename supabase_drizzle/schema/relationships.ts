import {
  pgTable,
  uuid,
  text,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";
import { userProfiles } from "./user_profiles";
import { groups } from "./groups";

/**
 * 関係テーブル
 * ユーザー間の関係性を管理
 */
export const relationships = pgTable(
  "relationships",
  {
    sourceUserProfileId: uuid("source_user_profile_id")
      .references(() => userProfiles.id)
      .notNull(),
    targetUserProfileId: uuid("target_user_profile_id")
      .references(() => userProfiles.id)
      .notNull(),
    relationshipType: text("relationship_type").notNull(),
    groupContextId: uuid("group_context_id").references(() => groups.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.sourceUserProfileId, t.targetUserProfileId] }),
  }),
);
