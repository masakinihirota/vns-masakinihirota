import { SkillTab as TabType } from "../groups.types";

interface SkillsProps {
  activeSubTab: TabType;
  onSubTabChange: (tab: TabType) => void;
}

export const SkillsTab = ({ activeSubTab, onSubTabChange }: SkillsProps) => {
  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-black/80">
      <div className="bg-white/70 dark:bg-black/40 px-4 border-b border-gray-200 dark:border-white/10 flex items-center gap-4 shrink-0 overflow-x-auto no-scrollbar backdrop-blur-sm">
        <button
          onClick={() => onSubTabChange("mandala")}
          className={`py-3 px-2 text-[11px] font-bold ${
            activeSubTab === "mandala"
              ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400"
              : "text-gray-400"
          }`}
        >
          マンダラチャート
        </button>
        <button
          onClick={() => onSubTabChange("list")}
          className={`py-3 px-2 text-[11px] font-bold ${
            activeSubTab === "list"
              ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400"
              : "text-gray-400"
          }`}
        >
          所持スキル一覧
        </button>
      </div>

      {activeSubTab === "mandala" && (
        <div className="h-full flex items-center justify-center p-8 bg-gray-50/50 dark:bg-black/20">
          <div className="grid grid-cols-3 grid-rows-3 gap-3 w-full max-w-lg aspect-square bg-white/40 dark:bg-white/5 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-white/20">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className={`flex items-center justify-center text-[10px] p-4 rounded-2xl font-black shadow-sm transition-all cursor-default ${
                  i === 4
                    ? "bg-indigo-600 text-white scale-110 shadow-indigo-200 dark:shadow-indigo-900/50 z-10 ring-4 ring-indigo-50 dark:ring-indigo-900/20"
                    : "bg-white/80 dark:bg-white/10 text-gray-400 dark:text-gray-300 border border-white/40 hover:bg-white hover:text-indigo-600 dark:hover:bg-white/20"
                }`}
              >
                {i === 4 ? "メイン目標" : `Skill ${i + 1}`}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
