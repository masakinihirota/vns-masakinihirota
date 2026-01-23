import { AlertCircle } from "lucide-react";
import { GENERATIONS } from "../onboarding.logic";

interface Step3IdentityPCProps {
  data: any;
  onUpdate: (data: any) => void;
}

export const Step3IdentityPC: React.FC<Step3IdentityPCProps> = ({
  data,
  onUpdate,
}) => {
  const { zodiac_sign, birth_generation, amazon_associate_tag, is_minor } =
    data;

  const handleZodiacChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sign = e.target.value;
    onUpdate({
      zodiac_sign: sign,
      display_name: "", // Reset name on zodiac change
    });
  };

  const handleGenerationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ birth_generation: e.target.value });
  };

  const handleAmazonIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ amazon_associate_tag: e.target.value });
  };

  const handleMinorChange = (isMinor: boolean) => {
    onUpdate({ is_minor: isMinor });
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
        {/* 1. Minor Check */}
        <div>
          <label className="block text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">
            あなたは成年ですか？
          </label>
          <div className="flex gap-4">
            {/* Yes (Adult) -> is_minor: false */}
            <label
              className={`
                            flex-1 relative flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all
                            ${
                              is_minor === false
                                ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700"
                            }
                        `}
            >
              <input
                type="radio"
                name="is_minor"
                className="sr-only"
                checked={is_minor === false}
                onChange={() => handleMinorChange(false)}
              />
              <span
                className={`font-medium ${
                  is_minor === false
                    ? "text-indigo-700 dark:text-indigo-300"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                はい (成人)
              </span>
            </label>

            {/* No (Minor) -> is_minor: true */}
            <label
              className={`
                            flex-1 relative flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all
                            ${
                              is_minor === true
                                ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700"
                            }
                        `}
            >
              <input
                type="radio"
                name="is_minor"
                className="sr-only"
                checked={is_minor === true}
                onChange={() => handleMinorChange(true)}
              />
              <span
                className={`font-medium ${
                  is_minor === true
                    ? "text-indigo-700 dark:text-indigo-300"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                いいえ (未成年)
              </span>
            </label>
          </div>
          {is_minor === true && (
            <div className="mt-3 flex items-start gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-sm">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <p>
                申し訳ありません。未成年の方は現在VNSをご利用いただけません。今後のアップデートをお待ちください。
              </p>
            </div>
          )}
        </div>

        {/* 2. Zodiac Sign */}
        <div
          className={`space-y-6 ${is_minor === true ? "opacity-50 pointer-events-none grayscale" : ""}`}
        >
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
              disabled={is_minor === true}
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
        </div>

        {/* 4. Generation */}
        <div
          className={`${is_minor === true ? "opacity-50 pointer-events-none grayscale" : ""}`}
        >
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
            disabled={is_minor === true}
          >
            <option value="">選択してください</option>
            {GENERATIONS.map((gen) => (
              <option key={gen} value={gen}>
                {gen}
              </option>
            ))}
          </select>
        </div>

        {/* 5. Amazon Associate ID */}
        <div
          className={`pt-4 border-t border-slate-100 dark:border-slate-700 ${is_minor === true ? "opacity-50 pointer-events-none grayscale" : ""}`}
        >
          <label
            htmlFor="amazon-id"
            className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
          >
            AmazonアソシエイトID (任意)
          </label>
          <input
            type="text"
            id="amazon-id"
            placeholder="example-22"
            className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={amazon_associate_tag || ""}
            onChange={handleAmazonIdChange}
            disabled={is_minor === true}
          />
        </div>
      </div>
    </div>
  );
};
