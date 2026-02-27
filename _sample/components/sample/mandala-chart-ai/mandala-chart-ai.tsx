"use client";

import {
  Cpu,
  Download,
  Info,
  Key,
  Maximize2,
  Minimize2,
  Puzzle,
  Settings,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useCallback, useState } from "react";

/**
 * マンダラチャートのデータ構造
 * 9つのグリッド (index 0-8)
 * 各グリッドに9つのセル (index 0-8)
 */
const INITIAL_DATA: string[][] = Array.from({ length: 9 }, () =>
  Array.from({ length: 9 }, () => "")
);

/**
 *
 */
export function MandalaChartAI() {
  const [data, setData] = useState<string[][]>(INITIAL_DATA);
  // const [activeGrid, setActiveGrid] = useState(4); // Unused
  const [apiKeyMode] = useState("server"); // 'extension' | 'temp' | 'server'
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // ----------------------------------------------------------------
  // 1. 同期ロジック
  // ----------------------------------------------------------------

  // 中央グリッド(index 4)の各セルが、周辺グリッドの中心(index 4)に対応する
  const syncData = useCallback(
    (gridIndex: number, cellIndex: number, value: string) => {
      const newData = data.map((grid) => [...grid]);
      newData[gridIndex][cellIndex] = value;

      // 中央グリッドが更新された場合、対応する周辺グリッドの中心を更新
      if (gridIndex === 4 && cellIndex !== 4) {
        const targetGridIndex = cellIndex; // 中央グリッドのセル番号がターゲットグリッドの番号
        newData[targetGridIndex][4] = value;
      }

      // 周辺グリッドの中心が更新された場合、中央グリッドの対応するセルを更新
      if (gridIndex !== 4 && cellIndex === 4) {
        newData[4][gridIndex] = value;
      }

      setData(newData);
    },
    [data]
  );

  // ----------------------------------------------------------------
  // 2. AI アクション (シミュレーション)
  // ----------------------------------------------------------------

  const handleAiExpand = async (gridIndex: number) => {
    const centerValue = data[gridIndex][4];
    if (!centerValue) {
      alert("中心に目標を入力してください。");
      return;
    }

    setIsAiLoading(true);
    // AIリクエストのシミュレーション
    setTimeout(() => {
      const suggestions = [
        "具体的な行動A",
        "習慣化B",
        "ツール導入C",
        "学習D",
        "分析E",
        "マインドセットF",
        "健康管理G",
        "フィードバックH",
      ];

      const newData = data.map((grid) => [...grid]);
      let sIndex = 0;
      for (let index = 0; index < 9; index++) {
        if (index === 4) continue; // 中心は飛ばす
        if (!newData[gridIndex][index]) {
          // 空のマスだけ埋める
          newData[gridIndex][index] = suggestions[sIndex];
        }
        sIndex++;
      }

      // 同期ロジックを全セルに適用（簡易化のため一括更新）
      if (gridIndex === 4) {
        for (let index = 0; index < 9; index++) {
          if (index !== 4) newData[index][4] = newData[4][index];
        }
      }

      setData(newData);
      setIsAiLoading(false);
    }, 1200);
  };

  // ----------------------------------------------------------------
  // 3. UIコンポーネント
  // ----------------------------------------------------------------

  const MandalaCell = ({
    gridIdx,
    cellIdx,
    value,
  }: {
    gridIdx: number;
    cellIdx: number;
    value: string;
  }) => {
    const isCenterOfSubGrid = cellIdx === 4;
    const isCenterOfEverything = gridIdx === 4 && cellIdx === 4;
    const isEmpty = !value;

    return (
      <div
        className={`
        relative group flex items-center justify-center p-1 border transition-all duration-300
        ${isCenterOfEverything
            ? "bg-indigo-900 border-indigo-400 z-10"
            : (isCenterOfSubGrid
              ? "bg-slate-800 border-slate-500"
              : "bg-slate-900/50 border-slate-700/50")
          }
        ${isEmpty ? "opacity-40 grayscale hover:opacity-100 hover:grayscale-0" : "opacity-100"}
        hover:border-indigo-400 hover:shadow-[0_0_10px_rgba(99,102,241,0.3)]
      `}
      >
        <textarea
          className="w-full h-full bg-transparent text-white text-[10px] sm:text-xs text-center resize-none outline-none overflow-hidden flex items-center justify-center pt-1"
          value={value}
          onChange={(e) => syncData(gridIdx, cellIdx, e.target.value)}
          placeholder={
            isCenterOfEverything ? "大目標" : (isCenterOfSubGrid ? "中目標" : "")
          }
        />
        {isCenterOfSubGrid && value && (
          <button
            onClick={() => handleAiExpand(gridIdx)}
            className="absolute -top-1 -right-1 bg-indigo-500 hover:bg-indigo-400 rounded-full p-1 shadow-lg transform scale-0 group-hover:scale-100 transition-transform"
          >
            <Sparkles size={10} className="text-white" />
          </button>
        )}
      </div>
    );
  };

  const SubGrid = ({ gridIdx }: { gridIdx: number }) => {
    const isMainGrid = gridIdx === 4;
    return (
      <div
        className={`
        grid grid-cols-3 grid-rows-3 gap-0.5 p-1 rounded-lg border-2
        ${isMainGrid ? "border-indigo-500/50 bg-indigo-500/5 shadow-xl" : "border-slate-700 bg-slate-800/20"}
      `}
      >
        {Array.from({ length: 9 }, () => "").map((_, index) => (
          <MandalaCell
            key={index}
            gridIdx={gridIdx}
            cellIdx={index}
            value={data[gridIdx][index]}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans p-4 md:p-8">
      {/* Header & Status Bar */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Cpu size={28} />
            </div>
            AI Mandala Chart
          </h1>
          <p className="text-slate-400 mt-1">
            思考を81マスのグリッドで整理し、AIで拡張する
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center bg-slate-800/50 p-2 rounded-xl border border-slate-700">
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium ${apiKeyMode === "extension" ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-700 text-slate-400"}`}
          >
            <Puzzle size={14} /> Extension
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium ${apiKeyMode === "temp" ? "bg-amber-500/20 text-amber-400" : "bg-slate-700 text-slate-400"}`}
          >
            <Key size={14} /> Session
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium ${apiKeyMode === "server" ? "bg-indigo-500/20 text-indigo-400" : "bg-slate-700 text-slate-400"}`}
          >
            <Cpu size={14} /> Server
          </div>
          <button className="ml-2 p-2 hover:bg-slate-700 rounded-full transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Main Board */}
      <main className="max-w-4xl mx-auto">
        <div
          className={`
          relative grid grid-cols-3 gap-3 md:gap-6 aspect-square w-full
          transition-all duration-700 ease-in-out
          ${isZoomed ? "scale-110" : "scale-100"}
        `}
        >
          {Array.from({ length: 9 }, () => "").map((_, index) => (
            <SubGrid key={index} gridIdx={index} />
          ))}

          {/* AI Loading Overlay */}
          {isAiLoading && (
            <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-[2px] z-50 flex items-center justify-center rounded-2xl border border-indigo-500/30">
              <div className="flex flex-col items-center gap-4 bg-slate-900 p-8 rounded-3xl shadow-2xl border border-indigo-500/50">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                  <Sparkles
                    className="absolute inset-0 m-auto text-indigo-400 animate-pulse"
                    size={20}
                  />
                </div>
                <div className="text-center">
                  <p className="font-bold text-white">AI拡張中...</p>
                  <p className="text-xs text-slate-400">
                    最適な要素をマッピングしています
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-12 px-4 py-6 bg-slate-800/30 border-t border-slate-700 rounded-b-3xl">
          <div className="flex gap-4">
            <button
              onClick={() => setData(INITIAL_DATA)}
              className="flex items-center gap-2 px-4 py-2 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg transition-colors text-sm"
            >
              <Trash2 size={16} /> リセット
            </button>
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm">
              <Download size={16} /> エクスポート
            </button>
          </div>

          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
          >
            {isZoomed ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            {isZoomed ? "俯瞰モード" : "集中モード"}
          </button>
        </div>

        {/* AI Guide Tip */}
        <div className="mt-8 flex items-start gap-4 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl">
          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
            <Info size={20} />
          </div>
          <div>
            <h4 className="font-bold text-indigo-300 text-sm">AI ヒント</h4>
            <p className="text-xs text-slate-400 leading-relaxed mt-1">
              中央のグリッドにあなたのビジョンを入力してください。各マスの右上にある{" "}
              <Sparkles className="inline-block" size={12} />{" "}
              アイコンをクリックすると、AIが不足している要素を具体化して提案します。現在のAPIキー設定は{" "}
              <strong>サーバー無料枠</strong> です。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
