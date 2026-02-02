"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChoiceCard } from "./choice-card";
import { CHOICE_PATHS } from "./choice.data";
import { useOnboardingChoice } from "./onboarding-choice.logic";

export const OnboardingChoice = () => {
  const { selectedPath, isConfirming, handleSelect, handleConfirm } =
    useOnboardingChoice();

  return (
    <div className="relative w-full flex flex-col items-center justify-center min-h-[80vh] overflow-hidden py-12 transition-colors duration-500 bg-neutral-50 dark:bg-slate-950 text-neutral-900 dark:text-slate-100">
      {/* Background Ambient Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="z-10 max-w-5xl w-full flex flex-col items-center space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-neutral-800 via-neutral-600 to-neutral-800 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            あなたの旅を選択してください
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            ようこそ、VNS masakinihirotaへ。
            <br className="hidden md:block" />
            あなたは今、「始まりの場所」に立っています。最初の一歩をどのように踏み出しますか？
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
          {CHOICE_PATHS.map((path) => (
            <ChoiceCard
              key={path.id}
              path={path}
              isSelected={selectedPath === path.id}
              onClick={() => handleSelect(path.id)}
            />
          ))}
        </div>

        {/* Action Bar */}
        <div
          className={cn(
            "flex flex-col items-center space-y-4 transition-all duration-500",
            selectedPath
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          )}
        >
          <Button
            onClick={handleConfirm}
            className="w-64 h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-shadow rounded-md"
            disabled={isConfirming}
          >
            {isConfirming ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                準備中...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                このルートで開始する <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </Button>
          <p className="text-xs text-slate-500">
            ※ 選択した内容は後から変更・追加可能です。
          </p>
        </div>
      </div>
    </div>
  );
};
