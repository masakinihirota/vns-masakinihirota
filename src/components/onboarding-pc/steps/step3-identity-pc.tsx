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
  const { zodiac_sign, birth_generation, amazon_associate_tag } = data;

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
        {/* 2. Zodiac Sign */}
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
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg text-sm text-slate-500">
            ルートアカウントに名前は不要です。星座のみ設定してください。
          </div>
        </div>

        {/* 4. Generation */}
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

        {/* 5. Amazon Associate ID */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
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
          />
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            あなたの活動を収益化するためのIDを入力します。
            <br />
            <span className="text-red-600 dark:text-red-400 font-bold">
              後から変更は出来ません。
            </span>
            <br />
            ※アフィリエイトURLの表示には、一定の信頼継続日数や活動度、サイトへの貢献度が必要です。また、ペナルティ期間中は使用されません。
          </p>

          <div className="mt-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 dark:text-amber-200 space-y-2">
              <p className="font-bold">
                Amazonアソシエイト規約に関する重要事項
              </p>
              <p>
                報酬を正しく受け取るために、必ずAmazonアソシエイト管理画面の「Webサイト情報の登録」に本サイトのURLを追加してください。
              </p>
              <p className="bg-white/50 dark:bg-black/20 p-2 rounded font-mono break-all select-all">
                https://vns-masakinihirota.com
              </p>
              <p>
                また、Amazonアソシエイト規約に基づき、アフィリエイトであることを明示する必要があります。本サイトのフッターには以下の声明を表示しています。
                <br />
                <span className="italic">
                  「Amazon
                  アソシエイトとして、対象となる購入から収入を得ています。」
                </span>
              </p>
              <p className="opacity-80">
                登録がない場合や明示がない場合、Amazonの規約によりアカウント停止等のペナルティ対象となる恐れがあります。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
