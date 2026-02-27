"use client";

import React from "react";
import { Concept } from "./concept";
import {
  CONCEPT_GHOST_TEXT,
  CONCEPT_NOTE,
  CONCEPT_PHASES,
  WORK_CHAINS
} from "./concept.logic";

/**
 * 価値観サイトコンセプト コンテナコンポーネント
 * ビジネスロジックからのデータを取得しUIに注入する
 */
export const ConceptContainer: React.FC = () => {
  return (
    <Concept
      phases={CONCEPT_PHASES}
      workChains={WORK_CHAINS}
      ghostText={CONCEPT_GHOST_TEXT}
      note={CONCEPT_NOTE}
    />
  );
};
