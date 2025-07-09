import {
  pgTable,
  uuid,
  text,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";
import { groups } from "./groups";
import { userProfiles } from "./user_profiles";

/**
 * グループメンバーテーブル
 * グループに参加するメンバーを管理
 */
export const groupMembers = pgTable(
  "group_members",
  {
    groupId: uuid("group_id")
      .references(() => groups.id)
      .notNull(),
    userProfileId: uuid("user_profile_id")
      .references(() => userProfiles.id)
      .notNull(),
    role: text("role").notNull().default("member"),
    status: text("status").notNull().default("active"),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.groupId, t.userProfileId] }),
  }),
);
