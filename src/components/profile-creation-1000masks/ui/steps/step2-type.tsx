import { CheckCircle2 } from 'lucide-react';
import React from 'react';
import { Profile, PROFILE_TYPES, ProfileTypeId } from '../../profile-creation-1000masks.logic';
import { StepHeader } from '../step-header';

interface Step2TypeProps {
  activeProfile: Profile;
  onUpdateDraft: (updatedFields: Partial<Profile>) => void;
}

export const Step2Type: React.FC<Step2TypeProps> = ({ activeProfile, onUpdateDraft }) => {
  return (
    <section>
      <StepHeader num="2" title="プロフィールのタイプ" subtitle="立脚点の決定" />
      <div className="flex flex-col gap-4 text-left">
        {PROFILE_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => onUpdateDraft({ selectedTypeId: type.id as ProfileTypeId })}
            className={`flex items-start p-8 rounded-[2rem] border-4 transition-all text-left group w-full ${activeProfile.selectedTypeId === type.id
                ? 'bg-blue-600 border-blue-400 text-white shadow-xl scale-[1.02]'
                : type.isSpecial
                  ? 'bg-amber-50/30 border-amber-100 text-slate-500 hover:border-amber-300 hover:bg-amber-50 shadow-sm'
                  : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
              }`}
          >
            <div className={`p-5 rounded-2xl mr-8 transition-colors shrink-0 ${activeProfile.selectedTypeId === type.id ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
              {React.createElement(type.icon, { size: 32 })}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2 text-left">
                <span className={`text-lg font-black ${activeProfile.selectedTypeId === type.id ? 'text-white' : 'text-slate-800'}`}>{type.label}</span>
                {activeProfile.selectedTypeId === type.id && <div className="p-1 rounded-full bg-blue-500 text-white shadow-lg"><CheckCircle2 size={24} /></div>}
              </div>
              <p className={`text-lg font-bold leading-relaxed ${activeProfile.selectedTypeId === type.id ? 'text-blue-50/80' : 'text-slate-400'}`}>{type.description}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
