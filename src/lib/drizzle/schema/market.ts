import { numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { groups, nations } from "./community";
import { userProfiles } from "./user-profiles";

/** market_items テーブル定義 */
export const marketItems = pgTable("market_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  nationId: uuid("nation_id")
    .notNull()
    .references(() => nations.id, { onDelete: "cascade" }),
  sellerId: uuid("seller_id").references(() => userProfiles.id, { onDelete: "set null" }),
  sellerGroupId: uuid("seller_group_id").references(() => groups.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description"),
  price: numeric("price").notNull(),
  currency: text("currency"),
  type: text("type"),
  status: text("status").default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** market_transactions テーブル定義 */
export const marketTransactions = pgTable("market_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  itemId: uuid("item_id")
    .notNull()
    .references(() => marketItems.id, { onDelete: "cascade" }),
  sellerId: uuid("seller_id").references(() => userProfiles.id, { onDelete: "set null" }),
  buyerId: uuid("buyer_id").references(() => userProfiles.id, { onDelete: "set null" }),
  price: numeric("price").notNull(),
  feeRate: numeric("fee_rate").notNull(),
  feeAmount: numeric("fee_amount").notNull(),
  sellerRevenue: numeric("seller_revenue").notNull(),
  status: text("status").default("pending"),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
