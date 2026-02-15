"use client";

import {
  createGroupAction,
  deleteGroupAction,
  getGroupByIdAction,
  getGroupMembersAction,
  getGroupsAction,
  getMyProfilesAction,
  joinGroupAction,
  leaveGroupAction,
  updateGroupAction
} from "@/app/actions/groups";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/types_db";
import { useState } from "react";
import useSWR from "swr";
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
export async function getGroups(limit = 20) {
  return getGroupsAction(limit);
}

/**
 * グループ詳細を取得する
 * @param id グループID
 * @returns グループ詳細
 */
export async function getGroupById(id: string) {
  return getGroupByIdAction(id);
}

/**
 * グループを作成する
 * 注意: RLSにより、leader_idは現在のユーザーIDである必要があります（またはTriggerで設定）
 * 現状のポリシー定義に基づき、作成者がleader_idとして設定されることを想定しています。
 * @param groupData グループ作成データ
 * @returns 作成されたグループ
 */
export async function createGroup(groupData: GroupInsert) {
  if (!groupData.name) throw new Error("Group name is required");
  if (!groupData.leader_id) throw new Error("Leader ID is required");

  const data = await createGroupAction(groupData);

  if (!data) throw new Error("Group creation failed no data returned");
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
) {
  return updateGroupAction(id, updateData);
}

/**
 * グループを削除する
 * @param id グループID
 */
export async function deleteGroup(id: string) {
  await deleteGroupAction(id);
}

// --- Membership ---

/**
 * グループに参加する
 * @param groupId 参加するグループID
 * @param userId 参加するユーザーID
 */
export async function joinGroup(
  groupId: string,
  userId: string
) {
  await joinGroupAction(groupId, userId);
}

/**
 * グループから脱退する
 * @param groupId グループID
 * @param userId ユーザーID
 */
export async function leaveGroup(
  groupId: string,
  userId: string
) {
  await leaveGroupAction(groupId, userId);
}

/**
 * グループメンバー一覧を取得する
 * @param groupId グループID
 * @returns メンバーリスト
 */
export async function getGroupMembers(groupId: string) {
  return getGroupMembersAction(groupId);
}

/**
 * 自分のプロフィール一覧を取得する
 * @returns プロフィールリスト
 */
export async function getMyProfiles() {
  return getMyProfilesAction();
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
