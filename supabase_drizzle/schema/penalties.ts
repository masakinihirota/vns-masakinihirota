import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { rootAccounts } from "./root_accounts";
import { userProfiles } from "./user_profiles";

export const penalties = pgTable("penalties", {
  id: uuid("id").primaryKey().notNull(),
  targetRootAccountId: uuid("target_root_account_id").references(
    () => rootAccounts.id,
  ),
  targetUserProfileId: uuid("target_user_profile_id").references(
    () => userProfiles.id,
  ),
  penaltyType: text("penalty_type").notNull(),
  reason: text("reason"),
  appliedByAdminId: uuid("applied_by_admin_id"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  warningCount: integer("warning_count"),
  lastWarningAt: timestamp("last_warning_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
