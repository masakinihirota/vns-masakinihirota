"use client";

import React from "react";
import { ManualMatching } from "./manual-matching";
import { useManualMatching } from "./manual-matching.logic";

export const ManualMatchingContainer = () => {
  const { candidates, currentUser, toggleWatch, toggleFollow } =
    useManualMatching();

  return (
    <ManualMatching
      currentUser={currentUser}
      candidates={candidates}
      onToggleWatch={toggleWatch}
      onToggleFollow={toggleFollow}
    />
  );
};
