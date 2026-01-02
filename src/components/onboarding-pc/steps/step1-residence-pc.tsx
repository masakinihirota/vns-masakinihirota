import React from "react";
import {
  CULTURAL_SPHERES,
  PREFECTURES,
  DETAILED_REGIONS,
  MOON_LOCATIONS,
  MARS_LOCATIONS,
} from "../../onboarding/onboarding.logic";
import { MarsMap } from "./mars-map";
import { MoonMap } from "./moon-map";
import { ResidenceMap } from "./residence-map";

interface Step1ResidencePCProps {
  data: any;
  onUpdate: (data: any) => void;
}

export const Step1ResidencePC: React.FC<Step1ResidencePCProps> = ({
  data,
  onUpdate,
}) => {
  const {
    activity_area_id,
    activity_culture_code,
    selectedCountry,
    selectedRegion,
    moon_location,
    mars_location,
  } = data;

  const handleAreaSelect = (areaId: number) => {
    if (activity_area_id === areaId) {
      onUpdate({ activity_area_id: null });
    } else {
      onUpdate({ activity_area_id: areaId });
    }
  };

  const handleMoonSelect = (location: string) => {
    onUpdate({ moon_location: location });
  };

  const handleMarsSelect = (location: string) => {
    onUpdate({ mars_location: location });
  };

  const handleSphereChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sphereId = e.target.value;
    onUpdate({
      activity_culture_code: sphereId,
      selectedCountry: sphereId === "japanese" ? "日本" : "",
      selectedRegion: "",
    });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ selectedCountry: e.target.value });
  };

  const handleRegionChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const val = e.target.value;
    // XSS対策: HTMLタグやスクリプトとして解釈されうる記号を除去
    // Remove < > { } ( ) to prevent script execution or json injection
    const sanitized = val.replace(/[<>{}()]/g, "");

    onUpdate({ selectedRegion: sanitized });
  };

  const currentDetail = activity_culture_code
    ? DETAILED_REGIONS[activity_culture_code]
    : null;

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
        住居・文化圏設定
      </h2>

      {/* 1. Residence Area Map */}
      <div>
        <label className="block text-sm font-medium mb-4 text-slate-700 dark:text-slate-300">
          居住エリア (Earth)
        </label>
        <ResidenceMap
          selectedAreaId={activity_area_id}
          onSelect={handleAreaSelect}
          className="mb-4"
        />
        <div className="text-xs text-slate-500 text-right">
          Selected Area:{" "}
          {activity_area_id ? `Area ${activity_area_id}` : "None"}
        </div>
      </div>

      {/* Moon & Mars Maps (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-medium mb-4 text-slate-700 dark:text-slate-300">
            月面拠点 (Moon - Optional)
          </label>
          <MoonMap
            selectedLocation={moon_location}
            onSelect={handleMoonSelect}
            className="mb-2"
          />
          {/* Extensible Dropdown for Moon */}
          <div className="mt-2">
            <select
              aria-label="月面拠点を選択"
              className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              value={moon_location || ""}
              onChange={(e) => handleMoonSelect(e.target.value)}
            >
              <option value="">未選択 (Select location)</option>
              {/* Options populated from extensible list */}
              {/* NOTE: Add new locations to MOON_LOCATIONS in onboarding.logic.ts */}
              {MOON_LOCATIONS.map((loc: string) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-4 text-slate-700 dark:text-slate-300">
            火星拠点 (Mars - Optional)
          </label>
          <MarsMap
            selectedLocation={mars_location}
            onSelect={handleMarsSelect}
            className="mb-2"
          />
          {/* Extensible Dropdown for Mars */}
          <div className="mt-2">
            <select
              aria-label="火星拠点を選択"
              className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              value={mars_location || ""}
              onChange={(e) => handleMarsSelect(e.target.value)}
            >
              <option value="">未選択 (Select location)</option>
              {/* Options populated from extensible list */}
              {/* NOTE: Add new locations to MARS_LOCATIONS in onboarding.logic.ts */}
              {MARS_LOCATIONS.map((loc: string) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Cultural Sphere */}
      <div>
        <label
          htmlFor="culture_sphere"
          className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
        >
          住んでいる文化圏
        </label>
        <select
          id="culture_sphere"
          aria-label="文化圏"
          className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          value={activity_culture_code || ""}
          onChange={handleSphereChange}
        >
          <option value="">選択してください</option>
          {CULTURAL_SPHERES.map((sphere) => (
            <option key={sphere.id} value={sphere.id}>
              {sphere.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 3. Country */}
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
            国
          </label>
          {currentDetail && (
            <select
              id="country"
              aria-label="国"
              className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              value={selectedCountry || ""}
              onChange={handleCountryChange}
              disabled={!activity_culture_code}
            >
              <option value="">選択してください</option>
              {currentDetail.countries.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
          {!currentDetail && (
            <div
              id="country"
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-400"
            >
              文化圏を選択してください
            </div>
          )}
        </div>

        {/* 4. Prefecture/State */}
        <div>
          <label
            htmlFor={selectedCountry === "日本" ? "prefecture" : "region"}
            className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
          >
            {selectedCountry === "日本" ? "都道府県" : "州/地域"}
          </label>
          {selectedCountry === "日本" ? (
            <select
              id="prefecture"
              className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              value={selectedRegion || ""}
              onChange={handleRegionChange}
            >
              <option value="">選択してください</option>
              {PREFECTURES.map((pref) => (
                <option key={pref} value={pref}>
                  {pref}
                </option>
              ))}
            </select>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                id="region"
                className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
                value={
                  selectedCountry?.includes("Others")
                    ? ""
                    : selectedRegion || ""
                }
                onChange={handleRegionChange}
                placeholder={
                  selectedCountry?.includes("Others")
                    ? "入力不要です (No input required)"
                    : "州・地域名を入力"
                }
                disabled={
                  !selectedCountry || selectedCountry.includes("Others")
                }
              />
              {selectedCountry?.includes("Others") && (
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  ※その他 (Others) を選択した場合、この項目への入力は不要です。
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
