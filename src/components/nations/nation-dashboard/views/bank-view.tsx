import { Landmark, TrendingUp } from "lucide-react";
import { NATION_DATA } from "../nation-dashboard.constants";

export const BankView = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="text-center py-8">
        <Landmark className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 dark:text-indigo-100">
          国立銀行 はじまりの国支店
        </h3>
        <p className="text-gray-500 dark:text-indigo-300/70">
          安全な資産管理と、夢への投資をサポートします。
        </p>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-xl border-2 border-blue-100 dark:border-blue-500/20 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-500 dark:text-gray-300">
            あなたの預金残高
          </span>
          <span className="text-3xl font-mono font-bold text-gray-800 dark:text-white">
            1,000{" "}
            <span className="text-sm text-gray-500 dark:text-gray-400">pt</span>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-bold shadow-sm">
            預け入れ
          </button>
          <button className="bg-white dark:bg-transparent border border-blue-200 dark:border-blue-400/30 text-blue-600 dark:text-blue-400 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition font-bold">
            引き出し
          </button>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-300">
        <h4 className="font-bold mb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          現在の金利・税制
        </h4>
        <ul className="space-y-1">
          <li className="flex justify-between">
            <span>普通預金金利:</span> <span>0.01% / 月</span>
          </li>
          <li className="flex justify-between">
            <span>取引手数料:</span> <span>{NATION_DATA.taxRate}%</span>
          </li>
          <li className="flex justify-between">
            <span>ベーシックインカム:</span>{" "}
            <span>受給資格あり (明日支給)</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
