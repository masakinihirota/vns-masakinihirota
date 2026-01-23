import React from "react";
import { ProfileVariant } from "../types";

type StatBoxProps = {
  label: string;
  value: string | number;
  variant?: ProfileVariant;
};

export const StatBox: React.FC<StatBoxProps> = ({
  label,
  value,
  variant = "default",
}) => {
  // Variant Styles
  const getStyles = () => {
    switch (variant) {
      case "cyber":
        return {
          value: "text-cyan-400 font-mono text-shadow-neon",
          label: "text-cyan-600/70 font-mono tracking-widest",
        };
      case "pop":
        return {
          value:
            "text-black font-black drop-shadow-[2px_2px_0_rgba(255,255,0,1)]",
          label:
            "text-black bg-yellow-400 px-1 font-bold border border-black inline-block transform -rotate-2",
        };
      case "elegant":
        return {
          value: "text-slate-800 dark:text-slate-200 font-serif italic",
          label: "text-slate-500 font-serif tracking-[0.2em]",
        };
      case "glass":
        return {
          value: "text-white drop-shadow-md",
          label: "text-white/80 font-medium tracking-wider",
        };
      default:
        return {
          value: "text-slate-900 dark:text-white",
          label: "text-slate-400",
        };
    }
  };

  const styles = getStyles();

  return (
    <div className="flex flex-col gap-1">
      <div
        className={`text-3xl font-black leading-none tracking-tight ${styles.value}`}
      >
        {value}
      </div>
      <div
        className={`text-[9px] font-black uppercase tracking-[0.3em] leading-none ${styles.label}`}
      >
        {label}
      </div>
    </div>
  );
};
