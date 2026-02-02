"use client";

import { useEffect, useState } from "react";

export type ViewMode = "beginner" | "latest";

const STORAGE_KEY = "homeTrialConfig";

export const useHomeTrialLogic = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("beginner");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.viewMode === "beginner" || parsed.viewMode === "latest") {
          setViewMode(parsed.viewMode);
        }
      }
    } catch (error) {
      console.error("Failed to load config", error);
    }
  }, []);

  const handleToggleView = (mode: ViewMode) => {
    setViewMode(mode);
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ viewMode: mode })
      );
    } catch (error) {
      console.error("Failed to save config", error);
    }
  };

  return {
    viewMode,
    handleToggleView,
  };
};
