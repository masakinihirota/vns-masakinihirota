import { ReactNode } from "react";

import { ThemeVars as ThemeVariables } from "../features/profile-dashboard.types";

interface VisibilityToggleProperties {
  readonly active: boolean;
  readonly onClick: () => void;
  readonly label: string;
  readonly icon: ReactNode;
  readonly themeVars: ThemeVariables;
}

/**
 * セクションの表示/非表示を切り替えるトグルボタン
 * @param root0
 * @param root0.active
 * @param root0.onClick
 * @param root0.label
 * @param root0.icon
 * @param root0.themeVars
 */
export const VisibilityToggle = ({
  active,
  onClick,
  label,
  icon,
  themeVars,
}: VisibilityToggleProperties) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold transition-all border-2 text-[14pt]
      ${
        active
          ? "bg-indigo-500/20 border-indigo-400 text-indigo-400 shadow-md"
          : `bg-white/5 border-white/10 ${themeVars.subText} opacity-50 grayscale hover:opacity-100`
      }`}
  >
    {icon} {label}
  </button>
);
