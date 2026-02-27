import { ReactNode } from "react";

import { ThemeVars as ThemeVariables } from "../features/profile-dashboard.types";

interface SectionHeaderProperties {
  readonly title: string;
  readonly icon: ReactNode;
  readonly themeVars: ThemeVariables;
  readonly accent?: string;
  readonly children?: ReactNode;
}

/**
 * 各セクションの共通ヘッダー
 * @param root0
 * @param root0.title
 * @param root0.icon
 * @param root0.themeVars
 * @param root0.accent
 * @param root0.children
 */
export const SectionHeader = ({
  title,
  icon,
  themeVars,
  accent,
  children,
}: SectionHeaderProperties) => (
  <div
    className={`${themeVars.headerBg} p-6 flex justify-between items-center border-b border-white/10`}
  >
    <h2 className="text-3xl font-bold flex items-center gap-4">
      <span className={accent || themeVars.accent}>{icon}</span> {title}
    </h2>
    {children}
  </div>
);
