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
} from "lucide-react";
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
};

// データ構造を要件に合わせて変更
const MOCK_PROFILES = [
  {
    id: "1",
    displayName: "佐藤 健太",
    username: "kenta_dev",
    role: "リーダー",
    purpose: "仕事",
    type: "本人",
    avatar: null,
  },
  {
    id: "2",
    displayName: "田中 美咲",
    username: "misaki_design",
    role: "メンバー",
    purpose: "仕事",
    type: "本人",
    avatar: null,
  },
  {
    id: "3",
    displayName: "鈴木 一郎",
    username: "ichiro_game",
    role: "メンバー",
    purpose: "遊び",
    type: "インタビュー",
    avatar: null,
  },
  {
    id: "4",
    displayName: "高橋 エリカ",
    username: "erika_match",
    role: "メンバー",
    purpose: "婚活",
    type: "他人視点",
    avatar: null,
  },
  {
    id: "5",
    displayName: "AI アシスタント",
    username: "ai_helper",
    role: "メンバー",
    purpose: "その他",
    type: "AI",
    avatar: null,
  },
  {
    id: "6",
    displayName: "渡辺 直人",
    username: "naoto_leader",
    role: "リーダー",
    purpose: "仕事",
    type: "架空",
    avatar: null,
  },
  {
    id: "7",
    displayName: "小林 さくら",
    username: "sakura_bloom",
    role: "メンバー",
    purpose: "遊び",
    type: "本人",
    avatar: null,
  },
];

// --- Mock Supabase Client ---
const supabase = {
  from: (_table: string) => ({
    select: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { data: MOCK_PROFILES, error: null };
    },
  }),
};

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
  onClick?: () => void;
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
      return <Briefcase className="h-4 w-4 mr-2 text-slate-500" />;
    case "遊び":
      return <Gamepad2 className="h-4 w-4 mr-2 text-rose-500" />;
    case "婚活":
      return <Heart className="h-4 w-4 mr-2 text-pink-500" />;
    default:
      return <HelpCircle className="h-4 w-4 mr-2 text-slate-400" />;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "本人":
      return <User className="h-4 w-4 mr-1 text-blue-500" />;
    case "インタビュー":
      return <Mic className="h-4 w-4 mr-1 text-orange-500" />;
    case "他人視点":
      return <Eye className="h-4 w-4 mr-1 text-green-500" />;
    case "AI":
      return <Bot className="h-4 w-4 mr-1 text-purple-500" />;
    case "架空":
      return <Ghost className="h-4 w-4 mr-1 text-slate-500" />;
    default:
      return null;
  }
};

// --- Main Application Component ---

export default function UserProfileManager() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

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
    setLoading(true);
    try {
      const { data, error } = await supabase.from("profiles").select();
      if (error) throw error;
      setProfiles(data);
    } catch (err) {
      console.error("Error fetching profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProfiles();
  }, []);

  // Filter Logic
  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch =
      profile.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || profile.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDelete = (id: string) => {
    if (confirm("本当にこのプロフィールを削除しますか？")) {
      setProfiles(profiles.filter((p) => p.id !== id));
    }
  };

  const handleUpdate = (updatedProfile: Profile) => {
    setProfiles(
      profiles.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
    );
    setSelectedProfile(null);
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
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> 新規プロフィール
            </Button>
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

        {/* Data Table */}
        <Card className="overflow-hidden">
          <div className="relative w-full overflow-auto">
            {loading ? (
              <div className="flex h-64 w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
              </div>
            ) : (
              <table className="w-full caption-bottom text-sm text-left">
                <thead className="[&_tr]:border-b [&_tr]:border-slate-200 dark:[&_tr]:border-slate-800">
                  <tr className="border-b transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-800/50">
                    <th className="h-12 px-4 align-middle font-medium text-slate-500 dark:text-slate-400 w-[50px]"></th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-500 dark:text-slate-400">
                      基本情報 (名前/ID)
                    </th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-500 dark:text-slate-400">
                      役割
                    </th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-500 dark:text-slate-400">
                      目的
                    </th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-500 dark:text-slate-400">
                      種類
                    </th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-500 dark:text-slate-400 text-right">
                      アクション
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {filteredProfiles.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="h-24 text-center text-slate-500"
                      >
                        プロフィールが見つかりませんでした。
                      </td>
                    </tr>
                  ) : (
                    filteredProfiles.map((profile) => (
                      <tr
                        key={profile.id}
                        className="border-b border-slate-200 dark:border-slate-800 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50"
                      >
                        <td className="p-4 align-middle">
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 dark:border-slate-700"
                          />
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-3">
                            <Avatar
                              name={profile.displayName}
                              src={profile.avatar}
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-900 dark:text-slate-100">
                                {profile.displayName}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                @{profile.username}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <Badge
                            variant={
                              profile.role === "リーダー" ? "leader" : "member"
                            }
                          >
                            {profile.role === "リーダー" && (
                              <Shield className="w-3 h-3 mr-1" />
                            )}
                            {profile.role === "メンバー" && (
                              <Users className="w-3 h-3 mr-1" />
                            )}
                            {profile.role}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center text-slate-700 dark:text-slate-300">
                            {getPurposeIcon(profile.purpose)}
                            {profile.purpose}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 w-fit text-xs font-medium">
                            {getTypeIcon(profile.type)}
                            {profile.type}
                          </div>
                        </td>
                        <td className="p-4 align-middle text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedProfile(profile)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600 dark:hover:text-red-400"
                              onClick={() => handleDelete(profile.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>

      {/* Edit Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg shadow-xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">プロフィール編集</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedProfile(null)}
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <Avatar
                  name={selectedProfile.displayName}
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
                        value={selectedProfile.displayName}
                        onChange={(e) =>
                          setSelectedProfile({
                            ...selectedProfile,
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
                          value={selectedProfile.username}
                          onChange={(e) =>
                            setSelectedProfile({
                              ...selectedProfile,
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
                        value={selectedProfile.role}
                        onChange={(e) =>
                          setSelectedProfile({
                            ...selectedProfile,
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
                        value={selectedProfile.purpose}
                        onChange={(e) =>
                          setSelectedProfile({
                            ...selectedProfile,
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
                           ${selectedProfile.type === type
                                ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                                : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                              }
                         `}
                          >
                            <input
                              type="radio"
                              name="profileType"
                              value={type}
                              checked={selectedProfile.type === type}
                              onChange={(e) =>
                                setSelectedProfile({
                                  ...selectedProfile,
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
                  onClick={() => setSelectedProfile(null)}
                >
                  キャンセル
                </Button>
                <Button onClick={() => handleUpdate(selectedProfile)}>
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
