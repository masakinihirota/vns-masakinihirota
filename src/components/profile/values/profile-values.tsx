import { Fingerprint, Scan, Grip, Feather, Hexagon } from "lucide-react";
import React from "react";
import { ProfileVariant } from "../types";
import { MarkdownTable, TableRow } from "../ui";

export type ValueItem = {
  id: number;
  category: string;
  topic: string;
  answers: string[];
  level: string;
};

type ProfileValuesProps = {
  values: ValueItem[];
  onAdd?: () => void;
  variant?: ProfileVariant;
};

export const ProfileValues: React.FC<ProfileValuesProps> = ({
  values,
  onAdd,
  variant = "default",
}) => {
  // Style adjustments for icons and headers
  const getStyles = () => {
    const iconSize = 14;
    switch (variant) {
      case "cyber":
        return {
          wrapper: "text-emerald-500 mb-6 border-l-4 border-emerald-500 pl-3",
          icon: <Scan size={iconSize} className="text-emerald-400" />,
          text: "font-mono tracking-widest text-shadow-neon",
        };
      case "pop":
        return {
          wrapper:
            "text-black mb-6 bg-white border-4 border-black inline-flex px-4 py-1 shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
          icon: <Grip size={iconSize} className="text-black" />,
          text: "font-black tracking-tighter",
        };
      case "elegant":
        return {
          wrapper: "text-slate-400 mb-8 flex justify-center",
          icon: <Feather size={iconSize} className="text-slate-300" />,
          text: "font-serif tracking-[0.3em] font-normal",
        };
      case "glass":
        return {
          wrapper:
            "text-white/80 mb-6 flex items-center gap-2 bg-white/10 w-fit px-4 py-1 rounded-full backdrop-blur-md border border-white/20",
          icon: <Hexagon size={iconSize} className="text-white" />,
          text: "font-bold tracking-widest drop-shadow-md",
        };
      default:
        return {
          wrapper: "text-slate-400 mb-6 flex items-center gap-2",
          icon: <Fingerprint size={iconSize} className="text-emerald-500" />,
          text: "font-black uppercase tracking-[0.2em]",
        };
    }
  };

  const style = getStyles();

  const rows: TableRow[] = values.map((v) => ({
    cells: [
      { content: v.category },
      { content: <span className="font-bold">{v.topic}</span> },
      {
        content: (
          <div className="flex flex-col space-y-1 py-1">
            {v.answers.map((ans, idx) => (
              <div key={idx} className="flex items-start gap-2 leading-snug">
                <span
                  className={`text-[10px] items-center flex ${variant === "cyber" ? "text-emerald-500" : "text-slate-400"}`}
                >
                  {variant === "pop" ? "■" : variant === "cyber" ? ">" : "•"}
                </span>
                <span>{ans}</span>
              </div>
            ))}
          </div>
        ),
      },
      {
        content: (
          <span
            className={
              v.level === "重要" ? "text-rose-500 font-bold" : "text-slate-400"
            }
          >
            {v.level}
          </span>
        ),
        className: "text-center text-xs font-bold",
      },
    ],
  }));

  return (
    <section
      className={`pt-8 border-t ${
        variant === "cyber"
          ? "border-emerald-500/30"
          : variant === "pop"
            ? "border-black border-t-4"
            : variant === "glass"
              ? "border-white/10"
              : variant === "elegant"
                ? "border-double border-slate-200 dark:border-slate-800"
                : "border-slate-200 dark:border-slate-800"
      }`}
    >
      <h2
        className={`text-xs ${style.wrapper} flex items-center gap-2 transition-all`}
      >
        {style.icon} <span className={style.text}>[ 価値観 ]</span>
      </h2>
      <MarkdownTable
        headers={[
          { label: "カテゴリ", className: "w-32" },
          { label: "お題", className: "w-48" },
          { label: "選択した内容" },
          { label: "重要度", className: "w-20 text-center" },
        ]}
        rows={rows}
        onAdd={onAdd}
        variant={variant}
      />
    </section>
  );
};
