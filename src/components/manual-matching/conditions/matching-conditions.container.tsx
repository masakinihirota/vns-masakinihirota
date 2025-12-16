"use client";

import React, { useState } from "react";
import { MatchingConditions } from "./matching-conditions";
import {
  DEFAULT_SETTINGS,
  MatchingSettings,
  saveSettings,
  startAutoMatching,
} from "./matching-conditions.logic";
import { useRouter } from "next/navigation";

export const MatchingConditionsContainer = () => {
  const router = useRouter();
  const [settings, setSettings] = useState<MatchingSettings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // Handlers
  const handleValueImportanceChange = (id: string, value: number) => {
    setSettings((prev) => ({
      ...prev,
      valueImportance: { ...prev.valueImportance, [id]: value },
    }));
  };

  const handleGenreToggle = (genreId: string) => {
    setSettings((prev) => {
      const current = prev.selectedGenres;
      const next = current.includes(genreId)
        ? current.filter((g) => g !== genreId)
        : [...current, genreId];
      return { ...prev, selectedGenres: next };
    });
  };

  const handleLocationChange = (loc: string) => {
    setSettings((prev) => ({ ...prev, locationPreference: loc }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSettings(settings);
      // Show toast or notification (mocked for now with alert)
      window.alert("設定を保存しました");
    } catch (e) {
      console.error(e);
      window.alert("保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartMatching = async () => {
    setIsStarting(true);
    try {
      await startAutoMatching(settings);
      // Navigate to console or auto-matching page
      router.push("/manual-matching");
    } catch (e) {
      console.error(e);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <MatchingConditions
      settings={settings}
      isSaving={isSaving}
      isStarting={isStarting}
      onValueImportanceChange={handleValueImportanceChange}
      onGenreToggle={handleGenreToggle}
      onLocationChange={handleLocationChange}
      onSave={handleSave}
      onStartMatching={handleStartMatching}
    />
  );
};
