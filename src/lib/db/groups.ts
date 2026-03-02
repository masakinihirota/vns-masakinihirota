import type { InferSelectModel } from "drizzle-orm";
import { and, desc, eq } from "drizzle-orm";

import { isValidUUID } from "@/lib/utils";

import { db as database } from "./client";
import { groupMembers, groups } from "./schema.postgres";
import { mapToUserProfileDomain, type DbUserProfile as DatabaseUserProfile } from "./user-profiles";

// Drizzle型定義
type GroupsRow = InferSelectModel<typeof groups>;
type GroupMembersRow = InferSelectModel<typeof groupMembers>;

export type Group = {
  id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  is_official: boolean | null;
  leader_id: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type GroupMember = {
  group_id: string;
  user_profile_id: string;
  role: string;
  joined_at: string;
  user_profiles: ReturnType<typeof mapToUserProfileDomain> | null;
};

// Mapper Helpers
/**
 *
 * @param g
 */
function mapToGroupDomain(g: GroupsRow & { userProfile?: unknown }): Group {
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

/**
 *
 * @param m
 */
function mapToMemberDomain(m: GroupMembersRow & { userProfile?: DatabaseUserProfile }): GroupMember {
  return {
    group_id: m.groupId,
    user_profile_id: m.userProfileId,
    role: m.role ?? "member",
    joined_at: m.joinedAt,
    user_profiles: m.userProfile ? mapToUserProfileDomain(m.userProfile) : null,
  };
}

export const getGroups = async (limit = 20): Promise<Group[]> => {
  const result = await database.query.groups.findMany({
    limit: limit,
    orderBy: [desc(groups.createdAt)],
    with: {
      userProfile: true, // Eager load leader userProfile
    },
  });
  return result.map(mapToGroupDomain);
};

export const createGroup = async (groupData: Partial<Group>): Promise<Group> => {
  const drizzleInput = {
    name: groupData.name!,
    description: groupData.description,
    avatarUrl: groupData.avatar_url,
    coverUrl: groupData.cover_url,
    isOfficial: groupData.is_official ?? false,
    leaderId: groupData.leader_id,
  };

  const newGroup = await database.transaction(async (tx) => {
    const [group] = await tx
      .insert(groups)
      .values(drizzleInput)
      .returning();

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

  return mapToGroupDomain(newGroup);
};

export const updateGroup = async (
  groupId: string,
  updateData: Partial<Group>
): Promise<Group> => {
  const drizzleUpdate: Record<string, unknown> = {};
  if (updateData.name !== undefined) drizzleUpdate.name = updateData.name;
  if (updateData.description !== undefined)
    drizzleUpdate.description = updateData.description;
  if (updateData.avatar_url !== undefined)
    drizzleUpdate.avatarUrl = updateData.avatar_url;
  if (updateData.cover_url !== undefined)
    drizzleUpdate.coverUrl = updateData.cover_url;

  const [updated] = await database
    .update(groups)
    .set(drizzleUpdate)
    .where(eq(groups.id, groupId))
    .returning();
  return mapToGroupDomain(updated);
};

export const deleteGroup = async (groupId: string): Promise<void> => {
  await database.delete(groups).where(eq(groups.id, groupId));
};


export const getGroupById = async (groupId: string): Promise<Group | null> => {
  if (!isValidUUID(groupId)) {
    return null;
  }

  const group = await database.query.groups.findFirst({
    where: eq(groups.id, groupId),
    with: {
      userProfile: true, // Eager load leader userProfile
    },
  });
  return group ? mapToGroupDomain(group) : null;
};

export const joinGroup = async (groupId: string, userId: string): Promise<GroupMember> => {
  const [member] = await database
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

export const leaveGroup = async (groupId: string, userId: string): Promise<void> => {
  await database
    .delete(groupMembers)
    .where(
      and(
        eq(groupMembers.groupId, groupId),
        eq(groupMembers.userProfileId, userId)
      )
    );
};

export const getGroupMembers = async (groupId: string): Promise<GroupMember[]> => {
  const members = await database.query.groupMembers.findMany({
    where: eq(groupMembers.groupId, groupId),
    with: {
      userProfile: true,
    },
  });
  return members.map(mapToMemberDomain);
};
