"use client";

import { ZODIAC_SYMBOLS, getZodiacColor } from "@/lib/anonymous-name-generator";
import { CheckCircle2, ChevronLeft } from "lucide-react";

interface ConfirmStepProps {
  zodiac: string;
  name: string;
  onConfirm: () => void;
  onReset: () => void;
}

export function ConfirmStep({
  zodiac,
  name,
  onConfirm,
  onReset,
}: ConfirmStepProps) {
  const gradientClass = getZodiacColor(zodiac);

  return (
    <div className="p-8 space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <header className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="p-2 hover:bg-slate-800 rounded-full transition-colors group"
        >
          <ChevronLeft className="w-6 h-6 text-slate-400 group-hover:text-white" />
        </button>
        <h2 className="text-lg font-bold text-white tracking-widest">Confirmation</h2>
        <div className="w-10"></div>
      </header>

      <div className="flex flex-col items-center py-10 space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>
          <div className="relative p-6 bg-slate-900/50 rounded-full border border-blue-500/30 animate-in zoom-in-50 duration-700">
            <CheckCircle2 className="w-16 h-16 text-blue-400" />
          </div>
        </div>

        <div className="text-center space-y-3">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">
            Selected Name
          </p>
          <h2 className={`text-4xl font-black tracking-tight bg-gradient-to-br ${gradientClass} bg-clip-text text-transparent drop-shadow-sm`}>
            {name}
          </h2>
        </div>

        <div className="w-full bg-slate-800/20 rounded-3xl p-6 border border-slate-700/50 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">星座</span>
            <div className="flex items-center gap-2">
              <span className="text-xl">{ZODIAC_SYMBOLS[zodiac]}</span>
              <span className="text-white font-bold">{zodiac}</span>
            </div>
          </div>
          <div className="h-[1px] bg-slate-700/50 w-full" />
          <p className="text-[10px] text-slate-500 text-center leading-relaxed">
            この名前は後から <span className="text-slate-300">変更できません</span>。<br />
            あなたの分身として大切に使用されます。
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={onConfirm}
          className="w-full py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-black shadow-[0_10px_30px_rgba(79,70,229,0.3)] hover:brightness-110 transition-all active:scale-95 text-lg"
        >
          体験を開始する
        </button>
        <button
          onClick={onReset}
          className="w-full py-4 text-slate-400 text-sm font-bold hover:text-white transition-colors"
        >
          選び直す
        </button>
      </div>
    </div>
  );
}
