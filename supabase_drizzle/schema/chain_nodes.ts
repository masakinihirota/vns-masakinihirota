import { pgTable, uuid, integer, text, timestamp } from "drizzle-orm/pg-core";

export const chainNodes = pgTable("chain_nodes", {
  id: uuid("id").primaryKey().notNull(),
  chainId: uuid("chain_id").notNull(),
  workId: uuid("work_id").notNull(),
  parentNodeId: uuid("parent_node_id"),
  depth: integer("depth").notNull(),
  displayOrder: integer("display_order").notNull(),
  relationLabel: text("relation_label"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
