"use client";

import { useState, useMemo } from "react";
import { AutoMatching } from "./auto-matching";
import {
  MY_PROFILES,
  CANDIDATE_POOL,
  filterCandidates,
  CATEGORIES,
  UserProfile,
} from "./auto-matching.logic";

export const AutoMatchingContainer = () => {
  // 状態管理
  const [selectedProfileId, setSelectedProfileId] = useState(MY_PROFILES[0].id);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    CATEGORIES.map((c) => c.id)
  );

  // マッチング基準: 'count' (人数) | 'score' (スコア)
  const [matchCriterion, setMatchCriterion] = useState<"count" | "score">(
    "count"
  );
  const [processLimit, setProcessLimit] = useState(3); // 人数指定用
  const [scoreThreshold, setScoreThreshold] = useState(2); // スコア指定用

  const [watchedUsersPerProfile, setWatchedUsersPerProfile] = useState<
    Record<string, UserProfile[]>
  >({});
  const [driftedUsersPerProfile, setDriftedUsersPerProfile] = useState<
    Record<string, UserProfile[]>
  >({});
  const [lastMatchStats, setLastMatchStats] = useState({
    added: 0,
    removed: 0,
  });

  // view: 'setup' | 'matching' | 'result' | 'detail'
  const [view, setView] = useState<"setup" | "matching" | "result" | "detail">(
    "setup"
  );
  const [previousView, setPreviousView] = useState<
    "setup" | "matching" | "result" | "detail"
  >("setup"); // 詳細から戻る用

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [rightSidebarTab, setRightSidebarTab] = useState<"watch" | "drift">(
    "watch"
  );

  const [viewingUser, setViewingUser] = useState<UserProfile | null>(null);
  const [matchMode, setMatchMode] = useState<"expand" | "refine">("expand");

  // 計算値
  const selectedProfile = useMemo(
    () => MY_PROFILES.find((p) => p.id === selectedProfileId),
    [selectedProfileId]
  );

  const currentWatchList = useMemo(
    () => watchedUsersPerProfile[selectedProfileId] || [],
    [watchedUsersPerProfile, selectedProfileId]
  );

  const currentDriftList = useMemo(
    () => driftedUsersPerProfile[selectedProfileId] || [],
    [driftedUsersPerProfile, selectedProfileId]
  );

  // 関数定義
  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleRestore = (user: UserProfile) => {
    setDriftedUsersPerProfile((prev) => ({
      ...prev,
      [selectedProfileId]: (prev[selectedProfileId] || []).filter(
        (u) => u.id !== user.id
      ),
    }));
    setWatchedUsersPerProfile((prev) => ({
      ...prev,
      [selectedProfileId]: [...(prev[selectedProfileId] || []), user],
    }));
  };

  const handleRemove = (user: UserProfile) => {
    setWatchedUsersPerProfile((prev) => ({
      ...prev,
      [selectedProfileId]: (prev[selectedProfileId] || []).filter(
        (u) => u.id !== user.id
      ),
    }));
    setDriftedUsersPerProfile((prev) => ({
      ...prev,
      [selectedProfileId]: [...(prev[selectedProfileId] || []), user],
    }));
  };

  const runMatching = () => {
    if (!selectedProfile) return;
    // setIsMatching(true);
    setView("matching");

    setTimeout(() => {
      const result = filterCandidates(
        CANDIDATE_POOL,
        currentWatchList,
        selectedProfile,
        selectedCategories,
        matchMode,
        matchCriterion,
        processLimit,
        scoreThreshold
      );

      if (matchMode === "expand") {
        const { addedUsers } = result as {
          addedUsers: UserProfile[];
          removedUsers: UserProfile[];
        };
        setWatchedUsersPerProfile((prev) => ({
          ...prev,
          [selectedProfileId]: [
            ...(prev[selectedProfileId] || []),
            ...addedUsers,
          ],
        }));
        // removedUsers is empty for expand
        setLastMatchStats({ added: addedUsers.length, removed: 0 });
      } else {
        const { removedUsers, kept } = result as {
          addedUsers: UserProfile[];
          removedUsers: UserProfile[];
          kept: UserProfile[];
        };
        setWatchedUsersPerProfile((prev) => ({
          ...prev,
          [selectedProfileId]: kept,
        }));
        setDriftedUsersPerProfile((prev) => ({
          ...prev,
          [selectedProfileId]: [
            ...(prev[selectedProfileId] || []),
            ...removedUsers,
          ],
        }));
        setLastMatchStats({ added: 0, removed: removedUsers.length });
      }

      // setIsMatching(false);
      setView("result");
    }, 1500);
  };

  const handleProfileSwitch = (id: string) => {
    setSelectedProfileId(id);
    setView("setup");
    setProcessLimit(3);
    setScoreThreshold(2);
  };

  // ユーザー詳細を表示（メインエリア切り替え）
  const handleViewUser = (user: UserProfile) => {
    if (view !== "detail") {
      setPreviousView(view);
    }
    setViewingUser(user);
    setView("detail");
  };

  // 詳細を閉じる
  const handleCloseUserDetail = () => {
    setView(previousView);
  };

  // Restore and go back
  const handleRestoreAndClose = (user: UserProfile) => {
    handleRestore(user);
    setView(previousView);
  };

  // Remove and go back
  const handleRemoveAndClose = (user: UserProfile) => {
    handleRemove(user);
    setView(previousView);
  };

  return (
    <AutoMatching
      selectedProfileId={selectedProfileId}
      selectedCategories={selectedCategories}
      matchCriterion={matchCriterion}
      processLimit={processLimit}
      scoreThreshold={scoreThreshold}
      view={view}
      matchMode={matchMode}
      lastMatchStats={lastMatchStats}
      viewingUser={viewingUser}
      isSidebarCollapsed={isSidebarCollapsed}
      isRightSidebarCollapsed={isRightSidebarCollapsed}
      rightSidebarTab={rightSidebarTab}
      myProfiles={MY_PROFILES}
      selectedProfile={selectedProfile}
      currentWatchList={currentWatchList}
      currentDriftList={currentDriftList}
      onProfileSwitch={handleProfileSwitch}
      onToggleCategory={toggleCategory}
      onSetSelectedCategories={setSelectedCategories}
      onSetMatchCriterion={setMatchCriterion}
      onSetProcessLimit={setProcessLimit}
      onSetScoreThreshold={setScoreThreshold}
      onSetMatchMode={setMatchMode}
      onRunMatching={runMatching}
      onSetView={setView}
      onViewUser={handleViewUser}
      onCloseUserDetail={handleCloseUserDetail}
      onRestoreUser={handleRestoreAndClose}
      onRemoveUser={handleRemoveAndClose}
      onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      onToggleRightSidebar={() =>
        setIsRightSidebarCollapsed(!isRightSidebarCollapsed)
      }
      onSetRightSidebarTab={setRightSidebarTab}
    />
  );
};
