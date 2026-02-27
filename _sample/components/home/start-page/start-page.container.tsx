"use client";

/**
 * スタートページ コンテナコンポーネント
 * ビューモードの状態管理を担当
 */

import { useCallback, useState } from "react";

import { TrialMigrationModal } from "@/components/home-trial/trial-migration-modal";

import { StartPage } from "./start-page";
import type { StartPageProperties, ViewMode } from "./start-page.types";

/**
 *
 * @param root0
 * @param root0.initialViewMode
 */
export function StartPageContainer({
  initialViewMode = "beginner",
}: StartPageProperties) {
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  return (
    <>
      <StartPage viewMode={viewMode} onViewModeChange={handleViewModeChange} />
      <TrialMigrationModal />
    </>
  );
}
