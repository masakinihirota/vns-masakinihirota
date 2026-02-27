import { Moon, Sun } from "lucide-react";

import { ThemeVars as ThemeVariables } from "../features/profile-dashboard.types";

interface ThemeToggleProperties {
  readonly isDarkMode: boolean;
  readonly onClick: () => void;
  readonly themeVars: ThemeVariables;
}

/**
 * ダークモードとライトモードを切り替えるボタン
 * @param root0
 * @param root0.isDarkMode
 * @param root0.onClick
 * @param root0.themeVars
 */
export const ThemeToggle = ({
  isDarkMode,
  onClick,
  themeVars,
}: ThemeToggleProperties) => (
  <button
    onClick={onClick}
    className={`p-4 rounded-full border transition-all ${themeVars.btnPrimary}`}
    aria-label="Toggle Theme"
  >
    {isDarkMode ? <Sun className="w-8 h-8" /> : <Moon className="w-8 h-8" />}
  </button>
);
