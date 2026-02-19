"use client";

import * as LucideIcons from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { CandidateList } from './candidate-list';
import { MandalaGrid } from './mandala-grid';
import { SortOrder, getMasteryCount } from './skill-comparison.logic';
import { CANDIDATES, MANDALA_TEMPLATES, MY_PROFILES } from './skill-comparison.sample-data';
import { SkillSelector } from './skill-selector';

/**
 * 状態管理用コンテナ
 * 仕様書のデータフローとアルゴリズム（ソート、カテゴリ統合）を実装
 */
export const MandalaContainer: React.FC = () => {
  // ステート
  const [selectedMyId, setSelectedMyId] = useState<string>(MY_PROFILES[0].id);
  const [selectedTargetId, setSelectedTargetId] = useState<string | number>(CANDIDATES[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>("FRONTEND");
  const [focusedSkill, setFocusedSkill] = useState<string>("React / Next.js");
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [interactions, setInteractions] = useState<Record<string | number, { followed: boolean; watched: boolean }>>({});
  const [lastLog, setLastLog] = useState<string>("SKILL SYNC PROTOCOL ONLINE");

  // メモ化されたデータ
  const currentMe = useMemo(() => MY_PROFILES.find(p => p.id === selectedMyId), [selectedMyId]);
  const currentTarget = useMemo(() => CANDIDATES.find(c => c.id === selectedTargetId), [selectedTargetId]);

  // ソートロジック
  const sortedCandidatesList = useMemo(() => {
    return [...CANDIDATES].sort((a, b) => {
      const countA = getMasteryCount(a, focusedSkill);
      const countB = getMasteryCount(b, focusedSkill);
      return sortOrder === 'desc' ? countB - countA : countA - countB;
    });
  }, [focusedSkill, sortOrder]);

  // インタラクションに基づく分類
  const followed = useMemo(() => sortedCandidatesList.filter(c => interactions[c.id]?.followed), [sortedCandidatesList, interactions]);
  const watched = useMemo(() => sortedCandidatesList.filter(c => interactions[c.id]?.watched && !interactions[c.id]?.followed), [sortedCandidatesList, interactions]);
  const queue = useMemo(() => sortedCandidatesList.filter(c => !interactions[c.id]?.followed && !interactions[c.id]?.watched), [sortedCandidatesList, interactions]);

  // カテゴリ切り替え時のスキル追従 (Effect)
  useEffect(() => {
    const availableSkills = Object.keys(MANDALA_TEMPLATES).filter(s => MANDALA_TEMPLATES[s].category === selectedCategory);
    if (availableSkills.length > 0 && !availableSkills.includes(focusedSkill)) {
      setFocusedSkill(availableSkills[0]);
    }
  }, [selectedCategory, focusedSkill]);

  // ハンドラー
  const handleToggleAction = (id: string | number, type: 'followed' | 'watched') => {
    setInteractions(prev => {
      const current = prev[id] || { followed: false, watched: false };
      const newValue = !current[type];
      const name = CANDIDATES.find(c => c.id === id)?.name ?? 'Unknown';
      setLastLog(`${type.toUpperCase()} UPDATED: ${name}`);
      return { ...prev, [id]: { ...current, [type]: newValue } };
    });
  };

  const toggleSort = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    setLastLog(`SORT: ${newOrder.toUpperCase()} BY ${focusedSkill}`);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Left Sidebar: Identities */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 z-30 shadow-sm">
        <div className="p-6 border-b border-slate-200 bg-slate-950 text-white">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-indigo-500 rounded-lg">
              <LucideIcons.UserCircle size={20} className="text-white" />
            </div>
            <span className="font-black text-xs tracking-widest uppercase">My Identity</span>
          </div>
          <div className="space-y-3">
            {MY_PROFILES.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedMyId(p.id)}
                className={`w-full p-4 rounded-xl text-left border transition-all duration-200 ${selectedMyId === p.id
                    ? 'bg-indigo-600 border-indigo-400 shadow-lg'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
              >
                <div className={`text-sm font-black uppercase tracking-tighter ${selectedMyId === p.id ? 'text-white' : ''}`}>
                  {p.name}
                </div>
                <div className="text-[10px] font-bold uppercase mt-1.5 opacity-60">
                  {p.role}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sorting Controls</h3>
            <button
              onClick={toggleSort}
              className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-black text-slate-600 transition-colors"
            >
              {sortOrder === 'desc' ? <LucideIcons.SortDesc size={14} /> : <LucideIcons.SortAsc size={14} />}
              <span>{sortOrder === 'desc' ? 'DESCEND' : 'ASCEND'}</span>
            </button>
          </div>

          <CandidateList
            title="Linked Partners"
            icon={<LucideIcons.Link2 size={14} className="text-blue-500" />}
            candidates={followed}
            focusedSkill={focusedSkill}
            selectedTargetId={selectedTargetId}
            onSelectTarget={setSelectedTargetId}
            onToggleAction={handleToggleAction}
            countBadge={followed.length}
          />

          <CandidateList
            title="Watchlist"
            icon={<LucideIcons.Star size={14} className="text-amber-500" fill="currentColor" />}
            candidates={watched}
            focusedSkill={focusedSkill}
            selectedTargetId={selectedTargetId}
            onSelectTarget={setSelectedTargetId}
            onToggleAction={handleToggleAction}
            countBadge={watched.length}
          />
        </div>
      </aside>

      {/* Main Content: Mandala Display */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-24 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0 z-20">
          <div className="flex items-center space-x-12">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Active Partner Analysis</span>
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">
                  {currentTarget?.name ?? 'Select Target'}
                </span>
                {currentTarget && (
                  <div className="flex items-center space-x-3">
                    <div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded border border-indigo-100 uppercase">Mastery Active</div>
                    <div className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded uppercase italic">
                      {getMasteryCount(currentTarget, focusedSkill)} / 8 Items
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-5 py-2 rounded-full border border-indigo-100 uppercase tracking-widest shadow-sm">
              Mandala Engine v2.0
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
          <div className="max-w-5xl mx-auto w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SkillSelector
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              focusedSkill={focusedSkill}
              onSelectSkill={setFocusedSkill}
            />

            <MandalaGrid
              focusedSkill={focusedSkill}
              currentMe={currentMe}
              currentTarget={currentTarget}
            />

            {/* Legend */}
            <div className="grid grid-cols-3 gap-8 p-10 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-start space-x-5">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                  <LucideIcons.ChevronRight size={24} strokeWidth={3} />
                </div>
                <div className="flex flex-col pt-1">
                  <span className="text-sm font-black uppercase tracking-tight mb-1">Advice Mode</span>
                  <p className="text-sm text-slate-400 leading-relaxed">あなたが習得済み、相手に教えることができる分野です。</p>
                </div>
              </div>
              <div className="flex items-start space-x-5 border-x border-slate-100 px-8">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm shrink-0">
                  <LucideIcons.ChevronLeft size={24} strokeWidth={3} />
                </div>
                <div className="flex flex-col pt-1">
                  <span className="text-sm font-black uppercase tracking-tight mb-1">Learning Mode</span>
                  <p className="text-sm text-slate-400 leading-relaxed">相手が習得済み、あなたがインスパイアを受ける分野です。</p>
                </div>
              </div>
              <div className="flex items-start space-x-5">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                  <LucideIcons.Activity size={24} strokeWidth={3} className="animate-pulse" />
                </div>
                <div className="flex flex-col pt-1">
                  <span className="text-sm font-black uppercase tracking-tight mb-1">Sync Mode</span>
                  <p className="text-sm text-slate-400 leading-relaxed">双方が習得済み、最も深い共創が可能なコア領域です。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar: Talent Network */}
      <aside className="w-96 bg-white border-l border-slate-200 flex flex-col shrink-0 shadow-sm z-30">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Protocol</h2>
            <div className="text-lg font-black uppercase tracking-tight">Talent Network</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-400 uppercase mb-1">Sorting Pulse</span>
              <button onClick={toggleSort} className="bg-indigo-600 text-white p-2 rounded shadow-md ring-2 ring-indigo-50">
                {sortOrder === 'desc' ? <LucideIcons.SortDesc size={18} /> : <LucideIcons.SortAsc size={18} />}
              </button>
            </div>
            <span className="bg-slate-900 text-white text-xs px-3 py-1 rounded-lg font-black tabular-nums">{queue.length}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <CandidateList
            title="Available in Network"
            icon={<LucideIcons.Users size={14} className="text-slate-400" />}
            candidates={queue}
            focusedSkill={focusedSkill}
            selectedTargetId={selectedTargetId}
            onSelectTarget={setSelectedTargetId}
            onToggleAction={handleToggleAction}
            showDetails={true}
          />
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-950 text-white font-mono">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Logs</span>
            <LucideIcons.Activity size={12} className="text-green-500 animate-pulse" />
          </div>
          <div className="text-xs font-mono text-indigo-400/90 italic font-black truncate uppercase tracking-tighter">
            &gt; {lastLog}
          </div>
        </div>
      </aside>
    </div>
  );
};
