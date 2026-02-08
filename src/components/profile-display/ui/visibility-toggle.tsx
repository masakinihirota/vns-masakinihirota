import { ReactNode } from "react";
import { ThemeVars } from "../features/profile-dashboard.types";

interface VisibilityToggleProps {
  readonly active: boolean;
  readonly onClick: () => void;
  readonly label: string;
  readonly icon: ReactNode;
  readonly themeVars: ThemeVars;
}

/**
 * セクションの表示/非表示を切り替えるトグルボタン
 */
export const VisibilityToggle = ({
  active,
  onClick,
  label,
  icon,
  themeVars,
}: VisibilityToggleProps) => (
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
