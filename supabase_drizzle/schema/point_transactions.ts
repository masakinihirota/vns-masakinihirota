import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { rootAccounts } from "./root_accounts";
import { userProfiles } from "./user_profiles";

export const pointTransactions = pgTable("point_transactions", {
  id: uuid("id").primaryKey().notNull(),
  rootAccountId: uuid("root_account_id").references(() => rootAccounts.id),
  userProfileId: uuid("user_profile_id").references(() => userProfiles.id),
  transactionType: text("transaction_type").notNull(),
  pointsAmount: integer("points_amount").notNull(),
  description: text("description"),
  transactionDate: timestamp("transaction_date", {
    withTimezone: true,
  }).notNull(),
});
