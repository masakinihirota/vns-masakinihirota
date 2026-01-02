"use client";

import * as Slider from "@radix-ui/react-slider";
import React from "react";
import { timeToHours, hoursToTime } from "@/lib/root-account-utils";

interface Step3HoursProps {
  data: any;
  onUpdate: (data: any) => void;
}

export function Step3Hours({ data, onUpdate }: Step3HoursProps) {
  // Initialize values or default to typical work hours
  const startHour = data.core_hours_start
    ? timeToHours(data.core_hours_start)
    : 9;
  const endHour = data.core_hours_end ? timeToHours(data.core_hours_end) : 18;

  const handleSliderChange = (values: number[]) => {
    const newStart = hoursToTime(values[0]);
    const newEnd = values[1] === 24 ? "24:00" : hoursToTime(values[1]);

    onUpdate({
      core_hours_start: newStart,
      core_hours_end: newEnd,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
          コア活動時間（UTC）
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          主に活動する時間を設定してください。
        </p>

        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            開始: {hoursToTime(startHour)}
          </span>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            終了: {data.core_hours_end || hoursToTime(endHour)}
          </span>
        </div>

        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          value={[startHour, Math.min(endHour, 24)]}
          onValueChange={handleSliderChange}
          min={0}
          max={24}
          step={0.5}
          aria-label="Core Hours"
        >
          <Slider.Track className="bg-slate-200 dark:bg-slate-700 relative grow rounded-full h-[3px]">
            <Slider.Range className="absolute bg-indigo-500 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-5 h-5 bg-white shadow-md border border-slate-200 rounded-full hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Start time"
          />
          <Slider.Thumb
            className="block w-5 h-5 bg-white shadow-md border border-slate-200 rounded-full hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="End time"
          />
        </Slider.Root>

        <div className="flex justify-between mt-2 text-xs text-slate-400">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
      </div>
    </div>
  );
}
