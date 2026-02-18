"use client";

import {
  ArrowDownCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  CheckSquare,
  ChevronRight,
  HelpCircle,
  Layout,
  List,
  Maximize2,
  Monitor,
  MousePointer,
  MousePointer2,
} from "lucide-react";
import React, { useMemo, useRef, useState } from "react";

const INITIAL_MARKDOWN = `# [Main] 人生の目標
- 1. 健康
- 2. 仕事
- 3. 趣味
- 4. 家庭
- 5. 学び
- 6. 資産
- 7. 社会貢献
- 8. メンタル

## [Sub] 1. 健康
- [x] 毎日7時間睡眠
- [ ] 週3回のジョギング
- [ ] 野菜中心の食事
- [ ] ストレッチ
- [x] 水2リットル
- [ ] 定期検診
- [ ] 禁酒
- [ ] 筋肉量アップ

## [Sub] 2. 仕事
- [ ] プロジェクト完遂
- [x] スキルアップ
- [ ] ネットワーキング
- [ ] 効率化ツールの導入
- [ ] 目標達成
- [ ] プレゼン力向上
- [ ] チームビルディング
- [ ] 顧客満足度向上
`;

interface Item {
  text: string;
  completed: boolean;
  lineIndex: number;
  subId?: number;
  isTitle?: boolean;
}

interface Section {
  type: "main" | "sub";
  id: number;
  title: string;
  items: Item[];
  lineStart: number;
}

