"use server";

import * as groupsDb from "@/lib/db/groups";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert, TablesUpdate } from "@/types/types_db";

type GroupInsert = TablesInsert<"groups">;
type GroupUpdate = TablesUpdate<"groups">;

export async function getGroupsAction(limit = 20) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();
  return groupsDb.getGroups(supabase, limit);
}

export async function createGroupAction(groupData: GroupInsert) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();

  return groupsDb.createGroup(supabase, groupData);
}

export async function updateGroupAction(groupId: string, updateData: GroupUpdate) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();
  return groupsDb.updateGroup(supabase, groupId, updateData);
}

export async function deleteGroupAction(groupId: string) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();
  return groupsDb.deleteGroup(supabase, groupId);
}

export async function getGroupByIdAction(groupId: string) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();

  return groupsDb.getGroupById(supabase, groupId);
}

export async function joinGroupAction(groupId: string, userId: string) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();

  return groupsDb.joinGroup(supabase, groupId, userId);
}

export async function leaveGroupAction(groupId: string, userId: string) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();
  return groupsDb.leaveGroup(supabase, groupId, userId);
}

export async function getGroupMembersAction(groupId: string) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();

  return groupsDb.getGroupMembers(supabase, groupId);
}
