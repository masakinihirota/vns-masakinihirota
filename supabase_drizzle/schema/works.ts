import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { userProfiles } from "./user_profiles";
import { categories } from "./categories";
import { genres } from "./genres";

// ENUM定義
export const sizeEnum = pgEnum("size", ["small", "medium", "large"]);

// worksテーブル定義
export const works = pgTable("works", {
  id: uuid("id").primaryKey(),
  title: text("title"),
  categoryId: uuid("category_id").references(() => categories.id),
  genreId: uuid("genre_id").references(() => genres.id),
  officialUrl: text("official_url"),
  creatorType: text("creator_type"),
  userProfileId: uuid("user_profile_id").references(() => userProfiles.id),
  size: sizeEnum("size"),
  releaseYear: integer("release_year"),
  aiCommentScore: integer("ai_comment_score"),
  callCount: integer("call_count"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
