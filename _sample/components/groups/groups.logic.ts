"use client";

import { useState } from "react";
import useSWR from "swr";

import {
  createGroupAction,
  deleteGroupAction,
  getGroupByIdAction,
  getGroupMembersAction,
  getGroupsAction,
  getMyProfilesAction,
  joinGroupAction,
  leaveGroupAction,
  updateGroupAction,
} from "@/app/actions/groups";
import type { Group, NewGroup } from "@/lib/db/types";


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

type GroupInsert = NewGroup;
type GroupUpdate = any;


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
 * @param groupData グループ作成データ
 * @returns 作成されたグループ
 */
export async function createGroup(groupData: GroupInsert) {
  if (!groupData.name) throw new Error("Group name is required");
  if (!groupData.leaderId) throw new Error("Leader ID is required");

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
export async function updateGroup(id: string, updateData: GroupUpdate) {
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
export async function joinGroup(groupId: string, userId: string) {
  await joinGroupAction(groupId, userId);
}

/**
 * グループから脱退する
 * @param groupId グループID
 * @param userId ユーザーID
 */
export async function leaveGroup(groupId: string, userId: string) {
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
    ? (membersData as any[]).map((m: any) => ({
      id: m.userProfileId,
      name: m.userProfiles?.displayName || "Unknown",
      role:
        m.role === "leader"
          ? "リーダー"
          : (m.role === "mediator"
            ? "メディエーター"
            : "一般"),
      avatar: m.userProfiles?.avatarUrl || "😎", // Default avatar
      traits: [], // Placeholder
      ratings: {}, // Placeholder
      values: {}, // Placeholder
    }))
    : []; // Or MOCK_MEMBERS if you want to keep mocks when no DB data

  // Event Handlers
  const handleValueChange = (topicId: string, choice: string) => {
    setUserValueSelections((previous) => ({
      ...previous,
      [topicId]: { ...previous[topicId], choice },
    }));
  };

  const handleTierChange = (topicId: string, tier: string) => {
    setUserValueSelections((previous) => ({
      ...previous,
      [topicId]: { ...previous[topicId], tier },
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
