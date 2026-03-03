"use client";

import { useCallback, useEffect, useState } from 'react';
import { generateUniqueCandidates } from '../../../lib/anonymous-name-generator';
import { TrialStorage } from '../../../lib/trial-storage';

export type OnboardingView = 'zodiac' | 'generate' | 'confirm' | 'experience';

export const STORAGE_KEYS = {
  CONFIRMED_NAME: 'onboarding_confirmed_name',
  SELECTED_ZODIAC: 'onboarding_selected_zodiac',
} as const;

export function useOnboardingLogic() {
  const [view, setView] = useState<OnboardingView>('zodiac');
  const [selectedZodiac, setSelectedZodiac] = useState<string | null>(null);
  const [history, setHistory] = useState<string[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tempSelectedName, setTempSelectedName] = useState<string | null>(null);
  const [confirmedName, setConfirmedName] = useState<string | null>(null);

  // 初期読み込み (localStorage)
  useEffect(() => {
    const savedName = localStorage.getItem(STORAGE_KEYS.CONFIRMED_NAME);
    const savedZodiac = localStorage.getItem(STORAGE_KEYS.SELECTED_ZODIAC);
    if (savedName && savedZodiac) {
      setConfirmedName(savedName);
      setSelectedZodiac(savedZodiac);
      setView('experience');
    }
  }, []);

  const handleSelectZodiac = useCallback((zodiac: string) => {
    setSelectedZodiac(zodiac);
    const initialTrio = generateUniqueCandidates(zodiac, 3);
    setHistory([initialTrio]);
    setHistoryIndex(0);
    setTempSelectedName(null);
    setView('generate');
  }, []);

  const handleNextCandidate = useCallback(() => {
    if (!selectedZodiac) return;
    const nextTrio = generateUniqueCandidates(selectedZodiac, 3, history.flat());
    const newHistory = [...history.slice(0, historyIndex + 1), nextTrio];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setTempSelectedName(null);
  }, [selectedZodiac, history, historyIndex]);

  const handleGoBack = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setTempSelectedName(null);
    }
  }, [historyIndex]);

  const goToConfirm = useCallback(() => {
    if (tempSelectedName) {
      setView('confirm');
    }
  }, [tempSelectedName]);

  const handleFinalConfirm = useCallback(() => {
    if (tempSelectedName && selectedZodiac) {
      setConfirmedName(tempSelectedName);

      // TrialStorage との統合
      try {
        const trialData = TrialStorage.init();
        trialData.rootAccount = {
          display_id: tempSelectedName,
          display_name: tempSelectedName,
          activity_area_id: null,
          core_activity_start: '09:00',
          core_activity_end: '18:00',
          holidayActivityStart: '10:00',
          holidayActivityEnd: '19:00',
          uses_ai_translation: false,
          nativeLanguages: ['ja'],
          agreed_oasis: true,
          zodiac_sign: selectedZodiac,
          birth_generation: '平成',
          week_schedule: {
            mon: 'work',
            tue: 'work',
            wed: 'work',
            thu: 'work',
            fri: 'work',
            sat: 'leisure',
            sun: 'leisure',
          },
          created_at: new Date().toISOString(),
        };
        TrialStorage.save(trialData);

        // 既存の互換性のための保存
        localStorage.setItem(STORAGE_KEYS.CONFIRMED_NAME, tempSelectedName);
        localStorage.setItem(STORAGE_KEYS.SELECTED_ZODIAC, selectedZodiac);

        setView('experience');
      } catch (error) {
        console.error('Failed to save trial onboarding data:', error);
      }
    }
  }, [tempSelectedName, selectedZodiac]);

  const reset = useCallback(() => {
    setSelectedZodiac(null);
    setHistory([]);
    setHistoryIndex(-1);
    setTempSelectedName(null);
    setConfirmedName(null);
    localStorage.removeItem(STORAGE_KEYS.CONFIRMED_NAME);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_ZODIAC);
    setView('zodiac');
  }, []);

  const currentTrio = history[historyIndex] || [];

  return {
    view,
    setView,
    selectedZodiac,
    currentTrio,
    history,
    historyIndex,
    tempSelectedName,
    setTempSelectedName,
    confirmedName,
    handleSelectZodiac,
    handleNextCandidate,
    handleGoBack,
    goToConfirm,
    handleFinalConfirm,
    reset,
  };
}
