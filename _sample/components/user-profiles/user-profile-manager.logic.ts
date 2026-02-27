"use client";

import { useEffect, useState } from "react";

import { getMyProfilesAction } from "@/app/(protected)/user-profiles/actions";

// UI-specific definitions (can be aligned with DB types later)
export type Profile = {
  id: string;
  customName?: string;
  displayName: string;
  username: string;
  role: string;
  purpose: string;
  type: string;
  avatar: string | null;
  deleted?: boolean;
};

export type SortKey = "displayName" | "role" | "purpose" | "type";

const fetchProfiles = async (
  setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setLoading(true);
  const result = await getMyProfilesAction();

  if (!result.success || !result.data) {
    setProfiles([]);
    setLoading(false);
    return;
  }

  const mappedProfiles: Profile[] = result.data.map((p) => ({
    id: p.id,
    displayName: p.display_name,
    username: p.display_name, // Mapping display_name as username for UI if field missing
    role: p.role === "leader" ? "リーダー" : "メンバー",
    purpose: p.purpose || "未設定",
    type: p.profile_type === "self" ? "本人" : p.profile_type,
    avatar: p.avatar_url,
    deleted: !p.is_active,
  }));
  setProfiles(mappedProfiles);
  setLoading(false);
};

export const useUserProfileManager = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedProfileForEdit, setSelectedProfileForEdit] =
    useState<Profile | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  }>({ key: "displayName", direction: "asc" });

  const [activeProfileIds, setActiveProfileIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"active" | "trash">("active");

  const isGhostActive = activeProfileIds.length === 0;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    void fetchProfiles(setProfiles, setLoading);
  }, []);

  const filteredProfiles = profiles
    .filter((profile) => {
      // 1. View Mode Filter
      if (viewMode === "active" && profile.deleted) return false;
      if (viewMode === "trash" && !profile.deleted) return false;

      // 2. Search Filter
      const matchesSearch =
        profile.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.username.toLowerCase().includes(searchQuery.toLowerCase());

      // 3. Role Filter
      const matchesRole = roleFilter === "all" || profile.role === roleFilter;

      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key] || "";
      const bValue = b[sortConfig.key] || "";

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue, "ja")
          : bValue.localeCompare(aValue, "ja");
      }
      return 0;
    });

  const handleSort = (key: SortKey) => {
    setSortConfig((previous) => ({
      key,
      direction: previous.key === key && previous.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleDelete = (id: string) => {
    if (!globalThis.confirm("このプロフィールをゴミ箱に移動しますか？")) return;

    setProfiles((previous) =>
      previous.map((p) => (p.id === id ? { ...p, deleted: true } : p))
    );
    if (activeProfileIds.includes(id)) {
      setActiveProfileIds((previous) => previous.filter((pid) => pid !== id));
    }
  };

  const handleRestore = (id: string) => {
    setProfiles((previous) =>
      previous.map((p) => (p.id === id ? { ...p, deleted: false } : p))
    );
  };

  const handlePermanentDelete = (id: string) => {
    if (
      globalThis.confirm(
        "このプロフィールを完全に削除しますか？この操作は取り消せません。"
      )
    ) {
      setProfiles((previous) => previous.filter((p) => p.id !== id));
    }
  };

  const toggleProfile = (id: string) => {
    if (viewMode === "trash") return;

    setActiveProfileIds((previous) => {
      const isSelected = previous.includes(id);
      return isSelected ? previous.filter((pId) => pId !== id) : [...previous, id];
    });
  };

  const setGhostActive = () => {
    if (viewMode === "trash") return;
    setActiveProfileIds([]);
  };

  return {
    isDarkMode,
    setIsDarkMode,
    profiles,
    loading,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    selectedProfileForEdit,
    setSelectedProfileForEdit,
    sortConfig,
    handleSort,
    activeProfileIds,
    viewMode,
    setViewMode,
    isGhostActive,
    filteredProfiles,
    handleDelete,
    handleRestore,
    handlePermanentDelete,
    toggleProfile,
    setGhostActive,
  };
};
