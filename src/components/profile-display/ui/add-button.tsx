import { Plus } from "lucide-react";
import { ThemeVars } from "../features/profile-dashboard.types";

interface AddButtonProps {
  readonly onClick: () => void;
  readonly label: string;
  readonly themeVars: ThemeVars;
}

/**
 * テーブル等に項目を追加するボタン
 */
export const AddButton = ({ onClick, label, themeVars }: AddButtonProps) => (
  <button
    onClick={onClick}
    className={`w-full p-6 transition-all text-center flex items-center justify-center gap-2 font-bold bg-white/5 hover:bg-white/10 border-t border-white/10 outline-none focus:bg-white/15 ${themeVars.subText} hover:text-white`}
  >
    <Plus className="w-6 h-6" /> {label}
  </button>
);
