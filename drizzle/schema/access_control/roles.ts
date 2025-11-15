import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { authUsers } from "../root_accounts/auth_users";

export const aclRoles = pgTable(
  "acl_roles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    rootAccountId: uuid("root_account_id").notNull(),
    code: varchar("code", { length: 64 }).notNull(),
    name: varchar("name", { length: 128 }).notNull(),
    description: text("description"),
    priority: integer("priority").notNull().default(100),
    isSystem: boolean("is_system").notNull().default(false),
    delegatable: boolean("delegatable").notNull().default(false),
    createdBy: uuid("created_by").references(() => authUsers.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    uniqRootAccountCode: uniqueIndex("acl_roles_root_account_code_unique").on(
      table.rootAccountId,
      table.code,
    ),
    priorityIdx: index("acl_roles_priority_idx").on(table.rootAccountId, table.priority),
    systemIdx: index("acl_roles_is_system_idx").on(table.isSystem),
  }),
);;;
