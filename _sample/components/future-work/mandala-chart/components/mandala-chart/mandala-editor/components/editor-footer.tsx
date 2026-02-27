import { Grid, MousePointer2 } from "lucide-react";
import React from "react";

export const EditorFooter: React.FC = () => {
  return (
    <footer className="px-6 py-2 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between shrink-0 text-[10px] text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-tighter">
      <div className="flex gap-8">
        <span
          className="flex items-center gap-1.5 hover:text-indigo-500 transition-colors cursor-help"
          title="9x9の正方形配置を保証"
        >
          <Grid size={12} /> STRICT 9x9 MAPPING
        </span>
        <span className="flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400 animate-pulse">
          <MousePointer2 size={12} /> HOVER BLOCK TO CLEAR
        </span>
      </div>
      <div className="flex gap-4 items-center">
        <span className="px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded text-slate-600 dark:text-zinc-400">
          ★ CENTER
        </span>
        <span className="px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded text-slate-600 dark:text-zinc-400">
          A-H PERIPHERAL
        </span>
      </div>
    </footer>
  );
};
