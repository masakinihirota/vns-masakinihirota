import { Database } from "@/types/database.types";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/types_db";
import { SupabaseClient } from "@supabase/supabase-js";
import { and, desc, eq } from "drizzle-orm";
import { db } from "./drizzle";
import { groupMembers, groups } from "./schema";

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
    user_profiles: m.userProfile ? {
      ...m.userProfile,
      root_account_id: m.userProfile.rootAccountId,
      display_name: m.userProfile.displayName,
      role_type: m.userProfile.roleType,
      is_active: m.userProfile.isActive,
      last_interacted_record_id: m.userProfile.lastInteractedRecordId,
      created_at: m.userProfile.createdAt,
      updated_at: m.userProfile.updatedAt,
    } : null
  };
}

export const getGroups = async (
  supabase: SupabaseClient<Database> | null,
  limit = 20
) => {
  if (process.env.USE_DRIZZLE === "true") {
    const result = await db.query.groups.findMany({
      limit: limit,
      orderBy: [desc(groups.createdAt)],
    });
    return result.map(mapGroupToSupabase);
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .limit(limit)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export const createGroup = async (
  supabase: SupabaseClient<Database> | null,
  groupData: GroupInsert
) => {
  if (process.env.USE_DRIZZLE === "true") {
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
          joinedAt: new Date().toISOString()
        });
      }
      return group;
    });

    return mapGroupToSupabase(newGroup);
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  const { data, error } = await supabase
    .from("groups")
    .insert(groupData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateGroup = async (
  supabase: SupabaseClient<Database> | null,
  groupId: string,
  updateData: GroupUpdate
) => {
  if (process.env.USE_DRIZZLE === "true") {
    const drizzleUpdate: any = {};
    if (updateData.name !== undefined) drizzleUpdate.name = updateData.name;
    if (updateData.description !== undefined) drizzleUpdate.description = updateData.description;
    if (updateData.avatar_url !== undefined) drizzleUpdate.avatarUrl = updateData.avatar_url;
    if (updateData.cover_url !== undefined) drizzleUpdate.coverUrl = updateData.cover_url;

    const [updated] = await db.update(groups).set(drizzleUpdate).where(eq(groups.id, groupId)).returning();
    return mapGroupToSupabase(updated);
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  const { data, error } = await supabase
    .from("groups")
    .update(updateData)
    .eq("id", groupId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export const deleteGroup = async (
  supabase: SupabaseClient<Database> | null,
  groupId: string
) => {
  if (process.env.USE_DRIZZLE === "true") {
    await db.delete(groups).where(eq(groups.id, groupId));
    return;
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  const { error } = await supabase.from("groups").delete().eq("id", groupId);
  if (error) throw error;
}

import { isValidUUID } from "@/lib/utils";

export const getGroupById = async (
  supabase: SupabaseClient<Database> | null,
  groupId: string
) => {
  if (!isValidUUID(groupId)) {
    return null;
  }

  if (process.env.USE_DRIZZLE === "true") {
    const group = await db.query.groups.findFirst({
      where: eq(groups.id, groupId),
    });
    return group ? mapGroupToSupabase(group) : null;
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("id", groupId)
    .single();

  if (error) throw error;
  return data;
};

export const joinGroup = async (
  supabase: SupabaseClient<Database> | null,
  groupId: string,
  userId: string
) => {
  if (process.env.USE_DRIZZLE === "true") {
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
      joined_at: member.joinedAt
    };
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  const { data, error } = await supabase
    .from("group_members")
    .insert({ group_id: groupId, user_profile_id: userId, role: "member" })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const leaveGroup = async (
  supabase: SupabaseClient<Database> | null,
  groupId: string,
  userId: string
) => {
  if (process.env.USE_DRIZZLE === "true") {
    await db.delete(groupMembers).where(
      and(
        eq(groupMembers.groupId, groupId),
        eq(groupMembers.userProfileId, userId)
      )
    );
    return;
  }

  if (!supabase) throw new Error("Supabase client required");

  const { error } = await supabase
    .from("group_members")
    .delete()
    .match({ group_id: groupId, user_profile_id: userId });

  if (error) throw error;
}

export const getGroupMembers = async (
  supabase: SupabaseClient<Database> | null,
  groupId: string
) => {
  if (process.env.USE_DRIZZLE === "true") {
    const members = await db.query.groupMembers.findMany({
      where: eq(groupMembers.groupId, groupId),
      with: {
        userProfile: true,
      },
    });
    return members.map(mapMemberToSupabase);
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  const { data, error } = await supabase
    .from("group_members")
    .select("*, user_profiles(*)")
    .eq("group_id", groupId);

  if (error) throw error;
  return data;
};
