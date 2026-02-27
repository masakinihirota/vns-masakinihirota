"use client";

import { useMemo, useState } from "react";

import { Matching } from "./matching";
import {
  CANDIDATE_POOL,
  CATEGORIES,
  filterCandidates,
  mergeTags,
  MY_PROFILES,
  UserProfile,
} from "./matching.logic";

export const MatchingContainer = () => {
  // 状態管理
  const [selectedProfileId, setSelectedProfileId] = useState(MY_PROFILES[0].id);
  const [profiles, setProfiles] = useState<UserProfile[]>(MY_PROFILES);
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
    () => profiles.find((p) => p.id === selectedProfileId),
    [profiles, selectedProfileId]
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
    setSelectedCategories((previous) =>
      previous.includes(id) ? previous.filter((c) => c !== id) : [...previous, id]
    );
  };

  const handleRestore = (user: UserProfile) => {
    setDriftedUsersPerProfile((previous) => ({
      ...previous,
      [selectedProfileId]: (previous[selectedProfileId] || []).filter(
        (u) => u.id !== user.id
      ),
    }));
    setWatchedUsersPerProfile((previous) => ({
      ...previous,
      [selectedProfileId]: [...(previous[selectedProfileId] || []), user],
    }));
  };

  const handleRemove = (user: UserProfile) => {
    setWatchedUsersPerProfile((previous) => ({
      ...previous,
      [selectedProfileId]: (previous[selectedProfileId] || []).filter(
        (u) => u.id !== user.id
      ),
    }));
    setDriftedUsersPerProfile((previous) => ({
      ...previous,
      [selectedProfileId]: [...(previous[selectedProfileId] || []), user],
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
        setWatchedUsersPerProfile((previous) => ({
          ...previous,
          [selectedProfileId]: [
            ...(previous[selectedProfileId] || []),
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
        setWatchedUsersPerProfile((previous) => ({
          ...previous,
          [selectedProfileId]: kept,
        }));
        setDriftedUsersPerProfile((previous) => ({
          ...previous,
          [selectedProfileId]: [
            ...(previous[selectedProfileId] || []),
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

  const handleMergeProfile = (candidate: UserProfile) => {
    if (!selectedProfile) return;
    const updated = mergeTags(selectedProfile, candidate);
    setProfiles((previous) =>
      previous.map((p) => (p.id === selectedProfileId ? updated : p))
    );
    console.log("Merged profile:", updated);
  };

  return (
    <Matching
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
      myProfiles={profiles}
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
      onMergeProfile={handleMergeProfile}
    />
  );
};
