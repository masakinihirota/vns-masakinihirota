import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp,
  index,
  bigint,
} from "drizzle-orm/pg-core";
import { pointsReasonEnum } from "../enums";
import { rootAccounts } from "./root_accounts";

export const pointsTransactions = pgTable(
  "points_transactions",
  {
    id: bigint("id", { mode: "number" })
      .primaryKey()
      .notNull()
      .generatedAlwaysAsIdentity(),
    rootAccountId: uuid("root_account_id")
      .notNull()
      .references(() => rootAccounts.id, { onDelete: "cascade" }),
    delta: integer("delta").notNull(),
    reason: pointsReasonEnum("reason").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => {
    return {
      idxRootAccount: index("idx_points_tx_root_account").on(t.rootAccountId),
      idxReason: index("idx_points_tx_reason").on(t.reason),
      idxCreated: index("idx_points_tx_created_at").on(t.createdAt),
    };
  },
);
