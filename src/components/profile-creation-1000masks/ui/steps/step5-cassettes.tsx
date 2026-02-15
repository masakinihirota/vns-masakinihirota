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

// Reusable Panel Component
const CassettePanel: React.FC<{
  title: string;
  slotLabel: string;
  icon: React.ReactNode;
  colorTheme: 'blue' | 'amber' | 'rose' | 'slate';
  children: React.ReactNode;
}> = ({ title, slotLabel, icon, colorTheme, children }) => {
  const themeStyles = {
    blue: {
      bg: 'bg-white',
      border: 'border-slate-100',
      borderL: 'border-l-blue-500',
      iconColor: 'text-blue-600',
      textColor: 'text-slate-800',
    },
    amber: {
      bg: 'bg-white',
      border: 'border-slate-100',
      borderL: 'border-l-amber-500',
      iconColor: 'text-amber-500',
      textColor: 'text-slate-800',
    },
    rose: {
      bg: 'bg-rose-50',
      border: 'border-rose-100',
      borderL: 'border-l-rose-500',
      iconColor: 'text-rose-600',
      textColor: 'text-rose-600', // Specialized for partner
    },
    slate: {
      bg: 'bg-slate-900',
      border: 'border-slate-800',
      borderL: 'border-l-blue-400',
      iconColor: 'text-blue-400',
      textColor: 'text-blue-400', // Specialized for politics
    }
  };

  const s = themeStyles[colorTheme];

  return (
    <div className={`p-10 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all border-l-8 text-left ${s.bg} ${s.border} ${s.borderL}`}>
      <div className={`flex items-center space-x-4 mb-8 text-left ${s.textColor}`}>
        <div className={s.iconColor}>{icon}</div>
        <div className="flex flex-col text-left">
          <span className="font-black text-xl uppercase tracking-tighter leading-none text-left">{title}</span>
          <span className={`text-[12px] font-bold uppercase mt-1 text-left ${colorTheme === 'slate' ? 'text-slate-500' : (colorTheme === 'rose' ? 'text-rose-400' : 'text-slate-400')}`}>{slotLabel}</span>
        </div>
      </div>
      {children}
    </div>
  );
};

export const Step5Cassettes: React.FC<Step5CassettesProps> = ({ activeProfile, onUpdateDraft, onOpenModal }) => {
  const [expandedValueCategory, setExpandedValueCategory] = useState<string | null>(null);

  return (
    <section>
      <StepHeader num="5" title="カセットの選択と装着" subtitle="選んだスロットに、どのカセット（データ）をセットするか決定します。" />
      {activeProfile.selectedSlots.length === 0 ? (
        <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 shadow-inner text-left">
          <LayoutGrid size={64} className="mx-auto text-slate-300 mb-6 opacity-30 text-center" />
          <p className="text-slate-400 font-black text-xl text-center">スロットを選択すると、対応するパネルが表示されます。</p>
        </div>
      ) : (
        <div className="flex flex-col gap-12 text-left">
          {/* 作品カセット */}
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
          {/* スキルカセット */}
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
          {/* パートナーカセット */}
          {activeProfile.selectedSlots.includes('partner_meta') && (
            <CassettePanel title="パートナーカセット" slotLabel="Slot: Partner" icon={<Heart size={36} />} colorTheme="rose">
              <div className="space-y-6 text-left">
                <p className="text-lg font-bold text-rose-500 leading-relaxed italic text-left">全プロフィール内で1つだけの限定カセットです。</p>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-lg font-black text-rose-600 tracking-widest ml-2 text-left">属性（男女など）</label>
                    <input type="text" className="w-full bg-white p-5 rounded-2xl border-none font-bold text-lg outline-none focus:ring-4 focus:ring-rose-200 shadow-inner text-left" />
                  </div>
                </div>
              </div>
            </CassettePanel>
          )}
          {/* 政治カセット */}
          {activeProfile.selectedSlots.includes('politics') && (
            <CassettePanel title="政治カセット" slotLabel="Slot: Politics" icon={<Flag size={36} />} colorTheme="slate">
              <div className="space-y-6 text-left">
                <div className="space-y-2">
                  <label className="text-lg font-black text-blue-400 tracking-widest ml-2 text-left">応援政党</label>
                  <input type="text" className="w-full bg-slate-800 p-5 rounded-2xl border-none font-bold text-lg outline-none focus:ring-4 focus:ring-blue-900 text-white text-left" />
                </div>
              </div>
            </CassettePanel>
          )}
        </div>
      )}

      {/* 価値観 (縦並び) */}
      {activeProfile.selectedSlots.includes('values') && (
        <div className="p-10 bg-white border border-slate-100 rounded-[4rem] shadow-xl mt-12 border-l-[12px] border-l-indigo-500 transition-all text-left">
          <div className="flex items-center justify-between mb-12 text-slate-800 text-left">
            <div className="flex items-center space-x-5 text-left">
              <MessageSquare size={36} className="text-indigo-600" />
              <span className="font-black text-xl tracking-tighter uppercase leading-none pt-2 text-left">価値観カセット装着</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 text-left">
            {VALUE_CATEGORIES.map(cat => (
              <div key={cat.id} className={`border-2 rounded-[2.5rem] overflow-hidden transition-all hover:shadow-xl hover:border-indigo-100 ${activeProfile.selectedValues.includes(cat.id) ? 'border-indigo-100 bg-indigo-50/20 ring-8 ring-indigo-50/50' : 'border-slate-50 bg-white shadow-md'} text-left`}>
                <button onClick={() => setExpandedValueCategory(expandedValueCategory === cat.id ? null : cat.id)} className="w-full flex items-center justify-between p-8 text-left">
                  <div className="flex items-center space-x-6 text-left">
                    <input
                      type="checkbox"
                      checked={activeProfile.selectedValues.includes(cat.id)}
                      disabled={cat.isRoot}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (cat.isRoot) return;
                        const newVals = activeProfile.selectedValues.includes(cat.id)
                          ? activeProfile.selectedValues.filter(v => v !== cat.id)
                          : [...activeProfile.selectedValues, cat.id];
                        onUpdateDraft({ selectedValues: newVals });
                      }}
                      className={`w-8 h-8 accent-indigo-600 cursor-pointer shadow-sm rounded-xl text-left ${cat.isRoot ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-lg font-black text-slate-400 flex items-center mb-1 uppercase tracking-widest leading-none text-left">{React.createElement(cat.icon, { size: 16, className: 'mr-2' })} {cat.id.split('_')[1]}</span>
                      <span className={`text-lg font-black leading-none text-left ${cat.isRoot ? 'text-indigo-600' : 'text-slate-700'}`}>{cat.name} {cat.isRoot && <span className="text-xs ml-2 bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">必須</span>}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 ml-4 text-left">
                    <span className="text-lg font-black text-slate-400 mb-2 leading-none text-left">{cat.answered}/{cat.total}</span>
                    <div className="w-24 bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner text-left"><div className="h-full bg-indigo-500 transition-all duration-1000 text-left" style={{ width: `${(cat.answered / cat.total) * 100}%` }} /></div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
