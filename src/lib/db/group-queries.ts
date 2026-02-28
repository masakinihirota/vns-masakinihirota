import { desc, eq } from "drizzle-orm";

import { db as database } from "./client";
import { groupMembers, groups } from "./schema.postgres";

export interface GroupSummary {
  id: string;
  name: string;
  description: string | null;
  leaderId: string | null;
  role: string | null;
  joinedAt: string | null;
}

export async function createGroup(
  userId: string,
  name: string,
  description?: string,
): Promise<GroupSummary> {
  const [createdGroup] = await database
    .insert(groups)
    .values({
      name,
      description,
      leaderId: userId,
    })
    .returning({
      id: groups.id,
      name: groups.name,
      description: groups.description,
      leaderId: groups.leaderId,
      createdAt: groups.createdAt,
    });

  if (!createdGroup) {
    throw new Error("Failed to create group");
  }

  await database
    .insert(groupMembers)
    .values({
      groupId: createdGroup.id,
      userProfileId: userId,
      role: "leader",
    })
    .onConflictDoNothing();

  return {
    id: createdGroup.id,
    name: createdGroup.name,
    description: createdGroup.description,
    leaderId: createdGroup.leaderId,
    role: "leader",
    joinedAt: createdGroup.createdAt,
  };
}

export async function getGroupsByUser(userId: string): Promise<GroupSummary[]> {
  const rows = await database
    .select({
      id: groups.id,
      name: groups.name,
      description: groups.description,
      leaderId: groups.leaderId,
      role: groupMembers.role,
      joinedAt: groupMembers.joinedAt,
    })
    .from(groupMembers)
    .innerJoin(groups, eq(groupMembers.groupId, groups.id))
    .where(eq(groupMembers.userProfileId, userId))
    .orderBy(desc(groupMembers.joinedAt));

  return rows;
}
