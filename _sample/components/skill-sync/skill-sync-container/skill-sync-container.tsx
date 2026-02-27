"use client";

import React, { useMemo, useState } from "react";

import { MANDALA_TEMPLATES } from "../constants";
import { CategorySkillSelector } from "../controls/category-skill-selector";
import { ViewModeSwitcher } from "../controls/view-mode-switcher";
import { MandalaChart } from "../mandala-chart/mandala-chart";
import { getMasteryCount } from "../mandala-chart/mandala-chart.logic";
import { CANDIDATES, MY_PROFILES } from "../sample-data";
import { ProfileSidebar } from "../sidebars/profile-sidebar";
import { TalentPoolSidebar } from "../sidebars/talent-pool-sidebar";
import { SyncHeader } from "../sync-header";
import { CategoryId, SortOrder, ViewMode } from "../types";

/**
 * スキル同期コンテナコンポーネント
 * アプリケーション全体のステート（誰、何、どう表示するか）を一元管理する
 */
export const SkillSyncContainer: React.FC = () => {
  // --- 状態管理 ---
  const [selectedMyId, setSelectedMyId] = useState(MY_PROFILES[0].id);
  const [selectedTargetId, setSelectedTargetId] = useState(CANDIDATES[0].id);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryId>("FRONTEND");
  const [focusedSkill, setFocusedSkill] = useState("React / Next.js");
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [lastLog, setLastLog] = useState("SKILL SYNC PROTOCOL ONLINE");

  // --- 派生データ ---
  const currentMe = useMemo(
    () => MY_PROFILES.find((p) => p.id === selectedMyId),
    [selectedMyId]
  );
  const currentTarget = useMemo(
    () => CANDIDATES.find((c) => c.id === selectedTargetId),
    [selectedTargetId]
  );

  // 候補者のソート処理
  const sortedCandidates = useMemo(() => {
    return [...CANDIDATES].sort((a, b) => {
      const countA = getMasteryCount(a, focusedSkill);
      const countB = getMasteryCount(b, focusedSkill);
      return sortOrder === "desc" ? countB - countA : countA - countB;
    });
  }, [focusedSkill, sortOrder]);

  // マンダラテンプレート
  const currentTemplate = MANDALA_TEMPLATES[focusedSkill];

  // --- イベントハンドラ ---
  const handleCategoryChange = (id: CategoryId) => {
    setSelectedCategory(id);
    setLastLog(`DOMAIN CHANGED: ${id}`);

    // カテゴリ変更時に該当カテゴリの最初のスキルを自動選択 (setState in effect を防止)
    const skills = Object.keys(MANDALA_TEMPLATES).filter(
      (s) => MANDALA_TEMPLATES[s].category === id
    );
    if (skills.length > 0 && !skills.includes(focusedSkill)) {
      setFocusedSkill(skills[0]);
    }
  };

  const handleSkillChange = (skill: string) => {
    setFocusedSkill(skill);
    setLastLog(`FOCUS SKILL: ${skill.toUpperCase()}`);
  };

  const handleModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setLastLog(`VIEW MODE: ${mode.toUpperCase()}`);
  };

  const toggleSort = () => {
    const nextOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(nextOrder);
    setLastLog(`SORT ORDER: ${nextOrder.toUpperCase()}`);
  };



  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* 左サイドバー: Identify */}
      <ProfileSidebar
        profiles={MY_PROFILES}
        selectedId={selectedMyId}
        onSelect={setSelectedMyId}
      />

      {/* メインエリア */}
      <main className="flex min-w-0 flex-1 flex-col">
        <SyncHeader
          target={currentTarget}
          masteryCount={
            currentTarget ? getMasteryCount(currentTarget, focusedSkill) : 0
          }
        />

        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-10">
          <div className="mx-auto flex max-w-5xl flex-col space-y-10">
            {/* コントロール群 */}
            <CategorySkillSelector
              selectedCategory={selectedCategory}
              focusedSkill={focusedSkill}
              onCategoryChange={handleCategoryChange}
              onSkillChange={handleSkillChange}
            />

            <ViewModeSwitcher
              currentMode={viewMode}
              onChange={handleModeChange}
            />

            {/* メインチャート */}
            <div className="pb-10">
              {currentTemplate && (
                <MandalaChart
                  skillTemplate={currentTemplate}
                  me={currentMe}
                  target={currentTarget}
                  viewMode={viewMode}
                />
              )}
            </div>

            {/* 凡例ガイドを表示する領域（オプション）をここに追加可能 */}
          </div>
        </div>
      </main>

      {/* 右サイドバー: Talent Pool */}
      <TalentPoolSidebar
        candidates={sortedCandidates}
        selectedId={selectedTargetId}
        focusedSkill={focusedSkill}
        sortOrder={sortOrder}
        lastLog={lastLog}
        onSelect={setSelectedTargetId}
        onToggleSort={toggleSort}
      />
    </div>
  );
};
