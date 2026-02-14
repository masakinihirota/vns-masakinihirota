import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { isDrizzle } from "./adapter";
import {
  createGroupDrizzle,
  getGroupByIdDrizzle,
  joinGroupDrizzle,
} from "./drizzle";

// Helper to map Drizzle Group to Supabase Group
const toSupabaseGroup = (g: any) => ({
  ...g,
  leader_id: g.leaderId,
  created_at: g.createdAt?.toISOString(),
  updated_at: g.updatedAt?.toISOString(),
  avatar_url: g.avatarUrl,
  cover_url: g.coverUrl,
  is_official: g.isOfficial,
  // Remove camelCase keys if strictness is needed, but spread keeps them.
  // We prioritize snake_case for compatibility.
});

// Helper to map Drizzle GroupMember to Supabase GroupMember
const toSupabaseGroupMember = (m: any) => ({
  ...m,
  group_id: m.groupId,
  user_profile_id: m.userProfileId,
  joined_at: m.joinedAt?.toISOString(),
});

export const createGroup = async (
  supabase: SupabaseClient<Database>,
  groupData: {
    name: string;
    description?: string;
    avatar_url?: string;
    cover_url?: string;
    leader_id: string;
  }
) => {
  // Drizzleアダプターが有効な場合はDrizzle実装に委譲
  if (isDrizzle()) {
    const result = await createGroupDrizzle(groupData);
    return toSupabaseGroup(result);
  }

  const { data, error } = await supabase
    .from("groups")
    .insert(groupData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getGroupById = async (
  supabase: SupabaseClient<Database>,
  groupId: string
) => {
  // Drizzleアダプターが有効な場合はDrizzle実装に委譲
  if (isDrizzle()) {
    const result = await getGroupByIdDrizzle(groupId);
    return toSupabaseGroup(result);
  }

  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("id", groupId)
    .single();

  if (error) throw error;
  return data;
};

export const joinGroup = async (
  supabase: SupabaseClient<Database>,
  groupId: string,
  userId: string
) => {
  // Drizzleアダプターが有効な場合はDrizzle実装に委譲
  if (isDrizzle()) {
    const result = await joinGroupDrizzle(groupId, userId);
    return toSupabaseGroupMember(result);
  }

  const { data, error } = await supabase
    .from("group_members")
    .insert({ group_id: groupId, user_profile_id: userId, role: "member" })
    .select()
    .single();

  if (error) throw error;
  return data;
};
