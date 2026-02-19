"use client";

import * as LucideIcons from 'lucide-react';
import React from 'react';
import { CATEGORIES, MANDALA_TEMPLATES } from './skill-comparison.sample-data';

interface SkillSelectorProps {
  readonly selectedCategory: string;
  readonly onSelectCategory: (id: string) => void;
  readonly focusedSkill: string;
  readonly onSelectSkill: (skill: string) => void;
}

/**
 * カテゴリとスキルのセレクター
 * 仕様書の「カテゴリとスキルの整合性」管理は Container 側で行われることを想定しています。
 * 文字サイズは 1rem (text-base) 以上を確保。
 */
export const SkillSelector: React.FC<SkillSelectorProps> = ({
  selectedCategory,
  onSelectCategory,
  focusedSkill,
  onSelectSkill,
}) => {
  return (
    <div className="space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
      {/* Category Selection */}
      <section>
        <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center">
          <LucideIcons.Layers size={14} className="mr-2" /> Domain Category
        </h4>
        <div className="flex space-x-3">
          {CATEGORIES.map((cat) => {
            const Icon = (LucideIcons as any)[cat.iconName] || LucideIcons.HelpCircle;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex-1 flex items-center justify-center space-x-3 py-3 px-5 rounded-xl border-2 transition-all ${isActive
                    ? 'bg-slate-900 border-slate-800 text-white shadow-md'
                    : 'bg-slate-50 border-slate-50 text-slate-500 hover:border-slate-200'
                  }`}
                aria-pressed={isActive}
              >
                <Icon size={18} className={isActive ? 'text-indigo-400' : 'text-slate-300'} />
                <span className="text-base font-black uppercase tracking-widest">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Skill Selection */}
      <section className="border-t border-slate-100 pt-6">
        <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center">
          <LucideIcons.Zap size={14} className="mr-2" /> Specific Skill
        </h4>
        <div className="flex flex-wrap gap-3">
          {Object.keys(MANDALA_TEMPLATES)
            .filter(skill => MANDALA_TEMPLATES[skill].category === selectedCategory)
            .map(skill => {
              const isActive = focusedSkill === skill;
              return (
                <button
                  key={skill}
                  onClick={() => onSelectSkill(skill)}
                  className={`py-3 px-6 rounded-lg text-base font-black uppercase transition-all border-2 ${isActive
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                      : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200'
                    }`}
                  aria-pressed={isActive}
                >
                  {skill}
                </button>
              );
            })}
        </div>
      </section>
    </div>
  );
};
