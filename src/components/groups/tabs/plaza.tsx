import { MessageSquare } from "lucide-react";
import { PlazaTab as TabType } from "../groups.types";

interface PlazaProps {
  activeSubTab: TabType;
  onSubTabChange: (tab: TabType) => void;
}

export const PlazaTab = ({ activeSubTab, onSubTabChange }: PlazaProps) => {
  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-black/80">
      <div className="bg-white/70 dark:bg-black/40 px-4 border-b border-gray-200 dark:border-white/10 flex items-center gap-4 shrink-0 overflow-x-auto no-scrollbar backdrop-blur-sm">
        <button
          onClick={() => onSubTabChange("chat")}
          className={`py-3 px-2 text-[11px] font-bold ${
            activeSubTab === "chat"
              ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400"
              : "text-gray-400"
          }`}
        >
          チャット
        </button>
        <button
          onClick={() => onSubTabChange("events")}
          className={`py-3 px-2 text-[11px] font-bold ${
            activeSubTab === "events"
              ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400"
              : "text-gray-400"
          }`}
        >
          イベント告知
        </button>
      </div>

      {activeSubTab === "chat" && (
        <div className="h-full flex flex-col p-4">
          <div className="flex-1 bg-white/70 dark:bg-black/40 backdrop-blur-xl rounded-xl border border-white/20 dark:border-white/10 p-4 shadow-sm overflow-y-auto">
            <div className="flex gap-4 mb-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs shadow-sm">
                😎
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl rounded-tl-none text-xs max-w-sm border border-gray-50 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                今日もお疲れ様です。現在の進捗を共有してください。
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              className="flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 text-sm shadow-inner outline-none focus:ring-1 focus:ring-indigo-500 text-gray-800 dark:text-gray-100"
              placeholder="メッセージを入力..."
            />
            <button
              aria-label="送信"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-all"
            >
              <MessageSquare size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
