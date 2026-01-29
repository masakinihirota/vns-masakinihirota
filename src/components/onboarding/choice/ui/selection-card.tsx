import React from "react";

type SelectionCardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
};

export const SelectionCard = ({
  children,
  className = "",
  onClick,
  selected,
}: SelectionCardProps) => (
  <div
    onClick={onClick}
    className={`
      relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer
      ${
        selected
          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-[1.02]"
          : "border-neutral-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:border-neutral-300 dark:hover:border-slate-600 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-lg hover:-translate-y-1"
      }
      ${className}
    `}
  >
    {children}
  </div>
);
