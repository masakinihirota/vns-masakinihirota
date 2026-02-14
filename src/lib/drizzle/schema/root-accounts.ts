import { integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

/** root_accounts テーブル定義 */
export const rootAccounts = pgTable("root_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  authUserId: uuid("auth_user_id").notNull().unique(),
  points: integer("points").notNull().default(3000),
  level: integer("level").notNull().default(1),
  trustDays: integer("trust_days").notNull().default(0),
  dataRetentionDays: integer("data_retention_days").default(30),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
