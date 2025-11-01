import { and, eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { aclPermissions } from "../schema/access_control/permissions";
import { aclRoles } from "../schema/access_control/roles";
import { aclRolePermissions } from "../schema/access_control/rolePermissions";

export type AccessControlSeedOptions = {
  rootAccountId: string;
  operatorUserId: string;
};

/**
 * Inserts baseline roles and permissions that allow administrators to sign in and manage the access-control UI.
 * This seed is idempotent and will upsert by role code / action tuple.
 */
export async function seedAccessControl(
  db: PostgresJsDatabase,
  options: AccessControlSeedOptions,
) {
  const { rootAccountId, operatorUserId } = options;

  const [adminRole] = await db
    .insert(aclRoles)
    .values({
      rootAccountId,
      code: "super_admin",
      name: "Super Admin",
      description: "Full administrative control over access settings",
      priority: 10,
      isSystem: true,
      delegatable: false,
      createdBy: operatorUserId,
    })
    .onConflictDoUpdate({
      target: [aclRoles.rootAccountId, aclRoles.code],
      set: {
        name: "Super Admin",
        description: "Full administrative control over access settings",
        priority: 10,
        updatedAt: new Date(),
      },
    })
    .returning({ id: aclRoles.id });

  const [managePermission] = await db
    .insert(aclPermissions)
    .values({
      resourceType: "operations",
      action: "manage",
      constraintType: "none",
      description: "Allows full management of the access control console",
    })
    .onConflictDoUpdate({
      target: [
        aclPermissions.resourceType,
        aclPermissions.action,
        aclPermissions.constraintType,
      ],
      set: {
        description: "Allows full management of the access control console",
      },
    })
    .returning({ id: aclPermissions.id });

  const existingLink = await db
    .select({ id: aclRolePermissions.id })
    .from(aclRolePermissions)
    .where(
      and(
        eq(aclRolePermissions.roleId, adminRole.id),
        eq(aclRolePermissions.permissionId, managePermission.id),
      ),
    )
    .limit(1);

  if (!existingLink.length) {
    await db.insert(aclRolePermissions).values({
      roleId: adminRole.id,
      permissionId: managePermission.id,
      effect: "allow",
      lastUpdatedBy: operatorUserId,
    });
  }
}
