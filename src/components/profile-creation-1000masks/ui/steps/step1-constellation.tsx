import { CheckCircle2, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import React from 'react';
import { Profile, USER_BASE_CONSTELLATION } from '../../profile-creation-1000masks.logic';
import { StepHeader } from '../step-header';

interface Step1ConstellationProps {
  activeProfile: Profile;
  onPrevAnonyms: () => void;
  onNextAnonyms: () => void;
  onSelectAnonym: (name: string) => void;
  isAtHistoryEnd: boolean;
}

export const Step1Constellation: React.FC<Step1ConstellationProps> = ({
  activeProfile,
  onPrevAnonyms,
  onNextAnonyms,
  onSelectAnonym,
  isAtHistoryEnd,
}) => {
  return (
    <section className="bg-slate-50/50 p-10 rounded-[3rem] border border-slate-100 shadow-sm transition-all text-left">
      <StepHeader num="1" title="星座匿名（識別ID）" subtitle="あなたの核となる識別子をリストから選択してください。" isGhost={activeProfile.isGhost} />
      <div className="flex items-center justify-between mb-8 text-left">
        <p className="text-lg text-slate-500 font-bold leading-relaxed text-left">あなたの星座 <span className="font-black">[{USER_BASE_CONSTELLATION}]</span> の候補</p>
        <div className="flex space-x-3 shrink-0 text-left">
          <button onClick={onPrevAnonyms} disabled={activeProfile.historyPointer === 0} className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 disabled:opacity-20 shadow-sm transition-all hover:border-slate-300" aria-label="前の候補へ"><ChevronLeft size={24} /></button>
          <button onClick={onNextAnonyms} className={`flex items-center space-x-3 px-6 py-3 rounded-2xl text-white font-black text-lg shadow-xl active:scale-95 transition-all ${isAtHistoryEnd ? (activeProfile.isGhost ? 'bg-purple-600 shadow-purple-100' : 'bg-blue-600 shadow-blue-100') : 'bg-slate-700'}`}>
            <span>{isAtHistoryEnd ? "次へ（ガチャ）" : "次へ"}</span>
            {isAtHistoryEnd ? <RotateCw size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4 text-left">
        {activeProfile.constellationHistory[activeProfile.historyPointer].map((name, i) => {
          const isSel = activeProfile.constellationName === name;
          return (
            <button key={`${name}-${i}`} onClick={() => onSelectAnonym(name)} className={`group p-8 rounded-[2rem] border-2 transition-all text-left relative flex items-center justify-between ${isSel ? (activeProfile.isGhost ? 'bg-purple-50 border-purple-500 ring-4 ring-purple-500/5 shadow-xl scale-[1.01]' : 'bg-blue-50 border-blue-500 ring-4 ring-blue-50/5 shadow-xl scale-[1.01]') : 'bg-white border-slate-100 hover:border-blue-200 shadow-sm'}`}>
              <div className="flex flex-col text-left">
                <div className={`text-lg font-black uppercase tracking-widest mb-1 ${isSel ? (activeProfile.isGhost ? 'text-purple-600' : 'text-blue-600') : 'text-slate-400'}`}>Candidate {i + 1}</div>
                <div className={`text-xl font-serif font-black leading-tight ${isSel ? 'text-slate-900' : 'text-slate-700'}`}>{name}</div>
              </div>
              {isSel && <div className={`p-2.5 rounded-full ${activeProfile.isGhost ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'} shadow-lg`}><CheckCircle2 size={24} /></div>}
            </button>
          );
        })}
      </div>
    </section>
  );
};
