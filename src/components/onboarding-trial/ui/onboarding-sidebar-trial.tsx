"use client";

import Image from "next/image";
import React from "react";

interface OnboardingSidebarTrialProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const OnboardingSidebarTrial: React.FC<OnboardingSidebarTrialProps> = ({
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg h-full sticky top-4">
      <h1 className="text-xl font-bold mb-8 text-slate-900 dark:text-white">
        お試しアカウント
        <br />
        <span className="text-sm font-normal text-slate-500">
          簡易セットアップ
        </span>
      </h1>

      <div className="space-y-6 relative">
        {/* Connection Line */}
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800 -z-10" />

        {[1, 2, 3, 4, 5, 6].map((step) => (
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
              {step === 1 && "オアシス宣言"}
              {step === 2 && "居住地・文化圏"}
              {step === 3 && "活動時間"}
              {step === 4 && "アイデンティティ"}
              {step === 5 && "言語"}
              {step === 6 && "確認"}
            </span>
          </button>
        ))}
      </div>

      {/* Guide Character */}
      <div className="hidden md:block mt-8 border-t border-slate-100 dark:border-slate-800 pt-6 text-center">
        <div className="relative w-28 h-28 mx-auto mb-4">
          <Image
            src="/images/characters/schrodinger-guide.png"
            alt="シュレディンガーちゃん"
            fill
            className="object-contain drop-shadow-lg scale-110"
          />
        </div>
        <div className="text-center text-xs font-bold text-slate-600 dark:text-slate-300 mb-3">
          シュレディンガーちゃん
        </div>
        <div className="bg-indigo-50 dark:bg-slate-800 p-3 rounded-xl text-xs text-indigo-900 dark:text-indigo-200 relative border border-indigo-100 dark:border-slate-700">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-50 dark:bg-slate-800 rotate-45 border-l border-t border-indigo-100 dark:border-slate-700" />
          <p className="font-bold leading-relaxed">
            {currentStep === 1 && (
              <>
                簡易版へようこそ！
                <br />
                最低限の約束事だけ
                <br />
                確認してね！
              </>
            )}
            {currentStep === 2 && (
              <>
                どこに住んでいるの？
                <br />
                文化圏はどこ？
              </>
            )}
            {currentStep === 3 && (
              <>
                活動時間は
                <br />
                いつかな？
              </>
            )}
            {currentStep === 4 && (
              <>
                星座だけ教えて！
                <br />
                名前を自動で作るよ✨
              </>
            )}
            {currentStep === 5 && <>何語が得意かな？</>}
            {currentStep === 6 && (
              <>
                これで準備完了！
                <br />
                早速VNSの世界へ
                <br />
                飛び込もう！
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
