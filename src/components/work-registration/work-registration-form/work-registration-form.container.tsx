"use client";

import { useCallback, useEffect, useState } from "react";
import { WorkRegistrationForm } from "./work-registration-form";
import type {
  AiDraftData,
  WorkCategory,
  WorkFormData,
} from "./work-registration-form.logic";
import {
  WORK_CATEGORY,
  getAiMockResult,
} from "./work-registration-form.logic";

export const WorkRegistrationFormContainer = () => {
  // 基本状態
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [activeCategory, setActiveCategory] = useState<WorkCategory>(
    WORK_CATEGORY.ANIME
  );
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAiDiff, setShowAiDiff] = useState(false);
  const [aiDraft, setAiDraft] = useState<AiDraftData | null>(null);

  // フォーム状態
  const [formData, setFormData] = useState<WorkFormData>({
    title: "",
    creator: "",
    releaseYear: new Date().getFullYear().toString(),
    officialUrl: "",
    affiliateUrl: "",
    length: "1日",
    isPurchasable: true,
    tags: "",
    synopsis: "",
  });

  // Chrome拡張機能連携シミュレーション
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasApiKey(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // ハンドラー
  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;

      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    },
    []
  );

  const handleRunAiAutocomplete = useCallback(async () => {
    if (!formData.title) return;
    setIsAiProcessing(true);

    // AI処理シミュレーション (2秒)
    setTimeout(() => {
      const result = getAiMockResult(activeCategory);
      setAiDraft(result);
      setShowAiDiff(true);
      setIsAiProcessing(false);
    }, 2000);
  }, [formData.title, activeCategory]);

  const handleApplyAiResult = useCallback(() => {
    if (!aiDraft) return;
    setFormData((prev) => ({ ...prev, ...aiDraft }));
    setShowAiDiff(false);
    setAiDraft(null);
  }, [aiDraft]);

  const handleSetLength = useCallback((length: string) => {
    setFormData((prev) => ({ ...prev, length: length as any }));
  }, []);

  const handleTogglePurchasable = useCallback(() => {
    setFormData((prev) => ({ ...prev, isPurchasable: !prev.isPurchasable }));
  }, []);

  return (
    <WorkRegistrationForm
      formData={formData}
      activeCategory={activeCategory}
      isDark={theme === "dark"}
      hasApiKey={hasApiKey}
      isAiProcessing={isAiProcessing}
      showAiDiff={showAiDiff}
      showDeleteConfirm={showDeleteConfirm}
      aiDraft={aiDraft}
      onInputChange={handleInputChange}
      onCategoryChange={setActiveCategory}
      onToggleTheme={handleToggleTheme}
      onRunAiAutocomplete={handleRunAiAutocomplete}
      onApplyAiResult={handleApplyAiResult}
      onSetShowAiDiff={setShowAiDiff}
      onSetShowDeleteConfirm={setShowDeleteConfirm}
      onSetLength={handleSetLength}
      onTogglePurchasable={handleTogglePurchasable}
    />
  );
};
