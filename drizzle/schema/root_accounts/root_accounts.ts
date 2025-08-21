import { sql } from "drizzle-orm";
import {
  check,
  pgTable,
  uuid,
  varchar,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { languages } from "./languages";
import { authUsers } from "./auth_users";
import { livingAreaSegmentEnum } from "./enums";

// root_accountsテーブル定義
export const rootAccounts = pgTable(
  "root_accounts",
  {
    id: uuid("id").primaryKey(), // 独自のUUID
    // auth.usersとの1:1関係
    authUserId: uuid("auth_user_id")
    .references(() => authUsers.id, { onDelete: 'cascade' })
    .notNull()
    .unique(), // auth_usersとの1:1関係
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),

    // アプリケーション固有フィールド
    isVerified: boolean("is_verified").notNull().default(false),
    motherTongueCode: varchar("mother_tongue_code", { length: 10 }).references(
      () => languages.id,
    ),
    siteLanguageCode: varchar("site_language_code", { length: 10 }).references(
      () => languages.id,
    ),
    birthGeneration: varchar("birth_generation", { length: 50 }),
    totalPoints: integer("total_points").notNull().default(0),
    livingAreaSegment: livingAreaSegmentEnum("living_area_segment").notNull().default("area1"),
    warningCount: integer("warning_count").notNull().default(0),
    lastWarningAt: timestamp("last_warning_at", { withTimezone: true }),
    isAnonymousInitialAuth: boolean("is_anonymous_initial_auth")
      .notNull()
      .default(false),
    invitedAt: timestamp("invited_at", { withTimezone: true }),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
  },
  (t) => [
    check("totalPoints_check", sql`${t.totalPoints} >= 0`),
    check("warningCount_check", sql`${t.warningCount} >= 0`),
  ],
);
