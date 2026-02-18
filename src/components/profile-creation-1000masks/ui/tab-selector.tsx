import { CheckCircle2, Disc, Info, Plus } from "lucide-react";
import React from "react";
import { Cassette } from "../profile-creation-1000masks.logic";

interface TabSelectorProps {
  label: string;
  sets: Cassette[];
  selectedId: string;
  onSelect: (id: string) => void;
  onCreateNew?: () => void;
}

export const TabSelector: React.FC<TabSelectorProps> = ({
  label,
  sets,
  selectedId,
  onSelect,
  onCreateNew,
}) => {
  return (
    <div className="mb-6 animate-in fade-in duration-500 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-lg font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center space-x-3 text-left">
          <Disc size={20} className="text-blue-400 dark:text-blue-600" />
          <span>{label}</span>
        </label>
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-xl text-lg font-black hover:bg-black dark:hover:bg-slate-600 transition-all active:scale-95 shadow-lg"
          >
            <Plus size={18} />
            <span>カセットを新規作成</span>
          </button>
        )}
      </div>
      <div className="flex flex-col gap-4 mb-6">
        {sets.map((set) => (
          <button
            key={set.id}
            onClick={() => onSelect(set.id)}
            className={`px-8 py-5 rounded-[1.5rem] text-lg font-bold text-left border-4 transition-all flex items-center justify-between ${
              selectedId === set.id
                ? "bg-blue-600 dark:bg-blue-700 text-white border-blue-400 dark:border-blue-500 shadow-xl scale-[1.01]"
                : "bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-white/10 hover:border-blue-200 dark:hover:border-blue-900 shadow-sm"
            }`}
          >
            <div className="flex flex-col text-left">
              <span>{set.name}</span>
              <span
                className={`text-lg font-bold mt-1 ${selectedId === set.id ? "text-blue-100 dark:text-blue-200/60" : "text-slate-400 dark:text-slate-600"}`}
              >
                Items: {set.items.join(", ")}
              </span>
            </div>
            {selectedId === set.id && <CheckCircle2 size={24} />}
          </button>
        ))}
      </div>
      <div className="p-6 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-wrap gap-2 shadow-inner">
        <p className="w-full text-lg font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-3 flex items-center space-x-2 opacity-50 text-left">
          <Info size={16} />
          <span>装着中の内容プレビュー</span>
        </p>
        {sets
          .find((s) => s.id === selectedId)
          ?.items.map((item, i) => (
            <span
              key={i}
              className="px-4 py-2 bg-white dark:bg-[#161B22] border border-slate-200 dark:border-white/10 rounded-xl text-lg font-bold text-slate-700 dark:text-neutral-300 shadow-sm transition-colors"
            >
              {item}
            </span>
          ))}
      </div>
    </div>
  );
};
