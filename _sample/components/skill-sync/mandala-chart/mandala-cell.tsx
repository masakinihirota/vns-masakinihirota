"use client";

import {
  Activity,
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  UserCheck,
} from "lucide-react";
import React from "react";

import { CellStatus, ViewMode } from "../types";

interface MandalaCellProperties {
  readonly label: string;
  readonly status: CellStatus;
  readonly isCenter?: boolean;
  readonly viewMode: ViewMode;
}

/**
 * 3x3 マンダラチャートの各セル
 * 仕様書の「ADVICE/LEARN/SYNCロジック」および「自分/相手のみモード」を反映
 * @param root0
 * @param root0.label
 * @param root0.status
 * @param root0.isCenter
 * @param root0.viewMode
 */
export const MandalaCell: React.FC<MandalaCellProperties> = ({
  label,
  status,
  isCenter = false,
  viewMode,
}) => {
  // 中央のセル（スキル名）
  if (isCenter) {
    return (
      <div className="flex h-32 flex-col items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 p-3 text-center text-white shadow-inner">
        <Brain size={28} className="mb-2 text-indigo-400" />
        <span className="text-[1.1rem] font-black uppercase leading-tight tracking-tighter">
          {label}
        </span>
      </div>
    );
  }

  // 表示設定に基づくコンフィグ取得
  const getCellConfig = () => {
    // 1. 自分のみモード
    if (viewMode === "me") {
      return status === "ADVICE" || status === "SYNC"
        ? {
            style: "bg-emerald-50 border-emerald-200 text-emerald-700",
            icon: <CheckCircle2 size={24} />,
            label: "MY SKILL",
          }
        : {
            style: "bg-white border-slate-100 text-slate-300 opacity-20",
            icon: undefined,
            label: undefined,
          };
    }

    // 2. 相手のみモード
    if (viewMode === "target") {
      return status === "LEARN" || status === "SYNC"
        ? {
            style: "bg-amber-50 border-amber-200 text-amber-700",
            icon: <UserCheck size={24} />,
            label: "TARGET SKILL",
          }
        : {
            style: "bg-white border-slate-100 text-slate-300 opacity-20",
            icon: undefined,
            label: undefined,
          };
    }

    // 3. すべて比較モード
    switch (status) {
      case "SYNC": {
        return {
          style:
            "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm ring-1 ring-indigo-100",
          icon: <Activity size={28} className="animate-pulse" />,
          label: "SYNC",
        };
      }
      case "ADVICE": {
        return {
          style: "bg-emerald-50 border-emerald-200 text-emerald-700",
          icon: <ChevronRight size={32} strokeWidth={3} />,
          label: "ADVICE",
        };
      }
      case "LEARN": {
        return {
          style: "bg-amber-50 border-amber-200 text-amber-700",
          icon: <ChevronLeft size={32} strokeWidth={3} />,
          label: "LEARN",
        };
      }
      default: {
        return {
          style: "bg-white border-slate-100 text-slate-300 opacity-40",
          icon: <HelpCircle size={24} className="opacity-10" />,
          label: undefined,
        };
      }
    }
  };

  const config = getCellConfig();

  return (
    <div
      className={`flex h-32 flex-col items-center justify-center rounded-2xl border-2 p-3 text-center transition-all duration-300 ${config.style}`}
      aria-label={`${label}: ${config.label ?? "未習得"}`}
    >
      <span className="mb-2 px-1 text-[1rem] font-bold leading-snug">
        {label}
      </span>
      <div className="flex flex-col items-center">
        {config.icon}
        {config.label && (
          <span className="mt-2 text-[0.8rem] font-black uppercase tracking-tighter">
            {config.label}
          </span>
        )}
      </div>
    </div>
  );
};
