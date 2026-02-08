import { Moon, Sun } from "lucide-react";
import { ThemeVars } from "../features/profile-dashboard.types";

interface ThemeToggleProps {
  readonly isDarkMode: boolean;
  readonly onClick: () => void;
  readonly themeVars: ThemeVars;
}

/**
 * ダークモードとライトモードを切り替えるボタン
 */
export const ThemeToggle = ({
  isDarkMode,
  onClick,
  themeVars,
}: ThemeToggleProps) => (
  <button
    onClick={onClick}
    className={`p-4 rounded-full border transition-all ${themeVars.btnPrimary}`}
    aria-label="Toggle Theme"
  >
    {isDarkMode ? <Sun className="w-8 h-8" /> : <Moon className="w-8 h-8" />}
  </button>
);
