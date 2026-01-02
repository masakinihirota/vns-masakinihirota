import { RefreshCcw, Check } from "lucide-react";
import React, { useState, useEffect } from "react";
import { generateUniqueCandidates } from "@/lib/anonymous-name-generator";
import { GENERATIONS } from "../../onboarding/onboarding.logic";

interface Step3IdentityPCProps {
  data: any;
  onUpdate: (data: any) => void;
}

export const Step3IdentityPC: React.FC<Step3IdentityPCProps> = ({
  data,
  onUpdate,
}) => {
  const { display_id, zodiac_sign, display_name, birth_generation } = data;
  const [candidates, setCandidates] = useState<string[]>([]);
  const [excludedNames, setExcludedNames] = useState<string[]>([]);

  // Reset candidates when Zodiac changes
  useEffect(() => {
    if (zodiac_sign) {
      const newCandidates = generateUniqueCandidates(zodiac_sign, 3);
      setCandidates(newCandidates);
      setExcludedNames(newCandidates);
      // If current display_name is not in new candidates (e.g. switched zodiac), clear it
      // Or if it's the first time
      if (!newCandidates.includes(display_name)) {
        onUpdate({ display_name: "" });
      }
    } else {
      setCandidates([]);
      setExcludedNames([]);
    }
  }, [zodiac_sign]);

  const handleZodiacChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sign = e.target.value;
    onUpdate({
      zodiac_sign: sign,
      display_name: "", // Reset name on zodiac change
    });
  };

  const handleReloadNames = () => {
    if (!zodiac_sign) return;
    const newCandidates = generateUniqueCandidates(
      zodiac_sign,
      3,
      excludedNames
    );
    setCandidates(newCandidates);
    // Add new candidates to exclusion to prevent immediate repeat
    // We can keep growing the list or just keep the last batch.
    // User request: "直近で表示したものが被らないように" (Prevent overlap with recently displayed)
    // So keeping the last displayed batch in exclusion is sufficient.
    setExcludedNames(newCandidates);
  };

  const handleNameSelect = (name: string) => {
    onUpdate({ display_name: name });
  };

  const handleGenerationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ birth_generation: e.target.value });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          アイデンティティ設定
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          VNS内でのあなたのアイデンティティを設定します。
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        {/* 1. Display ID (Read-only) */}
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
            Display ID
          </label>
          <input
            type="text"
            value={display_id || ""}
            readOnly
            className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-mono text-sm"
          />
          <p className="text-xs text-slate-500 mt-1">
            ※システムにより自動生成されるユニークIDです。
          </p>
        </div>

        {/* 2. Zodiac Sign & Name Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="zodiac"
              className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
            >
              星座
            </label>
            <select
              id="zodiac"
              aria-label="星座"
              className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={zodiac_sign || ""}
              onChange={handleZodiacChange}
            >
              <option value="">選択してください</option>
              <option value="aries">牡羊座 (3/21-4/19)</option>
              <option value="taurus">牡牛座 (4/20-5/20)</option>
              <option value="gemini">双子座 (5/21-6/21)</option>
              <option value="cancer">蟹座 (6/22-7/22)</option>
              <option value="leo">獅子座 (7/23-8/22)</option>
              <option value="virgo">乙女座 (8/23-9/22)</option>
              <option value="libra">天秤座 (9/23-10/23)</option>
              <option value="scorpio">蠍座 (10/24-11/22)</option>
              <option value="sagittarius">射手座 (11/23-12/21)</option>
              <option value="capricorn">山羊座 (12/22-1/19)</option>
              <option value="aquarius">水瓶座 (1/20-2/18)</option>
              <option value="pisces">魚座 (2/19-3/20)</option>
            </select>
          </div>

          {/* Anonymous Name Selection */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                表示名 (匿名)
              </label>
              {candidates.length > 0 && (
                <button
                  type="button"
                  onClick={handleReloadNames}
                  className="text-xs flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <RefreshCcw size={12} />
                  候補を更新
                </button>
              )}
            </div>

            {!zodiac_sign ? (
              <div className="p-4 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 text-sm text-center">
                星座を選択すると候補が表示されます
              </div>
            ) : (
              <div className="space-y-2">
                {candidates.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleNameSelect(name)}
                    className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                      display_name === name
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span className="font-medium">{name}</span>
                    {display_name === name && (
                      <Check
                        size={16}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4. Generation */}
        <div>
          <label
            htmlFor="generation"
            className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
          >
            生誕世代
          </label>
          <select
            id="generation"
            aria-label="生誕世代"
            className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={birth_generation || ""}
            onChange={handleGenerationChange}
          >
            <option value="">選択してください</option>
            {GENERATIONS.map((gen) => (
              <option key={gen} value={gen}>
                {gen}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
