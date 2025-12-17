"use client";

import React, { useState, useEffect } from "react";
import { AutoMatching } from "./auto-matching";
import { calculateMatches, MatchingScore, SearchCriteria } from "./auto-matching.logic";

export const AutoMatchingContainer = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchingScore[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [criteria, setCriteria] = useState<SearchCriteria>({
    role: "Frontend Engineer",
    skills: [],
    location: "東京",
    min_salary: 600,
    remote: false,
  });

  const handleSearch = async () => {
    setLoading(true);
    await calculateMatches(criteria)
      .then((data) => setResults(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Initial fetch
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCriteriaChange = (
    key: keyof SearchCriteria,
    value: SearchCriteria[keyof SearchCriteria],
  ) => {
    setCriteria((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <AutoMatching
      criteria={criteria}
      results={results}
      loading={loading}
      darkMode={darkMode}
      onCriteriaChange={handleCriteriaChange}
      onSearch={handleSearch}
      onToggleDarkMode={handleToggleDarkMode}
    />
  );
};
