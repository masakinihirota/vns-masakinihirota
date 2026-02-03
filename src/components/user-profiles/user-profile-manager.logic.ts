import { useEffect, useState } from "react";

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

const MOCK_PROFILES: Profile[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    displayName: "佐藤 健太",
    username: "kenta_dev",
    role: "リーダー",
    purpose: "仕事",
    type: "本人",
    avatar: null,
    deleted: false,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    displayName: "田中 美咲",
    username: "misaki_design",
    role: "メンバー",
    purpose: "仕事",
    type: "本人",
    avatar: null,
    deleted: false,
  },
  {
    id: "3",
    displayName: "鈴木 一郎",
    username: "ichiro_game",
    role: "メンバー",
    purpose: "遊び",
    type: "インタビュー",
    avatar: null,
    deleted: false,
  },
  {
    id: "4",
    displayName: "高橋 エリカ",
    username: "erika_match",
    role: "メンバー",
    purpose: "婚活",
    type: "他人視点",
    avatar: null,
    deleted: false,
  },
  {
    id: "5",
    displayName: "AI アシスタント",
    username: "ai_helper",
    role: "メンバー",
    purpose: "その他",
    type: "AI",
    avatar: null,
    deleted: false,
  },
  {
    id: "6",
    displayName: "渡辺 直人",
    username: "naoto_leader",
    role: "リーダー",
    purpose: "仕事",
    type: "架空",
    avatar: null,
    deleted: false,
  },
  {
    id: "7",
    displayName: "小林 さくら",
    username: "sakura_bloom",
    role: "メンバー",
    purpose: "遊び",
    type: "ペルソナ",
    avatar: null,
    deleted: false,
  },
];

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
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        setProfiles(MOCK_PROFILES);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProfiles();
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
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("このプロフィールをゴミ箱に移動しますか？")) return;

    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, deleted: true } : p))
    );
    if (activeProfileIds.includes(id)) {
      setActiveProfileIds((prev) => prev.filter((pid) => pid !== id));
    }
  };

  const handleRestore = (id: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, deleted: false } : p))
    );
  };

  const handlePermanentDelete = (id: string) => {
    if (
      window.confirm(
        "このプロフィールを完全に削除しますか？この操作は取り消せません。"
      )
    ) {
      setProfiles((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const toggleProfile = (id: string) => {
    if (viewMode === "trash") return;

    setActiveProfileIds((prev) => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        return prev.filter((pId) => pId !== id);
      } else {
        return [...prev, id];
      }
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
