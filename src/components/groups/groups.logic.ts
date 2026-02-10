"use client";

import { useState } from "react";
import useSWR from "swr";
import { createClient } from "@/lib/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/types_db";
import { MOCK_MEMBERS, MOCK_WORKS } from "./groups.mock";
import {
  AdminTab,
  EvalTab,
  Member,
  PlazaTab,
  SkillTab,
  SortConfig,
  ValueSelection,
} from "./groups.types";

type Group = Tables<"groups">;
// type GroupMember = Tables<"group_members">; // Unused
type GroupInsert = TablesInsert<"groups">;
type GroupUpdate = TablesUpdate<"groups">;

// --- Groups CRUD ---

/**
 * グループ一覧を取得する
 * @param limit 取得件数
 * @returns グループリスト
 */
export async function getGroups(
  limit = 20,
  client?: ReturnType<typeof createClient>
) {
  const supabase = client ?? createClient();
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .limit(limit)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * グループ詳細を取得する
 * @param id グループID
 * @returns グループ詳細
 */
export async function getGroupById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * グループを作成する
 * 注意: RLSにより、leader_idは現在のユーザーIDである必要があります（またはTriggerで設定）
 * 現状のポリシー定義に基づき、作成者がleader_idとして設定されることを想定しています。
 * @param groupData グループ作成データ
 * @returns 作成されたグループ
 */
export async function createGroup(
  groupData: GroupInsert,
  client?: ReturnType<typeof createClient>
) {
  const supabase = client ?? createClient();

  // Use the new atomic RPC function
  // groupData.name is required.
  // leader_id is required for RPC, though it checks auth.
  // RPC args: p_name, p_leader_id, p_description, p_avatar_url, p_cover_url

  if (!groupData.name) throw new Error("Group name is required");
  if (!groupData.leader_id) throw new Error("Leader ID is required");

  const { data, error } = await supabase.rpc("create_group_with_leader", {
    p_name: groupData.name,
    p_leader_id: groupData.leader_id,
    p_description: groupData.description || null,
    p_avatar_url: groupData.avatar_url || null,
    p_cover_url: groupData.cover_url || null,
  });

  if (error) throw error;
  if (!data) throw new Error("Group creation failed no data returned");

  // The RPC returns { id, name, ... } as Json. We cast it to Group.
  // Ensure the keys match the Table definition.
  return data as unknown as Group;
}

/**
 * グループ情報を更新する
 * @param id グループID
 * @param updateData 更新データ
 * @returns 更新されたグループ
 */
export async function updateGroup(
  id: string,
  updateData: GroupUpdate,
  client?: ReturnType<typeof createClient>
) {
  const supabase = client ?? createClient();
  const { data, error } = await supabase
    .from("groups")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * グループを削除する
 * @param id グループID
 */
export async function deleteGroup(
  id: string,
  client?: ReturnType<typeof createClient>
) {
  const supabase = client ?? createClient();
  const { error } = await supabase.from("groups").delete().eq("id", id);

  if (error) throw error;
}

// --- Membership ---

/**
 * グループに参加する
 * @param groupId 参加するグループID
 * @param userId 参加するユーザーID
 */
export async function joinGroup(
  groupId: string,
  userId: string,
  client?: ReturnType<typeof createClient>
) {
  const supabase = client ?? createClient();
  const { error } = await supabase.from("group_members").insert({
    group_id: groupId,
    user_profile_id: userId,
    role: "member",
  });

  if (error) throw error;
}

/**
 * グループから脱退する
 * @param groupId グループID
 * @param userId ユーザーID
 */
export async function leaveGroup(
  groupId: string,
  userId: string,
  client?: ReturnType<typeof createClient>
) {
  const supabase = client ?? createClient();
  const { error } = await supabase
    .from("group_members")
    .delete()
    .match({ group_id: groupId, user_profile_id: userId });

  if (error) throw error;
}

/**
 * グループメンバー一覧を取得する
 * @param groupId グループID
 * @returns メンバーリスト
 */
export async function getGroupMembers(
  groupId: string,
  client?: ReturnType<typeof createClient>
) {
  const supabase = client ?? createClient();
  const { data, error } = await supabase
    .from("group_members")
    .select("*, user_profiles(*)") // user_profilesの情報を結合
    .eq("group_id", groupId);

  if (error) throw error;
  return data;
}

/**
 * 自分のプロフィール一覧を取得する
 * @returns プロフィールリスト
 */
export async function getMyProfiles(client?: ReturnType<typeof createClient>) {
  const supabase = client ?? createClient();

  // 1. Get Current Auth User
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return [];

  // 2. Get Root Account
  const { data: rootAccount, error: rootError } = await supabase
    .from("root_accounts")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (rootError || !rootAccount) return [];

  // 3. Get Profiles
  const { data: profiles, error: profilesError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("root_account_id", rootAccount.id);

  if (profilesError) throw profilesError;
  return profiles;
}

// --- Logic Hook ---

export const useGroupLogic = (groupId?: string) => {
  // Tabs State
  const [mainTab, setMainTab] = useState("plaza");
  const [plazaSubTab, setPlazaSubTab] = useState<PlazaTab>("chat");
  const [evalSubTab, setEvalSubTab] = useState<EvalTab>("matrix");
  const [skillSubTab, setSkillSubTab] = useState<SkillTab>("list");
  const [adminSubTab, setAdminSubTab] = useState<AdminTab>("members");

  // Selection & Search State
  const [selectedMember, setSelectedMember] = useState<Member>(MOCK_MEMBERS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "title",
    direction: "asc",
  });

  // Values Tab State
  const [openTopicId, setOpenTopicId] = useState<string | null>(null);
  const [userValueSelections, setUserValueSelections] = useState<
    Record<string, ValueSelection>
  >({});
  const [isComparingSelf] = useState(false); // setIsComparingSelf is unused

  // Data Fetching
  const { data: group, error: groupError } = useSWR(
    groupId ? ["group", groupId] : null,
    () => getGroupById(groupId!)
  );

  // Fetch Members
  const { data: membersData } = useSWR(
    groupId ? ["group_members", groupId] : null,
    () => getGroupMembers(groupId!)
  );

  const members: Member[] = membersData
    ? membersData.map((m: any) => ({
        id: m.user_profile_id,
        name: m.user_profiles?.display_name || "Unknown",
        role:
          m.role === "leader"
            ? "リーダー"
            : m.role === "mediator"
              ? "メディエーター"
              : "一般",
        avatar: m.user_profiles?.avatar_url || "😎", // Default avatar
        traits: [], // Placeholder
        ratings: {}, // Placeholder
        values: {}, // Placeholder
      }))
    : []; // Or MOCK_MEMBERS if you want to keep mocks when no DB data

  // Event Handlers
  const handleValueChange = (topicId: string, choice: string) => {
    setUserValueSelections((prev) => ({
      ...prev,
      [topicId]: { ...prev[topicId], choice },
    }));
  };

  const handleTierChange = (topicId: string, tier: string) => {
    setUserValueSelections((prev) => ({
      ...prev,
      [topicId]: { ...prev[topicId], tier },
    }));
  };

  const requestSort = (key: SortConfig["key"]) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Derived State
  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    // State
    mainTab,
    plazaSubTab,
    evalSubTab,
    skillSubTab,
    adminSubTab,
    selectedMember,
    searchQuery,
    sortConfig,
    openTopicId,
    userValueSelections,
    isComparingSelf,

    // Data
    members,
    filteredMembers,
    sortedWorks: MOCK_WORKS, // Replace with real data logic
    group,
    groupError,

    // Setters & Handlers
    setMainTab,
    setPlazaSubTab,
    setEvalSubTab,
    setSkillSubTab,
    setAdminSubTab,
    setSelectedMember,
    setSearchQuery,
    requestSort,
    setOpenTopicId,
    handleValueChange,
    handleTierChange,
  };
};
