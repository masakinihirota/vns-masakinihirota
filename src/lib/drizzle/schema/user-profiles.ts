import { boolean, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { rootAccounts } from "./root-accounts";

/** user_profiles テーブル定義 */
export const userProfiles = pgTable(
  "user_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    rootAccountId: uuid("root_account_id")
      .notNull()
      .references(() => rootAccounts.id, { onDelete: "cascade" }),
    displayName: text("display_name").notNull(),
    purpose: text("purpose"),
    roleType: text("role_type").notNull().default("member"),
    isActive: boolean("is_active").notNull().default(true),
    lastInteractedRecordId: uuid("last_interacted_record_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_user_profiles_root_account_id").on(table.rootAccountId),
  ],
);
