"use client";

import { AlertTriangle, Handshake, Info, Scale, ShieldAlert } from 'lucide-react';
import React from 'react';
import { TROUBLE_LEVELS } from './trust-dashboard.logic';

const LEVEL_ICONS: Record<number, React.ReactNode> = {
  1: <ShieldAlert className="w-5 h-5" />,
  2: <Scale className="w-5 h-5" />,
  3: <AlertTriangle className="w-5 h-5" />,
  4: <Info className="w-5 h-5" />,
  5: <Handshake className="w-5 h-5" />
};

const LEVEL_COLORS: Record<number, string> = {
  1: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
  2: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
  3: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  4: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
  5: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
};

/**
 * トラブルレベル解説ガイド
 */
export function TroubleLevelGuide() {
  return (
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-xl">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center">
        <AlertTriangle className="w-5 h-5 mr-3 text-amber-400" />
        トラブル対応プロトコル
      </h3>

      <div className="space-y-6">
        {TROUBLE_LEVELS.map((tl) => (
          <div key={tl.level} className="relative pl-10">
            <div className={`absolute left-0 top-0 p-2 rounded-lg border ${LEVEL_COLORS[tl.level]}`}>
              {LEVEL_ICONS[tl.level]}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
              <h4 className="text-sm font-bold text-white">
                Level {tl.level}: {tl.name}
              </h4>
              <span className="text-[0.65rem] font-medium text-gray-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/5 mt-1 sm:mt-0">
                {tl.category}
              </span>
            </div>

            <p className="text-[0.8rem] text-gray-300 mb-2 leading-relaxed">
              {tl.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div className="bg-black/10 rounded-lg p-2 border border-white/5">
                <span className="text-[0.6rem] font-black text-gray-500 uppercase tracking-widest block mb-1">主要事例</span>
                <div className="flex flex-wrap gap-1">
                  {tl.examples.map((ex, idx) => (
                    <span key={idx} className="text-[0.7rem] px-2 py-0.5 bg-white/5 text-gray-300 rounded">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-black/10 rounded-lg p-2 border border-white/5">
                <span className="text-[0.6rem] font-black text-indigo-400/70 uppercase tracking-widest block mb-1">対応の核心</span>
                <p className="text-[0.75rem] text-indigo-200 font-medium">
                  {tl.coreApproach}
                </p>
              </div>
            </div>

            <div className={`text-[0.75rem] p-3 rounded-lg border italic ${LEVEL_COLORS[tl.level]}`}>
              “{tl.remedy}”
            </div>

            {tl.level < 5 && (
              <div className="absolute left-[1.15rem] top-10 w-0.5 h-full bg-linear-to-b from-white/10 to-transparent" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
          <h5 className="text-[0.75rem] font-bold text-indigo-300 mb-2 flex items-center">
            <Info className="w-4 h-4 mr-2" />
            暗黙の仕様: 善意の総量の最大化
          </h5>
          <p className="text-[0.8rem] text-indigo-200/70 leading-relaxed italic">
            システムは「悪しき者を正す」ことよりも「善き者が不快な対象を見なくて済む」環境づくりを優先します。
            隔離や制限は基本的に「サイレント・モデレーション」形式で実行されます。
          </p>
        </div>
      </div>
    </div>
  );
}
