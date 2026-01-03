import { Plus } from "lucide-react";
import React, { ReactNode } from "react";
import { ProfileVariant } from "../types";

export type TableHeader = {
  label: string;
  className?: string;
};

export type TableCell = {
  content: ReactNode;
  className?: string;
};

export type TableRow = {
  cells: TableCell[];
  className?: string;
};

type MarkdownTableProps = {
  headers: TableHeader[];
  rows: TableRow[];
  emptyMessage?: string;
  onAdd?: () => void;
  variant?: ProfileVariant;
};

export const MarkdownTable: React.FC<MarkdownTableProps> = ({
  headers,
  rows,
  emptyMessage,
  onAdd,
  variant = "default",
}) => {
  const getStyles = () => {
    switch (variant) {
      case "cyber":
        return {
          container:
            "border border-cyan-500/50 bg-black/80 shadow-[0_0_10px_rgba(6,182,212,0.2)]",
          headerRow: "bg-cyan-950/30 border-b border-cyan-500/50",
          headerCell:
            "text-cyan-400 font-mono uppercase tracking-widest border-r border-cyan-500/30 last:border-r-0",
          row: "hover:bg-cyan-900/20 transition-colors border-b border-cyan-500/20 last:border-b-0",
          cell: "text-cyan-300 font-mono border-r border-cyan-500/20 last:border-r-0",
          emptyData: "text-cyan-700 italic",
          addButton:
            "text-cyan-500 border-cyan-500/50 hover:bg-cyan-900/30 hover:text-cyan-300 mt-4 border-dashed",
        };
      case "pop":
        return {
          container:
            "border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)]",
          headerRow: "bg-yellow-400 border-b-4 border-black",
          headerCell:
            "text-black font-black uppercase text-lg border-r-4 border-black last:border-r-0",
          row: "hover:bg-yellow-50 border-b-4 border-black last:border-b-0",
          cell: "text-black font-bold border-r-4 border-black last:border-r-0",
          emptyData: "text-black font-bold bg-stripes",
          addButton:
            "text-black bg-white border-4 border-black hover:bg-black hover:text-white mt-4 font-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all",
        };
      case "elegant":
        return {
          container: "border-t border-b border-slate-200 dark:border-slate-800",
          headerRow: "border-b border-slate-200 dark:border-slate-800",
          headerCell:
            "text-slate-500 dark:text-slate-400 font-serif italic font-normal py-4 tracking-wider",
          row: "hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors border-b border-slate-100 dark:border-slate-800/50 last:border-b-0",
          cell: "text-slate-700 dark:text-slate-300 font-serif py-4",
          emptyData: "text-slate-400 font-serif italic py-8",
          addButton:
            "text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-serif italic border border-transparent hover:border-slate-200 mt-4",
        };
      case "glass":
        return {
          container:
            "bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden shadow-lg",
          headerRow: "bg-white/10 border-b border-white/10",
          headerCell: "text-white/90 font-medium tracking-wide",
          row: "hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0",
          cell: "text-white/80",
          emptyData: "text-white/40 italic py-8",
          addButton:
            "text-white/60 hover:text-white hover:bg-white/10 border border-white/20 rounded-lg mt-4",
        };
      default:
        return {
          container: "border border-slate-300 dark:border-slate-700",
          headerRow: "bg-slate-50 dark:bg-slate-800",
          headerCell:
            "font-bold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700",
          row: "bg-white dark:bg-slate-900 even:bg-slate-50/30",
          cell: "text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700",
          emptyData: "text-slate-400 italic",
          addButton:
            "text-slate-400 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 mt-2",
        };
    }
  };

  const styles = getStyles();

  return (
    <div className="mb-6">
      <div className={`overflow-x-auto ${styles.container}`}>
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className={styles.headerRow}>
              {headers.map((h, i) => (
                <th
                  key={i}
                  className={`px-4 py-2 ${styles.headerCell} ${h.className || ""}`}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row, i) => (
                <tr key={i} className={`${styles.row} ${row.className || ""}`}>
                  {row.cells.map((cell, j) => (
                    <td
                      key={j}
                      className={`px-4 py-2 align-top ${styles.cell} ${cell.className || ""}`}
                    >
                      {cell.content}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={headers.length}
                  className={`px-4 py-8 text-center ${styles.emptyData}`}
                >
                  {emptyMessage || "データがありません"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className={`w-full py-2 flex items-center justify-center gap-1 text-xs transition-all group ${styles.addButton}`}
        >
          <Plus
            size={14}
            className="group-hover:scale-110 transition-transform"
          />
          <span>新規追加</span>
        </button>
      )}
    </div>
  );
};
