"use client";

import React, { useCallback, useMemo, useState } from 'react';
import { WorkProfileComparison } from './work-profile-comparison';
import {
  calculateSyncLevel,
  CANDIDATES,
  CategoryKey,
  generateComparisonData,
  MY_PROFILES,
  SortConfig,
  TemporalAxisKey,
  TierKey,
} from './work-profile-comparison.logic';

const WorkProfileComparisonContainer: React.FC = () => {
  // --- States ---
  const [selectedMyId, setSelectedMyId] = useState<string | number>(MY_PROFILES[0].id);
  const [selectedTargetId, setSelectedTargetId] = useState<string | number | null>(CANDIDATES[0].id);

  const [userInteractions, setUserInteractions] = useState<Record<string | number, { watched: boolean; followed: boolean }>>({});
  const [lastLog, setLastLog] = useState("SYSTEM READY");

  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'heat', direction: 'desc' });
  const [tierFilters, setTierFilters] = useState<Record<TierKey, boolean>>({
    T1: true, T2: true, T3: true, NORMAL: true, INTERESTLESS: true, UNRATED: true,
  });
  const [catFilters, setCatFilters] = useState<Record<CategoryKey, boolean>>({
    MANGA: true, MOVIE: true, OTHER: true,
  });
  const [temporalFilters, setTemporalFilters] = useState<Record<TemporalAxisKey, boolean>>({
    LIFE: true, PRESENT: true, FUTURE: true,
  });

  // --- Derived Data ---
  const currentMe = useMemo(() => MY_PROFILES.find(p => p.id === selectedMyId)!, [selectedMyId]);
  const currentTarget = useMemo(() => CANDIDATES.find(c => c.id === selectedTargetId) || null, [selectedTargetId]);

  const followedCandidates = useMemo(() => CANDIDATES.filter(c => userInteractions[c.id]?.followed), [userInteractions]);
  const watchedCandidates = useMemo(() => CANDIDATES.filter(c => userInteractions[c.id]?.watched && !userInteractions[c.id]?.followed), [userInteractions]);
  const queueCandidates = useMemo(() => CANDIDATES.filter(c => !userInteractions[c.id]?.followed && !userInteractions[c.id]?.watched), [userInteractions]);

  const syncLevel = useMemo(() => calculateSyncLevel(currentMe, currentTarget), [currentMe, currentTarget]);

  const comparisonData = useMemo(() => {
    return generateComparisonData(
      currentMe,
      currentTarget,
      { tier: tierFilters, category: catFilters, temporal: temporalFilters },
      sortConfig
    );
  }, [currentMe, currentTarget, tierFilters, catFilters, temporalFilters, sortConfig]);

  // --- Handlers ---
  const handleSelectMyProfile = useCallback((id: string | number) => {
    setSelectedMyId(id);
    const profile = MY_PROFILES.find(p => p.id === id);
    setLastLog(`PROFILE SWITCHED TO ${profile?.name}`);
  }, []);

  const handleSelectTarget = useCallback((id: string | number) => {
    setSelectedTargetId(prev => prev === id ? null : id);
    if (selectedTargetId !== id) {
      const candidate = CANDIDATES.find(c => c.id === id);
      setLastLog(`TARGET SELECTED: ${candidate?.name}`);
    } else {
      setLastLog("SOLO ENGINE MODE ACTIVE");
    }
  }, [selectedTargetId]);

  const handleToggleAction = useCallback((userId: string | number, actionType: 'followed' | 'watched') => {
    setUserInteractions(prev => {
      const current = prev[userId] || { watched: false, followed: false };
      const updatedValue = !current[actionType];
      const updated = { ...current, [actionType]: updatedValue };
      const userName = CANDIDATES.find(c => c.id === userId)?.name;
      setLastLog(`${actionType.toUpperCase()}: ${userName} -> ${updatedValue ? 'ON' : 'OFF'}`);
      return { ...prev, [userId]: updated };
    });
  }, []);

  const handleToggleTierFilter = useCallback((key: TierKey) => {
    setTierFilters(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleToggleCategoryFilter = useCallback((key: CategoryKey) => {
    setCatFilters(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleToggleTemporalFilter = useCallback((key: TemporalAxisKey) => {
    setTemporalFilters(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleToggleSort = useCallback((key: 'title' | 'heat') => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  }, []);

  return (
    <WorkProfileComparison
      currentMe={currentMe}
      currentTarget={currentTarget}
      selectedMyId={selectedMyId}
      selectedTargetId={selectedTargetId}
      followedCandidates={followedCandidates}
      watchedCandidates={watchedCandidates}
      queueCandidates={queueCandidates}
      comparisonData={comparisonData}
      syncLevel={syncLevel}
      lastLog={lastLog}
      filters={{ tier: tierFilters, category: catFilters, temporal: temporalFilters }}
      sortConfig={sortConfig}
      onSelectMyProfile={handleSelectMyProfile}
      onSelectTarget={handleSelectTarget}
      onToggleAction={handleToggleAction}
      onToggleTierFilter={handleToggleTierFilter}
      onToggleCategoryFilter={handleToggleCategoryFilter}
      onToggleTemporalFilter={handleToggleTemporalFilter}
      onToggleSort={handleToggleSort}
    />
  );
};

export { WorkProfileComparisonContainer };

