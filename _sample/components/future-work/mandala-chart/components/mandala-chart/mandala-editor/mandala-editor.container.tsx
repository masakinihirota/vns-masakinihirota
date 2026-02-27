"use client";

import React, { useCallback, useMemo, useState } from "react";

import { MandalaEditor } from "./mandala-editor";
import {
  generateMarkdownFromMandala,
  INITIAL_MD,
  parseMarkdownToMandala,
  SKELETON_MARKDOWN,
} from "./mandala-editor.logic";
import { EditorDisplayMode, EditorFitMode } from "./mandala-editor.types";

export const MandalaEditorContainer: React.FC = () => {
  // ハイドレーションエラーを防ぐため、初期値は SKELETON_MARKDOWN にし、useEffect で復元する
  const [markdown, setMarkdown] = useState<string>(SKELETON_MARKDOWN);
  const [isLoaded, setIsLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [displayMode, setDisplayMode] = useState<EditorDisplayMode>("split");
  const [fitMode, setFitMode] = useState<EditorFitMode>("height");

  // 初期マウント時に localStorage から復元
  React.useEffect(() => {
    const saved = localStorage.getItem("mandala-markdown");
    if (saved) {
      setMarkdown(saved);
    } else {
      // 初回アクセス時は INITIAL_MD を使用
      setMarkdown(INITIAL_MD);
    }
    setIsLoaded(true);
  }, []);

  // Markdown変更時にローカルストレージに保存
  React.useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("mandala-markdown", markdown);
    }
  }, [markdown, isLoaded]);

  const data = useMemo(() => parseMarkdownToMandala(markdown), [markdown]);

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [markdown]);

  const handleReset = useCallback(() => {
    if (
      globalThis.confirm(
        "全てのデータをリセットしてもよろしいですか？（この操作は取り消せません）"
      )
    ) {
      setMarkdown(SKELETON_MARKDOWN);
    }
  }, []);

  const handleDisplayModeChange = useCallback((mode: EditorDisplayMode) => {
    setDisplayMode(mode);
  }, []);

  const handleFitModeChange = useCallback((mode: EditorFitMode) => {
    setFitMode(mode);
  }, []);

  const handleCellEdit = useCallback(
    (label: string, cellIndex: number | "title", value: string) => {
      const currentData = { ...data };
      if (label === "★") {
        if (cellIndex === "title") {
          currentData.center = { ...currentData.center, title: value };
        } else {
          const newItems = [...currentData.center.items];
          newItems[cellIndex as number] = value;
          currentData.center = { ...currentData.center, items: newItems };
        }
      } else {
        const blockIndex = currentData.blocks.findIndex((b) => b.label === label);
        if (blockIndex !== -1) {
          const block = { ...currentData.blocks[blockIndex] };
          if (cellIndex === "title") {
            block.title = value;
          } else {
            const newItems = [...block.items];
            newItems[cellIndex as number] = value;
            block.items = newItems;
          }
          const newBlocks = [...currentData.blocks];
          newBlocks[blockIndex] = block;
          currentData.blocks = newBlocks;
        }
      }
      setMarkdown(generateMarkdownFromMandala(currentData));
    },
    [data]
  );

  const handleClearBlock = useCallback(
    (label: string) => {
      if (
        globalThis.confirm(`ブロック [${label}] をクリアしてもよろしいですか？`)
      ) {
        const currentData = { ...data };
        if (label === "C_GLOBAL") {
          currentData.center = {
            label: "★",
            title: "",
            items: Array.from({ length: 8 }, () => ""),
          };
          currentData.blocks = currentData.blocks.map((b) => ({
            ...b,
            title: "",
            items: Array.from({ length: 8 }, () => ""),
          }));
        } else {
          const blockIndex = currentData.blocks.findIndex(
            (b) => b.label === label
          );
          if (blockIndex !== -1) {
            const updatedBlocks = [...currentData.blocks];
            updatedBlocks[blockIndex] = {
              label: currentData.blocks[blockIndex].label,
              title: "",
              items: Array.from({ length: 8 }, () => ""),
            };
            currentData.blocks = updatedBlocks;
          }
        }
        setMarkdown(generateMarkdownFromMandala(currentData));
      }
    },
    [data]
  );

  return (
    <MandalaEditor
      markdown={markdown}
      setMarkdown={setMarkdown}
      data={data}
      copied={copied}
      displayMode={displayMode}
      onCopy={handleCopy}
      onReset={handleReset}
      onClearBlock={handleClearBlock}
      onCellEdit={handleCellEdit}
      onDisplayModeChange={handleDisplayModeChange}
      fitMode={fitMode}
      onFitModeChange={handleFitModeChange}
    />
  );
};
