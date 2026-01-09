"use client";

import "prismjs/components/prism-markdown";
// 明示的なテーマの読み込み。Prismの提供するスタイルをインポート（本来はCSSで行うが今回はJS内で制御）
import "prismjs/themes/prism-tomorrow.css";
import { Edit3 } from "lucide-react";
import Prism from "prismjs";
import React, { useEffect } from "react";
import Editor from "react-simple-code-editor";

interface MarkdownPanelProps {
  markdown: string;
  setMarkdown: (value: string) => void;
}

export const MarkdownPanel: React.FC<MarkdownPanelProps> = ({
  markdown,
  setMarkdown,
}) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [markdown]);

  return (
    <div className="w-1/2 md:w-1/3 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col shadow-inner overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-800 shrink-0">
        <span className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 font-bold text-[10px] uppercase tracking-widest">
          <Edit3 size={12} /> Markdown Input
        </span>
      </div>
      <div className="flex-1 overflow-auto bg-[#2d2d2d] selection:bg-indigo-500/30">
        <Editor
          value={markdown}
          onValueChange={(code) => setMarkdown(code)}
          highlight={(code) =>
            Prism.highlight(code, Prism.languages.markdown, "markdown")
          }
          padding={20}
          className="font-mono text-sm leading-relaxed text-[#ccc] min-h-full"
          textareaId="mandala-markdown-editor"
          aria-label="Markdown content for mandala chart"
        />
      </div>
    </div>
  );
};
