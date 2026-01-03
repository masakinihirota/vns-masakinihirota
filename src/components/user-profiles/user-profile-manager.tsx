/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Search,
  Plus,
  Moon,
  Sun,
  Loader2,
  Filter,
  Users,
  Shield,
  Trash2,
  Edit2,
  XCircle,
  Briefcase,
  Gamepad2,
  Heart,
  HelpCircle,
  User,
  Mic,
  Eye,
  Bot,
  Ghost,
  // RotateCcw,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

type SortKey = "displayName" | "role" | "purpose" | "type";
import Link from "next/link";
import React, { useState, useEffect } from "react";

// --- Mock Data & Types ---

type Profile = {
  id: string;
  displayName: string;
  username: string;
  role: string;
  purpose: string;
  type: string;
  avatar: string | null;
  deleted?: boolean;
};

// データ構造を要件に合わせて変更
const MOCK_PROFILES = [
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

// --- Mock Supabase Client ---
// const supabase = {
//   from: (_table: string) => ({
//     select: async () => {
//       await new Promise((resolve) => setTimeout(resolve, 800));
//       return { data: MOCK_PROFILES, error: null };
//     },
//   }),
// };

// --- Reusable UI Components ---

const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  onClick,
  icon: Icon,
  disabled,
}: {
  children?: React.ReactNode;
  variant?: string;
  size?: string;
  className?: string;
  onClick?: (e?: any) => void;
  icon?: any;
  disabled?: boolean;
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    default:
      "bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
    outline:
      "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50",
    ghost:
      "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
    destructive:
      "bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90",
    secondary:
      "bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    icon: "h-10 w-10",
    xs: "h-8 px-2 text-xs",
  };

  return (
    <button
      className={`${baseStyles} ${(variants as any)[variant]} ${(sizes as any)[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && (
        <Icon className={`mr-2 h-4 w-4 ${size === "icon" ? "mr-0" : ""}`} />
      )}
      {children}
    </button>
  );
};

const Badge = ({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: string;
  className?: string;
}) => {
  const variants = {
    default:
      "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900",
    secondary:
      "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50",
    outline:
      "text-slate-950 dark:text-slate-50 border-slate-200 dark:border-slate-800",
    leader:
      "border-transparent bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    member:
      "border-transparent bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${(variants as any)[variant] || variants.default} ${className}`}
    >
      {children}
    </div>
  );
};

const Input = ({
  placeholder,
  value,
  onChange,
  className,
  icon: Icon,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (e: any) => void;
  className?: string;
  icon?: any;
}) => (
  <div className={`relative ${className}`}>
    {Icon && (
      <Icon className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
    )}
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 ${Icon ? "pl-9" : ""}`}
    />
  </div>
);

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 ${className}`}
  >
    {children}
  </div>
);

const Avatar = ({
  name,
  src,
  className = "",
}: {
  name: string;
  src?: string | null;
  className?: string;
}) => {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "?";
  return (
    <div
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-medium text-sm">
          {initials}
        </div>
      )}
    </div>
  );
};

// --- Helper Functions ---

const getPurposeIcon = (purpose: string) => {
  switch (purpose) {
    case "仕事":
      return <Briefcase className="w-4 h-4 mr-1 text-blue-500" />;
    case "遊び":
      return <Gamepad2 className="w-4 h-4 mr-1 text-green-500" />;
    case "婚活":
      return <Heart className="w-4 h-4 mr-1 text-pink-500" />;
    default:
      return <HelpCircle className="w-4 h-4 mr-1 text-slate-400" />;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "本人":
      return <User className="w-4 h-4 mr-1" />;
    case "インタビュー":
      return <Mic className="w-4 h-4 mr-1" />;
    case "他人視点":
      return <Eye className="w-4 h-4 mr-1" />;
    case "AI":
      return <Bot className="w-4 h-4 mr-1" />;
    default:
      return <User className="w-4 h-4 mr-1" />;
  }
};

// --- Main Application Component ---

