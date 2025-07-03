import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  integer,
  timestamp,
  primaryKey,
  check,
} from "drizzle-orm/pg-core";
import { userProfiles } from "./user_profiles";
import { skills } from "./skills";

/**
 * ユーザープロフィール_スキルテーブル
 * ユーザーが持つスキルとそのレベルを管理
 */
export const userProfileSkills = pgTable(
  "user_profile_skills",
  {
    userProfileId: uuid("user_profile_id")
      .references(() => userProfiles.id)
      .notNull(),
    skillId: uuid("skill_id")
      .references(() => skills.id)
      .notNull(),
    skillLevel: integer("skill_level").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userProfileId, t.skillId] }),
    skillLevelCheck: check(
      "skill_level_check",
      sql`${t.skillLevel} >= 1 AND ${t.skillLevel} <= 10`,
    ),
  }),
);
