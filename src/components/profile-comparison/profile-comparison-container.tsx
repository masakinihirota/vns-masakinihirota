"use client";

import React, { useMemo, useState } from "react";
import { CandidateManagement } from "./candidate-management/candidate-management";
import { ComparisonTable } from "./comparison-engine/comparison-table";
import {
  FilterConfig,
  Profile,
  SortConfig,
  UserInteraction,
  generateComparisonData,
} from "./comparison-engine/comparison.logic";
import { VisibilityControls } from "./comparison-engine/visibility-controls";
import { IdentityProfileList } from "./identity-selector/identity-profile-list";

// --- Mock Data (Based on Specification) ---
const MY_PROFILES: readonly Profile[] = [
  {
    id: "pm",
    name: "ケンジ (PM)",
    role: "IT PM / Rationalist",
    values: ["効率性", "論理的思考", "自律"],
    ratings: {
      ヒストリエ: "T1",
      "チ。―地球の運動について―": "T1",
      攻殻機動隊: "T1",
      マネーボール: "T1",
      ダンダダン: "T2",
      "プロジェクト・ヘイル・メアリー": "T1",
      "HUNTER×HUNTER": "T1",
    },
  },
  {
    id: "creator",
    name: "ケンジ (Creator)",
    role: "Indie Developer / Artist",
    values: ["創造性", "直感", "審美眼"],
    ratings: {
      "BLUE GIANT": "T1",
      攻殻機動隊: "T1",
      インセプション: "T1",
      ルックバック: "T1",
      ダンダダン: "T1",
    },
  },
];

const CANDIDATES: readonly Profile[] = [
  {
    id: 1,
    name: "佐藤 匠",
    role: "Full Stack Engineer",
    values: ["技術探求", "効率性", "オープンソース"],
    ratings: {
      ヒストリエ: "T1",
      攻殻機動隊: "T1",
      "チ。―地球の運動について―": "T2",
      "HUNTER×HUNTER": "T1",
      "プロジェクト・ヘイル・メアリー": "T1",
    },
  },
  {
    id: 2,
    name: "田中 美咲",
    role: "UI/UX Designer",
    values: ["美学", "論理的思考", "共感"],
    ratings: {
      ルックバック: "T1",
      "BLUE GIANT": "T1",
      ダンダダン: "T1",
      攻殻機動隊: "INTERESTLESS",
    },
  },
];

/**
 * プロフィール比較画面の全体を統括するコンテナコンポーネント。
 * ステート管理とロジックの注入を担当。
 */
export const ProfileComparisonContainer: React.FC = () => {
  // --- States ---
  const [selectedMyId, setSelectedMyId] = useState<string | number>(
    MY_PROFILES[0].id
  );
  const [selectedTargetId, setSelectedTargetId] = useState<
    string | number | null
  >(CANDIDATES[0].id);
  const [userInteractions, setUserInteractions] = useState<
    Record<string | number, UserInteraction>
  >({});

  const [filters, setFilters] = useState<FilterConfig>({
    tier: {
      T1: true,
      T2: true,
      T3: true,
      NORMAL: true,
      INTERESTLESS: true,
      UNRATED: true,
    },
    cat: { MANGA: true, MOVIE: true, OTHER: true },
    temporal: { LIFE: true, PRESENT: true, FUTURE: true },
  });

  const [sort] = useState<SortConfig>({
    key: "heat",
    direction: "desc",
  });

  // --- Derived Data ---
  const currentMe = useMemo(
    () => MY_PROFILES.find((p) => p.id === selectedMyId) ?? MY_PROFILES[0],
    [selectedMyId]
  );

  const currentTarget = useMemo(
    () => CANDIDATES.find((c) => c.id === selectedTargetId) ?? null,
    [selectedTargetId]
  );

  const comparisonData = useMemo(
    () => generateComparisonData(currentMe, currentTarget, sort, filters),
    [currentMe, currentTarget, sort, filters]
  );

  // --- Handlers ---
  const handleToggleAction = (
    id: string | number,
    type: keyof UserInteraction
  ) => {
    setUserInteractions((prev) => {
      const current = prev[id] || { watched: false, followed: false };
      return {
        ...prev,
        [id]: { ...current, [type]: !current[type] },
      };
    });
  };

  const handleSelectTarget = (id: string | number) => {
    setSelectedTargetId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 font-sans overflow-hidden">
      {/* 1. LEFT: Identity Switch */}
      <IdentityProfileList
        profiles={MY_PROFILES}
        selectedId={selectedMyId}
        onSelect={setSelectedMyId}
      />

      {/* 2. CENTER: Main Engine */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <VisibilityControls filters={filters} onChange={setFilters} />
        <ComparisonTable
          data={comparisonData}
          currentMe={currentMe}
          currentTarget={currentTarget}
        />

        {/* Simple Footer with sorting info */}
        <footer className="px-8 py-3 bg-white border-t border-slate-200 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <div>
            Sorted by: {sort.key} ({sort.direction})
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>System Ready</span>
          </div>
        </footer>
      </main>

      {/* 3. RIGHT: Candidate Queue */}
      <CandidateManagement
        candidates={CANDIDATES}
        interactions={userInteractions}
        selectedId={selectedTargetId}
        onSelect={handleSelectTarget}
        onToggleAction={handleToggleAction}
      />
    </div>
  );
};
