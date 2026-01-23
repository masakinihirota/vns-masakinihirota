import React from "react";
import { ProfileVariant } from "../types";
import { StatBox } from "../ui";

type ProfileBasicInfoProps = {
  name: string;
  stats: {
    trustDays: number;
    works: number;
    evals: number;
  };
  variant?: ProfileVariant;
};

export const ProfileBasicInfo: React.FC<ProfileBasicInfoProps> = ({
  name,
  stats,
  variant = "default",
}) => {
  const getStyles = () => {
    switch (variant) {
      case "cyber":
        return {
          container: "border-b border-cyan-500/30",
          title:
            "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400 text-shadow-neon",
        };
      case "pop":
        return {
          container:
            "bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] mb-8",
          title:
            "text-black bg-yellow-400 inline-block px-4 border-4 border-black transform -rotate-1 shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
        };
      case "elegant":
        return {
          container:
            "border-b border-double border-slate-200 dark:border-slate-800 text-center",
          title:
            "font-serif font-thin tracking-[0.2em] italic text-slate-800 dark:text-slate-200",
        };
      case "glass":
        return {
          container:
            "bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-inner border border-white/10",
          title: "text-white font-bold drop-shadow-lg",
        };
      default:
        return {
          container: "border-b border-slate-200 dark:border-slate-800",
          title: "text-slate-900 dark:text-white",
        };
    }
  };

  const styles = getStyles();

  // Adjust layout for 'elegant' which is centered
  const layoutClass =
    variant === "elegant" ? "flex flex-col items-center gap-8" : "space-y-6";

  const statsLayoutClass =
    variant === "elegant" ? "flex gap-16 justify-center" : "flex gap-8";

  return (
    <section
      className={`py-12 transition-all duration-300 ${styles.container}`}
    >
      <div className={layoutClass}>
        <h1
          className={`text-4xl font-black tracking-tighter uppercase leading-none transition-all ${styles.title}`}
        >
          {name}
        </h1>
        <div className={statsLayoutClass}>
          <StatBox
            label="信頼継続"
            value={`${stats.trustDays}d`}
            variant={variant}
          />
          <StatBox label="制作作品数" value={stats.works} variant={variant} />
          <StatBox label="総評価数" value={stats.evals} variant={variant} />
        </div>
      </div>
    </section>
  );
};
