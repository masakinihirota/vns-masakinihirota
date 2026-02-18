import { Save, Trash2 } from "lucide-react";
import React from "react";
import { getMaskIcon, Profile } from "../profile-creation-1000masks.logic";

interface HeaderProps {
  activeProfile: Profile;
  isDirty: boolean;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onDelete: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeProfile,
  isDirty,
  onNameChange,
  onSave,
  onDelete,
}) => {
  const Icon = getMaskIcon(activeProfile.maskId, activeProfile.avatarType);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0B0F1A]/80 backdrop-blur-md px-10 py-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between transition-colors duration-300">
      <div className="flex-1 mr-8 flex items-center space-x-8 text-left">
        <div
          className={`p-4 rounded-2xl shadow-lg transition-all duration-500 ${activeProfile.isGhost ? "bg-purple-600 text-white" : "bg-blue-600 text-white"}`}
        >
          <Icon size={32} />
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center space-x-3 mb-1 text-left line-height-none">
            <input
              type="text"
              value={activeProfile.name}
              onChange={(e) => onNameChange(e.target.value)}
              className="text-3xl font-black bg-transparent focus:outline-none tracking-tighter text-slate-800 dark:text-neutral-100 w-full transition-all"
              placeholder="名前を入力..."
            />
            {isDirty && (
              <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[12px] font-black rounded-full uppercase tracking-widest animate-pulse border border-amber-200 dark:border-amber-800/50 pt-1.5 whitespace-nowrap">
                Unsaved Changes
              </span>
            )}
          </div>
          <p className="text-lg font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
            {activeProfile.constellationName}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 text-left">
        {!activeProfile.isGhost && (
          <button
            onClick={onDelete}
            className="p-4 text-slate-300 dark:text-slate-600 hover:text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl"
            title="削除"
            aria-label="プロフィールを削除"
          >
            <Trash2 size={24} />
          </button>
        )}
        <button
          onClick={onSave}
          disabled={!isDirty}
          className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95 ${
            isDirty
              ? "bg-emerald-600 dark:bg-emerald-700 text-white shadow-emerald-100 dark:shadow-none hover:bg-emerald-700"
              : "bg-slate-100 dark:bg-[#161B22] text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50 shadow-none"
          }`}
        >
          <Save size={20} />
          <span>{isDirty ? "仮面を保存" : "保存済"}</span>
        </button>
      </div>
    </header>
  );
};
