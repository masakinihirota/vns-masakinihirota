import { Crown, ScrollText } from "lucide-react";
import { NATION_DATA } from "../nation-dashboard.constants";

export const CastleView = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="relative h-48 rounded-xl overflow-hidden bg-slate-800 text-white flex items-center justify-center shadow-md">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
        {/* 背景画像プレースホルダー */}
        <div className="absolute inset-0 opacity-30 bg-[url('https://placehold.co/800x200/2a2a2a/FFF?text=Throne+Room')] bg-cover bg-center"></div>
        <div className="relative z-20 text-center">
          <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-2 drop-shadow-lg" />
          <h3 className="text-2xl font-serif font-bold drop-shadow-md">
            王の間
          </h3>
          <p className="opacity-90 font-medium">統治者: {NATION_DATA.leader}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-white/5 p-6 rounded-xl border dark:border-white/10 shadow-sm">
          <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <ScrollText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            国の憲法・ルール
          </h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>オアシス宣言を遵守すること</li>
            <li>初心者に優しくすること</li>
            <li>ネタバレには「検索避け」を使うこと</li>
            <li>毎月1回はログインすること</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-white/5 p-6 rounded-xl border dark:border-white/10 shadow-sm">
          <h4 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">
            政策投票
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            現在進行中の投票はありません。
          </p>
          <button className="w-full py-2 bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 rounded-lg cursor-not-allowed font-medium">
            投票箱は空です
          </button>
        </div>
      </div>
    </div>
  );
};
