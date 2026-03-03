"use client";

import { CheckCircle2, Lock, Unlock } from 'lucide-react';
import { isUnlocked, PERMISSIONS, TrustRank } from './trust-dashboard.logic';

interface PermissionUnlockListProps {
  readonly userRank: TrustRank;
}

/**
 * ランク別権限解放リスト
 */
export function PermissionUnlockList({ userRank }: PermissionUnlockListProps) {
  return (
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-xl">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center">
        <Unlock className="w-5 h-5 mr-3 text-indigo-400" />
        権限マトリックス
      </h3>

      <div className="space-y-4">
        {PERMISSIONS.map((permission) => {
          const unlocked = isUnlocked(userRank, permission.unlockedAt);

          return (
            <div
              key={permission.id}
              className={`flex items-center p-4 rounded-xl border transition-all duration-300 ${unlocked
                  ? 'bg-indigo-500/10 border-indigo-500/20 text-white'
                  : 'bg-gray-500/5 border-white/5 text-gray-500'
                }`}
            >
              <div className="mr-4">
                {unlocked ? (
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                  </div>
                ) : (
                  <div className="p-2 bg-gray-500/10 rounded-lg">
                    <Lock className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center mb-0.5">
                  <h4 className={`text-sm font-bold ${unlocked ? 'text-indigo-200' : 'text-gray-500'}`}>
                    {permission.label}
                  </h4>
                  <span className={`ml-2 text-[0.65rem] font-black px-1.5 py-0.5 rounded uppercase border ${unlocked
                      ? 'border-indigo-500/30 text-indigo-400'
                      : 'border-gray-500/30 text-gray-600'
                    }`}>
                    Rank {permission.unlockedAt}
                  </span>
                </div>
                <p className="text-[0.75rem] opacity-70">
                  {permission.description}
                </p>
              </div>

              {!unlocked && (
                <div className="text-[0.6rem] font-bold text-gray-600 tracking-widest hidden sm:block">
                  RESTRICTED
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
        <div className="text-[0.7rem] text-orange-300 font-bold mb-1 uppercase tracking-tighter">🚨 エッジケース: 継続日数の喪失</div>
        <p className="text-[0.75rem] text-orange-200/80 leading-snug">
          重大な規約違反が認められた場合、継続日数は即座に失われ、解放されたすべての特権は直ちに凍結されます。
        </p>
      </div>
    </div>
  );
}
