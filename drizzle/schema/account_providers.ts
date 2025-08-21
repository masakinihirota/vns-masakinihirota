import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { authProviderEnum } from "./enums";
import { rootAccounts } from "./root_accounts";

export const accountProviders = pgTable(
  "account_providers",
  {
    id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
    rootAccountId: uuid("root_account_id")
      .notNull()
      .references(() => rootAccounts.id, { onDelete: "cascade" }),
    provider: authProviderEnum("provider").notNull(),
    providerUserId: text("provider_user_id").notNull(),
    isPrimary: boolean("is_primary").notNull().default(false),
    linkedAt: timestamp("linked_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => {
    return {
      uqProviderUser: uniqueIndex("uq_account_providers_provider_user").on(
        t.provider,
        t.providerUserId,
      ),
      uqRootProvider: uniqueIndex("uq_account_providers_root_provider").on(
        t.rootAccountId,
        t.provider,
      ),
      idxRootAccount: index("idx_account_providers_root_account").on(
        t.rootAccountId,
      ),
    };
  },
);
