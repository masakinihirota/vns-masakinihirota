import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authUsers } from "../root_accounts/auth_users";
import { aclMemberships } from "./memberships";
import { exceptionStatusEnum, permissionActionEnum, permissionResourceEnum } from "./enums";

export const aclExceptionGrants = pgTable(
  "acl_exception_grants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    membershipId: uuid("membership_id")
      .notNull()
      .references(() => aclMemberships.id, { onDelete: "cascade" }),
    resourceType: permissionResourceEnum("resource_type").notNull(),
    resourceId: uuid("resource_id"),
    action: permissionActionEnum("action").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    approvalChain: jsonb("approval_chain")
      .$type<Array<Record<string, unknown>>>()
      .notNull()
      .default([]),
    status: exceptionStatusEnum("status").notNull().default("pending"),
    reason: text("reason"),
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
    membershipStatusIdx: index("acl_exception_grants_membership_status_idx").on(
      table.membershipId,
      table.status,
    ),
    expiryIdx: index("acl_exception_grants_expires_at_idx").on(table.expiresAt),
  }),
);
