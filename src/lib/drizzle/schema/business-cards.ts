import { boolean, jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { userProfiles } from "./user-profiles";

/** business_cards テーブル定義 */
export const businessCards = pgTable("business_cards", {
  id: uuid("id").primaryKey().defaultRandom(),
  userProfileId: uuid("user_profile_id")
    .notNull()
    .unique()
    .references(() => userProfiles.id, { onDelete: "cascade" }),
  isPublished: boolean("is_published").notNull().default(false),
  displayConfig: jsonb("display_config").notNull().default({}),
  content: jsonb("content").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
