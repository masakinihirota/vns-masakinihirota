import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { alliances } from "./alliances";
import { groups } from "./groups";

/**
 * アライアンスグループテーブル
 * アライアンスに参加するグループを管理
 */
export const allianceGroups = pgTable(
  "alliance_groups",
  {
    allianceId: uuid("alliance_id")
      .references(() => alliances.id)
      .notNull(),
    groupId: uuid("group_id")
      .references(() => groups.id)
      .notNull(),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.allianceId, t.groupId] }),
  }),
);
