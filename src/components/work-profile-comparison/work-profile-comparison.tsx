"use client";

import {
  ArrowRightLeft,
  Clock,
  Filter,
  Flame,
  Layers,
  Link2,
  Plus,
  Star,
  UserCircle,
  X,
} from 'lucide-react';
import React from 'react';
import {
  CATEGORIES,
  CategoryKey,
  ComparisonItem,
  Profile,
  SortConfig,
  TEMPORAL_AXIS,
  TemporalAxisKey,
  TierKey,
  TIERS,
} from './work-profile-comparison.logic';

interface TierBadgeProps {
  readonly tierKey: TierKey;
}

const TierBadge: React.FC<TierBadgeProps> = ({ tierKey }) => {
  const tier = TIERS[tierKey] || TIERS.UNRATED;
  return (
    <div
      className={`px-3 py-1 rounded text-[0.75rem] font-bold ${tier.color} ${tier.text} flex items-center justify-center min-w-[3.5rem] tracking-tighter shrink-0 shadow-sm`}
      aria-label={`Tier: ${tier.label}`}
    >
      {tier.label}
    </div>
  );
};

interface WorkProfileComparisonProps {
  readonly currentMe: Profile;
  readonly currentTarget: Profile | null;
  readonly selectedMyId: string | number;
  readonly selectedTargetId: string | number | null;
  readonly followedCandidates: readonly Profile[];
  readonly watchedCandidates: readonly Profile[];
  readonly queueCandidates: readonly Profile[];
  readonly comparisonData: readonly ComparisonItem[];
  readonly syncLevel: number | null;
  readonly lastLog: string;
  readonly filters: {
    readonly tier: Record<TierKey, boolean>;
    readonly category: Record<CategoryKey, boolean>;
    readonly temporal: Record<TemporalAxisKey, boolean>;
  };
  readonly sortConfig: SortConfig;
  readonly onSelectMyProfile: (id: string | number) => void;
  readonly onSelectTarget: (id: string | number) => void;
  readonly onToggleAction: (id: string | number, actionType: 'followed' | 'watched') => void;
  readonly onToggleTierFilter: (key: TierKey) => void;
  readonly onToggleCategoryFilter: (key: CategoryKey) => void;
  readonly onToggleTemporalFilter: (key: TemporalAxisKey) => void;
  readonly onToggleSort: (key: 'title' | 'heat') => void;
}

