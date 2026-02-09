import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types"; // Will be generated

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
  const { data, error } = await supabase
    .from("group_members")
    .insert({ group_id: groupId, user_profile_id: userId, role: "member" })
    .select()
    .single();

  if (error) throw error;
  return data;
};