export default function UserProfileManager() {
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

  // New State for Selection and View Mode
  const [activeProfileIds, setActiveProfileIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"active" | "trash">("active");

  // ゴースト状態：activeProfileIds が空のとき
  const isGhostActive = activeProfileIds.length === 0;

  // Dark Mode Toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Fetch Data
  const fetchProfiles = async () => {
    try {
      // 本来は Supabase から取得するが、モックデータで代用
      // const { data, error } = await supabase.from('profiles').select('*');
      // if (error) throw error;
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

  // Filter Logic
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

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    );
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("このプロフィールをゴミ箱に移動しますか？")) return;

    // Soft Delete (Move to Trash)
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, deleted: true } : p))
    );
    // If the deleted profile was active, deactivate it
    if (activeProfileIds.includes(id)) {
      setActiveProfileIds((prev) => prev.filter((pid) => pid !== id));
    }
  };

  const handleRestore = (id: string) => {
    // Restore from Trash
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

  const handleUpdate = (updatedProfile: Profile) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
    );
    setSelectedProfileForEdit(null);
  };

  const toggleProfile = (id: string) => {
    // ゴミ箱モードではトグル不可
    if (viewMode === "trash") return;

    setActiveProfileIds((prev) => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        // Remove id
        return prev.filter((pId) => pId !== id);
      } else {
        // Add id
        return [...prev, id];
      }
    });
  };

  const setGhostActive = () => {
    // ゴミ箱モードではゴースト操作不可
    if (viewMode === "trash") return;
    setActiveProfileIds([]);
  };

  return (
    <div
      className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-200 p-8`}
    >
      {/* Header Area */}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              ユーザープロフィール管理
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              使用するプロフィールを選択してください。何も選択しない場合は「ゴースト」として活動します。
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="rounded-full"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Link href="/user-profiles/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> 新規プロフィール
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters & Actions Bar */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full md:w-auto flex-1">
              <Input
                placeholder="表示名 または @username"
                icon={Search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80"
              />
              <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-4">
                <Filter className="h-4 w-4 text-slate-500" />
                <select
                  className="bg-transparent text-sm font-medium focus:outline-none dark:text-slate-200"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">すべての役割</option>
                  <option value="リーダー">リーダー</option>
                  <option value="メンバー">メンバー</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
              全 {profiles.length} 件中 {filteredProfiles.length} 件を表示
            </div>
          </div>
        </Card>

        {/* View Mode Tabs */}
        <div className="flex space-x-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800 w-fit">
          <button
            onClick={() => setViewMode("active")}
            data-testid="tab-active"
            className={`
                    flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-all
                    ${
                      viewMode === "active"
                        ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-100"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                    }
                `}
          >
            <Users className="mr-2 h-4 w-4" />
            一覧
          </button>
          <button
            onClick={() => setViewMode("trash")}
            data-testid="tab-trash"
            className={`
                    flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-all
                    ${
                      viewMode === "trash"
                        ? "bg-white text-red-600 shadow-sm dark:bg-slate-950 dark:text-red-500"
                        : "text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-500"
                    }
                `}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            ゴミ箱
          </button>
        </div>

        {/* Header Row (Mimics Table Header) */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => handleSort("displayName")}
            data-testid="header-displayName"
            className="col-span-4 flex items-center hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            基本情報 (名前/ID) {getSortIcon("displayName")}
          </button>
          <button
            onClick={() => handleSort("role")}
            data-testid="header-role"
            className="col-span-2 flex items-center hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            役割 {getSortIcon("role")}
          </button>
          <button
            onClick={() => handleSort("purpose")}
            data-testid="header-purpose"
            className="col-span-2 flex items-center hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            目的 {getSortIcon("purpose")}
          </button>
          <button
            onClick={() => handleSort("type")}
            data-testid="header-type"
            className="col-span-2 flex items-center hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            種類 {getSortIcon("type")}
          </button>
          <div className="col-span-2 text-right">アクション</div>
        </div>

        {/* Profiles List */}
        <div className="space-y-2 mt-2">
          {/* Ghost Row - ONLY SHOW IN ACTIVE MODE */}
          {viewMode === "active" && (
            <button
              onClick={setGhostActive}
              className={`
                    w-full text-left group flex flex-col md:grid md:grid-cols-12 gap-4 items-center p-4 rounded-lg border-2 transition-all duration-200
                    ${
                      isGhostActive
                        ? "border-slate-900 bg-slate-50 dark:border-slate-100 dark:bg-slate-900 shadow-sm ring-1 ring-slate-900 dark:ring-slate-100"
                        : "border-dashed border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900 opacity-60 hover:opacity-100"
                    }
                `}
              data-testid="ghost-card"
              aria-pressed={isGhostActive}
            >
              <div className="col-span-4 flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${isGhostActive ? "bg-slate-200 dark:bg-slate-800" : "bg-slate-100 dark:bg-slate-800"}`}
                >
                  <Ghost
                    className={`h-5 w-5 ${isGhostActive ? "text-slate-900 dark:text-slate-100" : "text-slate-500"}`}
                  />
                </div>
                <div>
                  <div className="font-bold text-sm">Ghost (匿名)</div>
                  <div className="text-xs text-slate-500">デフォルト状態</div>
                </div>
              </div>
              <div className="col-span-8 flex items-center text-xs text-slate-500">
                アクティブなプロフィールがない場合、自動的に選択されます。
                {isGhostActive && (
                  <span className="ml-2 font-bold text-slate-900 dark:text-slate-100">
                    ● Active
                  </span>
                )}
              </div>
            </button>
          )}

          {loading ? (
            <div className="flex h-32 items-center justify-center border rounded-lg border-slate-200 dark:border-slate-800 border-dashed">
              <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="p-8 text-center text-slate-500 border rounded-lg border-dashed">
              {viewMode === "active"
                ? "条件に一致するプロフィールが見つかりません。"
                : "ゴミ箱は空です。"}
            </div>
          ) : (
            filteredProfiles.map((profile) => {
              const isActive = activeProfileIds.includes(profile.id);
              return (
                <div key={profile.id} className="relative group">
                  <button
                    onClick={() => toggleProfile(profile.id)}
                    className={`
                                w-full text-left relative flex flex-col md:grid md:grid-cols-12 gap-4 items-center p-3 rounded-lg border-2 transition-all duration-200
                                ${
                                  isActive
                                    ? "border-blue-500 bg-white dark:bg-slate-950 shadow-sm ring-1 ring-blue-500 z-10"
                                    : "border-transparent border-b-slate-200 dark:border-b-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                                }
                                ${viewMode === "trash" ? "opacity-70 cursor-default hover:bg-transparent hover:border-transparent" : ""}
                            `}
                    data-testid="profile-card"
                    aria-pressed={isActive}
                    disabled={viewMode === "trash"}
                  >
                    {/* Checkbox-like indicator */}
                    <div className="absolute left-4 md:static md:col-span-4 flex items-center gap-3 overflow-hidden w-full">
                      <div
                        className={`
                                    flex items-center justify-center h-5 w-5 rounded border transition-colors
                                    ${isActive ? "bg-blue-500 border-blue-500 text-white" : "border-slate-300 bg-white dark:bg-slate-950 dark:border-slate-600"}
                                `}
                      >
                        {isActive && <Users className="h-3 w-3" />}
                      </div>

                      <Avatar
                        name={profile.displayName}
                        src={profile.avatar}
                        className="h-8 w-8"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">
                          {profile.displayName}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          @{profile.username}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 w-full md:w-auto pl-12 md:pl-0">
                      <Badge
                        variant={
                          profile.role === "リーダー" ? "leader" : "member"
                        }
                        className="text-[10px] py-0.5"
                      >
                        {profile.role === "リーダー" ? (
                          <Shield className="w-3 h-3 mr-1" />
                        ) : (
                          <Users className="w-3 h-3 mr-1" />
                        )}
                        {profile.role}
                      </Badge>
                    </div>

                    <div className="col-span-2 w-full md:w-auto pl-12 md:pl-0 flex items-center text-sm text-slate-600 dark:text-slate-400">
                      {getPurposeIcon(profile.purpose)}
                      {profile.purpose}
                    </div>

                    <div className="col-span-2 w-full md:w-auto pl-12 md:pl-0">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {getTypeIcon(profile.type)}
                        {profile.type}
                      </span>
                    </div>

                    <div
                      className="col-span-2 w-full flex justify-end gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {viewMode === "active" ? (
                        <>
                          <Link
                            href={`/user-profiles/${profile.id}/edit`}
                            onClick={(e) => e.stopPropagation()}
                            passHref
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-blue-600"
                              data-testid="button-edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-red-600"
                            onClick={(e) => {
                              e?.stopPropagation();
                              handleDelete(profile.id);
                            }}
                            data-testid="button-delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={(e) => {
                              e?.stopPropagation();
                              handleRestore(profile.id);
                            }}
                            data-testid="button-restore"
                          >
                            復元
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => {
                              e?.stopPropagation();
                              handlePermanentDelete(profile.id);
                            }}
                            data-testid="button-permanent-delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Edit Modal (Reuse logic but updated state variable name) */}
      {selectedProfileForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg shadow-xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">プロフィール編集</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedProfileForEdit(null)}
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <Avatar
                  name={selectedProfileForEdit.displayName}
                  className="h-16 w-16 text-xl"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-slate-500 mb-1">
                    アバター設定
                  </h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="xs">
                      画像をアップロード
                    </Button>
                    <Button variant="ghost" size="xs">
                      SVG生成
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* 1. 基本情報 */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-500 border-b pb-2">
                    基本情報
                  </h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        表示名 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={selectedProfileForEdit.displayName}
                        onChange={(e) =>
                          setSelectedProfileForEdit({
                            ...selectedProfileForEdit,
                            displayName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        ID (@username) <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center">
                        <span className="bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-800 rounded-l-md px-3 py-2 text-sm text-slate-500">
                          @
                        </span>
                        <input
                          type="text"
                          value={selectedProfileForEdit.username}
                          onChange={(e) =>
                            setSelectedProfileForEdit({
                              ...selectedProfileForEdit,
                              username: e.target.value,
                            })
                          }
                          className="flex h-10 w-full rounded-r-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:focus-visible:ring-slate-300"
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        半角英数字のみ使用可能です。
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. 属性設定 */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-500 border-b pb-2">
                    属性設定
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        役割 <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
                        value={selectedProfileForEdit.role}
                        onChange={(e) =>
                          setSelectedProfileForEdit({
                            ...selectedProfileForEdit,
                            role: e.target.value,
                          })
                        }
                      >
                        <option value="リーダー">リーダー</option>
                        <option value="メンバー">メンバー</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        目的 <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
                        value={selectedProfileForEdit.purpose}
                        onChange={(e) =>
                          setSelectedProfileForEdit({
                            ...selectedProfileForEdit,
                            purpose: e.target.value,
                          })
                        }
                      >
                        <option value="仕事">仕事</option>
                        <option value="遊び">遊び</option>
                        <option value="婚活">婚活</option>
                        <option value="その他">その他</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      種類 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["本人", "インタビュー", "他人視点", "AI", "架空"].map(
                        (type) => (
                          <label
                            key={type}
                            className={`
                           flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer text-sm transition-all
                           ${
                             selectedProfileForEdit.type === type
                               ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                               : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                           }
                         `}
                          >
                            <input
                              type="radio"
                              name="profileType"
                              value={type}
                              checked={selectedProfileForEdit.type === type}
                              onChange={(e) =>
                                setSelectedProfileForEdit({
                                  ...selectedProfileForEdit,
                                  type: e.target.value,
                                })
                              }
                              className="sr-only"
                            />
                            {type}
                          </label>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  onClick={() => setSelectedProfileForEdit(null)}
                >
                  キャンセル
                </Button>
                <Button onClick={() => handleUpdate(selectedProfileForEdit)}>
                  保存して閉じる
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
