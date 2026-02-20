"use client";

import { Clock, Filter, Layers } from "lucide-react";
import React from "react";
import {
  AxisKey,
  CATEGORIES,
  CategoryKey,
  FilterConfig,
  TEMPORAL_AXIS,
  TierKey,
  TIERS,
} from "./comparison.logic";

interface VisibilityControlsProps {
  readonly filters: FilterConfig;
  readonly onChange: (updater: (prev: FilterConfig) => FilterConfig) => void;
}

/**
 * ティア、カテゴリ、三世（時間軸）の表示制御を行うツールバー
 */
export const VisibilityControls: React.FC<VisibilityControlsProps> = ({
  filters,
  onChange,
}) => {
  const toggleFilter = <K extends keyof FilterConfig>(
    group: K,
    key: keyof FilterConfig[K]
  ) => {
    onChange((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: !prev[group][key],
      },
    }));
  };

  return (
    <div className="bg-white border-b border-slate-100 px-8 py-4 flex flex-col space-y-4 shadow-sm shrink-0">
      {/* Tier Filter */}
      <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar">
        <div className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest shrink-0 w-32">
          <Filter size={14} className="mr-3" aria-hidden="true" />
          <span>Tier</span>
        </div>
        <div className="flex gap-2">
          {Object.entries(TIERS).map(([key, tier]) => (
            <button
              key={key}
              onClick={() => toggleFilter("tier", key as TierKey)}
              className={`px-4 py-1.5 rounded-lg border text-sm font-black transition-all duration-200 ${
                filters.tier[key as TierKey]
                  ? `${tier.color} ${tier.text} border-transparent shadow-sm scale-105`
                  : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>

      {/* Attribute Filter */}
      <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar border-t border-slate-50 pt-3">
        <div className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest shrink-0 w-32">
          <Layers size={14} className="mr-3" aria-hidden="true" />
          <span>Attribute</span>
        </div>
        <div className="flex gap-2">
          {Object.entries(CATEGORIES).map(([key, cat]) => {
            const Icon = cat.icon;
            const active = filters.cat[key as CategoryKey];
            return (
              <button
                key={key}
                onClick={() => toggleFilter("cat", key as CategoryKey)}
                className={`flex items-center space-x-2.5 px-5 py-1.5 rounded-lg border text-sm font-black transition-all duration-200 ${
                  active
                    ? `${cat.bgColor} ${cat.color} border-current shadow-sm scale-105`
                    : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Epoch Filter */}
      <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar border-t border-slate-50 pt-3">
        <div className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest shrink-0 w-32">
          <Clock size={14} className="mr-3" aria-hidden="true" />
          <span>三世 (Epoch)</span>
        </div>
        <div className="flex gap-2">
          {Object.entries(TEMPORAL_AXIS).map(([key, axis]) => {
            const Icon = axis.icon;
            const active = filters.temporal[key as AxisKey];
            return (
              <button
                key={key}
                onClick={() => toggleFilter("temporal", key as AxisKey)}
                className={`flex items-center space-x-2.5 px-5 py-1.5 rounded-lg border text-sm font-black transition-all duration-200 ${
                  active
                    ? `${axis.bgColor} ${axis.color} border-current shadow-sm scale-105`
                    : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                <span>{axis.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
