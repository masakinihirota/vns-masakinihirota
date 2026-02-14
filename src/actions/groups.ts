"use server";

import { revalidatePath } from "next/cache";
import {
  createGroup as createGroupDAL,
  getGroupById as getGroupByIdDAL,
  joinGroup as joinGroupDAL,
} from "@/lib/db/groups";
import { createClient } from "@/lib/supabase/server";

export async function createGroupAction(groupData: {
  name: string;
  description?: string;
  avatar_url?: string;
  cover_url?: string;
  leader_id: string;
}) {
  const supabase = await createClient();
  const result = await createGroupDAL(supabase, groupData);
  revalidatePath("/groups");
  return result;
}

export async function getGroupByIdAction(groupId: string) {
  const supabase = await createClient();
  return await getGroupByIdDAL(supabase, groupId);
}

export async function joinGroupAction(groupId: string, userId: string) {
  const supabase = await createClient();
  const result = await joinGroupDAL(supabase, groupId, userId);
  revalidatePath(`/groups/${groupId}`);
  return result;
}
