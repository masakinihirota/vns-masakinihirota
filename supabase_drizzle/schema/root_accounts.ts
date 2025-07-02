// -- ルートアカウント詳細テーブル（言語テーブルに依存）
// CREATE TABLE public.root_accounts (
//   id                   UUID PRIMARY KEY,
//   aud                  TEXT,
//   role                 TEXT,
//   email                TEXT UNIQUE,
//   email_confirmed_at   TEXT UNIQUE,
//   last_sign_in_at      TIMESTAMPTZ,
//   raw_app_meta_data    JSONB,
//   raw_user_meta_data   JSONB,
//   is_verified          BOOLEAN DEFAULT FALSE NOT NULL,
//   mother_tongue_code   VARCHAR(10) REFERENCES languages(id),
//   site_language_code   VARCHAR(10) REFERENCES languages(id),
//   birth_generation     VARCHAR(50),
//   total_points         INTEGER DEFAULT 0 NOT NULL CHECK (total_points >= 0),
//   living_area_segment  living_area_segment,
//   last_login_at        TIMESTAMPTZ,
//   warning_count        INTEGER DEFAULT 0 NOT NULL CHECK (warning_count >= 0),
//   last_warning_at      TIMESTAMPTZ,
//   is_anonymous_initial_auth BOOLEAN DEFAULT FALSE NOT NULL,
//   created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
//   updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
// );

import { sql } from "drizzle-orm";
import {
  check,
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  boolean,
  jsonb,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { languages } from "./languages";

// living_area_segmentのEnum定義
export const livingAreaSegmentEnum = pgEnum("living_area_segment", [
  "urban",
  "rural",
  "suburban",
]);

// root_accountsテーブル定義
export const rootAccounts = pgTable(
  "root_accounts",
  {
    id: uuid("id").primaryKey(),
    aud: text("aud"),
    role: text("role"),
    email: text("email").unique(),
    emailConfirmedAt: text("email_confirmed_at").unique(),
    lastSignInAt: timestamp("last_sign_in_at", { withTimezone: true }),
    rawAppMetaData: jsonb("raw_app_meta_data"),
    rawUserMetaData: jsonb("raw_user_meta_data"),
    isVerified: boolean("is_verified").notNull().default(false),
    motherTongueCode: varchar("mother_tongue_code", { length: 10 }).references(
      () => languages.id,
    ),
    siteLanguageCode: varchar("site_language_code", { length: 10 }).references(
      () => languages.id,
    ),
    birthGeneration: varchar("birth_generation", { length: 50 }),
    totalPoints: integer("total_points").notNull().default(0),
    livingAreaSegment: livingAreaSegmentEnum("living_area_segment"),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    warningCount: integer("warning_count").notNull().default(0),
    lastWarningAt: timestamp("last_warning_at", { withTimezone: true }),
    isAnonymousInitialAuth: boolean("is_anonymous_initial_auth")
      .notNull()
      .default(false),
    invitedAt: timestamp("invited_at", { withTimezone: true }),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    bannedUntil: timestamp("banned_until", { withTimezone: true }),
    isSuperAdmin: boolean("is_super_admin").default(false),
    isSsoUser: boolean("is_sso_user").notNull().default(false),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    check("totalPoints_check", sql`${t.totalPoints} >= 0`),
    check("warningCount_check", sql`${t.warningCount} >= 0`),
  ],
);
