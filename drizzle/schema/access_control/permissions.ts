import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import {
  permissionActionEnum,
  permissionConstraintEnum,
  permissionResourceEnum,
} from "./enums";

export const aclPermissions = pgTable(
  "acl_permissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    resourceType: permissionResourceEnum("resource_type").notNull(),
    action: permissionActionEnum("action").notNull(),
    constraintType: permissionConstraintEnum("constraint_type")
      .notNull()
      .default("none"),
    constraintPayload: jsonb("constraint_payload")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    uniqPermission: uniqueIndex("acl_permissions_resource_action_constraint_idx").on(
      table.resourceType,
      table.action,
      table.constraintType,
    ),
  }),
);
