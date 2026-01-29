import React from "react";
import { GENERATIONS } from "@/components/onboarding-pc/onboarding.logic";

interface Step3IdentityTrialProps {
  data: any;
  onUpdate: (data: any) => void;
}

export const Step3IdentityTrial: React.FC<Step3IdentityTrialProps> = ({
  data,
  onUpdate,
}) => {
  const { zodiac_sign, birth_generation } = data;

  const handleZodiacChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ zodiac_sign: e.target.value });
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
          VNS内でのあなたのアイデンティティ（星座と世代）を設定します。
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        {/* Zodiac Sign */}
        <div className="space-y-6">
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
            <p className="text-xs text-slate-500 mt-2">
              ※この星座を元に、自動的に星座ネームが生成されます。
            </p>
          </div>
        </div>

        {/* Generation */}
        <div>
          <label
            htmlFor="generation"
            className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
          >
            生誕世代(生まれた年){" "}
            <span className="text-xs text-slate-500 font-normal ml-2">
              ※5年毎
            </span>
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
