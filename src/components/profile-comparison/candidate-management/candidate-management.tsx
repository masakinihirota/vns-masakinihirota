"use client";

import { ArrowRightLeft, Link2, Plus, Star, X } from "lucide-react";
import React from "react";
import {
  Profile,
  UserInteraction,
} from "../comparison-engine/comparison.logic";

interface CandidateQueueProps {
  readonly candidates: readonly Profile[];
  readonly interactions: Record<string | number, UserInteraction>;
  readonly selectedId: string | number | null;
  readonly onSelect: (id: string | number) => void;
  readonly onToggleAction: (
    id: string | number,
    type: keyof UserInteraction
  ) => void;
}

/**
 * 候補者キュー（未処理、フォロー中、ウォッチリスト）を管理するサイドバーコンポーネント
 */
export const CandidateManagement: React.FC<CandidateQueueProps> = ({
  candidates,
  interactions,
  selectedId,
  onSelect,
  onToggleAction,
}) => {
  const followed = candidates.filter((c) => interactions[c.id]?.followed);
  const watched = candidates.filter(
    (c) => interactions[c.id]?.watched && !interactions[c.id]?.followed
  );
  const queue = candidates.filter(
    (c) => !interactions[c.id]?.followed && !interactions[c.id]?.watched
  );

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 shadow-sm z-20 overflow-hidden">
      {/* Target Queue Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Target Queue
          </h2>
          <div className="text-lg font-black uppercase tracking-tight">
            New Arrivals
          </div>
        </div>
        <span className="bg-slate-900 text-white text-xs font-black px-3 py-1 rounded-lg uppercase font-mono shadow-sm">
          {queue.length} LEFT
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8 bg-slate-50/20">
        {/* Linked Section */}
        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center">
            <Link2 size={16} className="mr-3 text-blue-500" />
            <span>Linked</span>
            {followed.length > 0 && (
              <span className="ml-auto bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                {followed.length}
              </span>
            )}
          </h3>
          <div className="space-y-2">
            {followed.map((c) => (
              <div key={c.id} className="group flex items-center">
                <button
                  onClick={() => onSelect(c.id)}
                  className={`flex-1 p-4 rounded-l-2xl border text-left transition-all duration-300 overflow-hidden ${
                    selectedId === c.id
                      ? "bg-blue-50 border-blue-200 shadow-sm"
                      : "bg-white border-slate-100 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`text-sm font-black uppercase truncate ${selectedId === c.id ? "text-blue-700" : "text-slate-800"}`}
                  >
                    {c.name}
                  </div>
                </button>
                <button
                  onClick={() => onToggleAction(c.id, "followed")}
                  className="p-4 border bg-white hover:bg-rose-50 hover:text-rose-500 text-slate-300 rounded-r-2xl border-l-0 border-slate-100 transition-colors"
                  aria-label="Remove from Linked"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Watchlist Section */}
        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center">
            <Star
              size={16}
              className="mr-3 text-amber-500"
              fill="currentColor"
            />
            <span>Watchlist</span>
            {watched.length > 0 && (
              <span className="ml-auto bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                {watched.length}
              </span>
            )}
          </h3>
          <div className="space-y-2">
            {watched.map((c) => (
              <div key={c.id} className="group flex items-center">
                <button
                  onClick={() => onSelect(c.id)}
                  className={`flex-1 p-4 rounded-l-2xl border text-left transition-all duration-300 overflow-hidden ${
                    selectedId === c.id
                      ? "bg-amber-50 border-amber-200 shadow-sm"
                      : "bg-white border-slate-100 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`text-sm font-black uppercase truncate ${selectedId === c.id ? "text-amber-800" : "text-slate-800"}`}
                  >
                    {c.name}
                  </div>
                </button>
                <button
                  onClick={() => onToggleAction(c.id, "watched")}
                  className="p-4 border bg-white hover:bg-rose-50 hover:text-rose-500 text-slate-300 rounded-r-2xl border-l-0 border-slate-100 transition-colors"
                  aria-label="Remove from Watchlist"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* New Queue Section */}
        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
            New Entries
          </h3>
          <div className="space-y-4">
            {queue.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`group w-full p-5 rounded-2xl text-left transition-all duration-300 border-2 cursor-pointer relative shadow-sm ${
                  selectedId === c.id
                    ? "bg-white border-blue-600 shadow-xl ring-2 ring-blue-50 scale-[1.02]"
                    : "bg-white border-slate-100 hover:border-slate-300"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div
                    className={`font-black text-base uppercase tracking-tight ${selectedId === c.id ? "text-blue-700" : "text-slate-900"}`}
                  >
                    {c.name}
                  </div>
                  <ArrowRightLeft
                    size={16}
                    className="text-slate-200 group-hover:text-blue-200 transition-colors"
                  />
                </div>
                <div className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest truncate">
                  {c.role}
                </div>

                <div className="flex items-center justify-between mt-4 border-t border-slate-100 pt-4">
                  <div className="flex gap-1.5 flex-wrap">
                    {c.values.slice(0, 2).map((v) => (
                      <span
                        key={v}
                        className="text-[10px] px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md text-slate-500 font-black uppercase tracking-tighter"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center space-x-1.5 bg-slate-50 p-1 rounded-xl border border-slate-100 shadow-inner">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleAction(c.id, "watched");
                      }}
                      className="p-2.5 rounded-lg text-slate-300 hover:bg-white hover:text-amber-500 hover:shadow-sm transition-all"
                      aria-label="Add to Watchlist"
                    >
                      <Star size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleAction(c.id, "followed");
                      }}
                      className="p-2.5 rounded-lg text-slate-300 hover:bg-blue-600 hover:text-white hover:shadow-md transition-all"
                      aria-label="Link Candidate"
                    >
                      <Plus size={18} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
