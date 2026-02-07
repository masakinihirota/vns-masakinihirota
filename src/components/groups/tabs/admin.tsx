import { BookOpen, Plus, ShieldAlert } from "lucide-react";
import { MOCK_MEMBERS } from "../groups.mock"; // Direct import or prop? Prop is better but mock is fine for now as it's reused.
import { AdminTab as TabType } from "../groups.types";

interface AdminProps {
  activeSubTab: TabType;
  onSubTabChange: (tab: TabType) => void;
  // If we want to manage members via props, add here. For now using MOCK_MEMBERS directly as per spec implies read-only for now.
}

export const AdminTab = ({ activeSubTab, onSubTabChange }: AdminProps) => {
  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-black/80">
      <div className="bg-white/70 dark:bg-black/40 px-4 border-b border-gray-200 dark:border-white/10 flex items-center gap-4 shrink-0 overflow-x-auto no-scrollbar backdrop-blur-sm">
        <button
          onClick={() => onSubTabChange("members")}
          className={`py-3 px-2 text-[11px] font-bold ${
            activeSubTab === "members"
              ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400"
              : "text-gray-400"
          }`}
        >
          メンバー管理
        </button>
        <button
          onClick={() => onSubTabChange("projects")}
          className={`py-3 px-2 text-[11px] font-bold ${
            activeSubTab === "projects"
              ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400"
              : "text-gray-400"
          }`}
        >
          進捗ボード
        </button>
      </div>

      {activeSubTab === "members" && (
        <div className="p-8 space-y-6 overflow-y-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              組織メンバー管理室
            </h2>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 dark:shadow-none hover:scale-105 transition-all">
              <Plus size={16} /> メンバー招待
            </button>
          </div>
          <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 shadow-sm overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                <tr className="text-left text-gray-400 uppercase tracking-widest">
                  <th className="p-4 font-black">メンバー名</th>
                  <th className="p-4 font-black">役割</th>
                  <th className="p-4 font-black text-right">管理アクション</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {MOCK_MEMBERS.slice(0, 15).map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 flex items-center gap-3">
                      <span className="text-xl">{m.avatar}</span>
                      <span className="font-bold text-gray-700 dark:text-gray-200">
                        {m.name}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full font-black text-[9px] uppercase ${
                          m.role === "リーダー"
                            ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300"
                            : m.role === "メディエーター"
                              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
                              : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                        }`}
                      >
                        {m.role}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2 justify-end">
                      <button
                        aria-label="詳細を見る"
                        className="p-2 text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                      >
                        <BookOpen size={16} />
                      </button>
                      <button
                        aria-label="警告する"
                        className="p-2 text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                      >
                        <ShieldAlert size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
