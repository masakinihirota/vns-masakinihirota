import { CheckCircle2, Circle } from 'lucide-react';
import React from 'react';
import { ALL_SLOTS, Profile, SlotId } from '../../profile-creation-1000masks.logic';
import { StepHeader } from '../step-header';

interface Step4SlotsProps {
  activeProfile: Profile;
  onToggleSlot: (id: SlotId) => void;
}

export const Step4Slots: React.FC<Step4SlotsProps> = ({ activeProfile, onToggleSlot }) => {
  return (
    <section>
      <StepHeader num="4" title="スロットの構成" subtitle="「３．プロフィールの目的」のスロットの組み合わせを決定します。" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        {ALL_SLOTS.map(slot => (
          <button key={slot.id} onClick={() => onToggleSlot(slot.id)} className={`flex items-center space-x-4 p-6 rounded-[2rem] border-2 transition-all ${activeProfile.selectedSlots.includes(slot.id) ? 'bg-white border-blue-500 shadow-xl text-blue-900 ring-4 ring-blue-50' : 'bg-slate-50/50 border-transparent text-slate-400 hover:bg-white hover:border-slate-200'}`}>
            <div className={activeProfile.selectedSlots.includes(slot.id) ? 'text-blue-600' : 'text-slate-300'}>{activeProfile.selectedSlots.includes(slot.id) ? <CheckCircle2 size={28} /> : <Circle size={28} />}</div>
            <div className="flex items-center space-x-3 text-left">
              {React.createElement(slot.icon, { size: 24, className: activeProfile.selectedSlots.includes(slot.id) ? 'text-blue-500' : 'opacity-40' })}
              <span className="text-lg font-black tracking-tight text-left">{slot.label}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
