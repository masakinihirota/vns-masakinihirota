"use server";

import { auth } from "@/auth";
import * as groupsDb from "@/lib/db/groups";
import type { TablesInsert, TablesUpdate } from "@/types/types_db";

type GroupInsert = TablesInsert<"groups">;
type GroupUpdate = TablesUpdate<"groups">;

export async function getGroupsAction(limit = 20) {
  return groupsDb.getGroups(limit);
}

export async function createGroupAction(groupData: GroupInsert) {
  return groupsDb.createGroup(groupData);
}

export async function updateGroupAction(groupId: string, updateData: GroupUpdate) {
  return groupsDb.updateGroup(groupId, updateData);
}

export async function deleteGroupAction(groupId: string) {
  return groupsDb.deleteGroup(groupId);
}

export async function getGroupByIdAction(groupId: string) {
  return groupsDb.getGroupById(groupId);
}

export async function joinGroupAction(groupId: string, userId: string) {
  return groupsDb.joinGroup(groupId, userId);
}

export async function leaveGroupAction(groupId: string, userId: string) {
  return groupsDb.leaveGroup(groupId, userId);
}

export async function getGroupMembersAction(groupId: string) {
  return groupsDb.getGroupMembers(groupId);
}

export async function getMyProfilesAction() {
  const session = await auth();
  if (!session?.user?.id) return [];

  // Implement logic to get profiles for the current user
  // Assuming auth_user_id mapping via root_accounts
  const profiles = await getUserProfilesByAuthUserId(session.user.id);
  return profiles;
}
