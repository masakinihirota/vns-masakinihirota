"use client";

import { HomeTrial } from "./home-trial";
import { useHomeTrialLogic } from "./home-trial.logic";

export const HomeTrialContainer = () => {
  const { viewMode, handleToggleView, trialData, publicWorks } =
    useHomeTrialLogic();

  return (
    <HomeTrial
      viewMode={viewMode}
      onToggleView={handleToggleView}
      points={trialData?.points?.current}
      works={publicWorks}
    />
  );
};
