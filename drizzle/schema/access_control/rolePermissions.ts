import {
  index,
  jsonb,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { authUsers } from "../root_accounts/auth_users";
import { aclPermissions } from "./permissions";
import { aclRoles } from "./roles";
import { permissionEffectEnum, scopeDomainEnum } from "./enums";

export const aclRolePermissions = pgTable(
  "acl_role_permissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    roleId: uuid("role_id")
      .notNull()
      .references(() => aclRoles.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => aclPermissions.id, { onDelete: "cascade" }),
    effect: permissionEffectEnum("effect").notNull().default("allow"),
    scopeDomain: scopeDomainEnum("scope_domain").notNull().default("global"),
    scopeFilter: jsonb("scope_filter")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    validFrom: timestamp("valid_from", { withTimezone: true }),
    validUntil: timestamp("valid_until", { withTimezone: true }),
    lastUpdatedBy: uuid("last_updated_by").references(() => authUsers.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    uniqRolePermissionEffect: uniqueIndex("acl_role_permissions_unique").on(
      table.roleId,
      table.permissionId,
      table.scopeDomain,
      table.effect,
    ),
    validUntilIdx: index("acl_role_permissions_valid_until_idx").on(table.validUntil),
  }),
);;;
