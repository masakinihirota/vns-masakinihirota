"use client";

import { Flame, ShieldCheck, TrendingUp } from 'lucide-react';

interface TrustStreakCardProps {
  readonly streakDays: number;
  readonly trustScore: number;
  readonly rank: string;
}

/**
 * 信頼継続日数（Trust Streak）を表示するカード
 */
export function TrustStreakCard({ streakDays, trustScore, rank }: TrustStreakCardProps) {
  return (
    <div className="relative overflow-hidden bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-xl group hover:shadow-2xl transition-all duration-300">
      {/* 背景の装飾的グラデーション */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-colors" />

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-500/20 rounded-xl">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-indigo-200 uppercase tracking-wider">信頼ステータス</h3>
            <p className="text-2xl font-bold text-white">聖域の守護者</p>
          </div>
        </div>
        <div className="px-4 py-1.5 bg-white/10 rounded-full border border-white/10 backdrop-blur-sm">
          <span className="text-xs font-semibold text-indigo-300">Rank {rank}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <div className="flex items-center space-x-2 mb-1">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-gray-400">信頼継続</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-black text-white">{streakDays}</span>
            <span className="text-sm font-medium text-gray-400">日</span>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-400">信用資産</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-black text-white">{trustScore}</span>
            <span className="text-sm font-medium text-gray-400">Pts</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-gray-400">Rank S への進捗</span>
          <span className="text-indigo-400 font-bold">{Math.min(100, Math.floor(trustScore / 10))}%</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-indigo-500 to-purple-500 shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(100, Math.floor(trustScore / 10))}%` }}
          />
        </div>
      </div>

      <p className="mt-4 text-[0.85rem] text-gray-400 leading-relaxed">
        <span className="text-indigo-300 font-medium">平穏に過ごした期間</span>があなたの最大の資産です。
        規約を守り続けることで、さらに強力な権限が解放されます。
      </p>
    </div>
  );
}
