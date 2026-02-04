"use client";

/**
 * スタートページ コンテナコンポーネント
 * ビューモードの状態管理を担当
 */

import { useCallback, useState } from "react";
import { TrialMigrationModal } from "@/components/home-trial/trial-migration-modal";
import { StartPage } from "./start-page";
import type { StartPageProps, ViewMode } from "./start-page.types";

export function StartPageContainer({
  initialViewMode = "beginner",
}: StartPageProps) {
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
