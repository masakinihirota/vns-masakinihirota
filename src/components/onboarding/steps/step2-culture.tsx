"use client";

import React, { useEffect } from "react";
import {
  CULTURAL_SPHERES,
  PREFECTURES,
  LANGUAGE_OPTIONS,
  DETAILED_REGIONS,
} from "../onboarding.logic";

interface Step2CultureProps {
  data: any;
  onUpdate: (data: any) => void;
}

export function Step2Culture({ data, onUpdate }: Step2CultureProps) {
  // Local state for location cascade if needed, but we can rely on data props if we update parent immediately.
  // We need to know the selected cultural sphere to show relevant countries if applicable.

  // Initialize country/prefecture if location string is set?
  // For now, let's treat location as a composite or keep separate fields in data.
  // The user requirement says "Area -> Country -> Prefecture".
  // Let's assume onUpdate handles simple key-value pairs.
  // We need to coordinate `activity_culture_code` (sphere), `country`, `prefecture`.

  const handleSphereChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sphere = e.target.value;
    onUpdate({
      activity_culture_code: sphere,
      // Reset location if sphere changes? Maybe
      country: "",
      prefecture: "",
    });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ country: e.target.value, prefecture: "" });
  };

  const handlePrefectureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ prefecture: e.target.value });
  };

  // Combine country/prefecture into location for display or data consistency if needed
  useEffect(() => {
    if (data.country || data.prefecture) {
      const loc = `${data.country || ""}${data.prefecture ? `, ${data.prefecture}` : ""}`;
      onUpdate({ location: loc });
    }
  }, [data.country, data.prefecture]); // Ensure infinite loop isn't triggered. onUpdate needs to be stable or check equality.

  const handleLanguageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "mother_tongue_codes" | "available_language_codes"
  ) => {
    const { value, checked } = e.target;
    // data[type] should be string[]
    const currentList: string[] = Array.isArray(data[type]) ? data[type] : [];

    let newList;
    if (checked) {
      newList = [...currentList, value];
    } else {
      newList = currentList.filter((code) => code !== value);
    }
    onUpdate({ [type]: newList });
  };

  // Helper to extract countries based on sphere.
  // The provided logic DETAILED_REGIONS only spans a few spheres.
  // We'll fallback to a generic country list or input if not found.
  const currentRegionDetail = data.activity_culture_code
    ? DETAILED_REGIONS[data.activity_culture_code]
    : null;
  const availableCountries = currentRegionDetail?.countries || []; // Fallback empty if not defined in logic

  // If specific countries aren't defined in logic for the sphere, maybe show a text input or generic list?
  // User req: "Area -> Country -> Prefecture".
  // If Japanese sphere -> Japan -> Prefectures.
  // If English -> USA, UK etc. -> (No prefectures defined in logic usually, maybe free text?)

  return (
    <div className="space-y-6">
      {/* 1. Cultural Sphere */}
      <div>
        <label
          htmlFor="activity_culture_code"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          文化圏 <span className="text-red-500">*</span>
        </label>
        <select
          id="activity_culture_code"
          name="activity_culture_code"
          className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 sm:text-sm px-3 py-2 border"
          value={data.activity_culture_code || ""}
          onChange={handleSphereChange}
          required
        >
          <option value="">選択してください</option>
          {CULTURAL_SPHERES.map((sphere) => (
            <option key={sphere.id} value={sphere.id}>
              {sphere.label}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Location (Country -> Prefecture) */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          居住地 (国/地域) <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4 mt-1">
          <select
            aria-label="国"
            className="block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 sm:text-sm px-3 py-2 border"
            value={data.country || ""}
            onChange={handleCountryChange}
            disabled={!data.activity_culture_code}
            required
          >
            <option value="">国を選択</option>
            {availableCountries.length > 0 ? (
              availableCountries.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))
            ) : (
              // Fallback if no specific countries defined
              <option value="Other">その他</option>
            )}
          </select>

          {data.activity_culture_code === "japanese" && (
            <select
              aria-label="都道府県"
              className="block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 sm:text-sm px-3 py-2 border"
              value={data.prefecture || ""}
              onChange={handlePrefectureChange}
              required
            >
              <option value="">都道府県を選択</option>
              {PREFECTURES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* 3. Mother Tongue */}
      <div>
        <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          母国語 <span className="text-red-500">*</span>
        </span>
        <div className="space-y-2 max-h-40 overflow-y-auto border p-2 rounded-md">
          {LANGUAGE_OPTIONS.map((lang) => (
            <label key={`mt-${lang}`} className="flex items-center">
              <input
                type="checkbox" // Changed to checkbox to allow multiple mother tongues if needed, or radio? User said "Language... choice". Usually mother tongue is single but some have dual. Let's use checkbox for consistency or radio?
                // Checkbox is safer for "Mother Tongue Codes" (plural).
                value={lang}
                checked={data.mother_tongue_codes?.includes(lang) || false}
                onChange={(e) => handleLanguageChange(e, "mother_tongue_codes")}
                className="rounded border-slate-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                {lang}
              </span>
            </label>
          ))}
          <label className="flex items-center">
            <input
              type="checkbox"
              value="Other"
              checked={data.mother_tongue_codes?.includes("Other") || false}
              onChange={(e) => handleLanguageChange(e, "mother_tongue_codes")}
              className="rounded border-slate-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
              その他
            </span>
          </label>
        </div>
      </div>

      {/* 4. Available Languages */}
      <div>
        <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          使用可能言語 <span className="text-red-500">*</span>
        </span>
        <div className="space-y-2 max-h-40 overflow-y-auto border p-2 rounded-md">
          {LANGUAGE_OPTIONS.map((lang) => (
            <label key={`av-${lang}`} className="flex items-center">
              <input
                type="checkbox"
                value={lang}
                checked={data.available_language_codes?.includes(lang) || false}
                onChange={(e) =>
                  handleLanguageChange(e, "available_language_codes")
                }
                className="rounded border-slate-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                {lang}
              </span>
            </label>
          ))}
          <label className="flex items-center">
            <input
              type="checkbox"
              value="Other"
              checked={
                data.available_language_codes?.includes("Other") || false
              }
              onChange={(e) =>
                handleLanguageChange(e, "available_language_codes")
              }
              className="rounded border-slate-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
              その他
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
