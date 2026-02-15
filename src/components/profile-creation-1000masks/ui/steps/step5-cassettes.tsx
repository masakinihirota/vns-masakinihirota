import { Flag, Heart, Layers, LayoutGrid, MessageSquare, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { INITIAL_SKILL_CASSETTES, INITIAL_WORKS_CASSETTES, Profile, VALUE_CATEGORIES } from '../../profile-creation-1000masks.logic';
import { StepHeader } from '../step-header';
import { TabSelector } from '../tab-selector';

interface Step5CassettesProps {
  activeProfile: Profile;
  onUpdateDraft: (updatedFields: Partial<Profile>) => void;
  onOpenModal: (type: 'info', message: string) => void;
}

const CassettePanel: React.FC<{
  title: string;
  slotLabel: string;
  icon: React.ReactNode;
  colorTheme: 'blue' | 'amber' | 'rose' | 'slate';
  children: React.ReactNode;
}> = ({ title, slotLabel, icon, colorTheme, children }) => {
  const themeStyles = {
    blue: {
      bg: 'bg-white dark:bg-white/5',
      border: 'border-slate-100 dark:border-white/10',
      borderL: 'border-l-blue-500',
      iconColor: 'text-blue-600 dark:text-blue-400',
      textColor: 'text-slate-800 dark:text-neutral-200',
    },
    amber: {
      bg: 'bg-white dark:bg-white/5',
      border: 'border-slate-100 dark:border-white/10',
      borderL: 'border-l-amber-500',
      iconColor: 'text-amber-500 dark:text-amber-400',
      textColor: 'text-slate-800 dark:text-neutral-200',
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-900/10',
      border: 'border-rose-100 dark:border-rose-900/30',
      borderL: 'border-l-rose-500',
      iconColor: 'text-rose-600 dark:text-rose-400',
      textColor: 'text-rose-600 dark:text-rose-400',
    },
    slate: {
      bg: 'bg-slate-900 dark:bg-black/40',
      border: 'border-slate-800 dark:border-white/5',
      borderL: 'border-l-blue-400',
      iconColor: 'text-blue-400',
      textColor: 'text-blue-400',
    }
  };

  const s = themeStyles[colorTheme];

  return (
    <div className={`p-10 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all border-l-8 text-left ${s.bg} ${s.border} ${s.borderL}`}>
      <div className={`flex items-center space-x-4 mb-8 text-left ${s.textColor}`}>
        <div className={s.iconColor}>{icon}</div>
        <div className="flex flex-col text-left">
          <span className="font-black text-xl uppercase tracking-tighter leading-none">{title}</span>
          <span className={`text-[12px] font-bold uppercase mt-1 ${colorTheme === 'slate' ? 'text-slate-500' : (colorTheme === 'rose' ? 'text-rose-400' : 'text-slate-400 dark:text-slate-500')}`}>{slotLabel}</span>
        </div>
      </div>
      {children}
    </div>
  );
};

export const Step5Cassettes: React.FC<Step5CassettesProps> = ({ activeProfile, onUpdateDraft, onOpenModal }) => {
  const [expandedValueCategory, setExpandedValueCategory] = useState<string | null>(null);

  return (
    <section className="transition-colors duration-300">
      <StepHeader num="5" title="カセットの選択と装着" subtitle="選んだスロットに、どのカセット（データ）をセットするか決定します。" />
      {activeProfile.selectedSlots.length === 0 ? (
        <div className="py-20 text-center bg-slate-50 dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/10 shadow-inner group">
          <LayoutGrid size={64} className="mx-auto text-slate-300 dark:text-slate-700 mb-6 opacity-30 group-hover:scale-110 transition-transform duration-500" />
          <p className="text-slate-400 dark:text-slate-500 font-black text-xl">スロットを選択すると、対応するパネルが表示されます。</p>
        </div>
      ) : (
        <div className="flex flex-col gap-12 text-left">
          {activeProfile.selectedSlots.includes('works') && (
            <CassettePanel title="作品スロット" slotLabel="Slot: Works" icon={<Layers size={32} />} colorTheme="blue">
              <TabSelector
                label="装着するカセットを選択"
                sets={INITIAL_WORKS_CASSETTES}
                selectedId={activeProfile.workSetId || 'ws1'}
                onSelect={(id) => onUpdateDraft({ workSetId: id })}
                onCreateNew={() => onOpenModal('info', '作品用カセット作成画面へ移動します。')}
              />
            </CassettePanel>
          )}
          {activeProfile.selectedSlots.includes('skills') && (
            <CassettePanel title="スキルステータス" slotLabel="Slot: Skills" icon={<Zap size={32} />} colorTheme="amber">
              <TabSelector
                label="装着するカセットを選択"
                sets={INITIAL_SKILL_CASSETTES}
                selectedId={activeProfile.skillSetId || 'ss1'}
                onSelect={(id) => onUpdateDraft({ skillSetId: id })}
                onCreateNew={() => onOpenModal('info', 'スキル用カセット作成画面へ移動します。')}
              />
            </CassettePanel>
          )}
          {activeProfile.selectedSlots.includes('partner_meta') && (
            <CassettePanel title="パートナーカセット" slotLabel="Slot: Partner" icon={<Heart size={36} />} colorTheme="rose">
              <div className="space-y-6 text-left">
                <p className="text-lg font-bold text-rose-500 dark:text-rose-400 leading-relaxed italic">全プロフィール内で1つだけの限定カセットです。</p>
                <div className="space-y-2">
                  <label className="text-lg font-black text-rose-600 dark:text-rose-400 tracking-widest ml-2">属性（男女など）</label>
                  <input
                    type="text"
                    className="w-full bg-white dark:bg-[#161B22] p-5 rounded-2xl border-none font-bold text-lg outline-none focus:ring-4 focus:ring-rose-200 dark:focus:ring-rose-900 shadow-inner text-slate-800 dark:text-neutral-200"
                    placeholder="属性を入力..."
                  />
                </div>
              </div>
            </CassettePanel>
          )}
          {activeProfile.selectedSlots.includes('politics') && (
            <CassettePanel title="政治カセット" slotLabel="Slot: Politics" icon={<Flag size={36} />} colorTheme="slate">
              <div className="space-y-6 text-left">
                <div className="space-y-2">
                  <label className="text-lg font-black text-blue-400 tracking-widest ml-2">応援政党</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800 dark:bg-black/40 p-5 rounded-2xl border-none font-bold text-lg outline-none focus:ring-4 focus:ring-blue-900 text-white dark:text-blue-300 shadow-inner"
                    placeholder="政党名を入力..."
                  />
                </div>
              </div>
            </CassettePanel>
          )}
        </div>
      )}

      {activeProfile.selectedSlots.includes('values') && (
        <div className="p-10 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[4rem] shadow-xl mt-12 border-l-[12px] border-l-indigo-500 transition-all text-left">
          <div className="flex items-center justify-between mb-12 text-slate-800 dark:text-neutral-100">
            <div className="flex items-center space-x-5">
              <MessageSquare size={36} className="text-indigo-600 dark:text-indigo-400" />
              <span className="font-black text-xl tracking-tighter uppercase leading-none pt-2">価値観カセット装着</span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {VALUE_CATEGORIES.map(cat => {
              const isSelected = activeProfile.selectedValues.includes(cat.id);
              const isExpanded = expandedValueCategory === cat.id;
              return (
                <div key={cat.id} className={`border-2 rounded-[2.5rem] overflow-hidden transition-all hover:shadow-xl ${isSelected
                    ? 'border-indigo-100 dark:border-indigo-900 bg-indigo-50/20 dark:bg-indigo-900/10 ring-8 ring-indigo-50/50 dark:ring-indigo-900/20'
                    : 'border-slate-50 dark:border-white/5 bg-white dark:bg-transparent shadow-md'
                  }`}>
                  <button onClick={() => setExpandedValueCategory(isExpanded ? null : cat.id)} className="w-full flex items-center justify-between p-8 text-left">
                    <div className="flex items-center space-x-6">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={cat.isRoot}
                        onChange={(e) => {
                          e.stopPropagation();
                          if (cat.isRoot) return;
                          const newVals = isSelected
                            ? activeProfile.selectedValues.filter(v => v !== cat.id)
                            : [...activeProfile.selectedValues, cat.id];
                          onUpdateDraft({ selectedValues: newVals });
                        }}
                        className={`w-8 h-8 accent-indigo-600 dark:accent-indigo-500 cursor-pointer shadow-sm rounded-xl ${cat.isRoot ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-slate-400 dark:text-slate-600 flex items-center mb-1 uppercase tracking-widest leading-none">
                          {React.createElement(cat.icon, { size: 16, className: 'mr-2' })} {cat.id.split('_')[1]}
                        </span>
                        <span className={`text-lg font-black leading-none ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-400'}`}>
                          {cat.name} {cat.isRoot && <span className="text-xs ml-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-full">必須</span>}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0 ml-4">
                      <span className="text-lg font-black text-slate-400 dark:text-slate-600 mb-2 leading-none">{cat.answered}/{cat.total}</span>
                      <div className="w-24 bg-slate-100 dark:bg-white/10 h-2.5 rounded-full overflow-hidden shadow-inner uppercase">
                        <div className="h-full bg-indigo-500 dark:bg-indigo-600 transition-all duration-1000" style={{ width: `${(cat.answered / cat.total) * 100}%` }} />
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
