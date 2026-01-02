"use client";

import React from "react";
import {
  generateAnonymousName,
  CONSTELLATIONS,
} from "@/lib/anonymous-name-generator";

interface Step1IdentityProps {
  data: any;
  onUpdate: (data: any) => void;
  userId: string;
}

const generationOptions = [
  "1940年代以前",
  "1950年代",
  "1960年代",
  "1970年代",
  "1980年代",
  "1990年代",
  "2000年代",
  "2010年代",
  "2020年代以降",
];

export function Step1Identity({ data, onUpdate, userId }: Step1IdentityProps) {
  // 1940年代以前 is the first option, default to it if not set? Or empty.
  // data.display_id should default to userId if not set
  React.useEffect(() => {
    if (!data.display_id && userId) {
      onUpdate({ display_id: userId });
    }
  }, [userId, data.display_id, onUpdate]);

  const handleZodiacChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const zodiac = e.target.value;
    const newName = generateAnonymousName(zodiac);
    onUpdate({
      zodiac_sign: zodiac,
      display_name: newName,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    onUpdate({ [name]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="display_name"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          表示名 (匿名)
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="text"
            id="display_name"
            name="display_name"
            className="block w-full rounded-md border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 sm:text-sm px-3 py-2 border cursor-not-allowed"
            value={data.display_name || ""}
            readOnly
          />
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          星座を選択すると自動生成されます
        </p>
      </div>

      <div>
        <label
          htmlFor="display_id"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          表示ID
        </label>
        <input
          type="text"
          id="display_id"
          name="display_id"
          className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 sm:text-sm px-3 py-2 border cursor-not-allowed"
          value={data.display_id || userId}
          readOnly
        />
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          認証されたユーザーIDが使用されます
        </p>
      </div>

      <div>
        <label
          htmlFor="zodiac_sign"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          星座 <span className="text-red-500">*</span>
        </label>
        <select
          id="zodiac_sign"
          name="zodiac_sign"
          data-testid="zodiac-select-final"
          aria-label="星座"
          className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          value={data.zodiac_sign || ""}
          onChange={handleZodiacChange}
          required
        >
          <option value="">選択してください</option>
          {CONSTELLATIONS.map((zodiac) => (
            <option key={zodiac} value={zodiac}>
              {zodiac}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="birth_generation"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          生誕世代 <span className="text-red-500">*</span>
        </label>
        <select
          id="birth_generation"
          name="birth_generation"
          className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 sm:text-sm px-3 py-2 border"
          value={data.birth_generation || ""}
          onChange={handleChange}
          required
        >
          <option value="">選択してください</option>
          {generationOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
