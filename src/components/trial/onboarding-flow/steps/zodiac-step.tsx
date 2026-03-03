"use client";

import { ZODIAC_SYMBOLS } from "@/lib/anonymous-name-generator";
import { Sparkles } from "lucide-react";

interface ZodiacStepProps {
  onSelect: (zodiac: string) => void;
}

const zodiacs = [
  "牡羊座", "牡牛座", "双子座", "蟹座", "獅子座", "乙女座",
  "天秤座", "蠍座", "射手座", "山羊座", "水瓶座", "魚座"
];

export function ZodiacStep({ onSelect }: ZodiacStepProps) {
  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl mb-2 border border-blue-500/20">
          <Sparkles className="text-blue-400 w-8 h-8 animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          星座匿名メーカー
        </h1>
        <p className="text-slate-400 leading-relaxed">
          いらっしゃい、まずはあなたの<br />
          <span className="text-blue-300 font-semibold underline underline-offset-4 decoration-blue-500/30">好きな星座</span>を教えてください。
        </p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        {zodiacs.map((zodiac) => (
          <button
            key={zodiac}
            onClick={() => onSelect(zodiac)}
            className="p-3 text-sm bg-slate-800/40 hover:bg-blue-600/20 border border-slate-700/50 hover:border-blue-500/50 rounded-2xl transition-all duration-300 hover:-translate-y-1 active:scale-95 text-center group"
          >
            <span className="block text-2xl mb-1 group-hover:scale-125 transition-transform duration-300">
              {ZODIAC_SYMBOLS[zodiac]}
            </span>
            <span className="text-xs font-medium text-slate-300">{zodiac}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
