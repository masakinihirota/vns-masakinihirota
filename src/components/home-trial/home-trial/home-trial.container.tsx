"use client";

import { HomeTrial } from "./home-trial";
import { useHomeTrialLogic } from "./home-trial.logic";

export const HomeTrialContainer = () => {
  const { viewMode, handleToggleView } = useHomeTrialLogic();

  return <HomeTrial viewMode={viewMode} onToggleView={handleToggleView} />;
};
