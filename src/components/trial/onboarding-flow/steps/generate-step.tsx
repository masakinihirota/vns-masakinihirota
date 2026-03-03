"use client";

import { ZODIAC_SYMBOLS } from "@/lib/anonymous-name-generator";
import { CheckCircle2, ChevronLeft, RefreshCw } from "lucide-react";

interface GenerateStepProps {
  zodiac: string;
  candidates: string[];
  selectedName: string | null;
  onSelect: (name: string) => void;
  onNext: () => void;
  onBack: () => void;
  history: string[][];
  historyIndex: number;
  onConfirm: () => void;
  onReset: () => void;
}

export function GenerateStep({
  zodiac,
  candidates,
  selectedName,
  onSelect,
  onNext,
  onBack,
  history,
  historyIndex,
  onConfirm,
  onReset,
}: GenerateStepProps) {
  return (
    <div className="p-8 space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <header className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="p-2 hover:bg-slate-800 rounded-full transition-colors group"
        >
          <ChevronLeft className="w-6 h-6 text-slate-400 group-hover:text-white" />
        </button>
        <div className="px-5 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20 flex items-center gap-2">
          <span className="text-lg">{ZODIAC_SYMBOLS[zodiac]}</span>
          <span className="text-sm font-bold text-blue-300 tracking-widest">
            {zodiac}
          </span>
        </div>
        <div className="w-10"></div>
      </header>

      <div className="space-y-4">
        <p className="text-slate-400 text-xs text-center uppercase tracking-[0.2em] font-bold">
          好きな名前を選択してください
        </p>

        <div className="space-y-3">
          {candidates.map((name, idx) => (
            <button
              key={`${historyIndex}-${idx}`}
              onClick={() => onSelect(name)}
              className={`w-full text-left relative overflow-hidden p-5 border rounded-2xl transition-all duration-300 group ${selectedName === name
                  ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                  : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-500'
                }`}
            >
              <div className="relative z-10 flex items-center justify-between">
                <span className={`text-lg font-bold tracking-wide transition-colors ${selectedName === name ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  }`}>
                  {name}
                </span>
                {selectedName === name && (
                  <CheckCircle2 className="w-5 h-5 text-blue-400 animate-in zoom-in-50 duration-300" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <button
          onClick={onConfirm}
          disabled={!selectedName}
          className={`w-full py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${selectedName
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-900/40 hover:brightness-110'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
        >
          {selectedName ? '確認する' : '名前を選んでください'}
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onBack}
            disabled={historyIndex === 0}
            className={`flex items-center justify-center gap-2 py-3 border border-slate-700 rounded-2xl text-sm font-medium transition-all ${historyIndex === 0
                ? 'opacity-20 cursor-not-allowed'
                : 'hover:bg-slate-800 active:scale-95'
              }`}
          >
            <ChevronLeft className="w-4 h-4" />
            前の履歴
          </button>
          <button
            onClick={onNext}
            className="flex items-center justify-center gap-2 py-3 border border-slate-700 bg-slate-800/30 hover:bg-slate-800 rounded-2xl text-sm font-medium transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            他の候補
          </button>
        </div>
      </div>

      <footer className="pt-2 flex justify-center items-center gap-3">
        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">History</span>
        <div className="flex gap-1.5">
          {history.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === historyIndex ? 'w-8 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'w-1.5 bg-slate-800'
                }`}
            />
          ))}
        </div>
      </footer>
    </div>
  );
}
