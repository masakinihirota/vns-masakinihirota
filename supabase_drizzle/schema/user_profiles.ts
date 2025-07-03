import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { rootAccounts } from "./root_accounts";

// ENUM定義
export const profileTypeEnum = pgEnum("profile_type", ["personal", "business"]);
export const statusEnum = pgEnum("status", ["active", "inactive"]);

// user_profilesテーブル定義
export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey(),
  rootAccountId: uuid("root_account_id").references(() => rootAccounts.id),
  profileName: text("profile_name"),
  profileType: profileTypeEnum("profile_type"),
  status: statusEnum("status"),
  purpose: text("purpose"),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
