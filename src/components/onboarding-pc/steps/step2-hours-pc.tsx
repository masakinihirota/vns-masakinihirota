import { AlertCircle } from "lucide-react";
import React from "react";
import {
  WeekScheduler,
  WeekSchedulerProps,
} from "@/components/ui/week-scheduler/week-scheduler";
import { timeToHours } from "@/lib/root-account-utils";
import { DailyScheduleEditor } from "./daily-schedule-editor";

interface Step2HoursPCProps {
  data: any;
  onUpdate: (data: any) => void;
  weekSchedulerProps?: Partial<WeekSchedulerProps>;
  holidayLabel?: string;
}

export const Step2HoursPC: React.FC<Step2HoursPCProps> = ({
  data,
  onUpdate,
  weekSchedulerProps,
  holidayLabel = "休日用 (Holiday)",
}) => {
  // Total hours calculation helper
  const calculateTotal = (
    startKey: string,
    endKey: string,
    subStartKey?: string,
    subEndKey?: string
  ) => {
    const start1 = timeToHours(data[startKey] || "09:00");
    const end1 = timeToHours(data[endKey] || "18:00");
    const total1 = end1 - start1;

    let total2 = 0;
    if (subStartKey && subEndKey && data[subStartKey] && data[subEndKey]) {
      const start2 = timeToHours(data[subStartKey]);
      const end2 = timeToHours(data[subEndKey]);
      total2 = end2 - start2;
    }

    return Math.max(0, total1 + total2);
  };

  const workTotalHours = calculateTotal(
    "core_activity_start",
    "core_activity_end",
    "core_activity_2_start",
    "core_activity_2_end"
  );
  const holidayTotalHours = calculateTotal(
    "holidayActivityStart",
    "holidayActivityEnd",
    "holidayActivity2Start",
    "holidayActivity2End"
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          アクティブ時間（コアタイム、連絡OKな時間帯）
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          主に活動する時間帯を設定してください。マッチング等の参考にされます。
        </p>
      </div>

      {/* Week Schedule */}
      {data.week_schedule && (
        <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
              週間リズム (Weekly Rhythm)
            </h3>
            <p className="text-sm text-slate-500 mt-1 ml-3">
              曜日ごとの基本的な活動ステータスを設定します。
            </p>
          </div>
          <WeekScheduler
            value={data.week_schedule}
            onChange={(val) => onUpdate({ week_schedule: val })}
            {...weekSchedulerProps}
          />
        </div>
      )}

      {/* Work Schedule */}
      <div className="space-y-4">
        <DailyScheduleEditor
          label="仕事用 (Weekday)"
          startKey="core_activity_start"
          endKey="core_activity_end"
          subStartKey="core_activity_2_start"
          subEndKey="core_activity_2_end"
          data={data}
          onUpdate={onUpdate}
        />
        {/* Warning or Total for Work */}
        <div
          className={`p-4 rounded-lg border flex items-start gap-3 ${
            workTotalHours < 8
              ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
              : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
          }`}
        >
          <AlertCircle
            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              workTotalHours < 8
                ? "text-amber-600 dark:text-amber-400"
                : "text-blue-600 dark:text-blue-400"
            }`}
          />
          <div>
            <p
              className={`text-sm font-semibold ${
                workTotalHours < 8
                  ? "text-amber-900 dark:text-amber-100"
                  : "text-blue-900 dark:text-blue-100"
              }`}
            >
              仕事用 合計活動時間: {workTotalHours.toFixed(1)}時間
            </p>
          </div>
        </div>
      </div>

      {/* Holiday Schedule */}
      <div className="space-y-4">
        <DailyScheduleEditor
          label={holidayLabel}
          startKey="holidayActivityStart"
          endKey="holidayActivityEnd"
          subStartKey="holidayActivity2Start"
          subEndKey="holidayActivity2End"
          data={data}
          onUpdate={onUpdate}
          colorClass="bg-emerald-500"
          thumbColorClass="border-emerald-500"
        />
        {/* Warning or Total for Holiday */}
        <div
          className={`p-4 rounded-lg border flex items-start gap-3 ${
            holidayTotalHours < 8
              ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
              : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
          }`}
        >
          <AlertCircle
            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              holidayTotalHours < 8
                ? "text-amber-600 dark:text-amber-400"
                : "text-green-600 dark:text-green-400"
            }`}
          />
          <div>
            <p
              className={`text-sm font-semibold ${
                holidayTotalHours < 8
                  ? "text-amber-900 dark:text-amber-100"
                  : "text-green-900 dark:text-green-100"
              }`}
            >
              {holidayLabel.split(" ")[0]} 合計活動時間:{" "}
              {holidayTotalHours.toFixed(1)}時間
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
