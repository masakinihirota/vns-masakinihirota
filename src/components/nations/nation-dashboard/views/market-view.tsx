import { Search, ShoppingBag } from "lucide-react";
import { MARKET_ITEMS } from "../nation-dashboard.constants";

export const MarketView = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-orange-500" />
          自由市場
        </h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-white dark:bg-white/10 border dark:border-white/10 rounded-full text-sm hover:bg-gray-50 dark:hover:bg-white/20 transition dark:text-gray-200">
            買う
          </button>
          <button className="px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-white/10 transition">
            売る
          </button>
          <button className="px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-white/10 transition">
            依頼する
          </button>
        </div>
      </div>

      {/* 検索バー */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="商品やスキルを検索..."
          className="w-full pl-10 pr-4 py-2 border dark:border-white/10 rounded-lg bg-gray-50 dark:bg-black/20 focus:bg-white dark:focus:bg-black/40 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
        />
      </div>

      {/* 商品グリッド */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {MARKET_ITEMS.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-white/5 border dark:border-white/10 rounded-xl overflow-hidden hover:shadow-md transition cursor-pointer group"
          >
            <div className="h-32 bg-gray-100 dark:bg-white/5 flex items-center justify-center text-4xl group-hover:scale-105 transition">
              {item.category === "必需品"
                ? "🗺️"
                : item.category === "ツール"
                  ? "⛏️"
                  : item.category === "知識"
                    ? "📘"
                    : "💧"}
            </div>
            <div className="p-3">
              <div className="text-xs text-gray-400 mb-1">{item.category}</div>
              <div className="font-bold text-gray-800 dark:text-gray-200 mb-1">
                {item.name}
              </div>
              <div className="flex justify-between items-end">
                <div className="text-orange-600 dark:text-orange-400 font-bold">
                  {item.price > 0 ? `${item.price}pt` : "無料"}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  by {item.seller}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-white/5 px-3 py-2 text-xs text-gray-500 dark:text-gray-400 border-t dark:border-white/10 flex justify-between">
              <span>税金: {Math.floor(item.price * 0.05)}pt</span>
              <span className="text-green-600 dark:text-green-400 font-bold cursor-pointer hover:underline">
                購入へ
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
