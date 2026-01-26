"use client";

import React from "react";

interface OnboardingNormalSidebarProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const OnboardingNormalSidebar: React.FC<
  OnboardingNormalSidebarProps
> = ({ currentStep, onStepClick }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg h-full sticky top-4">
      <h1 className="text-xl font-bold mb-8 text-slate-900 dark:text-white">
        アカウント作成
      </h1>

      <div className="space-y-6 relative">
        {/* Connection Line */}
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800 -z-10" />

        {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
          <button
            key={step}
            onClick={() => onStepClick(step)}
            className="flex items-center gap-4 w-full text-left group"
          >
            <div
              className={`
                                    w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all
                                    ${
                                      currentStep >= step
                                        ? "bg-indigo-600 text-white shadow-md ring-4 ring-indigo-50 dark:ring-indigo-900/30"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                                    }
                                `}
            >
              {step}
            </div>
            <span
              className={`
                                    text-sm font-medium transition-colors
                                    ${currentStep === step ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"}
                                `}
            >
              {step === 1 && "3つの誓い"}
              {step === 2 && "10の基本価値観"}
              {step === 3 && "居住地・文化圏"}
              {step === 4 && "活動時間"}
              {step === 5 && "アイデンティティ"}
              {step === 6 && "言語"}
              {step === 7 && "システム"}
              {step === 8 && "確認"}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
          すべてのステップを完了して、
          <br />
          アカウント設定を確定させてください。
        </p>
      </div>
    </div>
  );
};
