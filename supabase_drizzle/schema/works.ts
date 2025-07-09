import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  pgEnum,
  check,
} from "drizzle-orm/pg-core";
import { categories } from "./categories";
import { genres } from "./genres";
import { userProfiles } from "./user_profiles";

// 作品サイズのEnum定義
export const workSizeEnum = pgEnum("work_size", [
  "small",
  "medium",
  "large",
  "extra_large",
]);

/**
 * 作品テーブル
 * ユーザーが登録する作品情報を管理
 */
export const works = pgTable(
  "works",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    categoryId: uuid("category_id")
      .references(() => categories.id)
      .notNull(),
    genreId: uuid("genre_id").references(() => genres.id),
    officialUrl: text("official_url"),
    creatorType: text("creator_type").notNull(),
    userProfileId: uuid("user_profile_id")
      .references(() => userProfiles.id)
      .notNull(),
    size: workSizeEnum("size"),
    releaseYear: integer("release_year"),
    aiCommentScore: integer("ai_comment_score"),
    callCount: integer("call_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    check("callCount_check", sql`${t.callCount} >= 0`),
    check(
      "aiCommentScore_check",
      sql`${t.aiCommentScore} >= 0 AND ${t.aiCommentScore} <= 100`,
    ),
  ],
);
