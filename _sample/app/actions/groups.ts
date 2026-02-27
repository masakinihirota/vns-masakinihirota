"use server";

import { auth } from "@/lib/auth/helper";
import * as groupsDb from "@/lib/db/groups";
import type { NewGroup } from "@/lib/db/types";
import { getUserProfilesByAuthUserId } from "@/lib/db/user-profiles";

type GroupInsert = NewGroup;
type GroupUpdate = Partial<NewGroup>;

/**
 *
 * @param limit
 */
export async function getGroupsAction(limit = 20) {
  return groupsDb.getGroups(limit);
}

/**
 *
 * @param groupData
 */
export async function createGroupAction(groupData: GroupInsert) {
  return groupsDb.createGroup(groupData);
}

/**
 *
 * @param groupId
 * @param updateData
 */
export async function updateGroupAction(
  groupId: string,
  updateData: GroupUpdate
) {
  return groupsDb.updateGroup(groupId, updateData);
}

/**
 *
 * @param groupId
 */
export async function deleteGroupAction(groupId: string) {
  return groupsDb.deleteGroup(groupId);
}

/**
 *
 * @param groupId
 */
export async function getGroupByIdAction(groupId: string) {
  return groupsDb.getGroupById(groupId);
}

/**
 *
 * @param groupId
 * @param userId
 */
export async function joinGroupAction(groupId: string, userId: string) {
  return groupsDb.joinGroup(groupId, userId);
}

/**
 *
 * @param groupId
 * @param userId
 */
export async function leaveGroupAction(groupId: string, userId: string) {
  return groupsDb.leaveGroup(groupId, userId);
}

/**
 *
 * @param groupId
 */
export async function getGroupMembersAction(groupId: string) {
  return groupsDb.getGroupMembers(groupId);
}

/**
 *
 */
export async function getMyProfilesAction() {
  const session = await auth();
  if (!session?.user?.id) return [];

  // Implement logic to get profiles for the current user
  // Assuming auth_user_id mapping via root_accounts
  const profiles = await getUserProfilesByAuthUserId(session.user.id);
  return profiles;
}
