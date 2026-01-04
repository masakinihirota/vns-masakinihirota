import * as Slider from "@radix-ui/react-slider";
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { timeToHours, hoursToTime } from "@/lib/root-account-utils";

interface Step2HoursPCProps {
  data: any;
  onUpdate: (data: any) => void;
}

export const Step2HoursPC: React.FC<Step2HoursPCProps> = ({
  data,
  onUpdate,
}) => {
  // Local state for smoother interactions, synced with props
  const [isSubCoreHourEnabled, setIsSubCoreHourEnabled] = useState(
    !!(data.core_activity_2_start && data.core_activity_2_end)
  );

  // Derived states for next day ending
  const nextDayEndHour =
    timeToHours(data.core_activity_end || "18:00") > 24
      ? timeToHours(data.core_activity_end) - 24
      : 0;

  const nextDayEndHour2 =
    timeToHours(data.core_activity_2_end || "00:00") > 24
      ? timeToHours(data.core_activity_2_end) - 24
      : 0;

  const handleChange = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  // Main slider logic
  const handleMainSliderChange = (values: number[]) => {
    const start = values[0];
    const end = Math.max(values[0], values[1]); // Ensure end >= start

    handleChange("core_activity_start", hoursToTime(start));

    // Preserve next day offset if currently set, unless slider pulled back < 24
    if (end < 24) {
      handleChange("core_activity_end", hoursToTime(end));
    } else {
      // Keep existing overflow calculation if dragging the 24 handle
      // But here we are just maxing at 24.
      // If user drags to 24, we set it to 24.
      // If they want >24, they use the second slider.
      handleChange("core_activity_end", hoursToTime(24 + nextDayEndHour));
    }
  };

  // Sub slider logic
  const handleSubSliderChange = (values: number[]) => {
    const start = values[0];
    const end = Math.max(values[0], values[1]);

    handleChange("core_activity_2_start", hoursToTime(start));
    if (end < 24) {
      handleChange("core_activity_2_end", hoursToTime(end));
    } else {
      handleChange("core_activity_2_end", hoursToTime(24 + nextDayEndHour2));
    }
  };

  // Total hours calculation
  const calculateTotal = () => {
    const start1 = timeToHours(data.core_activity_start || "09:00");
    const end1 = timeToHours(data.core_activity_end || "18:00");
    const total1 = end1 - start1; // Assuming normalized > 24 format works

    let total2 = 0;
    if (
      isSubCoreHourEnabled &&
      data.core_activity_2_start &&
      data.core_activity_2_end
    ) {
      const start2 = timeToHours(data.core_activity_2_start);
      const end2 = timeToHours(data.core_activity_2_end);
      total2 = end2 - start2;
    }

    return Math.max(0, total1 + total2);
  };

  const totalHours = calculateTotal();

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

      <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="space-y-8">
          {/* First Core Hours */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                第一活動時間
              </label>
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {hoursToTime(timeToHours(data.core_activity_start || "09:00"))}{" "}
                ～{" "}
                {timeToHours(data.core_activity_end || "18:00") >= 24
                  ? "24:00"
                  : hoursToTime(timeToHours(data.core_activity_end || "18:00"))}
              </span>
            </div>

            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5"
              value={[
                timeToHours(data.core_activity_start || "09:00"),
                Math.min(timeToHours(data.core_activity_end || "18:00"), 24),
              ]}
              onValueChange={handleMainSliderChange}
              min={0}
              max={24}
              step={0.5}
              minStepsBetweenThumbs={1}
            >
              <Slider.Track className="relative grow rounded-full h-3 bg-slate-200 dark:bg-slate-700">
                <Slider.Range className="absolute h-full rounded-full bg-indigo-500" />
              </Slider.Track>
              <Slider.Thumb className="block w-6 h-6 bg-white dark:bg-slate-800 border-2 border-indigo-500 rounded-full shadow-lg cursor-grab focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <Slider.Thumb className="block w-6 h-6 bg-white dark:bg-slate-800 border-2 border-indigo-500 rounded-full shadow-lg cursor-grab focus:outline-none focus:ring-2 focus:ring-indigo-500" />
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
          {timeToHours(data.core_activity_end || "18:00") >= 24 && (
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
                  handleChange("core_activity_end", hoursToTime(24 + val[0]));
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
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                第二活動時間（任意）
              </label>
              {isSubCoreHourEnabled ? (
                <button
                  onClick={() => {
                    setIsSubCoreHourEnabled(false);
                    handleChange("core_activity_2_start", undefined);
                    handleChange("core_activity_2_end", undefined);
                  }}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsSubCoreHourEnabled(true);
                    handleChange("core_activity_2_start", "21:00");
                    handleChange("core_activity_2_end", "23:00");
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
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {hoursToTime(
                      timeToHours(data.core_activity_2_start || "21:00")
                    )}{" "}
                    ～{" "}
                    {timeToHours(data.core_activity_2_end || "23:00") >= 24
                      ? "24:00"
                      : hoursToTime(
                          timeToHours(data.core_activity_2_end || "23:00")
                        )}
                  </span>
                </div>
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  value={[
                    timeToHours(data.core_activity_2_start || "21:00"),
                    Math.min(
                      timeToHours(data.core_activity_2_end || "23:00"),
                      24
                    ),
                  ]}
                  onValueChange={handleSubSliderChange}
                  min={0}
                  max={24}
                  step={0.5}
                  minStepsBetweenThumbs={1}
                >
                  <Slider.Track className="relative grow rounded-full h-3 bg-slate-200 dark:bg-slate-700">
                    <Slider.Range className="absolute h-full rounded-full bg-indigo-500 opacity-70" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-6 h-6 bg-white dark:bg-slate-800 border-2 border-indigo-500 rounded-full shadow-lg cursor-grab focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <Slider.Thumb className="block w-6 h-6 bg-white dark:bg-slate-800 border-2 border-indigo-500 rounded-full shadow-lg cursor-grab focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </Slider.Root>

                {/* Next Day Slider for Sub Core Hours */}
                {timeToHours(data.core_activity_2_end || "00:00") >= 24 && (
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
                        handleChange(
                          "core_activity_2_end",
                          hoursToTime(24 + val[0])
                        );
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
        </div>
      </div>

      {/* Warning or Total */}
      <div
        className={`p-4 rounded-lg border flex items-start gap-3 ${
          totalHours < 8
            ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
            : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
        }`}
      >
        <AlertCircle
          className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            totalHours < 8
              ? "text-amber-600 dark:text-amber-400"
              : "text-blue-600 dark:text-blue-400"
          }`}
        />
        <div>
          <p
            className={`text-sm font-semibold ${
              totalHours < 8
                ? "text-amber-900 dark:text-amber-100"
                : "text-blue-900 dark:text-blue-100"
            }`}
          >
            合計活動時間: {totalHours.toFixed(1)}時間
          </p>
        </div>
      </div>
    </div>
  );
};
