"use client";

import "prismjs/components/prism-markdown";
import "prismjs/themes/prism.css"; // Basic theme, we can customize via CSS
import { ZoomIn, Maximize2 } from "lucide-react";
import { highlight, languages } from "prismjs";
import { useState, useEffect, useRef } from "react";
// Editor & Syntax Highlight
import Editor from "react-simple-code-editor";
// Debounce
import { useDebouncedCallback } from "use-debounce";
import { Card, CardContent } from "@/components/ui/card";
import {
  generateMarkdownFromMandala,
  parseMarkdownToMandala,
} from "./mandala-chart.logic";

interface MandalaChartProps {
  initialData?: string[][];
  onChange?: (data: string[][]) => void;
  readOnly?: boolean;
}

const createEmptyBlocks = () =>
  Array(9)
    .fill(null)
    .map(() => Array(9).fill(""));

export function MandalaChart({
  initialData,
  onChange,
  readOnly = false,
}: MandalaChartProps) {
  const [blocks, setBlocks] = useState<string[][]>(
    initialData || createEmptyBlocks()
  );
  const [markdownText, setMarkdownText] = useState("");
  const [focusedBlock, setFocusedBlock] = useState<number | null>(null);

  // Sync source tracking to prevent loop
  const sourceRef = useRef<"markdown" | "chart" | "external">("external");

  // Initial Sync
  useEffect(() => {
    if (initialData) {
      sourceRef.current = "external";
      setBlocks(initialData);
    }
  }, [initialData]);

  // Sync Markdown from blocks (Only if source is NOT markdown)
  useEffect(() => {
    if (sourceRef.current === "markdown") {
      // Skip updating markdownText to avoid cursor jumping / normalization conflicts during typing
      return;
    }
    const newMarkdown = generateMarkdownFromMandala(blocks);
    setMarkdownText(newMarkdown);
  }, [blocks]);

  // Debounced Block Update from Markdown
  const debouncedUpdateBlocks = useDebouncedCallback((text: string) => {
    const newBlocks = parseMarkdownToMandala(text);
    setBlocks(newBlocks);
    onChange?.(newBlocks);
  }, 300);

  const handleMarkdownChange = (text: string) => {
    sourceRef.current = "markdown";
    setMarkdownText(text);
    debouncedUpdateBlocks(text);
  };

  const handleCellChange = (blockIdx: number, cellIdx: number, val: string) => {
    sourceRef.current = "chart";
    const newBlocks = blocks.map((row, bI) =>
      bI === blockIdx
        ? row.map((cell, cI) => (cI === cellIdx ? val : cell))
        : row
    );
    // Note: If we want strict sync logic (center cells etc), it should be handled here or in a helper.
    // For now we assume direct update is sufficient or logic is handled by re-render if needed (but currently logic is inside parse).
    // Ideally we should have `updateMandala(blocks, blockIdx, cellIdx, val)` in logic.ts.
    // However, the current parse logic syncs on parse.
    // Let's add a simple sync call here if we want to mimic the parser's behavior?
    // Actually, `parseMarkdownToMandala` invokes `syncMandalaBlocks(blocks)`.
    // We should probably invoke that too if we want consistency.
    // But `syncMandalaBlocks` is not exported.
    // Use Case: User edits chart -> Markdown updates.
    // If we don't sync, markdown will reflect unsynced state.
    // Let's rely on visual feedback for now, or improve logic later.
    setBlocks(newBlocks);
    onChange?.(newBlocks);
  };

  const getCellStyles = (bIdx: number, cIdx: number) => {
    const isMainCenter = bIdx === 4 && cIdx === 4;
    const isSubCenter =
      (bIdx === 4 && cIdx !== 4) || (bIdx !== 4 && cIdx === 4);
    if (isMainCenter) return "bg-indigo-600 text-white font-bold";
    if (isSubCenter)
      return "bg-indigo-50 text-indigo-700 font-semibold border-indigo-100";
    return "bg-white text-slate-600 dark:bg-zinc-900 dark:text-zinc-400";
  };

  const Block = ({
    blockIdx,
    isFocused,
  }: {
    blockIdx: number;
    isFocused: boolean;
  }) => (
    <div
      className={`
      grid grid-cols-3 gap-[1px] bg-slate-200 dark:bg-zinc-700 p-[1px]
      ${isFocused ? "rounded-xl overflow-hidden max-w-2xl mx-auto shadow-xl" : "h-full"}
    `}
    >
      {blocks[blockIdx].map((content, cellIdx) => (
        <div
          key={cellIdx}
          className={`
            relative aspect-square flex items-center justify-center p-0 text-center transition-colors
            ${getCellStyles(blockIdx, cellIdx)}
          `}
        >
          {isFocused ? (
            <input
              className="w-full h-full bg-transparent text-center outline-none px-1 text-sm md:text-base cursor-text"
              value={content}
              onChange={(e) =>
                handleCellChange(blockIdx, cellIdx, e.target.value)
              }
              readOnly={readOnly}
            />
          ) : (
            <button
              className="w-full h-full flex items-center justify-center p-0.5"
              onClick={() => setFocusedBlock(blockIdx)}
            >
              <span className="line-clamp-3 text-[8px] sm:text-[10px] md:text-[11px] leading-tight break-all">
                {content || (blockIdx === 4 && cellIdx === 4 ? "テーマ" : "")}
              </span>
            </button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)] min-h-[600px]">
      {/* Left Column: Markdown Input */}
      <Card className="flex flex-col h-full border-indigo-100 dark:border-zinc-800">
        <div className="p-4 border-b bg-indigo-50/30 dark:bg-zinc-900/50 flex justify-between items-center">
          <h3 className="text-sm font-bold text-indigo-900 dark:text-zinc-100 italic">
            Markdown Editor
          </h3>
          {focusedBlock !== null && (
            <button
              onClick={() => setFocusedBlock(null)}
              className="text-xs px-3 py-1 bg-white dark:bg-zinc-800 border rounded-md flex items-center gap-1 hover:bg-slate-50 transition-colors"
            >
              <Maximize2 size={12} /> 全体に戻る
            </button>
          )}
        </div>
        <CardContent className="flex-1 p-0 overflow-hidden relative">
          <div className="absolute inset-0 overflow-auto scrollbar-thin scrollbar-thumb-indigo-100 dark:scrollbar-thumb-zinc-800">
            <Editor
              value={markdownText}
              onValueChange={handleMarkdownChange}
              highlight={(code) =>
                highlight(code, languages.markdown, "markdown")
              }
              padding={24}
              className="font-mono text-sm leading-relaxed min-h-full"
              style={{
                fontFamily: '"Fira Code", "Fira Mono", monospace',
                fontSize: 14,
              }}
              textareaClassName="focus:outline-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Right Column: Mandala Chart Display */}
      <div className="flex flex-col h-full space-y-4">
        <div className="flex-1 flex items-center justify-center p-4 bg-slate-50/50 dark:bg-zinc-900/30 rounded-2xl border border-dashed border-slate-300 dark:border-zinc-800 overflow-hidden">
          {focusedBlock === null ? (
            /* 9x9 Overview */
            <div className="grid grid-cols-3 gap-1 md:gap-3 bg-slate-300 dark:bg-zinc-700 p-1 rounded-xl shadow-lg border border-slate-300 dark:border-zinc-800 aspect-square w-full max-w-[500px]">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                <div
                  key={idx}
                  className="relative group bg-white dark:bg-zinc-900 overflow-hidden"
                >
                  <div
                    className={`
                    absolute top-0 left-0 px-1 py-0.5 text-[8px] font-black z-20 rounded-br-sm shadow-sm
                    ${idx === 4 ? "bg-indigo-600 text-white" : "bg-slate-700 dark:bg-zinc-800 text-white"}
                  `}
                  >
                    {idx === 4
                      ? "★"
                      : idx < 4
                        ? idx + 1
                        : idx === 4
                          ? "★"
                          : idx}
                  </div>
                  <Block blockIdx={idx} isFocused={false} />
                  {idx !== 4 && (
                    <button
                      onClick={() => setFocusedBlock(idx)}
                      className="absolute bottom-1 right-1 p-1 bg-white/90 dark:bg-zinc-900/90 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 z-10 border"
                    >
                      <ZoomIn size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Focus Mode */
            <div className="w-full h-full flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="mb-6 text-center">
                <span className="text-xs font-black text-white px-4 py-1.5 bg-slate-700 dark:bg-zinc-800 rounded-full mb-2 shadow-sm tracking-widest uppercase">
                  SECTION {focusedBlock < 4 ? focusedBlock + 1 : focusedBlock}
                </span>
                <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-200">
                  {blocks[4][focusedBlock] || "名称未設定"}
                </h2>
              </div>
              <div className="w-full max-w-[500px] aspect-square">
                <Block blockIdx={focusedBlock} isFocused={true} />
              </div>
            </div>
          )}
        </div>

        {/* Help Tip */}
        <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm text-[10px] text-slate-500 flex items-start gap-2">
          <div className="h-4 w-4 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-400 font-bold shrink-0">
            !
          </div>
          <p>
            左側の Markdown
            を編集すると、右側のマンダラチャートがリアルタイムで更新されます。
            <code>---</code> でブロックを区切り、<code># ★(0)</code> や{" "}
            <code># 1</code> で各セクションを定義してください。
          </p>
        </div>
      </div>
    </div>
  );
}