const WorkProfileComparison: React.FC<WorkProfileComparisonProps> = ({
  currentMe,
  currentTarget,
  selectedMyId,
  selectedTargetId,
  followedCandidates,
  watchedCandidates,
  queueCandidates,
  comparisonData,
  syncLevel,
  lastLog,
  filters,
  sortConfig,
  onSelectMyProfile,
  onSelectTarget,
  onToggleAction,
  onToggleTierFilter,
  onToggleCategoryFilter,
  onToggleTemporalFilter,
  onToggleSort,
}) => {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* LEFT: MY PROFILES & PROCESSED */}
      <aside className="w-80 bg-white/80 backdrop-blur-md border-r border-slate-200 flex flex-col shrink-0 shadow-sm z-20">
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex justify-between items-center">
          <div>
            <h2 className="text-[0.625rem] font-black uppercase tracking-widest opacity-50">Identity Switch</h2>
            <div className="text-[1rem] font-black uppercase tracking-tight">My Profiles</div>
          </div>
          <UserCircle size={24} className="text-blue-400" />
        </div>

        <div className="p-4 space-y-3 border-b border-slate-200 bg-slate-100/50">
          {[
            { id: 'pm', name: "ケンジ (PM)", role: "IT PM / Rationalist" },
            { id: 'creator', name: "ケンジ (Creator)", role: "Indie Developer / Artist" }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => onSelectMyProfile(p.id)}
              className={`w-full p-4 rounded-xl text-left transition-all border-2 ${selectedMyId === p.id
                  ? 'bg-white border-blue-600 shadow-lg ring-1 ring-blue-100'
                  : 'bg-white/50 border-transparent hover:bg-white hover:border-slate-300'
                }`}
            >
              <div className="font-black text-[0.875rem] text-slate-800 uppercase tracking-tight">{p.name}</div>
              <div className="text-[0.75rem] font-bold text-slate-400 truncate tracking-tight">{p.role}</div>
            </button>
          ))}
        </div>

        <nav className="flex-1 overflow-y-auto p-5 space-y-8" aria-label="Candidate Lists">
          <section>
            <h3 className="text-[0.625rem] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center">
              <Link2 size={14} className="mr-2 text-blue-500" /> Linked Candidates
              {followedCandidates.length > 0 && <span className="ml-auto bg-blue-600 text-white text-[0.625rem] px-2 py-0.5 rounded-full">{followedCandidates.length}</span>}
            </h3>
            <div className="space-y-2">
              {followedCandidates.map(c => (
                <div key={c.id} className="group flex items-center">
                  <button
                    onClick={() => onSelectTarget(c.id)}
                    className={`flex-1 p-3 rounded-l-xl border text-left transition-all overflow-hidden ${selectedTargetId === c.id
                        ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold'
                        : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'
                      }`}
                  >
                    <div className="text-[0.75rem] font-black uppercase truncate">{c.name}</div>
                  </button>
                  <button
                    onClick={() => onToggleAction(c.id, 'followed')}
                    className="p-3 border bg-white hover:bg-red-50 hover:text-red-500 text-slate-300 rounded-r-xl border-l-0 border-slate-100 transition-colors"
                    aria-label={`Unfollow ${c.name}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[0.625rem] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center">
              <Star size={14} className="mr-2 text-amber-500" fill="currentColor" /> Watchlist
              {watchedCandidates.length > 0 && <span className="ml-auto bg-amber-500 text-white text-[0.625rem] px-2 py-0.5 rounded-full">{watchedCandidates.length}</span>}
            </h3>
            <div className="space-y-2">
              {watchedCandidates.map(c => (
                <div key={c.id} className="group flex items-center">
                  <button
                    onClick={() => onSelectTarget(c.id)}
                    className={`flex-1 p-3 rounded-l-xl border text-left transition-all overflow-hidden ${selectedTargetId === c.id
                        ? 'bg-amber-50 border-amber-200 text-amber-700 font-bold'
                        : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'
                      }`}
                  >
                    <div className="text-[0.75rem] font-black uppercase truncate">{c.name}</div>
                  </button>
                  <button
                    onClick={() => onToggleAction(c.id, 'watched')}
                    className="p-3 border bg-white hover:bg-red-50 hover:text-red-500 text-slate-300 rounded-r-xl border-l-0 border-slate-100 transition-colors"
                    aria-label={`Remove from watchlist ${c.name}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </nav>
      </aside>

      {/* CENTER: MAIN ENGINE */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-100/30">
        <header className="h-24 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center space-x-8">
            <div className={`flex items-center space-x-3 px-5 py-2.5 rounded-full font-black text-[0.75rem] tracking-widest bg-orange-500 text-white shadow-xl shadow-orange-100 transition-transform active:scale-95`}>
              <Flame size={16} fill="currentColor" />
              <span>{currentTarget ? 'SYNC HEAT' : 'SOLO ENGINE'}</span>
            </div>
            <div className="h-6 w-[1px] bg-slate-300" />
            <div className="flex flex-col">
              <span className="text-[0.625rem] font-black text-slate-400 uppercase tracking-widest">Operation Mode</span>
              <span className="text-[1rem] font-black text-slate-900 tracking-tight">
                {currentTarget ? `Analyzing Compatibility with ${currentTarget.name}` : 'Personal Value Assessment'}
              </span>
            </div>
          </div>
          {currentTarget && (
            <div className="flex flex-col items-end">
              <span className="text-[0.625rem] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Match Factor</span>
              <span className="text-4xl font-black text-blue-600 tracking-tighter leading-none">{syncLevel}%</span>
            </div>
          )}
        </header>

        {/* VISIBILITY CONTROLS */}
        <div className="bg-white/70 backdrop-blur-sm border-b border-slate-200 px-10 py-5 flex flex-col space-y-4 shadow-sm shrink-0">
          <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar">
            <div className="flex items-center text-[0.75rem] font-black text-slate-400 uppercase tracking-widest shrink-0 w-28">
              <Filter size={14} className="mr-2" /> Tier Filter
            </div>
            <div className="flex gap-2">
              {(Object.entries(TIERS) as Array<[TierKey, typeof TIERS.T1]>).map(([key, tier]) => (
                <button
                  key={key}
                  onClick={() => onToggleTierFilter(key)}
                  className={`px-3 py-1.5 rounded-lg border text-[0.75rem] font-black transition-all ${filters.tier[key]
                      ? `${tier.color} ${tier.text} border-transparent shadow-sm`
                      : 'bg-white border-slate-200 text-slate-300 hover:border-slate-400'
                    }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar border-t border-slate-100 pt-4">
            <div className="flex items-center text-[0.75rem] font-black text-slate-400 uppercase tracking-widest shrink-0 w-28">
              <Layers size={14} className="mr-2" /> Attribute
            </div>
            <div className="flex gap-2">
              {(Object.entries(CATEGORIES) as Array<[CategoryKey, typeof CATEGORIES.MANGA]>).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => onToggleCategoryFilter(key)}
                  className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg border text-[0.75rem] font-black transition-all ${filters.category[key]
                      ? `${cat.bgColor} ${cat.color} border-current shadow-sm`
                      : 'bg-white border-slate-200 text-slate-300 hover:border-slate-400'
                    }`}
                >
                  <cat.icon size={14} /> <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar border-t border-slate-100 pt-4">
            <div className="flex items-center text-[0.75rem] font-black text-slate-400 uppercase tracking-widest shrink-0 w-28">
              <Clock size={14} className="mr-2" /> 三世 (Epoch)
            </div>
            <div className="flex gap-2">
              {(Object.entries(TEMPORAL_AXIS) as Array<[TemporalAxisKey, typeof TEMPORAL_AXIS.LIFE]>).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => onToggleTemporalFilter(key)}
                  className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg border text-[0.75rem] font-black transition-all ${filters.temporal[key]
                      ? `${item.bgColor} ${item.color} border-current shadow-sm`
                      : 'bg-white border-slate-200 text-slate-300 hover:border-slate-400'
                    }`}
                >
                  <item.icon size={14} /> <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* COMPARISON TABLE */}
        <div className="flex-1 overflow-y-auto px-10 py-8 bg-slate-50">
          <div className="max-w-5xl mx-auto space-y-3">
            <div className={`grid ${currentTarget ? 'grid-cols-[160px_1fr_160px]' : 'grid-cols-[160px_1fr]'} px-6 py-2 text-[0.625rem] font-black text-slate-400 uppercase tracking-[0.2em]`}>
              <div className="flex justify-center">Your Rating</div>
              <div className="flex justify-center border-x border-slate-200 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => onToggleSort('title')}>Work / Series</div>
              {currentTarget && <div className="flex justify-center" onClick={() => onToggleSort('heat')}>Their Rating</div>}
            </div>

            {comparisonData.map((item) => {
              const TemporalIcon = TEMPORAL_AXIS[item.axis]?.icon || History;
              const TemporalColor = TEMPORAL_AXIS[item.axis]?.color || 'text-slate-400';
              const isMatch = currentTarget && item.myTier === item.theirTier && item.myTier !== 'UNRATED';

              return (
                <div
                  key={item.title}
                  className={`grid ${currentTarget ? 'grid-cols-[160px_1fr_160px]' : 'grid-cols-[160px_1fr]'} bg-white rounded-2xl border ${isMatch ? 'border-blue-300 shadow-blue-50' : 'border-slate-200'} shadow-sm hover:border-blue-400 hover:shadow-md transition-all items-center overflow-hidden group`}
                >
                  <div className="p-5 border-r border-slate-100 flex justify-center bg-slate-50/50 group-hover:bg-white transition-colors">
                    <TierBadge tierKey={item.myTier} />
                  </div>
                  <div className={`p-5 px-8 ${currentTarget ? 'text-center' : 'text-left'} flex flex-col bg-white`}>
                    <div className="flex items-center justify-center space-x-3">
                      <TemporalIcon size={16} className={TemporalColor} />
                      <span className={`text-[1.125rem] font-black tracking-tight ${isMatch ? 'text-blue-700' : 'text-slate-800'}`}>
                        {item.title}
                      </span>
                    </div>
                    <div className="text-[0.625rem] font-bold text-slate-300 uppercase tracking-[0.15em] mt-1 text-center">
                      {CATEGORIES[item.category]?.label} • {TEMPORAL_AXIS[item.axis]?.label}
                    </div>
                  </div>
                  {currentTarget && (
                    <div className="p-5 border-l border-slate-100 flex justify-center bg-slate-50/50 group-hover:bg-white transition-colors">
                      <TierBadge tierKey={item.theirTier || 'UNRATED'} />
                    </div>
                  )}
                </div>
              );
            })}

            {comparisonData.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-4">
                <Filter size={48} className="opacity-20" />
                <p className="text-[1rem] font-bold tracking-tight">No works match the current filters.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* RIGHT: TARGET QUEUE */}
      <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 shadow-sm z-20">
        <div className="p-5 border-b border-slate-200 bg-slate-100/30 flex justify-between items-center">
          <div>
            <h2 className="text-[0.625rem] font-black uppercase tracking-widest text-slate-400">Target Queue</h2>
            <div className="text-[1rem] font-black uppercase tracking-tight">New Arrivals</div>
          </div>
          <span className="bg-slate-900 text-white text-[0.625rem] font-black px-2.5 py-1 rounded-md uppercase font-mono tracking-widest">{queueCandidates.length} LEFT</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
          {queueCandidates.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectTarget(c.id)}
              className={`group w-full p-5 rounded-2xl text-left transition-all border-2 cursor-pointer relative bg-white ${selectedTargetId === c.id
                  ? 'border-blue-600 shadow-xl ring-1 ring-blue-100 scale-[1.02]'
                  : 'border-slate-100 hover:border-slate-300 hover:shadow-lg'
                }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className={`font-black text-[1rem] uppercase tracking-tight ${selectedTargetId === c.id ? 'text-blue-700' : 'text-slate-900'}`}>{c.name}</div>
                <ArrowRightLeft size={16} className={selectedTargetId === c.id ? 'text-blue-200' : 'text-slate-200'} />
              </div>
              <div className="text-[0.75rem] font-bold text-slate-400 mb-4 uppercase tracking-widest truncate">{c.role}</div>
              <div className="flex items-center justify-between mt-5 border-t border-slate-100 pt-4">
                <div className="flex gap-1.5 flex-wrap">
                  {c.values.slice(0, 2).map(v => (
                    <span key={v} className="text-[0.625rem] px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md text-slate-500 font-bold uppercase tracking-tight">
                      {v}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleAction(c.id, 'watched'); }}
                    className="p-2 rounded-lg text-slate-300 hover:bg-amber-100 hover:text-amber-600 transition-colors"
                    aria-label="Add to watchlist"
                  >
                    <Star size={16} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleAction(c.id, 'followed'); }}
                    className="p-2 rounded-lg text-slate-300 hover:bg-blue-600 hover:text-white transition-colors"
                    aria-label="Follow candidate"
                  >
                    <Plus size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="p-5 border-t border-slate-200 bg-slate-900 text-white font-mono shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[0.625rem] font-black text-slate-500 uppercase tracking-[0.3em]">Operational Log</span>
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.8)]" />
          </div>
          <div className="text-[0.75rem] text-green-400/90 truncate font-black tracking-tighter italic selection:bg-green-500 selection:text-black">
            {'>'} {lastLog}
          </div>
        </footer>
      </aside>
    </div>
  );
};

export { WorkProfileComparison };
export type { WorkProfileComparisonProps };

