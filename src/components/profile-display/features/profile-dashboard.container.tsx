"use client";

import { useMemo } from "react";
import { ProfileDashboard } from "./profile-dashboard";
import { useProfileDashboard } from "./profile-dashboard.hook";
import { ThemeVars } from "./profile-dashboard.types";

/**
 * プロフィールダッシュボードのコンテナコンポーネント
 */
export const ProfileDashboardContainer = () => {
  const {
    data,
    isDarkMode,
    setIsDarkMode,
    isLikeMode,
    setIsLikeMode,
    filter,
    setFilter,
    visibleSections,
    toggleSection,
    worksSort,
    favsSort,
    handleSort,
    sortedWorks,
    filteredAndSortedFavs,
    handleAdd,
    updateCell,
    handleRatingChange,
    triggerDelete,
    confirmDelete,
    pendingDelete,
    setPendingDelete,
  } = useProfileDashboard();

  // テーマ変数の計算
  const themeVars: ThemeVars = useMemo(
    () =>
      isDarkMode
        ? {
            bg: "bg-[#0B0F1A]",
            text: "text-neutral-200",
            subText: "text-neutral-400",
            card: "bg-white/5 backdrop-blur-md border-white/10 shadow-2xl",
            accent: "text-indigo-400",
            btnPrimary:
              "bg-white/10 hover:bg-white/15 text-neutral-100 border-white/20",
            btnSecondary: "bg-indigo-600 hover:bg-indigo-700 text-white",
            rowHover: "hover:bg-white/[0.03]",
            headerBg: "bg-neutral-900/50",
            overlay: "bg-black/60",
          }
        : {
            bg: "bg-gradient-to-br from-white via-blue-50 to-purple-50",
            text: "text-gray-800",
            subText: "text-gray-600",
            card: "bg-white/40 backdrop-blur-md border-white/30 shadow-xl",
            accent: "text-blue-700",
            btnPrimary:
              "bg-white/40 hover:bg-white/60 text-blue-900 border-white/50",
            btnSecondary: "bg-blue-600 hover:bg-blue-700 text-white",
            rowHover: "hover:bg-blue-500/5",
            headerBg: "bg-white/20",
            overlay: "bg-white/20",
          },
    [isDarkMode]
  );

  return (
    <ProfileDashboard
      data={data}
      isDarkMode={isDarkMode}
      isLikeMode={isLikeMode}
      filter={filter}
      visibleSections={visibleSections}
      themeVars={themeVars}
      worksSort={worksSort}
      favsSort={favsSort}
      sortedWorks={sortedWorks}
      filteredAndSortedFavs={filteredAndSortedFavs}
      pendingDelete={pendingDelete as any}
      onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      onToggleLikeMode={() => setIsLikeMode(!isLikeMode)}
      onToggleFilter={(type) => setFilter((f) => ({ ...f, [type]: !f[type] }))}
      onToggleSection={toggleSection}
      onSort={handleSort}
      onUpdateCell={updateCell}
      onRatingChange={handleRatingChange}
      onAdd={handleAdd}
      onDeleteTrigger={triggerDelete}
      onDeleteConfirm={confirmDelete}
      onDeleteCancel={() => setPendingDelete(null)}
    />
  );
};
