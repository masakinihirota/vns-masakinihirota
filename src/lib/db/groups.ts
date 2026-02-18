import { and, desc, eq } from "drizzle-orm";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/types_db";
import { db } from "./drizzle-postgres";
import { groupMembers, groups } from "./schema.postgres";
import { mapUserProfileToSupabase } from "./user-profiles";

type Group = Tables<"groups">;
type GroupInsert = TablesInsert<"groups">;
type GroupUpdate = TablesUpdate<"groups">;

// Mapper Helpers
function mapGroupToSupabase(g: any): Group {
  return {
    id: g.id,
    name: g.name,
    description: g.description,
    avatar_url: g.avatarUrl,
    cover_url: g.coverUrl,
    is_official: g.isOfficial,
    leader_id: g.leaderId,
    created_at: g.createdAt,
    updated_at: g.updatedAt,
  };
}

function mapMemberToSupabase(m: any): any {
  return {
    group_id: m.groupId,
    user_profile_id: m.userProfileId,
    role: m.role,
    joined_at: m.joinedAt,
    user_profiles: m.userProfile
      ? mapUserProfileToSupabase(m.userProfile)
      : null,
  };
}

export const getGroups = async (limit = 20) => {
  const result = await db.query.groups.findMany({
    limit: limit,
    orderBy: [desc(groups.createdAt)],
  });
  return result.map(mapGroupToSupabase);
};

export const createGroup = async (groupData: GroupInsert) => {
  const drizzleInput = {
    name: groupData.name,
    description: groupData.description,
    avatarUrl: groupData.avatar_url,
    coverUrl: groupData.cover_url,
    isOfficial: groupData.is_official,
    leaderId: groupData.leader_id,
  };

  // Transaction: Create Group -> Add Leader as Member
  const newGroup = await db.transaction(async (tx) => {
    const [group] = await tx.insert(groups).values(drizzleInput).returning();

    if (groupData.leader_id) {
      await tx.insert(groupMembers).values({
        groupId: group.id,
        userProfileId: groupData.leader_id,
        role: "leader",
        joinedAt: new Date().toISOString(),
      });
    }
    return group;
  });

  return mapGroupToSupabase(newGroup);
};

export const updateGroup = async (groupId: string, updateData: GroupUpdate) => {
  const drizzleUpdate: any = {};
  if (updateData.name !== undefined) drizzleUpdate.name = updateData.name;
  if (updateData.description !== undefined)
    drizzleUpdate.description = updateData.description;
  if (updateData.avatar_url !== undefined)
    drizzleUpdate.avatarUrl = updateData.avatar_url;
  if (updateData.cover_url !== undefined)
    drizzleUpdate.coverUrl = updateData.cover_url;

  const [updated] = await db
    .update(groups)
    .set(drizzleUpdate)
    .where(eq(groups.id, groupId))
    .returning();
  return mapGroupToSupabase(updated);
};

export const deleteGroup = async (groupId: string) => {
  await db.delete(groups).where(eq(groups.id, groupId));
};

import { isValidUUID } from "@/lib/utils";

export const getGroupById = async (groupId: string) => {
  if (!isValidUUID(groupId)) {
    return null;
  }

  const group = await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
  });
  return group ? mapGroupToSupabase(group) : null;
};

export const joinGroup = async (groupId: string, userId: string) => {
  const [member] = await db
    .insert(groupMembers)
    .values({
      groupId,
      userProfileId: userId,
      role: "member",
    })
    .returning();

  return {
    group_id: member.groupId,
    user_profile_id: member.userProfileId,
    role: member.role,
    joined_at: member.joinedAt,
  };
};

export const leaveGroup = async (groupId: string, userId: string) => {
  await db
    .delete(groupMembers)
    .where(
      and(
        eq(groupMembers.groupId, groupId),
        eq(groupMembers.userProfileId, userId)
      )
    );
};

export const getGroupMembers = async (groupId: string) => {
  const members = await db.query.groupMembers.findMany({
    where: eq(groupMembers.groupId, groupId),
    with: {
      userProfile: true,
    },
  });
  return members.map(mapMemberToSupabase);
};
