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
    <section className="transition-colors duration-300">
      <StepHeader num="2" title="プロフィールのタイプ" subtitle="立脚点の決定" />
      <div className="flex flex-col gap-4 text-left">
        {PROFILE_TYPES.map((type) => {
          const isSelected = activeProfile.selectedTypeId === type.id;
          return (
            <button
              key={type.id}
              onClick={() => onUpdateDraft({ selectedTypeId: type.id as ProfileTypeId })}
              className={`flex items-start p-8 rounded-[2rem] border-4 transition-all text-left group w-full ${isSelected
                  ? 'bg-blue-600 dark:bg-blue-700 border-blue-400 dark:border-blue-500 text-white shadow-xl scale-[1.02]'
                  : type.isSpecial
                    ? 'bg-amber-50/30 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30 text-slate-500 dark:text-slate-400 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 shadow-sm'
                    : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/10 shadow-sm'
                }`}
            >
              <div className={`p-5 rounded-2xl mr-8 transition-colors shrink-0 ${isSelected
                  ? 'bg-blue-500 dark:bg-blue-600 text-white shadow-inner'
                  : 'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-slate-600 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-500 dark:group-hover:text-blue-400'
                }`}>
                {React.createElement(type.icon, { size: 32 })}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between mb-2 text-left">
                  <span className={`text-lg font-black ${isSelected ? 'text-white' : 'text-slate-800 dark:text-neutral-200'}`}>{type.label}</span>
                  {isSelected && (
                    <div className="p-1 rounded-full bg-blue-500 dark:bg-blue-600 text-white shadow-lg animate-in zoom-in duration-300">
                      <CheckCircle2 size={24} />
                    </div>
                  )}
                </div>
                <p className={`text-lg font-bold leading-relaxed ${isSelected ? 'text-blue-50/80 dark:text-blue-200/70' : 'text-slate-400 dark:text-slate-500'}`}>
                  {type.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
