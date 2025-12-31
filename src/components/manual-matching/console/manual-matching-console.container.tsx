"use client";

import React, { useState, useEffect, useMemo } from "react";
import { UserProfile, MatchRecord } from "../common/types";
import { ManualMatchingConsole } from "./manual-matching-console";
import {
  fetchSubjects,
  fetchCandidates,
  calculateComparison,
} from "./manual-matching-console.logic";

export const ManualMatchingConsoleContainer = () => {
  // State: Data
  const [subjects, setSubjects] = useState<UserProfile[]>([]);
  const [candidates, setCandidates] = useState<UserProfile[]>([]);

  // State: Selection
  const [selectedSubject, setSelectedSubject] = useState<UserProfile | null>(
    null
  );
  const [selectedCandidate, setSelectedCandidate] =
    useState<UserProfile | null>(null);

  // State: UI
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [matchComment, setMatchComment] = useState("");
  const [isProcessingMatch, setIsProcessingMatch] = useState(false);

  // Fetch subjects on mount
  useEffect(() => {
    const load = async () => {
      setLoadingSubjects(true);
      fetchSubjects()
        .then((data) => setSubjects(data))
        .catch((e) => console.error(e))
        .finally(() => setLoadingSubjects(false));
    };
    void load();
  }, []);

  // Fetch candidates when subject selected
  useEffect(() => {
    if (!selectedSubject) {
      return;
    }

    const load = async () => {
      setLoadingCandidates(true);
      fetchCandidates(selectedSubject.gender)
        .then((data) => setCandidates(data))
        .catch((e) => console.error(e))
        .finally(() => setLoadingCandidates(false));
    };
    void load();
  }, [selectedSubject]);

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Comparison Logic
  const comparisonData = useMemo(() => {
    if (!selectedSubject || !selectedCandidate) return null;
    return calculateComparison(selectedSubject, selectedCandidate);
  }, [selectedSubject, selectedCandidate]);

  // Handlers
  const handleSubjectSelect = (user: UserProfile) => {
    setSelectedSubject(user);
    setCandidates([]);
    setSelectedCandidate(null);
  };

  const handleCandidateSelect = (user: UserProfile) => {
    setSelectedCandidate(user);
  };

  const handleToggleDarkMode = () => setDarkMode(!darkMode);

  const handleOpenMatchModal = () => setIsMatchModalOpen(true);
  const handleCloseMatchModal = () => setIsMatchModalOpen(false);

  const handleExecuteMatch = async () => {
    // Simulate API call
    setIsProcessingMatch(true);
    new Promise((resolve) => setTimeout(resolve, 1000))
      .then(() => {
        alert(
          `マッチング成功!\n${selectedSubject?.name} さんと ${selectedCandidate?.name} さんをマッチングしました。`
        );
        setIsMatchModalOpen(false);
        setMatchComment("");
      })
      .catch((e) => {
        console.error(e);
        alert("マッチングに失敗しました");
      })
      .finally(() => {
        setIsProcessingMatch(false);
      });
  };

  return (
    <ManualMatchingConsole
      subjects={subjects}
      candidates={candidates}
      selectedSubject={selectedSubject}
      selectedCandidate={selectedCandidate}
      loadingSubjects={loadingSubjects}
      loadingCandidates={loadingCandidates}
      comparisonData={comparisonData}
      darkMode={darkMode}
      isMatchModalOpen={isMatchModalOpen}
      matchComment={matchComment}
      isProcessingMatch={isProcessingMatch}
      onSubjectSelect={handleSubjectSelect}
      onCandidateSelect={handleCandidateSelect}
      onToggleDarkMode={handleToggleDarkMode}
      onOpenMatchModal={handleOpenMatchModal}
      onCloseMatchModal={handleCloseMatchModal}
      onExecuteMatch={handleExecuteMatch}
      onMatchCommentChange={setMatchComment}
    />
  );
};
