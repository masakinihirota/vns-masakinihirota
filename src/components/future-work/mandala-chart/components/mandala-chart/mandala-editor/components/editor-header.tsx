"use client";

import {
  Hash,
  Copy,
  Check,
  RefreshCw,
  Columns,
  Grid3X3,
  Layout,
} from "lucide-react";
import React from "react";
import { EditorDisplayMode, EditorFitMode } from "../mandala-editor.types";

interface EditorHeaderProps {
  copied: boolean;
  displayMode: EditorDisplayMode;
  onCopy: () => void;
  onReset: () => void;
  fitMode: EditorFitMode;
  onFitModeChange: (mode: EditorFitMode) => void;
  onDisplayModeChange: (mode: EditorDisplayMode) => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  copied,
  displayMode,
  onCopy,
  onReset,
  fitMode,
  onFitModeChange,
  onDisplayModeChange,
}) => {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 shrink-0 shadow-sm z-20">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded text-white shadow-lg shadow-indigo-500/20">
            <Hash size={20} />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold tracking-tight leading-tight">
              Mandala Pro
            </h1>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
              EDITING SUITE
            </p>
          </div>
        </div>

        {/* Display Mode Toggle */}
        <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg">
          <button
            onClick={() => onDisplayModeChange("markdown")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all ${
              displayMode === "markdown"
                ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
            }`}
            title="Markdown View Only"
          >
            <Layout size={14} /> <span className="hidden md:inline">CODE</span>
          </button>
          <button
            onClick={() => onDisplayModeChange("split")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all ${
              displayMode === "split"
                ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
            }`}
            title="Split View"
          >
            <Columns size={14} />{" "}
            <span className="hidden md:inline">SPLIT</span>
          </button>
          <button
            onClick={() => onDisplayModeChange("grid")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all ${
              displayMode === "grid"
                ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
            }`}
            title="Grid View Only"
          >
            <Grid3X3 size={14} /> <span className="hidden md:inline">GRID</span>
          </button>
        </div>

        {/* Fit Mode Toggle - Only visible when not in markdown view */}
        {displayMode !== "markdown" && (
          <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg">
            <button
              onClick={() =>
                onFitModeChange(fitMode === "width" ? "height" : "width")
              }
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all ${
                fitMode === "width"
                  ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
              }`}
              title={
                fitMode === "width"
                  ? "Switch to Fit Screen"
                  : "Switch to Fit Width"
              }
            >
              <span className="hidden md:inline uppercase">Fit Width</span>
              <span className="md:hidden">W</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onCopy}
          className={`group flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-full transition-all border ${
            copied
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400"
              : "bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 hover:shadow-md"
          }`}
        >
          {copied ? (
            <Check size={14} />
          ) : (
            <Copy
              size={14}
              className="group-hover:scale-110 transition-transform"
            />
          )}
          <span className="hidden sm:inline">
            {copied ? "COPIED" : "COPY MD"}
          </span>
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all border border-red-100 dark:border-red-900/30 bg-white dark:bg-zinc-800 hover:shadow-md hover:scale-[1.02]"
          title="全てのデータをリセット"
        >
          <RefreshCw size={14} />{" "}
          <span className="hidden sm:inline">RESET</span>
        </button>
      </div>
    </header>
  );
};
