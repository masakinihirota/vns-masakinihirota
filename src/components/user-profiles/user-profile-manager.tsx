"use client";

import {
  ArrowDown,
  ArrowUp,
  Bot,
  Briefcase,
  Contact,
  Edit2,
  Eye,
  Filter,
  Gamepad2,
  Ghost,
  Heart,
  HelpCircle,
  Loader2,
  Mic,
  Moon,
  Plus,
  Search,
  Shield,
  Sun,
  Trash2,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SortKey, useUserProfileManager } from "./user-profile-manager.logic";

// --- Helper Components & Styles ---

const badgeVariants: Record<string, string> = {
  default:
    "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900",
  secondary:
    "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50",
  outline:
    "text-slate-950 dark:text-slate-50 border-slate-200 dark:border-slate-800 border", // added border
  leader:
    "border-transparent bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  member:
    "border-transparent bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
};

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
  const {
    isDarkMode,
    setIsDarkMode,
    profiles,
    loading,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    sortConfig,
    handleSort,
    activeProfileIds,
    viewMode,
    setViewMode,
    isGhostActive,
    filteredProfiles,
    handleDelete,
    toggleProfile,
    setGhostActive,
    handleRestore,
    handlePermanentDelete,
  } = useUserProfileManager();

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    );
  };

  return (
    <div
      className={`min-h-screen bg-background text-foreground transition-colors duration-200 p-8`}
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
              aria-label="Toggle theme"
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
        <Card className="p-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full md:w-auto flex-1">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <Input
                  placeholder="表示名 または @username"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 w-full"
                />
              </div>

              <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-4">
                <Filter className="h-4 w-4 text-slate-500" />
                <select
                  className="bg-transparent text-sm font-medium focus:outline-none dark:text-slate-200 cursor-pointer"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  aria-label="Filter by role"
                >
                  <option
                    value="all"
                    className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50"
                  >
                    すべての役割
                  </option>
                  <option
                    value="リーダー"
                    className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50"
                  >
                    リーダー
                  </option>
                  <option
                    value="メンバー"
                    className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50"
                  >
                    メンバー
                  </option>
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
                  <div
                    onClick={() => toggleProfile(profile.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleProfile(profile.id);
                      }
                    }}
                    className={`
                                w-full text-left relative flex flex-col md:grid md:grid-cols-12 gap-4 items-center p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer
                                ${
                                  isActive
                                    ? "border-blue-500 bg-white dark:bg-slate-950 shadow-sm ring-1 ring-blue-500 z-10"
                                    : "border-transparent border-b-slate-200 dark:border-b-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                                }
                                ${viewMode === "trash" ? "opacity-70 cursor-default hover:bg-transparent hover:border-transparent" : ""}
                            `}
                    data-testid="profile-card"
                  >
                    {/* Checkbox-like indicator */}
                    <div className="absolute left-4 md:static md:col-span-4 flex items-center gap-3 overflow-hidden w-full">
                      <div
                        role="checkbox"
                        aria-checked={isActive}
                        aria-label={`Select ${profile.displayName}`}
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleProfile(profile.id);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleProfile(profile.id);
                          }
                        }}
                        className={`
                                    flex items-center justify-center h-5 w-5 rounded border transition-colors cursor-pointer
                                    ${isActive ? "bg-blue-500 border-blue-500 text-white" : "border-slate-300 bg-white dark:bg-slate-950 dark:border-slate-600"}
                                `}
                      >
                        {isActive && <Users className="h-3 w-3" />}
                      </div>

                      <Avatar className="h-8 w-8 bg-slate-100 dark:bg-slate-800">
                        {profile.avatar ? (
                          <AvatarImage
                            src={profile.avatar}
                            alt={profile.customName || profile.displayName}
                            data-testid="avatar-image"
                          />
                        ) : null}
                        <AvatarFallback>
                          {profile.displayName.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate flex items-center gap-1">
                          {profile.customName || profile.displayName}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {profile.customName
                            ? `@${profile.displayName}`
                            : `@${profile.username}`}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 w-full md:w-auto pl-12 md:pl-0">
                      <Badge
                        className={`text-[10px] py-0.5 rounded-full inline-flex items-center font-semibold ${
                          profile.role === "リーダー"
                            ? badgeVariants.leader
                            : badgeVariants.member
                        }`}
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
                            href={`/user-profiles/${profile.id}/card`}
                            onClick={(e) => e.stopPropagation()}
                            passHref
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-blue-600"
                              data-testid="button-card"
                              aria-label="Business Card"
                            >
                              <Contact className="h-4 w-4" />
                            </Button>
                          </Link>
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
                              aria-label="Edit Profile"
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
                            aria-label="Delete Profile"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRestore(profile.id)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            data-testid="button-restore"
                          >
                            復元
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePermanentDelete(profile.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            data-testid="button-permanent-delete"
                          >
                            削除
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
