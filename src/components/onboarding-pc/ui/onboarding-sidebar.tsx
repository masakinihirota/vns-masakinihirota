"use client";

import Image from "next/image";
import React from "react";

interface OnboardingSidebarProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const OnboardingSidebar: React.FC<OnboardingSidebarProps> = ({
  currentStep,
  onStepClick,
}) => {
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
                VNSへようこそ！
                <br />
                まずは私たちの
                <br />
                大切な約束を確認してね。
              </>
            )}
            {currentStep === 2 && (
              <>
                あなたの価値観を
                <br />
                教えてね。
                <br />
                正解はないから安心してね！
              </>
            )}
            {currentStep === 3 && (
              <>
                まずは住んでいる場所と
                <br />
                文化圏を教えてね。
                <br />
                すべてはここから始まるよ！
              </>
            )}
            {currentStep === 4 && (
              <>
                いつ活動しているの？
                <br />
                一緒に働いたり遊んだりする
                <br />
                時間を教えてね！
              </>
            )}
            {currentStep === 5 && (
              <>
                生まれた世代と
                <br />
                星座を教えてね！
              </>
            )}
            {currentStep === 6 && (
              <>
                何語で話すのが得意？
                <br />
                AI翻訳を使えば世界中の人と
                <br />
                お話しできるよ✨
              </>
            )}
            {currentStep === 7 && (
              <>
                VNSのシステムについて
                <br />
                確認してね！
                <br />
                大切なことだよ🤖
              </>
            )}
            {currentStep === 8 && (
              <>
                最後に設定内容を
                <br />
                確認してね。
                <br />
                準備はＯＫ？
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
