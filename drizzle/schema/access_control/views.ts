import { jsonb, pgView, timestamp, uuid } from "drizzle-orm/pg-core";
import {
  effectivePermissionSourceEnum,
  permissionActionEnum,
  permissionEffectEnum,
  permissionResourceEnum,
  scopeDomainEnum,
} from "./enums";

export const vwEffectivePermissions = pgView("vw_effective_permissions", {
  userId: uuid("user_id"),
  rootAccountId: uuid("root_account_id"),
  permissionId: uuid("permission_id"),
  resourceType: permissionResourceEnum("resource_type"),
  action: permissionActionEnum("action"),
  effect: permissionEffectEnum("effect"),
  scopeDomain: scopeDomainEnum("scope_domain"),
  scopeFilter: jsonb("scope_filter").$type<Record<string, unknown>>(),
  validFrom: timestamp("valid_from", { withTimezone: true }),
  validUntil: timestamp("valid_until", { withTimezone: true }),
  resourceId: uuid("resource_id"),
  source: effectivePermissionSourceEnum("source"),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});
