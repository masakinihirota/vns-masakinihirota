import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/** works テーブル定義 */
export const works = pgTable("works", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  author: text("author"),
  category: text("category").notNull(),
  description: text("description"),
  isOfficial: boolean("is_official").notNull().default(false),
  isPurchasable: boolean("is_purchasable"),
  ownerUserId: uuid("owner_user_id"),
  status: text("status").notNull().default("pending"),
  affiliateUrl: text("affiliate_url"),
  externalUrl: text("external_url"),
  releaseYear: text("release_year"),
  scale: text("scale"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** user_work_entries テーブル定義 */
export const userWorkEntries = pgTable("user_work_entries", {
  userId: uuid("user_id").notNull(),
  workId: uuid("work_id")
    .notNull()
    .references(() => works.id, { onDelete: "cascade" }),
  status: text("status").notNull(),
  tier: text("tier"),
  memo: text("memo"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** user_work_ratings テーブル定義 */
export const userWorkRatings = pgTable("user_work_ratings", {
  userId: uuid("user_id").notNull(),
  workId: uuid("work_id")
    .notNull()
    .references(() => works.id, { onDelete: "cascade" }),
  rating: text("rating").notNull(),
  lastTier: text("last_tier"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
