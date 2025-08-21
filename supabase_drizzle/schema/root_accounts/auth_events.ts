import {
  pgTable,
  uuid,
  bigint,
  timestamp,
  text,
  index,
} from "drizzle-orm/pg-core";
import { authEventTypeEnum } from "../enums";
import { rootAccounts } from "./root_accounts";

export const authEvents = pgTable(
  "auth_events",
  {
    id: bigint("id", { mode: "number" })
      .primaryKey()
      .notNull()
      .generatedAlwaysAsIdentity(),
    rootAccountId: uuid("root_account_id").references(() => rootAccounts.id, {
      onDelete: "set null",
    }),
    eventType: authEventTypeEnum("event_type").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    message: text("message"),
  },
  (t) => {
    return {
      idxRootAccount: index("idx_auth_events_root_account").on(t.rootAccountId),
      idxEventType: index("idx_auth_events_event_type").on(t.eventType),
      idxCreated: index("idx_auth_events_created_at").on(t.createdAt),
    };
  },
);
