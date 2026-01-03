import { Heart, Trash2, Activity, Star, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { ProfileVariant } from "../types";
import { MarkdownTable, TableRow } from "../ui";

type Tier = "tier1" | "tier2" | "tier3" | "normal";

export type Evaluation = {
  id: number;
  title: string;
  category: string;
  status: "now" | "future" | "life";
  tier: Tier;
};

type ProfileEvaluationsProps = {
  evaluations: Evaluation[];
  onAdd?: () => void;
  variant?: ProfileVariant;
};

export const ProfileEvaluations: React.FC<ProfileEvaluationsProps> = ({
  evaluations,
  onAdd,
  variant = "default",
}) => {
  const [selectedCategory, setSelectedCategory] = useState("アニメ");

  const getTierDisplay = (tier: string) => {
    switch (tier) {
      case "tier1":
        return "1";
      case "tier2":
        return "2";
      case "tier3":
        return "3";
      default:
        return "普";
    }
  };

  const getStyles = () => {
    switch (variant) {
      case "cyber":
        return {
          section: "pt-8 border-t border-cyan-500/30",
          headerIcon: <Activity size={14} className="text-cyan-400" />,
          headerText: "text-cyan-600 font-mono tracking-widest",
          tabContainer: "border border-cyan-500/50 bg-black/50",
          tab: (isActive: boolean) =>
            isActive
              ? "bg-cyan-900/50 text-cyan-300 border-r border-cyan-500/50 text-shadow-neon"
              : "bg-transparent text-cyan-700 hover:text-cyan-400 hover:bg-cyan-900/20 border-r border-cyan-500/30",
          subHeader: (color: string) =>
            `text-xs font-mono font-bold mb-3 flex items-center gap-2 bg-black border border-${color}-500/50 text-${color}-400 uppercase tracking-widest w-fit px-3 py-1 rounded-none text-shadow-xs`,
        };
      case "pop":
        return {
          section: "pt-8 border-t-4 border-black",
          headerIcon: (
            <Heart size={14} className="text-pink-500 fill-pink-500" />
          ),
          headerText:
            "text-black font-black bg-pink-200 px-2 py-1 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
          tabContainer:
            "border-4 border-black bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
          tab: (isActive: boolean) =>
            isActive
              ? "bg-black text-white font-black border-r-4 border-black"
              : "bg-white text-black font-bold hover:bg-slate-100 border-r-4 border-black",
          subHeader: (_color: string) =>
            `text-xs font-black mb-3 flex items-center gap-2 text-black uppercase tracking-widest bg-white border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] w-fit px-2 py-0.5 rounded-none`,
        };
      case "elegant":
        return {
          section:
            "pt-8 border-t border-double border-slate-200 dark:border-slate-800",
          headerIcon: <Star size={14} className="text-slate-400" />,
          headerText: "text-slate-500 font-serif italic tracking-widest",
          tabContainer:
            "border-b border-slate-200 dark:border-slate-800 bg-transparent rounded-none",
          tab: (isActive: boolean) =>
            isActive
              ? "text-slate-800 dark:text-slate-200 border-b-2 border-slate-800 dark:border-slate-200 font-serif italic"
              : "text-slate-400 hover:text-slate-600 font-serif hover:bg-transparent",
          subHeader: (_color: string) =>
            `text-xs font-serif italic mb-3 flex items-center gap-2 text-slate-500 uppercase tracking-wider w-fit py-1`,
        };
      case "glass":
        return {
          section: "pt-8 border-t border-white/10",
          headerIcon: <Sparkles size={14} className="text-purple-300" />,
          headerText:
            "text-purple-100 font-bold tracking-widest drop-shadow-sm",
          tabContainer:
            "border border-white/20 bg-white/5 backdrop-blur-md rounded-full p-1",
          tab: (isActive: boolean) =>
            isActive
              ? "bg-white/20 text-white rounded-full font-bold shadow-inner"
              : "text-white/60 hover:text-white hover:bg-white/10 rounded-full border-none",
          subHeader: (_color: string) =>
            `text-xs font-bold mb-3 flex items-center gap-2 text-white/90 uppercase tracking-widest bg-white/10 border border-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm`,
        };
      default:
        return {
          section: "pt-8 border-t border-slate-200 dark:border-slate-800",
          headerIcon: <Heart size={14} className="text-pink-500" />,
          headerText: "text-slate-400 font-black uppercase tracking-[0.2em]",
          tabContainer:
            "border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded",
          tab: (isActive: boolean) =>
            isActive
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "bg-transparent text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800",
          subHeader: (color: string) =>
            `text-xs font-black mb-3 flex items-center gap-2 text-${color}-600 dark:text-${color}-400 uppercase tracking-widest bg-${color}-50 dark:bg-${color}-900/20 w-fit px-2 py-0.5 rounded font-mono`,
        };
    }
  };

  const styles = getStyles();

  const renderTable = (
    status: "now" | "future" | "life",
    label: string,
    colorName: string,
    emptyMsg: string
  ) => {
    const filtered = evaluations
      .filter((e) => e.status === status && e.category === selectedCategory)
      .sort((a, b) => a.tier.localeCompare(b.tier));

    const rows: TableRow[] = filtered.map((e) => ({
      cells: [
        { content: getTierDisplay(e.tier), className: "text-center font-bold" },
        { content: <span className="font-bold">{e.title}</span> },
        {
          content: (
            <button className="hover:text-red-500 transition-colors">
              <Trash2 size={14} />
            </button>
          ),
          className: "text-right",
        },
      ],
    }));

    return (
      <div>
        <h3 className={styles.subHeader(colorName)}>{label}</h3>
        <MarkdownTable
          headers={[
            { label: "Tier", className: "w-16 text-center font-mono" },
            { label: "作品タイトル" },
            { label: "", className: "w-10 text-right" },
          ]}
          rows={rows}
          emptyMessage={emptyMsg}
          onAdd={onAdd}
          variant={variant}
        />
      </div>
    );
  };

  return (
    <section className={styles.section}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className={`text-xs flex items-center gap-2 ${styles.headerText}`}>
          {styles.headerIcon} [ 作品評価 ]
        </h2>

        <div className={`flex overflow-hidden ${styles.tabContainer}`}>
          {["アニメ", "漫画"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-1.5 text-xs transition-colors ${styles.tab(selectedCategory === cat)}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-12">
        {renderTable(
          "now",
          "> Now Watching (今の作品)",
          "blue",
          "今の作品はありません"
        )}
        {renderTable(
          "future",
          "> Future Expectations (未来の期待作)",
          "orange",
          "未来の作品はありません"
        )}
        {renderTable(
          "life",
          "> Lifetime Best (人生の作品)",
          "purple",
          "人生の作品はありません"
        )}
      </div>
    </section>
  );
};
