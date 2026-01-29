import { Briefcase, Users, HelpCircle, Info } from "lucide-react";
import React from "react";
import { WeekSchedule, WeekStatus, DAYS, DayKey } from "./types";

interface WeekSchedulerProps {
  value: WeekSchedule;
  onChange?: (value: WeekSchedule) => void;
  readOnly?: boolean;
}

const STATUS_CONFIG = {
  BUSY: {
    label: "予定あり",
    color: "bg-blue-500",
    icon: Briefcase,
    desc: "本業・学業・私用・集中時間などで埋まっている状態です。",
  },
  MATCH: {
    label: "マッチング可",
    color: "bg-emerald-500",
    icon: Users,
    desc: "共同作業やチャット、副業の相談が可能な時間です。",
  },
  PENDING: {
    label: "未定",
    color: "bg-slate-400",
    icon: HelpCircle,
    desc: "予定がまだ確定していない、あるいは調整可能です。",
  },
} as const;

export const WeekScheduler: React.FC<WeekSchedulerProps> = ({
  value,
  onChange,
  readOnly = false,
}) => {
  const toggleStatus = (dayKey: DayKey) => {
    if (readOnly || !onChange) return;

    const current = value[dayKey];
    let next: WeekStatus;
    if (current === "BUSY") next = "MATCH";
    else if (current === "MATCH") next = "PENDING";
    else next = "BUSY";

    onChange({ ...value, [dayKey]: next });
  };

  return (
    <div className={readOnly ? "" : "space-y-8"}>
      <div>
        <div className="grid grid-cols-7 gap-1 sm:gap-4 mb-4">
          {DAYS.map((day) => {
            const status = value[day.key];
            const config = STATUS_CONFIG[status];
            const Icon = config.icon;
            return (
              <div key={day.key} className="flex flex-col items-center">
                <div
                  className={`text-xs sm:text-lg font-bold mb-2 ${
                    day.key === "sun"
                      ? "text-red-500"
                      : day.key === "sat"
                        ? "text-blue-500"
                        : "text-slate-400"
                  }`}
                >
                  {day.label}
                </div>
                <button
                  type="button"
                  onClick={() => toggleStatus(day.key)}
                  disabled={readOnly}
                  aria-label={
                    readOnly
                      ? `${day.key} status: ${config.label}`
                      : `${day.key} assigned status "${config.label}". Click to change.`
                  }
                  className={`w-full aspect-square max-w-[50px] sm:max-w-[80px] rounded-xl sm:rounded-3xl flex items-center justify-center transition-all transform shadow-sm ${config.color} text-white ${
                    readOnly
                      ? "cursor-default opacity-90"
                      : "active:scale-95 hover:brightness-110"
                  }`}
                >
                  <Icon size={20} className="sm:w-7 sm:h-7" />
                </button>
                <span className="mt-2 text-[10px] sm:text-sm font-bold text-slate-700 text-center leading-tight">
                  {config.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {!readOnly && (
        <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Info size={16} />
            ステータス凡例
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {(
              Object.entries(STATUS_CONFIG) as [
                WeekStatus,
                (typeof STATUS_CONFIG)[WeekStatus],
              ][]
            ).map(([key, info]) => {
              const Icon = info.icon;
              return (
                <div key={key} className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 shrink-0 rounded-xl ${info.color} text-white shadow-sm flex items-center justify-center`}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {info.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{info.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
