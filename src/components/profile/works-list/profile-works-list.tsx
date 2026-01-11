import { BookOpen, Disc, PenTool, Hash, Folder } from "lucide-react";
import React from "react";
import { ProfileVariant } from "../types";
import { MarkdownTable, TableRow } from "../ui";

type Work = {
  id: number;
  title: string;
  category: string;
  date: string;
};

type ProfileWorksListProps = {
  works: Work[];
  onAdd?: () => void;
  variant?: ProfileVariant;
};

export const ProfileWorksList: React.FC<ProfileWorksListProps> = ({
  works,
  onAdd,
  variant = "default",
}) => {
  // Style adjustments for cells
  const getCellStyles = () => {
    switch (variant) {
      case "cyber":
        return {
          title: "text-green-400 font-mono text-shadow-xs",
          date: "text-cyan-600 font-mono",
        };
      case "pop":
        return {
          title: "text-black font-black",
          date: "text-black font-bold bg-yellow-200 px-1 border-2 border-black",
        };
      case "elegant":
        return {
          title: "text-slate-800 dark:text-slate-200 font-serif italic",
          date: "text-slate-400 font-serif",
        };
      case "glass":
        return {
          title: "text-white font-bold text-shadow-sm",
          date: "text-white/60 font-mono",
        };
      default:
        return {
          title: "text-slate-900 dark:text-white font-bold",
          date: "text-slate-500 font-mono",
        };
    }
  };

  const cellStyles = getCellStyles();

  const rows: TableRow[] = works.map((w) => ({
    cells: [
      { content: <span className={cellStyles.title}>{w.title}</span> },
      { content: w.category },
      { content: w.date, className: `text-right text-xs ${cellStyles.date}` },
    ],
  }));

  // Header styling
  const getHeaderStyles = () => {
    const iconSize = 14;
    switch (variant) {
      case "cyber":
        return {
          wrapper: "text-green-500 mb-4 border-l-4 border-green-500 pl-3",
          icon: (
            <Disc
              size={iconSize}
              className="text-green-400 animate-spin-slow"
            />
          ),
          text: "font-mono tracking-widest text-shadow-neon",
        };
      case "pop":
        return {
          wrapper:
            "text-black mb-4 bg-white border-4 border-black inline-flex px-4 py-1 shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
          icon: <PenTool size={iconSize} className="text-black" />,
          text: "font-black tracking-tighter",
        };
      case "elegant":
        return {
          wrapper: "text-slate-400 mb-8 flex justify-center",
          icon: <Hash size={iconSize} className="text-slate-300" />,
          text: "font-serif tracking-[0.3em] font-normal",
        };
      case "glass":
        return {
          wrapper:
            "text-white/80 mb-4 flex items-center gap-2 bg-white/10 w-fit px-4 py-1 rounded-full backdrop-blur-md border border-white/20",
          icon: <Folder size={iconSize} className="text-white" />,
          text: "font-bold tracking-widest drop-shadow-md",
        };
      default:
        return {
          wrapper: "text-slate-400 mb-4 flex items-center gap-2",
          icon: <BookOpen size={iconSize} className="text-blue-600" />,
          text: "font-black uppercase tracking-[0.2em]",
        };
    }
  };

  const header = getHeaderStyles();

  return (
    <section>
      <h2
        className={`text-xs ${header.wrapper} flex items-center gap-2 transition-all duration-300`}
      >
        {header.icon}
        <span className={header.text}>[ 自分自身が作った作品 ]</span>
      </h2>
      <MarkdownTable
        headers={[
          { label: "作品タイトル" },
          { label: "カテゴリ", className: "w-32" },
          { label: "登録時期", className: "w-32 text-right" },
        ]}
        rows={rows}
        onAdd={onAdd}
        variant={variant}
      />
    </section>
  );
};
