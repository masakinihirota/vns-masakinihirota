import { ReactNode } from "react";
import { ThemeVars } from "../features/profile-dashboard.types";

interface SectionHeaderProps {
  readonly title: string;
  readonly icon: ReactNode;
  readonly themeVars: ThemeVars;
  readonly accent?: string;
  readonly children?: ReactNode;
}

/**
 * 各セクションの共通ヘッダー
 */
export const SectionHeader = ({
  title,
  icon,
  themeVars,
  accent,
  children,
}: SectionHeaderProps) => (
  <div
    className={`${themeVars.headerBg} p-6 flex justify-between items-center border-b border-white/10`}
  >
    <h2 className="text-3xl font-bold flex items-center gap-4">
      <span className={accent || themeVars.accent}>{icon}</span> {title}
    </h2>
    {children}
  </div>
);
