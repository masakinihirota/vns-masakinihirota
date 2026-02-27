"use client";

import { MessageSquareShare } from "lucide-react";
import React from "react";

import { Profile } from "./types";

interface HeaderProperties {
  readonly target?: Profile;
  readonly masteryCount: number;
}

/**
 * メインヘッダー: ターゲット情報と同期スコア
 * @param root0
 * @param root0.target
 * @param root0.masteryCount
 */
export const SyncHeader: React.FC<HeaderProperties> = ({ target, masteryCount }) => {
  return (
    <header className="z-20 flex h-24 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-10 shadow-sm">
      <div className="flex items-center space-x-12">
        <div>
          <span className="mb-1 block text-[0.8rem] font-black uppercase tracking-[0.2em] text-slate-400">
            Target Analysis
          </span>
          <div className="flex items-center space-x-4">
            <h1 className="text-[1.3rem] font-black uppercase tracking-tight text-slate-900">
              {target ? target.name : "Select a Partner"}
            </h1>
            {target && (
              <div className="flex items-center space-x-3">
                <div className="rounded border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[0.8rem] font-black uppercase tracking-widest text-indigo-600">
                  Sync Active
                </div>
                <div className="rounded bg-slate-900 px-2.5 py-1 text-[0.8rem] font-black italic uppercase tracking-widest text-white tabular-nums">
                  {masteryCount} / 8 Items
                </div>
              </div>
            )}
          </div>
        </div>

        {target && (
          <div className="flex items-center space-x-8">
            <div className="flex flex-col items-center">
              <span className="mb-1 text-[0.75rem] font-black uppercase text-slate-400">
                Potential Sync
              </span>
              <div className="flex items-baseline font-black text-indigo-600">
                <span className="text-[1.8rem] tracking-tighter">84</span>
                <span className="ml-1 text-[0.9rem]">%</span>
              </div>
            </div>
            <div className="h-10 w-[1px] bg-slate-100" />
            <button
              className="group flex flex-col items-center space-y-1.5"
              aria-label="接続リクエスト"
            >
              <MessageSquareShare
                size={22}
                className="text-slate-300 transition-colors group-hover:text-indigo-500"
              />
              <span className="text-[0.75rem] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-500">
                Connect
              </span>
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col items-end">
        <span className="rounded-full border border-indigo-100 bg-indigo-50 px-6 py-2 text-[0.9rem] font-black uppercase tracking-widest text-indigo-500 shadow-sm">
          Reverse Mandala Mode
        </span>
      </div>
    </header>
  );
};
