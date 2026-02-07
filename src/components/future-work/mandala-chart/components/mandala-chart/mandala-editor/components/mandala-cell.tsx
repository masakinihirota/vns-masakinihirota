"use client";

import React, { useMemo } from "react";

interface MandalaCellProps {
  text: string;
  label: string;
  isCenter: boolean;
  isBlockCenter: boolean;
  onClick?: () => void;
}

export const MandalaCell: React.FC<MandalaCellProps> = ({
  text,
  label,
  isCenter,
  isBlockCenter,
  onClick,
}) => {
  // 文字数に応じてフォントサイズを動的に計算する
  // 思考を妨げないよう、長文でも可能な限り全て表示することを目指す
  const fontSizeStyle = useMemo(() => {
    const length = text.length;
    if (length === 0) return {};

    let fontSize = "13px"; // デフォルト
    if (length > 40) fontSize = "9px";
    else if (length > 25) fontSize = "10px";
    else if (length > 15) fontSize = "11px";
    else if (length > 8) fontSize = "12px";

    return { fontSize };
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  let cellClass =
    "relative flex items-center justify-center p-2 text-center break-all leading-snug rounded transition-all duration-300 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 z-0 h-full w-full ";

  if (isCenter) {
    cellClass += isBlockCenter
      ? "bg-indigo-600 dark:bg-indigo-500 text-white font-black ring-2 ring-indigo-400 dark:ring-indigo-700 shadow-lg shadow-indigo-500/20 active:scale-95"
      : "bg-slate-700 dark:bg-zinc-600 text-white font-bold ring-1 ring-slate-500 shadow-md shadow-slate-500/20 active:scale-95 cursor-pointer hover:bg-slate-600 dark:hover:bg-zinc-500";
  } else {
    cellClass +=
      "bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/80 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900 cursor-pointer active:scale-95";
  }

  return (
    <div
      className={cellClass}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${label}: ${text || "未入力"}`}
      aria-haspopup="dialog"
    >
      <div
        className={`absolute top-0 left-0 px-1 py-0.5 font-mono leading-none rounded-br flex items-center gap-1 select-none pointer-events-none ${
          isCenter
            ? "text-[10px] font-black text-white/70 bg-black/10"
            : "text-[7.5px] font-bold text-slate-300 dark:text-zinc-600"
        }`}
      >
        {label}
      </div>
      <span
        className="font-medium inline-block w-full overflow-hidden transition-all duration-300"
        style={fontSizeStyle}
      >
        {text}
      </span>
    </div>
  );
};
