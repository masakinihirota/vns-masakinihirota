"use client";

import { useMemo, useState } from "react";
import { MOCK_MEMBERS, MOCK_WORKS, RATING_ORDER } from "./groups.mock";
import {
  AdminTab,
  EvalTab,
  Member,
  PlazaTab,
  SkillTab,
  SortConfig,
  ValueSelection,
} from "./groups.types";

export const useGroupLogic = () => {
  // State
  const [mainTab, setMainTab] = useState<string>("evaluation");
  const [plazaSubTab, setPlazaSubTab] = useState<PlazaTab>("chat");
  const [evalSubTab, setEvalSubTab] = useState<EvalTab>("matrix");
  const [skillSubTab, setSkillSubTab] = useState<SkillTab>("mandala");
  const [adminSubTab, setAdminSubTab] = useState<AdminTab>("members");

  const [selectedMember, setSelectedMember] = useState<Member>(MOCK_MEMBERS[1]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "title",
    direction: "asc",
  });

  // Value Tab State
  const [openTopicId, setOpenTopicId] = useState<string | null>("v1");
  const [userValueSelections, setUserValueSelections] = useState<
    Record<string, ValueSelection>
  >({
    v1: { choice: "はい", tier: "T1", lastUpdated: new Date().toISOString() },
    v2: { choice: "はい", tier: "T3", lastUpdated: new Date().toISOString() },
    v3: { choice: "はい", tier: "T1", lastUpdated: new Date().toISOString() },
    v4: { choice: "いいえ", tier: "T2", lastUpdated: new Date().toISOString() },
  });

  // Derived State
  const isComparingSelf = useMemo(
    () => selectedMember.id === MOCK_MEMBERS[0].id,
    [selectedMember]
  );

  const filteredMembers = useMemo(() => {
    if (!searchQuery) return MOCK_MEMBERS;
    return MOCK_MEMBERS.filter(
      (m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.traits.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [searchQuery]);

  const sortedWorks = useMemo(() => {
    let sortableItems = [...MOCK_WORKS];

    // Work filtering removed as searchQuery is now for members (per spec section 7.1)

    // Sorting
    sortableItems.sort((a, b) => {
      if (sortConfig.key === "title") {
        return sortConfig.direction === "asc"
          ? a.title.localeCompare(b.title, "ja")
          : b.title.localeCompare(a.title, "ja");
      }
      if (sortConfig.key === "me" || sortConfig.key === "target") {
        // me: MOCK_MEMBERS[0], target: selectedMember
        const ratingA =
          sortConfig.key === "me"
            ? MOCK_MEMBERS[0].ratings[a.id]
            : selectedMember.ratings[a.id];

        const ratingB =
          sortConfig.key === "me"
            ? MOCK_MEMBERS[0].ratings[b.id]
            : selectedMember.ratings[b.id];

        const valA = RATING_ORDER[ratingA] || 0;
        const valB = RATING_ORDER[ratingB] || 0;

        return sortConfig.direction === "asc" ? valA - valB : valB - valA;
      }
      return 0;
    });
    return sortableItems;
  }, [sortConfig, selectedMember, searchQuery]);

  // Handlers
  const requestSort = (key: SortConfig["key"]) => {
    let direction: SortConfig["direction"] = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  const handleValueChange = (topicId: string, choice: string) => {
    setUserValueSelections((prev) => ({
      ...prev,
      [topicId]: {
        ...prev[topicId],
        choice,
        lastUpdated: new Date().toISOString(),
      },
    }));
  };

  const handleTierChange = (topicId: string, tier: string) => {
    setUserValueSelections((prev) => ({
      ...prev,
      [topicId]: {
        ...prev[topicId],
        tier,
        lastUpdated: prev[topicId]?.lastUpdated || new Date().toISOString(),
      },
    }));
  };

  return {
    mainTab,
    setMainTab,
    plazaSubTab,
    setPlazaSubTab,
    evalSubTab,
    setEvalSubTab,
    skillSubTab,
    setSkillSubTab,
    adminSubTab,
    setAdminSubTab,
    selectedMember,
    setSelectedMember,
    searchQuery,
    setSearchQuery,
    sortConfig,
    setSortConfig,
    openTopicId,
    setOpenTopicId,
    userValueSelections,
    setUserValueSelections,
    isComparingSelf,
    sortedWorks,
    filteredMembers,
    requestSort,
    handleValueChange,
    handleTierChange,
  };
};