const App = () => {
  const [currentPage, setCurrentPage] = useState<"editor" | "cheatsheet">(
    "editor"
  );
  const [markdown, setMarkdown] = useState(INITIAL_MARKDOWN);
  const [viewMode, setViewMode] = useState<"list" | "grid" | "full">("list");
  const [isSyncEnabled, setIsSyncEnabled] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const LINE_HEIGHT = 28;

  const mandalaData = useMemo<Section[]>(() => {
    const lines = markdown.split("\n");
    const sections: Section[] = [];
    let currentSection: Section | null = null;

    lines.forEach((line, index) => {
      const mainMatch = line.match(/^#\s+\[Main\]\s+(.*)/);
      const subMatch = line.match(/^##\s+\[Sub\]\s+(\d+)\.\s+(.*)/);
      const itemMatch = line.match(/^-\s+(\[(x| )\]\s+)?(.*)/);

      if (mainMatch) {
        currentSection = {
          type: "main",
          id: 0,
          title: mainMatch[1],
          items: [],
          lineStart: index,
        };
        sections.push(currentSection);
      } else if (subMatch) {
        currentSection = {
          type: "sub",
          id: parseInt(subMatch[1]),
          title: subMatch[2],
          items: [],
          lineStart: index,
        };
        sections.push(currentSection);
      } else if (itemMatch && currentSection) {
        currentSection.items.push({
          text: itemMatch[3],
          completed: itemMatch[2] === "x",
          lineIndex: index,
        });
      }
    });
    return sections;
  }, [markdown]);

  const handleToggleStatus = (lineIndex: number) => {
    if (lineIndex === undefined) return;
    const lines = markdown.split("\n");
    const targetLine = lines[lineIndex];
    if (targetLine.includes("- [ ]")) {
      lines[lineIndex] = targetLine.replace("- [ ]", "- [x]");
    } else if (targetLine.includes("- [x]")) {
      lines[lineIndex] = targetLine.replace("- [x]", "- [ ]");
    } else if (targetLine.startsWith("- ")) {
      lines[lineIndex] = targetLine.replace("- ", "- [x] ");
    }
    setMarkdown(lines.join("\n"));
  };

  const scrollToEditorLine = (lineIndex: number) => {
    if (!editorRef.current || lineIndex === undefined) return;
    const textarea = editorRef.current;
    const lines = markdown.split("\n");
    const lineStartPos =
      lines.slice(0, lineIndex).join("\n").length + (lineIndex > 0 ? 1 : 0);
    const lineEndPos = lineStartPos + (lines[lineIndex]?.length || 0);
    textarea.focus();
    textarea.setSelectionRange(lineEndPos, lineEndPos);
    textarea.scrollTop = lineIndex * LINE_HEIGHT - 100;
  };

  const handleEditorScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (!isSyncEnabled) return;
    const textarea = e.currentTarget;
    const currentLine =
      textarea.value.substr(0, textarea.selectionStart).split("\n").length - 1;
    const active = mandalaData.reduce((prev, curr) => {
      return curr.lineStart <= currentLine ? curr : prev;
    }, mandalaData[0]);
    if (active && active.id !== activeSectionId) {
      setActiveSectionId(active.id);
      if (viewMode === "list") {
        sectionRefs.current[active.id]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  const getCellClassName = (cell: Item | null, isMainSection: boolean) => {
    const baseClasses = `flex items-center justify-center p-2 leading-snug text-center border break-words overflow-hidden transition-all duration-300 cursor-pointer group/cell select-none`;
    let fontSize = "text-[11px]";
    if (viewMode === "list") fontSize = "text-[16px]";
    else if (viewMode === "full") fontSize = "text-[14px]";
    let colorClass = "bg-white border-slate-100 hover:bg-slate-50";
    if (cell?.isTitle) {
      colorClass = "bg-indigo-50 border-indigo-200 font-bold text-indigo-900";
    } else if (cell?.completed) {
      colorClass =
        "bg-emerald-100 border-emerald-300 text-emerald-900 font-medium";
    } else if (isMainSection && !cell?.isTitle && cell?.text) {
      colorClass =
        "bg-white border-indigo-50 hover:bg-indigo-50/50 hover:border-indigo-200";
    }
    return `${baseClasses} ${fontSize} ${colorClass} ${cell ? "shadow-sm hover:shadow" : "bg-slate-50/30"}`;
  };

  const renderGrid = (section: Section | undefined) => {
    if (!section)
      return (
        <div className="grid grid-cols-3 gap-1 bg-slate-50 border border-dashed border-slate-300 p-2 rounded h-full items-center justify-center text-slate-400">
          <span className="text-[12px]">No Data</span>
        </div>
      );
    const cells: (Item | null)[] = new Array(9).fill(null);
    cells[4] = {
      text: section.title,
      isTitle: true,
      lineIndex: section.lineStart,
      completed: false,
    };
    section.items.slice(0, 8).forEach((item, idx) => {
      const pos = idx >= 4 ? idx + 1 : idx;
      cells[pos] = { ...item, subId: idx + 1 };
    });
    const isMain = section.type === "main";
    return (
      <div
        className={`grid grid-cols-3 gap-1 h-full w-full p-1 bg-white transition-all ${activeSectionId === section.id ? "ring-2 ring-indigo-500 z-10" : ""}`}
      >
        {cells.map((cell, i) => (
          <div
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              if (isMain && cell && !cell.isTitle && cell.subId) {
                const subSection = mandalaData.find(
                  (s) => s.type === "sub" && s.id === cell.subId
                );
                if (subSection) {
                  scrollToEditorLine(subSection.lineStart);
                } else {
                  scrollToEditorLine(cell.lineIndex);
                }
              } else {
                if (cell) {
                  scrollToEditorLine(cell?.lineIndex);
                } else {
                  scrollToEditorLine(section.lineStart);
                }
              }
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              if (cell && !cell.isTitle) {
                handleToggleStatus(cell.lineIndex);
              }
            }}
            className={getCellClassName(cell, isMain)}
          >
            <span className="relative">
              {cell?.text || ""}
              {cell && (
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 ${isMain && !cell.isTitle ? "bg-indigo-500" : "bg-indigo-400/50"} group-hover/cell:w-full`}
                />
              )}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const fullMatrix = useMemo(() => {
    const matrix: (Section | undefined)[] = new Array(9).fill(null);
    const mainSection = mandalaData.find((s) => s.type === "main");
    matrix[4] = mainSection;
    for (let i = 1; i <= 8; i++) {
      const pos = i > 4 ? i : i - 1;
      matrix[pos] = mandalaData.find((s) => s.type === "sub" && s.id === i);
    }
    return matrix;
  }, [mandalaData]);

  const activeSection = mandalaData.find((s) => s.id === activeSectionId);

  // Render Editor View
  const renderEditor = () => (
    <main className="flex flex-1 overflow-hidden">
      {viewMode !== "full" && (
        <section className="w-1/2 flex flex-col border-r bg-white shadow-inner">
          <div className="px-4 py-2 bg-slate-50 border-b flex items-center justify-between">
            <div className="flex items-center text-xs font-bold text-slate-500 truncate mr-4">
              <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded mr-2 text-[10px]">
                EDITING
              </span>
              <ChevronRight className="w-3 h-3 mx-1 text-slate-300" />
              <span className="text-indigo-600 truncate font-mono">
                {activeSection?.title || "Main Workspace"}
              </span>
            </div>
          </div>
          <textarea
            ref={editorRef}
            className="flex-1 p-8 font-mono text-[18px] opacity-90 leading-[28px] focus:outline-none resize-none bg-slate-50/5 custom-scrollbar"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            onKeyUp={handleEditorScroll}
            onClick={handleEditorScroll}
            spellCheck="false"
          />
        </section>
      )}

      <section
        className={`${viewMode === "full" ? "w-full" : "w-1/2"} flex flex-col bg-slate-100 overflow-hidden relative`}
      >
        <div className="px-4 py-2 bg-slate-200/50 border-b flex justify-between items-center">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
            <CheckSquare className="w-3 h-3 mr-2 text-indigo-500" />
            {viewMode === "list" ? "Detail Blocks" : "9x9 Global Board"}
          </span>
          <div className="text-[9px] text-slate-400 font-bold flex items-center space-x-2">
            <span className="bg-white px-2 py-1 rounded shadow-sm border uppercase text-indigo-600">
              Click: Sync / Dbl Click: Toggle
            </span>
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar"
          ref={previewRef}
        >
          {viewMode === "list" ? (
            <div className="max-w-xl mx-auto space-y-12 py-6">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((blockId) => {
                const section = mandalaData.find(
                  (s) =>
                    (s.type === "main" && blockId === 0) ||
                    (s.type === "sub" && s.id === blockId)
                );
                return (
                  <div
                    key={blockId}
                    ref={(el) => {
                      sectionRefs.current[blockId] = el;
                    }}
                    className={`relative bg-white rounded-2xl shadow-sm border-2 transition-all
                      ${activeSectionId === blockId ? "border-indigo-400 shadow-xl ring-4 ring-indigo-50/50" : "border-transparent"}
                    `}
                  >
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                        {blockId === 0 ? "Core Center" : `Satellite ${blockId}`}
                      </span>
                    </div>
                    <div className="aspect-square w-full p-2">
                      {renderGrid(section)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className={`${viewMode === "full" ? "max-w-5xl" : "max-w-3xl"} mx-auto aspect-square bg-slate-300 grid grid-cols-3 gap-1.5 p-1.5 rounded-xl shadow-2xl transition-all duration-500`}
            >
              {fullMatrix.map((section, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-md overflow-hidden shadow-sm hover:scale-[1.01] transition-all border border-slate-200"
                >
                  {renderGrid(section)}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );

  // Render Cheat Sheet View
  const renderCheatSheet = () => (
    <main className="flex-1 overflow-y-auto bg-white p-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex items-center space-x-4 border-b pb-6">
          <BookOpen className="w-8 h-8 text-indigo-600" />
          <h2 className="text-3xl font-bold text-slate-800">
            Mandala Studio Cheat Sheet
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-[16px]">
          {/* DSL Syntax Section */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-indigo-900 border-l-4 border-indigo-500 pl-4">
              マンダラチャート記法 (DSL)
            </h3>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg border">
                <p className="font-bold text-slate-700 mb-2">
                  中心の3x3ブロック
                </p>
                <code className="text-indigo-600 block bg-white p-2 border rounded">
                  # [Main] タイトル
                </code>
                <p className="text-sm text-slate-500 mt-2">
                  ※ リスト項目 (- 1. など) は周辺8項目としてマッピングされます。
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border">
                <p className="font-bold text-slate-700 mb-2">
                  周辺の3x3ブロック
                </p>
                <code className="text-indigo-600 block bg-white p-2 border rounded">
                  ## [Sub] 1. タイトル
                </code>
                <p className="text-sm text-slate-500 mt-2">
                  ※ 1〜8の番号で、中心ブロックの対応するマスと紐付けられます。
                </p>
              </div>
            </div>
          </section>

          {/* Task Interaction Section */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-indigo-900 border-l-4 border-indigo-500 pl-4">
              タスク操作とインタラクション
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
                <MousePointer className="w-5 h-5 text-indigo-600 mt-1" />
                <div>
                  <p className="font-bold text-slate-800">シングルクリック</p>
                  <p className="text-sm text-slate-600">
                    プレビューのセルをクリックすると、エディタの該当行へジャンプし、行末にカーソルが移動します。
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <MousePointer2 className="w-5 h-5 text-emerald-600 mt-1" />
                <div>
                  <p className="font-bold text-slate-800">ダブルクリック</p>
                  <p className="text-sm text-slate-600">
                    プレビューのセルをダブルクリックすると、Markdown内の [ ] と
                    [x] を瞬時に切り替えます。
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Markdown Basics Section */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-indigo-900 border-l-4 border-indigo-500 pl-4">
              基本のMarkdownシンタックス
            </h3>
            <ul className="space-y-3 bg-slate-50 p-6 rounded-xl border">
              <li className="flex justify-between items-center border-b pb-2">
                <span className="font-mono text-indigo-600">- [ ] 未完了</span>
                <span className="text-sm text-slate-400">未完了タスク</span>
              </li>
              <li className="flex justify-between items-center border-b pb-2">
                <span className="font-mono text-indigo-600">- [x] 完了</span>
                <span className="text-sm text-slate-400">
                  完了タスク (色が付きます)
                </span>
              </li>
              <li className="flex justify-between items-center border-b pb-2">
                <span className="font-mono text-indigo-600">- リスト項目</span>
                <span className="text-sm text-slate-400">通常の箇条書き</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="font-mono text-indigo-600">**太字**</span>
                <span className="text-sm text-slate-400">テキストの強調</span>
              </li>
            </ul>
          </section>

          {/* Quick Tips Section */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-indigo-900 border-l-4 border-indigo-500 pl-4">
              便利な機能
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 border rounded-xl shadow-sm">
                <p className="text-sm font-bold text-slate-500 mb-1">SYNC ON</p>
                <p className="text-sm text-slate-700">
                  エディタのカーソル位置に合わせて、右側のプレビューが自動でスクロールします。
                </p>
              </div>
              <div className="p-4 border rounded-xl shadow-sm">
                <p className="text-sm font-bold text-slate-500 mb-1">
                  GRID / FULL VIEW
                </p>
                <p className="text-sm text-slate-700">
                  全体の9x9チャートを表示し、思考の広がりを俯瞰することができます。
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="flex justify-center pt-8">
          <button
            onClick={() => setCurrentPage("editor")}
            className="flex items-center space-x-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>エディタに戻る</span>
          </button>
        </div>
      </div>
    </main>
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm z-20">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => setCurrentPage("editor")}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
            <Layout className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-none text-slate-800 tracking-tight text-indigo-900">
              Mandala Studio
            </h1>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-widest mt-1 italic">
              VNS Task Controller
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {currentPage === "editor" && (
            <>
              <button
                onClick={() => setIsSyncEnabled(!isSyncEnabled)}
                className={`flex items-center px-4 py-2 rounded-lg text-xs font-bold transition-all border-2
                  ${
                    isSyncEnabled
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 ring-2 ring-indigo-100"
                      : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                  }`}
              >
                <ArrowDownCircle
                  className={`w-4 h-4 mr-2 ${isSyncEnabled ? "animate-pulse" : ""}`}
                />
                SYNC {isSyncEnabled ? "ON" : "OFF"}
              </button>

              <div className="flex items-center bg-slate-100 p-1 rounded-xl border-2 border-slate-200 overflow-hidden">
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center px-4 py-2 rounded-lg text-xs font-bold transition-all
                    ${
                      viewMode === "list"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
                    }`}
                >
                  <List className="w-4 h-4 mr-2" />
                  LIST
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center px-4 py-2 rounded-lg text-xs font-bold transition-all
                    ${
                      viewMode === "grid"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
                    }`}
                >
                  <Maximize2 className="w-4 h-4 mr-2" />
                  GRID
                </button>
                <button
                  onClick={() => setViewMode("full")}
                  className={`flex items-center px-4 py-2 rounded-lg text-xs font-bold transition-all
                    ${
                      viewMode === "full"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
                    }`}
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  FULL
                </button>
              </div>
            </>
          )}

          <button
            onClick={() =>
              setCurrentPage(currentPage === "editor" ? "cheatsheet" : "editor")
            }
            className={`flex items-center px-4 py-2 rounded-lg text-xs font-bold transition-all border-2
              ${
                currentPage === "cheatsheet"
                  ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-100"
                  : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
              }`}
          >
            {currentPage === "cheatsheet" ? (
              <ArrowLeft className="w-4 h-4 mr-2" />
            ) : (
              <HelpCircle className="w-4 h-4 mr-2" />
            )}
            {currentPage === "cheatsheet" ? "BACK" : "HELP"}
          </button>
        </div>
      </header>

      {/* Dynamic Page Rendering */}
      {currentPage === "editor" ? renderEditor() : renderCheatSheet()}

      <footer className="bg-slate-900 text-white px-6 py-2.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em]">
        <div className="flex space-x-8">
          <span className="text-slate-500 flex items-center">
            <CheckCircle2 className="w-3 h-3 mr-2 text-emerald-400" />
            Progress:{" "}
            <span className="text-emerald-400 ml-1 font-mono">
              {Math.round(
                (mandalaData.reduce(
                  (acc, s) => acc + s.items.filter((i) => i.completed).length,
                  0
                ) /
                  Math.max(
                    1,
                    mandalaData.reduce((acc, s) => acc + s.items.length, 0)
                  )) *
                  100
              )}
              %
            </span>
          </span>
          <span className="text-slate-500 border-l border-slate-700 pl-8">
            View:{" "}
            <span className="text-sky-400 ml-1 font-mono uppercase">
              {viewMode}
            </span>
          </span>
        </div>
        <div className="flex items-center text-slate-400 text-[10px]">
          <Layout className="w-3 h-3 mr-2 text-indigo-400" />
          Mandala System v2.1 Active
        </div>
      </footer>
    </div>
  );
};

export default App;
