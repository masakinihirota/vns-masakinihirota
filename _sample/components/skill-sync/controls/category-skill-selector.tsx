"use client";

import { Layers, Zap } from "lucide-react";
import React from "react";

import { CATEGORIES, MANDALA_TEMPLATES } from "../constants";
import { CategoryId } from "../types";

interface ControlsProperties {
  readonly selectedCategory: CategoryId;
  readonly focusedSkill: string;
  readonly onCategoryChange: (id: CategoryId) => void;
  readonly onSkillChange: (skill: string) => void;
}

/**
 * 中央コントロール: カテゴリとスキルの選択
 * @param root0
 * @param root0.selectedCategory
 * @param root0.focusedSkill
 * @param root0.onCategoryChange
 * @param root0.onSkillChange
 */
export const CategorySkillSelector: React.FC<ControlsProperties> = ({
  selectedCategory,
  focusedSkill,
  onCategoryChange,
  onSkillChange,
}) => {
  const currentSkills = Object.keys(MANDALA_TEMPLATES).filter(
    (s) => MANDALA_TEMPLATES[s].category === selectedCategory
  );

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      {/* ドメインカテゴリ */}
      <div>
        <h4 className="mb-4 flex items-center text-[0.85rem] font-black uppercase tracking-[0.2em] text-slate-400">
          <Layers size={14} className="mr-2" /> Domain Category
        </h4>
        <div className="flex gap-3">
          {Object.values(CATEGORIES).map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`flex flex-1 items-center justify-center space-x-3 rounded-2xl border-2 px-6 py-3 transition-all ${
                  isSelected
                    ? "border-slate-800 bg-slate-900 text-white shadow-md"
                    : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200"
                }`}
              >
                <cat.icon
                  size={18}
                  className={isSelected ? "text-indigo-400" : "text-slate-300"}
                />
                <span className="text-[1rem] font-black uppercase tracking-widest">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* スキル項目 */}
      <div className="border-t border-slate-100 pt-6">
        <h4 className="mb-4 flex items-center text-[0.85rem] font-black uppercase tracking-[0.2em] text-slate-400">
          <Zap size={14} className="mr-2" /> Specific Skill
        </h4>
        <div className="flex flex-wrap gap-3">
          {currentSkills.map((skill) => {
            const isSelected = focusedSkill === skill;
            return (
              <button
                key={skill}
                onClick={() => onSkillChange(skill)}
                className={`rounded-xl border-2 px-6 py-2.5 text-[0.95rem] font-black uppercase transition-all ${
                  isSelected
                    ? "border-indigo-400 bg-indigo-600 text-white shadow-md"
                    : "border-slate-100 bg-white text-slate-500 hover:border-indigo-200"
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
