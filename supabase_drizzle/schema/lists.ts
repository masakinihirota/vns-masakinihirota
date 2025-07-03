import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { userProfiles } from "./user_profiles";

// ENUM定義
export const listTypeEnum = pgEnum("list_type", [
  "favorites",
  "watchlist",
  "custom",
]);

// listsテーブル定義
export const lists = pgTable("lists", {
  id: uuid("id").primaryKey(),
  title: text("title"),
  description: text("description"),
  creatorType: text("creator_type"),
  userProfileId: uuid("user_profile_id").references(() => userProfiles.id),
  isPublic: boolean("is_public").notNull().default(false),
  listType: listTypeEnum("list_type"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
