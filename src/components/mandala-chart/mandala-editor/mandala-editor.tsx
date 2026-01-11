"use client";

import { EditorFooter } from "./components/editor-footer";
import { EditorHeader } from "./components/editor-header";
import { MandalaBlock } from "./components/mandala-block";
import { MarkdownPanel } from "./components/markdown-panel";
import { MandalaData } from "./mandala-editor.logic";
import {
  CENTER_BLOCK_INDEX,
  EditorDisplayMode,
  EditorFitMode,
} from "./mandala-editor.types";

interface MandalaEditorProps {
  markdown: string;
  setMarkdown: (value: string) => void;
  data: MandalaData;
  copied: boolean;
  displayMode: EditorDisplayMode;
  onCopy: () => void;
  onReset: () => void;
  onClearBlock: (label: string) => void;
  onCellEdit: (
    label: string,
    cellIndex: number | "title",
    value: string
  ) => void;
  fitMode: EditorFitMode;
  onFitModeChange: (mode: EditorFitMode) => void;
  onDisplayModeChange: (mode: EditorDisplayMode) => void;
}

export const MandalaEditor: React.FC<MandalaEditorProps> = ({
  markdown,
  setMarkdown,
  data,
  copied,
  displayMode,
  onCopy,
  onReset,
  onClearBlock,
  onCellEdit,
  onDisplayModeChange,
  fitMode,
  onFitModeChange,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-100 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 font-sans overflow-hidden text-[13px]">
      <EditorHeader
        copied={copied}
        displayMode={displayMode}
        onCopy={onCopy}
        onReset={onReset}
        onDisplayModeChange={onDisplayModeChange}
        fitMode={fitMode}
        onFitModeChange={onFitModeChange}
      />

      <main className="flex flex-1 overflow-hidden">
        {/* Left Pane: Markdown Editor */}
        <div
          className={`${displayMode === "grid" ? "hidden" : "flex"} ${displayMode === "split" ? "w-1/2" : "w-full"} h-full border-r border-slate-200 dark:border-zinc-800 transition-all duration-300`}
        >
          <MarkdownPanel markdown={markdown} setMarkdown={setMarkdown} />
        </div>

        {/* Right Pane: Graphical View */}
        <div
          className={`${displayMode === "markdown" ? "hidden" : "flex flex-col items-stretch"} ${displayMode === "split" ? "w-1/2" : "w-full"} bg-slate-200/30 dark:bg-zinc-900/40 ${fitMode === "height" ? "overflow-hidden items-center justify-center p-4 md:p-6 lg:p-8" : "overflow-auto"} transition-all duration-300`}
        >
          <div
            className={`${fitMode === "height" ? "w-full h-full max-w-screen-2xl flex items-center justify-center mx-auto" : "w-full min-w-full h-auto"}`}
          >
            <div
              className={`grid grid-cols-3 grid-rows-3 gap-1.5 md:gap-3 lg:gap-4 ${fitMode === "height" ? "h-full aspect-square max-h-full max-w-full" : "w-full min-w-full h-auto aspect-square"}`}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((blockIdx) => {
                const isCenterBlock = blockIdx === CENTER_BLOCK_INDEX;
                const peripheralIdx =
                  blockIdx < CENTER_BLOCK_INDEX ? blockIdx : blockIdx - 1;
                const blockData = isCenterBlock
                  ? data.center
                  : data.blocks[peripheralIdx];

                return (
                  <MandalaBlock
                    key={
                      isCenterBlock
                        ? "center-block"
                        : `block-${blockData.label}`
                    }
                    block={blockData}
                    index={blockIdx}
                    isCenterBlock={isCenterBlock}
                    onClear={onClearBlock}
                    onCellClick={(label, cellIdx) => {
                      const currentText =
                        cellIdx === "title"
                          ? blockData.title
                          : blockData.items[cellIdx as number];
                      const newValue = window.prompt(
                        `${label} の内容を編集:`,
                        currentText
                      );
                      if (newValue !== null) {
                        onCellEdit(label, cellIdx, newValue);
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <EditorFooter />
    </div>
  );
};
