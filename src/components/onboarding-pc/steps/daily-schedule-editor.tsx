import * as Slider from "@radix-ui/react-slider";
import { Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { timeToHours, hoursToTime } from "@/lib/root-account-utils";

interface DailyScheduleEditorProps {
  label: string;
  startKey: string;
  endKey: string;
  subStartKey?: string;
  subEndKey?: string;
  data: any;
  onUpdate: (data: any) => void;
  colorClass?: string;
  thumbColorClass?: string;
}

export const DailyScheduleEditor: React.FC<DailyScheduleEditorProps> = ({
  label,
  startKey,
  endKey,
  subStartKey,
  subEndKey,
  data,
  onUpdate,
  colorClass = "bg-indigo-500",
  thumbColorClass = "border-indigo-500",
}) => {
  // Local state for smoother interactions, synced with props
  const [isSubCoreHourEnabled, setIsSubCoreHourEnabled] = useState(
    !!(subStartKey && subEndKey && data[subStartKey] && data[subEndKey])
  );

  // Derived states for next day ending
  const nextDayEndHour =
    timeToHours(data[endKey] || "18:00") > 24
      ? timeToHours(data[endKey]) - 24
      : 0;

  const nextDayEndHour2 =
    subEndKey && timeToHours(data[subEndKey] || "00:00") > 24
      ? timeToHours(data[subEndKey]) - 24
      : 0;

  const handleChange = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  // Main slider logic
  const handleMainSliderChange = (values: number[]) => {
    const start = values[0];
    const end = Math.max(values[0], values[1]); // Ensure end >= start

    handleChange(startKey, hoursToTime(start));

    // Preserve next day offset if currently set, unless slider pulled back < 24
    if (end < 24) {
      handleChange(endKey, hoursToTime(end));
    } else {
      // Keep existing overflow calculation if dragging the 24 handle
      // But here we are just maxing at 24.
      // If user drags to 24, we set it to 24.
      // If they want >24, they use the second slider.
      handleChange(endKey, hoursToTime(24 + nextDayEndHour));
    }
  };

  // Sub slider logic
  const handleSubSliderChange = (values: number[]) => {
    if (!subStartKey || !subEndKey) return;
    const start = values[0];
    const end = Math.max(values[0], values[1]);

    handleChange(subStartKey, hoursToTime(start));
    if (end < 24) {
      handleChange(subEndKey, hoursToTime(end));
    } else {
      handleChange(subEndKey, hoursToTime(24 + nextDayEndHour2));
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="space-y-8">
        {/* First Core Hours */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {label} （第一活動時間）
            </label>
            <span className="text-lg font-bold text-slate-700 dark:text-slate-300">
              {hoursToTime(timeToHours(data[startKey] || "09:00"))} ～{" "}
              {timeToHours(data[endKey] || "18:00") >= 24
                ? "24:00"
                : hoursToTime(timeToHours(data[endKey] || "18:00"))}
            </span>
          </div>

          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[
              timeToHours(data[startKey] || "09:00"),
              Math.min(timeToHours(data[endKey] || "18:00"), 24),
            ]}
            onValueChange={handleMainSliderChange}
            min={0}
            max={24}
            step={0.5}
            minStepsBetweenThumbs={1}
          >
            <Slider.Track className="relative grow rounded-full h-3 bg-slate-200 dark:bg-slate-700">
              <Slider.Range
                className={`absolute h-full rounded-full ${colorClass}`}
              />
            </Slider.Track>
            <Slider.Thumb
              className={`block w-6 h-6 bg-white dark:bg-slate-800 border-2 ${thumbColorClass} rounded-full shadow-lg cursor-grab focus:outline-none focus:ring-2 focus:ring-slate-500`}
            />
            <Slider.Thumb
              className={`block w-6 h-6 bg-white dark:bg-slate-800 border-2 ${thumbColorClass} rounded-full shadow-lg cursor-grab focus:outline-none focus:ring-2 focus:ring-slate-500`}
            />
          </Slider.Root>

          <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span>0時</span>
            <span>6時</span>
            <span>12時</span>
            <span>18時</span>
            <span>24時</span>
          </div>
        </div>

        {/* Next Day Slider for First Core Hours */}
        {timeToHours(data[endKey] || "18:00") >= 24 && (
          <div className="pl-4 border-l-2 border-emerald-200 dark:border-emerald-800 animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                翌日の終了時間
              </label>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                翌日 {hoursToTime(nextDayEndHour)}
              </span>
            </div>
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5"
              value={[nextDayEndHour]}
              onValueChange={(val) => {
                handleChange(endKey, hoursToTime(24 + val[0]));
              }}
              min={0}
              max={24}
              step={0.5}
            >
              <Slider.Track className="relative grow rounded-full h-3 bg-slate-200 dark:bg-slate-700">
                <Slider.Range className="absolute h-full rounded-full bg-emerald-500" />
              </Slider.Track>
              <Slider.Thumb className="block w-6 h-6 bg-white dark:bg-slate-800 border-2 border-emerald-500 rounded-full shadow-lg cursor-grab focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </Slider.Root>
          </div>
        )}

        {/* Second Core Hours Section */}
        {subStartKey && subEndKey && (
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                第二活動時間（任意）
              </label>
              {isSubCoreHourEnabled ? (
                <button
                  onClick={() => {
                    setIsSubCoreHourEnabled(false);
                    handleChange(subStartKey, undefined);
                    handleChange(subEndKey, undefined);
                  }}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsSubCoreHourEnabled(true);
                    handleChange(subStartKey, "21:00");
                    handleChange(subEndKey, "23:00");
                  }}
                  className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium px-2 py-1 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                >
                  <Plus size={14} />
                  追加する
                </button>
              )}
            </div>

            {isSubCoreHourEnabled && (
              <div className="animate-in fade-in slide-in-from-top-2 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">設定範囲</span>
                  <span className="text-lg font-bold text-slate-700 dark:text-slate-300">
                    {hoursToTime(timeToHours(data[subStartKey] || "21:00"))} ～{" "}
                    {timeToHours(data[subEndKey] || "23:00") >= 24
                      ? "24:00"
                      : hoursToTime(timeToHours(data[subEndKey] || "23:00"))}
                  </span>
                </div>
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  value={[
                    timeToHours(data[subStartKey] || "21:00"),
                    Math.min(timeToHours(data[subEndKey] || "23:00"), 24),
                  ]}
                  onValueChange={handleSubSliderChange}
                  min={0}
                  max={24}
                  step={0.5}
                  minStepsBetweenThumbs={1}
                >
                  <Slider.Track className="relative grow rounded-full h-3 bg-slate-200 dark:bg-slate-700">
                    <Slider.Range
                      className={`absolute h-full rounded-full ${colorClass} opacity-70`}
                    />
                  </Slider.Track>
                  <Slider.Thumb
                    className={`block w-6 h-6 bg-white dark:bg-slate-800 border-2 ${thumbColorClass} rounded-full shadow-lg cursor-grab focus:outline-none focus:ring-2 focus:ring-slate-500`}
                  />
                  <Slider.Thumb
                    className={`block w-6 h-6 bg-white dark:bg-slate-800 border-2 ${thumbColorClass} rounded-full shadow-lg cursor-grab focus:outline-none focus:ring-2 focus:ring-slate-500`}
                  />
                </Slider.Root>

                {/* Next Day Slider for Sub Core Hours */}
                {timeToHours(data[subEndKey] || "00:00") >= 24 && (
                  <div className="pl-4 border-l-2 border-emerald-200 dark:border-emerald-800 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        翌日の終了時間 (第二活動時間)
                      </label>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        翌日 {hoursToTime(nextDayEndHour2)}
                      </span>
                    </div>
                    <Slider.Root
                      className="relative flex items-center select-none touch-none w-full h-5"
                      value={[nextDayEndHour2]}
                      onValueChange={(val) => {
                        handleChange(subEndKey, hoursToTime(24 + val[0]));
                      }}
                      min={0}
                      max={24}
                      step={0.5}
                    >
                      <Slider.Track className="relative grow rounded-full h-3 bg-slate-200 dark:bg-slate-700">
                        <Slider.Range className="absolute h-full rounded-full bg-emerald-500" />
                      </Slider.Track>
                      <Slider.Thumb className="block w-6 h-6 bg-white dark:bg-slate-800 border-2 border-emerald-500 rounded-full shadow-lg cursor-grab focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </Slider.Root>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
