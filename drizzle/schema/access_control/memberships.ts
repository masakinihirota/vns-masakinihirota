import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { authUsers } from "../root_accounts/auth_users";
import { rootAccounts } from "../root_accounts/root_accounts";
import { aclRoles } from "./roles";
import { membershipStateEnum } from "./enums";

export const aclMemberships = pgTable(
  "acl_memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    rootAccountId: uuid("root_account_id")
      .notNull()
      .references(() => rootAccounts.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => aclRoles.id, { onDelete: "cascade" }),
    state: membershipStateEnum("state").notNull().default("pending"),
    validFrom: timestamp("valid_from", { withTimezone: true })
      .notNull()
      .defaultNow(),
    validUntil: timestamp("valid_until", { withTimezone: true }),
    delegationDepth: integer("delegation_depth").notNull().default(0),
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
    uniqMembership: uniqueIndex("acl_memberships_root_user_role_idx").on(
      table.rootAccountId,
      table.userId,
      table.roleId,
    ),
    stateIndex: index("acl_memberships_state_idx").on(
      table.rootAccountId,
      table.userId,
      table.state,
    ),
    delegationDepthNonNegative: check(
      "acl_memberships_delegation_depth_non_negative",
      sql`${table.delegationDepth} >= 0`,
    ),
    delegationDepthLimit: check(
      "acl_memberships_delegation_depth_limit",
      sql`${table.delegationDepth} <= 5`,
    ),
  }),
);
