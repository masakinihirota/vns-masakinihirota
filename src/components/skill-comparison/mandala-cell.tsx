"use client";

import {
  Activity,
  Brain,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import React from "react";
import { MANDALA_STATUS, MandalaStatus } from "./skill-comparison.logic";

interface MandalaCellProps {
  readonly label: string;
  readonly status?: MandalaStatus;
  readonly isCenter?: boolean;
}

/**
 * マンダラチャートの個別セル
 *
 * 指定されたステータスに応じて、背景色、文字色、およびアイコンを切り替えて表示します。
 * 全てのテキストは 1rem (16px) 以上を確保しています。
 */
export const MandalaCell: React.FC<MandalaCellProps> = ({
  label,
  status = MANDALA_STATUS.EMPTY,
  isCenter = false,
}) => {
  if (isCenter) {
    return (
      <div
        className="flex flex-col items-center justify-center bg-slate-900 text-white rounded-xl shadow-inner border border-slate-700 p-4 text-center h-28"
        data-testid="mandala-cell-center"
      >
        <Brain size={24} className="mb-2 text-indigo-400" />
        <span className="text-base font-black uppercase leading-tight tracking-tighter">
          {label}
        </span>
      </div>
    );
  }

  const getStyle = () => {
    switch (status) {
      case MANDALA_STATUS.SYNC:
        return "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm ring-1 ring-indigo-100";
      case MANDALA_STATUS.ADVICE:
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      case MANDALA_STATUS.LEARN:
        return "bg-amber-50 border-amber-200 text-amber-700";
      default:
        return "bg-white border-slate-100 text-slate-300 opacity-60";
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border-2 p-4 text-center transition-all h-28 ${getStyle()}`}
      data-testid={`mandala-cell-${status}`}
    >
      <span className="text-base font-bold leading-tight mb-2 px-1">
        {label}
      </span>
      <div className="flex items-center space-x-1 h-8">
        {status === MANDALA_STATUS.SYNC && (
          <Activity
            size={24}
            className="text-indigo-500 animate-pulse"
            aria-label="Sync Mode"
          />
        )}
        {status === MANDALA_STATUS.ADVICE && (
          <div
            className="flex flex-col items-center text-[10px] font-black"
            aria-label="Advice Mode"
          >
            <ChevronRight size={28} strokeWidth={3} />
            <span className="tracking-tighter">ADVICE</span>
          </div>
        )}
        {status === MANDALA_STATUS.LEARN && (
          <div
            className="flex flex-col items-center text-[10px] font-black"
            aria-label="Learning Mode"
          >
            <ChevronLeft size={28} strokeWidth={3} />
            <span className="tracking-tighter">LEARN</span>
          </div>
        )}
        {status === MANDALA_STATUS.EMPTY && (
          <HelpCircle size={20} className="opacity-20" aria-label="Empty" />
        )}
      </div>
    </div>
  );
};
