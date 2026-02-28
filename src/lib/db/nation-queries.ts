import { and, desc, eq } from "drizzle-orm";

import { db as database } from "./client";
import { groupMembers, nationGroups, nations } from "./schema.postgres";

export interface NationSummary {
  id: string;
  name: string;
  description: string | null;
  ownerUserId: string | null;
  ownerGroupId: string | null;
  role: string | null;
  joinedAt: string | null;
}

export async function createNation(
  groupLeaderId: string,
  name: string,
  description?: string,
): Promise<NationSummary> {
  const leaderGroups = await database
    .select({ groupId: groupMembers.groupId })
    .from(groupMembers)
    .where(
      and(
        eq(groupMembers.userProfileId, groupLeaderId),
        eq(groupMembers.role, "leader"),
      ),
    )
    .limit(1);

  const ownerGroupId = leaderGroups[0]?.groupId;

  if (!ownerGroupId) {
    throw new Error("Forbidden: group_leader role is required");
  }

  const [createdNation] = await database
    .insert(nations)
    .values({
      name,
      description,
      ownerUserId: groupLeaderId,
      ownerGroupId,
    })
    .returning({
      id: nations.id,
      name: nations.name,
      description: nations.description,
      ownerUserId: nations.ownerUserId,
      ownerGroupId: nations.ownerGroupId,
      createdAt: nations.createdAt,
    });

  if (!createdNation) {
    throw new Error("Failed to create nation");
  }

  await database
    .insert(nationGroups)
    .values({
      nationId: createdNation.id,
      groupId: ownerGroupId,
      role: "deputy",
    })
    .onConflictDoNothing();

  return {
    id: createdNation.id,
    name: createdNation.name,
    description: createdNation.description,
    ownerUserId: createdNation.ownerUserId,
    ownerGroupId: createdNation.ownerGroupId,
    role: "deputy",
    joinedAt: createdNation.createdAt,
  };
}

export async function getNationsByGroup(groupId: string): Promise<NationSummary[]> {
  const rows = await database
    .select({
      id: nations.id,
      name: nations.name,
      description: nations.description,
      ownerUserId: nations.ownerUserId,
      ownerGroupId: nations.ownerGroupId,
      role: nationGroups.role,
      joinedAt: nationGroups.joinedAt,
    })
    .from(nationGroups)
    .innerJoin(nations, eq(nationGroups.nationId, nations.id))
    .where(eq(nationGroups.groupId, groupId))
    .orderBy(desc(nationGroups.joinedAt));

  return rows;
}
