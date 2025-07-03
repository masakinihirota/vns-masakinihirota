import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { works } from "./works";
import { tags } from "./tags";

/**
 * 作品_タグテーブル
 * 作品に付与されたタグを管理
 */
export const workTags = pgTable(
  "work_tags",
  {
    workId: uuid("work_id")
      .references(() => works.id)
      .notNull(),
    tagId: uuid("tag_id")
      .references(() => tags.id)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.workId, t.tagId] }),
  }),
);
