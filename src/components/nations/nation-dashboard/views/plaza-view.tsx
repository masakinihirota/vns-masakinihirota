import { Heart, Info, MessageSquare } from "lucide-react";
import { BOARD_POSTS, NATION_DATA } from "../nation-dashboard.constants";

export const PlazaView = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 重要な通知（Hero） */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Info className="w-5 h-5" />
              ようこそ、はじまりの国へ
            </h3>
            <p className="mt-2 text-indigo-100">
              ここはVNSの中心地です。まずは「市場」で地図を手に入れ、「銀行」で口座を開設しましょう。
              困ったときは広場の誰かに声をかけてください。
            </p>
          </div>
          <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition">
            チュートリアル開始
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* メインフィード（掲示板） */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            国民の声
          </h3>
          <div className="bg-white dark:bg-white/5 dark:border-white/10 rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
              <input
                type="text"
                placeholder="広場で声を上げる（投稿する）..."
                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>
            <div className="space-y-4">
              {BOARD_POSTS.map((post) => (
                <div
                  key={post.id}
                  className="border-b border-gray-100 dark:border-white/5 last:border-0 pb-3 last:pb-0"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      <span className="font-bold text-sm text-gray-800 dark:text-gray-200">
                        {post.user}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          post.role === "King"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : post.role === "Ghost"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                              : "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400"
                        }`}
                      >
                        {post.role}
                      </span>
                      <span className="text-xs text-gray-400">{post.time}</span>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {post.content}
                  </p>
                  <div className="mt-2 flex gap-4 text-gray-400 text-xs">
                    <button className="hover:text-pink-500 flex items-center gap-1">
                      <Heart className="w-3 h-3" /> {post.likes}
                    </button>
                    <button className="hover:text-indigo-500">返信</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右サイドバー：国のステータス */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-white/5 dark:border-white/10 rounded-xl shadow-sm border border-gray-200 p-4">
            <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-3 text-sm border-b dark:border-white/10 pb-2">
              現在の国政データ
            </h4>

            {/* 人口動態 */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>アクティブ率</span>
                <span>
                  {Math.round(
                    (NATION_DATA.activePopulation / NATION_DATA.population) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "15%" }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                あと50人の活動で維持費ランクダウン！
              </p>
            </div>

            {/* 国庫状況 */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded text-center">
                <div className="text-xs text-amber-600 dark:text-amber-400">
                  税率
                </div>
                <div className="font-bold text-amber-800 dark:text-amber-200">
                  {NATION_DATA.taxRate}%
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-center">
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  国庫
                </div>
                <div className="font-bold text-blue-800 dark:text-blue-200">
                  {(NATION_DATA.treasury / 10000).toFixed(1)}万pt
                </div>
              </div>
            </div>

            <div className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1 justify-center mt-2 bg-red-50 dark:bg-red-900/20 p-1 rounded">
              <span className="font-bold">⚠</span>
              次回の維持費徴収まであと {NATION_DATA.nextDeduction}
            </div>
          </div>

          {/* 今日のイベント */}
          <div className="bg-white dark:bg-white/5 dark:border-white/10 rounded-xl shadow-sm border border-gray-200 p-4">
            <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-2 text-sm">
              本日のイベント
            </h4>
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>新人歓迎会 (21:00~)</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>AIプロンプト講習会</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
