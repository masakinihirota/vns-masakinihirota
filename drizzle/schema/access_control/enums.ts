import { pgEnum } from "drizzle-orm/pg-core";

export const permissionResourceEnum = pgEnum("acl_permission_resource", [
  "account",
  "group",
  "matching",
  "transaction",
  "operations",
  "settings",
  "public",
]);

export const permissionActionEnum = pgEnum("acl_permission_action", [
  "view",
  "create",
  "update",
  "delete",
  "approve",
  "export",
  "manage",
]);

export const permissionConstraintEnum = pgEnum("acl_permission_constraint", [
  "none",
  "ownership",
  "segment",
  "expression",
]);

export const permissionEffectEnum = pgEnum("acl_permission_effect", [
  "allow",
  "deny",
]);

export const membershipStateEnum = pgEnum("acl_membership_state", [
  "pending",
  "active",
  "suspended",
  "revoked",
]);

export const exceptionStatusEnum = pgEnum("acl_exception_status", [
  "pending",
  "approved",
  "rejected",
  "expired",
  "revoked",
]);

export const effectivePermissionSourceEnum = pgEnum(
  "acl_effective_permission_source",
  ["role", "exception", "system"],
);
