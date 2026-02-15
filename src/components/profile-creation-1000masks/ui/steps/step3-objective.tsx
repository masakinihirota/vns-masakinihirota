import { Component, Info, X } from 'lucide-react';
import React from 'react';
import { ALL_SLOTS, OBJECTIVE_PRESETS, ObjectiveId, Profile, SlotId } from '../../profile-creation-1000masks.logic';
import { StepHeader } from '../step-header';

interface Step3ObjectiveProps {
  activeProfile: Profile;
  onToggleObjective: (id: ObjectiveId) => void;
  onToggleSlot: (id: SlotId) => void;
}

export const Step3Objective: React.FC<Step3ObjectiveProps> = ({ activeProfile, onToggleObjective, onToggleSlot }) => {
  return (
    <section>
      <StepHeader num="3" title="プロフィールの目的" subtitle="方向性の決定" />
      <div className="bg-blue-50/50 border border-blue-100 p-8 rounded-[2.5rem] mb-12 space-y-4 shadow-sm text-left">
        <div className="flex items-center space-x-3 text-blue-700 font-black text-left">
          <Info size={24} />
          <span className="text-lg uppercase tracking-widest">Guidance</span>
        </div>
        <ul className="list-disc list-inside text-lg font-bold text-slate-600 space-y-3 leading-relaxed text-left">
          <li>複数の目的を同時に選択して、複合的な仮面を作ることができます。</li>
          <li className="text-rose-600 font-black text-left">「パートナー活」カセットは1つだけ登録可能です。</li>
        </ul>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-12 text-left">
        {OBJECTIVE_PRESETS.map((preset) => (
          <button key={preset.id} onClick={() => onToggleObjective(preset.id)} className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all space-y-4 ${activeProfile.selectedObjectiveIds.includes(preset.id) ? 'bg-blue-600 border-blue-400 text-white shadow-xl scale-[1.05]' : 'bg-white border-slate-100 text-slate-400 shadow-md'}`}>
            {React.createElement(preset.icon, { size: 32 })}
            <span className="text-lg font-black uppercase tracking-tight text-center leading-tight">{preset.label}</span>
          </button>
        ))}
      </div>

      {/* 構成要素表示 */}
      {activeProfile.selectedSlots.length > 0 && (
        <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 animate-in slide-in-from-top-4 duration-500 shadow-inner text-left">
          <div className="flex items-center space-x-4 mb-8 text-left">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl shadow-sm text-left"><Component size={28} /></div>
            <h3 className="text-xl font-black text-slate-700 uppercase tracking-widest leading-none pt-1 text-left">現在の仮面の構成スロット</h3>
          </div>
          <div className="flex flex-wrap gap-6 text-left">
            {ALL_SLOTS.map(slot => {
              const isActive = activeProfile.selectedSlots.includes(slot.id);
              if (!isActive) return null;
              const sourceObjectives = activeProfile.selectedObjectiveIds.filter(objId => {
                const preset = OBJECTIVE_PRESETS.find(p => p.id === objId);
                return preset && preset.slots.includes(slot.id);
              });
              const isManual = sourceObjectives.length === 0;
              return (
                <div key={slot.id} className="flex flex-col space-y-2 animate-in fade-in zoom-in duration-300 text-left">
                  {isManual ? (
                    <button onClick={() => onToggleSlot(slot.id)} className="px-6 py-3 rounded-[1.25rem] flex items-center space-x-3 border-2 bg-white border-amber-200 text-amber-700 shadow-lg hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-all group relative text-left">
                      {React.createElement(slot.icon, { size: 24 })}
                      <span className="font-black">{slot.label}</span>
                      <div className="ml-2 p-1 bg-amber-100 rounded-lg group-hover:bg-red-200 transition-colors"><X size={16} /></div>
                    </button>
                  ) : (
                    <div className="px-6 py-3 rounded-[1.25rem] flex items-center space-x-3 border-2 bg-blue-50 border-blue-200 text-blue-700 shadow-sm text-left">
                      {React.createElement(slot.icon, { size: 24 })}
                      <span className="font-black text-left">{slot.label}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
