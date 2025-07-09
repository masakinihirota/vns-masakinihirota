import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { userProfiles } from "./user_profiles";

// 足りないカラム？
// ユーザーへの通知を管理するテーブル。
// カラム例: user_id, type, message

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().notNull(),
  recipientUserProfileId: uuid("recipient_user_profile_id")
    .references(() => userProfiles.id)
    .notNull(),
  notificationType: text("notification_type").notNull(),
  content: text("content"),
  isRead: boolean("is_read").notNull().default(false),
  linkUrl: text("link_url"),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
