"use client";

import { Shield, Sparkles } from 'lucide-react';
import { PermissionUnlockList } from './permission-unlock-list';
import { TroubleLevelGuide } from './trouble-level-guide';
import { TrustData } from './trust-dashboard.logic';
import { TrustStreakCard } from './trust-streak-card';

interface TrustDashboardProps {
  readonly trustData: TrustData;
}

/**
 * サンクチュアリ（信頼システム） ダッシュボード メインUI
 */
export function TrustDashboard({ trustData }: TrustDashboardProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* ヒーローセクション */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-[0.7rem] font-bold uppercase tracking-widest">
            <Shield className="w-3 h-3 mr-2" />
            Community Sanctuary System
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            SANCTUARY
          </h1>
          <p className="text-gray-400 max-w-lg text-[1rem]">
            「誠実さが利益を生み、悪意が孤独を招く」
            自律的な秩序形成を目的とした信頼管理ダッシュボード。
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-sm p-2 rounded-full border border-white/10">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-indigo-600 flex items-center justify-center border-2 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="pr-6">
            <p className="text-[0.65rem] text-gray-400 font-bold uppercase">Current Rank</p>
            <p className="text-xl font-black text-white">Rank {trustData.rank}</p>
          </div>
        </div>
      </div>

      {/* メインレイアウト */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
        {/* 左側：信頼ステータスと権限 */}
        <div className="lg:col-span-5 space-y-8">
          <TrustStreakCard
            streakDays={trustData.streakDays}
            trustScore={trustData.trustScore}
            rank={trustData.rank}
          />

          <PermissionUnlockList userRank={trustData.rank} />

          <div className="p-6 bg-linear-to-br from-indigo-900/40 to-purple-900/40 rounded-2xl border border-white/10 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center">
              <Shield className="w-4 h-4 mr-2 text-indigo-400" />
              動的隔離（Dynamic Isolation）
            </h4>
            <p className="text-[0.8rem] text-gray-300 leading-relaxed">
              あなたの視界は、信頼ランクに応じて「最適化」されます。
              低スコアのユーザーとの接触はサイレントに制御され、コミュニティの平穏が維持されます。
            </p>
          </div>
        </div>

        {/* 右側：トラブルレベルガイド */}
        <div className="lg:col-span-7">
          <TroubleLevelGuide />
        </div>
      </div>
    </div>
  );
}
