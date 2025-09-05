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
  text,
} from "drizzle-orm/pg-core";
import { languages } from "./languages";
import { authUsers } from "./auth_users";
import {
  livingAreaSegmentEnum,
  accountStatusEnum
} from "./enums";

// root_accountsテーブル定義
export const rootAccounts = pgTable(
  "root_accounts",
  {
    id: uuid("id").primaryKey(), // 独自のUUID
    // auth.usersとpublic.auth_usersとの1:1:1関係 つまり共通id
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

    // アプリケーション固有フィールド (既存)
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

    // ===== Phase 1 追加フィールド (設計書準拠) =====

    // ポイント管理関連
    maxPoints: integer("max_points").notNull().default(1000),
    lastPointRecoveryAt: timestamp("last_point_recovery_at", { withTimezone: true }),
    totalConsumedPoints: integer("total_consumed_points").notNull().default(0),
    activityPoints: integer("activity_points").notNull().default(0),
    clickPoints: integer("click_points").notNull().default(0),

    // 信頼度・認証関連
    consecutiveDays: integer("consecutive_days").notNull().default(0),
    trustScore: integer("trust_score").notNull().default(0),
    oauthProviders: text("oauth_providers").array().notNull().default(sql`ARRAY[]::text[]`),
    oauthCount: integer("oauth_count").notNull().default(0),

    // アカウント状態関連
    accountStatus: accountStatusEnum("account_status").notNull().default("active"),
  },
  (t) => [
    // 既存制約
    check("totalPoints_check", sql`${t.totalPoints} >= 0`),
    check("warningCount_check", sql`${t.warningCount} >= 0`),

    // Phase 1 追加制約
    check("maxPoints_check", sql`${t.maxPoints} > 0`),
    check("totalConsumedPoints_check", sql`${t.totalConsumedPoints} >= 0`),
    check("activityPoints_check", sql`${t.activityPoints} >= 0`),
    check("clickPoints_check", sql`${t.clickPoints} >= 0`),
    check("consecutiveDays_check", sql`${t.consecutiveDays} >= 0`),
    check("trustScore_check", sql`${t.trustScore} >= 0`),
    check("oauthCount_check", sql`${t.oauthCount} >= 0`),

    // ビジネスルール制約
    check("totalPoints_maxPoints_check", sql`${t.totalPoints} <= ${t.maxPoints}`),
    check("oauthCount_providers_check", sql`${t.oauthCount} = array_length(${t.oauthProviders}, 1)`),
  ],
);
