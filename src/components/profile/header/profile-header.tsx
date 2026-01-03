import { ChevronRight, Bell, Settings, Zap, Star, Hexagon } from "lucide-react";
import React from "react";
import { ProfileVariant } from "../types";

type ProfileHeaderProps = {
  userName: string;
  points: number;
  variant?: ProfileVariant;
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userName,
  points,
  variant = "default",
}) => {
  const getStyles = () => {
    switch (variant) {
      case "cyber":
        return {
          header:
            "bg-black border-b border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]",
          logoBox: "bg-cyan-950/50 text-cyan-400 border border-cyan-500",
          logoText: "font-mono tracking-tighter text-shadow-neon",
          breadcrumb: "text-cyan-700 font-mono",
          breadcrumbCurrent: "text-cyan-400 text-shadow-neon",
          pointsBox:
            "bg-black border border-cyan-500 text-cyan-400 font-mono shadow-[0_0_5px_rgba(6,182,212,0.5)]",
          iconBtn: "text-cyan-500 hover:text-cyan-300 hover:bg-cyan-900/30",
        };
      case "pop":
        return {
          header: "bg-yellow-400 border-b-4 border-black",
          logoBox:
            "bg-black text-white transform -rotate-2 shadow-[4px_4px_0_0_rgba(255,255,255,1)]",
          logoText: "font-black tracking-tighter",
          breadcrumb: "text-black font-bold",
          breadcrumbCurrent:
            "bg-black text-white px-2 py-0.5 transform rotate-2",
          pointsBox:
            "bg-white border-4 border-black text-black font-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
          iconBtn:
            "bg-white border-2 border-black text-black hover:bg-black hover:text-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all rounded-none",
        };
      case "elegant":
        return {
          header:
            "bg-white dark:bg-slate-950 border-b border-double border-slate-200 dark:border-slate-800",
          logoBox:
            "bg-transparent text-slate-900 dark:text-white border border-slate-900 dark:border-white px-4",
          logoText: "font-serif tracking-widest font-normal",
          breadcrumb: "text-slate-400 font-serif italic",
          breadcrumbCurrent: "text-slate-900 dark:text-white font-serif",
          pointsBox:
            "bg-slate-50 dark:bg-slate-900 border-none text-slate-800 dark:text-slate-200 font-serif italic",
          iconBtn:
            "text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-full",
        };
      case "glass":
        return {
          header:
            "bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-4 mx-4 rounded-full mt-4 z-50",
          logoBox: "bg-white/20 text-white backdrop-blur-sm rounded-full px-4",
          logoText: "font-bold tracking-tight",
          breadcrumb: "text-white/60",
          breadcrumbCurrent: "text-white font-bold text-shadow-sm",
          pointsBox:
            "bg-white/10 border border-white/20 text-white rounded-full backdrop-blur-md",
          iconBtn: "text-white hover:bg-white/20 rounded-full",
        };
      default:
        return {
          header:
            "bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 sticky top-0",
          logoBox:
            "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900",
          logoText: "font-black tracking-tighter",
          breadcrumb: "text-slate-400",
          breadcrumbCurrent: "text-slate-900 dark:text-white",
          pointsBox:
            "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white",
          iconBtn: "hover:bg-slate-100 dark:hover:bg-slate-800",
        };
    }
  };

  const styles = getStyles();

  return (
    <header
      className={`h-16 flex items-center justify-between px-8 z-20 shadow-sm transition-all duration-300 ${styles.header}`}
    >
      <div className="flex items-center gap-6">
        <div
          className={`rounded px-2 py-1 text-lg leading-none transition-all ${styles.logoBox}`}
        >
          {variant === "cyber" && <Zap size={16} className="inline mr-1" />}
          {variant === "pop" && (
            <Star size={16} className="inline mr-1 fill-white text-black" />
          )}
          {variant === "glass" && <Hexagon size={16} className="inline mr-1" />}
          <span className={`uppercase ${styles.logoText}`}>masakinihirota</span>
        </div>
        <div
          className={`flex items-center gap-2 text-xs font-bold tracking-widest transition-all ${styles.breadcrumb}`}
        >
          <span>DATA SHEET</span>
          <ChevronRight size={10} />
          <span
            className={`uppercase transition-all ${styles.breadcrumbCurrent}`}
          >
            {userName}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div
          className={`text-xs font-mono font-bold px-3 py-1 rounded transition-all ${styles.pointsBox}`}
        >
          {points.toLocaleString()} PT
        </div>
        <button className={`p-2 transition-all ${styles.iconBtn}`}>
          <Bell size={18} />
        </button>
        <button className={`p-2 transition-all ${styles.iconBtn}`}>
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
};
