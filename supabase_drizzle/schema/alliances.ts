import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { groups } from "./groups";

// アライアンスステータスのEnum定義
export const allianceStatusEnum = pgEnum("alliance_status", [
  "active",
  "inactive",
  "suspended",
  "disbanded",
]);

// アライアンス可視性のEnum定義
export const allianceVisibilityEnum = pgEnum("alliance_visibility", [
  "public",
  "private",
  "invite_only",
]);

/**
 * アライアンステーブル
 * グループ間の同盟を管理
 */
export const alliances = pgTable("alliances", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  allianceLeaderGroupId: uuid("alliance_leader_group_id")
    .references(() => groups.id)
    .notNull(),
  status: allianceStatusEnum("status").notNull().default("active"),
  visibility: allianceVisibilityEnum("visibility").notNull().default("public"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
