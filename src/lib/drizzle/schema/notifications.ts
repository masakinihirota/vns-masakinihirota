import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { userProfiles } from "./user-profiles";

/** notifications テーブル定義 */
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userProfileId: uuid("user_profile_id")
    .notNull()
    .references(() => userProfiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(),
  linkUrl: text("link_url"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
