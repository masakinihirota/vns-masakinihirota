import Link from "next/link";
import React from "react";
import {
  Rating,
  RatingStatus,
  RatingValue,
} from "./work-continuous-rating.logic";

interface WorkContinuousRatingProps {
  category: "anime" | "manga" | null;
  sessionSize: number | "all" | null;
  isLoading: boolean;
  isComplete: boolean;
  currentIndex: number;
  sessionTotal: number;
  currentTitle: string;
  announcement: string;
  ratings: Record<string, Rating>;
  showRatedItems: boolean;
  currentStatus: RatingStatus;

  // Actions
  onCategorySelect: (cat: "anime" | "manga") => void;
  onSessionStart: (size: number | "all") => void;
  onRate: (value: RatingValue) => void;
  onStatusChange: (status: RatingStatus) => void;
  onPrevious: () => void;
  onNext: () => void;
  onReset: () => void;
  onExport: () => void;
  onToggleRatedItems: () => void;
}

// Helper to format rating for display
const formatRating = (rating: Rating): string => {
  if (!rating) return "";
  if (typeof rating === "string") return rating;
  return `${rating.status} - ${rating.value}`;
};

// Helper to get value for comparison
const getRatingValue = (rating: Rating): RatingValue | null => {
  if (!rating) return null;
  if (typeof rating === "string") return rating;
  return rating.value;
};

export const WorkContinuousRating: React.FC<WorkContinuousRatingProps> = ({
  category,
  sessionSize,
  isLoading,
  isComplete,
  currentIndex,
  sessionTotal,
  currentTitle,
  announcement,
  ratings,
  showRatedItems,
  currentStatus,
  onCategorySelect,
  onSessionStart,
  onRate,
  onStatusChange,
  onPrevious,
  onNext,
  onReset,
  onExport,
  onToggleRatedItems,
}) => {
  const progress =
    sessionTotal > 0 ? ((currentIndex + 1) / sessionTotal) * 100 : 0;

  // -------------------------------------------------------------------------
  // 共通スタイル定義 (Light/Dark対応)
  // -------------------------------------------------------------------------
  // 全体背景
  const containerClass =
    "min-h-screen p-4 flex items-center justify-center transition-colors duration-300 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950";

  // カード・パネル (Glassmorphism / Elegant Dark)
  const cardClass =
    "max-w-xl w-full rounded-2xl shadow-xl transition-all duration-300 bg-white/50 backdrop-blur-md border border-white/30 dark:bg-black/40 dark:border-white/10 dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]";

  // ボタン (Primary)
  const btnPrimaryClass =
    "w-full py-3 rounded-xl font-semibold text-sm transition-all shadow-md active:scale-95 bg-white/50 backdrop-blur-md border border-white/30 text-gray-900 hover:bg-white/70 hover:shadow-2xl focus:ring-4 focus:ring-white/50 focus:ring-offset-4 dark:bg-white/5 dark:text-neutral-100 dark:border-white/10 dark:hover:bg-white/10 dark:focus:ring-white/20 dark:focus:ring-offset-gray-900";

  // ボタン (Back/Secondary)
  const btnSecondaryClass =
    "px-6 py-2 rounded-xl font-semibold text-sm transition-all shadow-sm active:scale-95 bg-white/50 backdrop-blur-md text-gray-900 border border-white/30 hover:bg-white/70 hover:shadow-xl focus:ring-4 focus:ring-white/50 focus:ring-offset-4 dark:bg-transparent dark:text-neutral-300 dark:border-white/10 dark:hover:bg-white/5 dark:focus:ring-white/20";

  // テキスト
  const titleClass =
    "text-3xl font-semibold text-center mb-2 text-gray-900 dark:text-neutral-100";
  const subtitleClass =
    "text-center text-gray-700 mb-6 text-sm dark:text-neutral-400";
  const bodyTextClass = "text-gray-900 dark:text-neutral-200";

  // -------------------------------------------------------------------------
  // カテゴリ選択画面
  // -------------------------------------------------------------------------
  if (!category) {
    return (
      <main className={containerClass}>
        <div className={`${cardClass} p-8`}>
          <Link
            href="/"
            className={`inline-block mb-8 ${btnSecondaryClass}`}
            aria-label="UIギャラリーに戻る"
          >
            ← トップページへ戻る
          </Link>

          <h1 className={titleClass}>作品連続評価</h1>
          <div className="space-y-6" role="group" aria-label="カテゴリ選択">
            <button
              onClick={() => onCategorySelect("anime")}
              className={btnPrimaryClass}
              aria-label="アニメを評価する"
            >
              🎬 アニメ
            </button>
            <button
              onClick={() => onCategorySelect("manga")}
              className={btnPrimaryClass}
              aria-label="漫画を評価する"
            >
              📚 漫画
            </button>
          </div>
        </div>
      </main>
    );
  }

  // -------------------------------------------------------------------------
  // ローディング画面
  // -------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className={containerClass}>
        <div className="text-center">
          <div
            className="text-4xl mb-4 animate-pulse"
            role="status"
            aria-live="polite"
          >
            ⏳
          </div>
          <p className={`text-lg font-semibold ${bodyTextClass}`}>
            読み込み中...
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // セッションサイズ選択画面
  // -------------------------------------------------------------------------
  if (sessionSize === null) {
    const ratedCount = Object.keys(ratings).length;

    return (
      <main className={containerClass}>
        <div className={`${cardClass} p-8`}>
          <button
            onClick={onReset}
            className={`mb-8 ${btnSecondaryClass}`}
            aria-label="カテゴリ選択に戻る"
          >
            ← 戻る
          </button>

          <h2
            className={`text-2xl font-semibold text-center mb-6 ${bodyTextClass}`}
          >
            今日は何件評価しますか？
          </h2>

          <div
            className="grid grid-cols-2 gap-4 mb-6"
            role="group"
            aria-label="評価件数選択"
          >
            {[5, 10, 20, 50].map((size) => (
              <button
                key={size}
                onClick={() => onSessionStart(size)}
                className={btnPrimaryClass}
                aria-label={`${size}作品を評価する`}
              >
                {size}件
              </button>
            ))}
          </div>

          <button
            onClick={() => onSessionStart("all")}
            className={btnPrimaryClass}
            aria-label="すべての未評価作品を評価する"
          >
            全件評価
          </button>

          {/* 評価済み作品の表示（簡易版） */}
          {ratedCount > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200/30 dark:border-white/10">
              <button
                onClick={onToggleRatedItems}
                className="w-full text-left flex items-center justify-between p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-expanded={showRatedItems}
              >
                <span className={`text-sm font-semibold ${bodyTextClass}`}>
                  📊 評価済み作品 ({ratedCount}件)
                </span>
                <span className={bodyTextClass}>
                  {showRatedItems ? "▼" : "▶"}
                </span>
              </button>

              {showRatedItems && (
                <div className="mt-4 pl-4 text-sm text-gray-700 dark:text-neutral-400 space-y-1 max-h-40 overflow-y-auto">
                  {Object.keys(ratings)
                    .slice(0, 100)
                    .map((title) => (
                      <div key={title} className="truncate">
                        • [{formatRating(ratings[title])}] {title}
                      </div>
                    ))}
                  {ratedCount > 100 && <div>...他 {ratedCount - 100} 件</div>}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    );
  }

  // -------------------------------------------------------------------------
  // 完了画面
  // -------------------------------------------------------------------------
  if (isComplete) {
    return (
      <main className={containerClass}>
        <div className={`${cardClass} p-8 text-center`}>
          <div className="text-6xl mb-4" role="img" aria-label="完了">
            🎉
          </div>
          <h2 className={`text-3xl font-semibold mb-4 ${bodyTextClass}`}>
            お疲れ様でした！
          </h2>
          <p className={`text-lg mb-6 ${subtitleClass}`} aria-live="polite">
            {sessionTotal}作品の評価が完了しました
          </p>

          <div className="space-y-4">
            <button
              onClick={onReset}
              className={btnPrimaryClass}
              aria-label="トップ画面に戻る"
            >
              トップへ戻る
            </button>
            <button
              onClick={onExport}
              className={btnPrimaryClass}
              aria-label="評価データをエクスポート"
            >
              📥 評価をエクスポート
            </button>
          </div>
        </div>
      </main>
    );
  }

  // -------------------------------------------------------------------------
  // 評価画面
  // -------------------------------------------------------------------------
  return (
    <main className={`${containerClass} block`}>
      {" "}
      {/* blockで中央配置解除して上から配置 */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
      <div className="max-w-4xl mx-auto pt-4">
        {/* ヘッダーボタン */}
        <button
          onClick={onReset}
          className={`mb-8 ${btnSecondaryClass}`}
          aria-label="トップページへ戻る"
        >
          ← トップページへ戻る
        </button>

        {/* プログレスバー */}
        <div
          className="mb-8"
          role="progressbar"
          aria-label="セッション進捗"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-semibold ${bodyTextClass}`}>
              進捗: {currentIndex + 1} / {sessionTotal}
            </span>
            <span className={`text-sm font-semibold ${bodyTextClass}`}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-6 rounded-2xl overflow-hidden bg-white/30 border border-white/30 dark:bg-white/5 dark:border-white/10">
            <div
              className="h-full transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-indigo-500 dark:to-purple-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 作品名カード */}
        <div className="mb-6 p-8 rounded-2xl shadow-xl bg-white/50 backdrop-blur-md border border-white/30 dark:bg-white/5 dark:border-white/10">
          <h2
            className={`text-3xl font-semibold text-center ${bodyTextClass}`}
            aria-label={`現在の作品: ${currentTitle}`}
          >
            {currentTitle}
          </h2>
        </div>

        {/* ナビゲーション（戻る/次へ） */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className={`flex-1 py-3 rounded-xl font-semibold text-lg transition-all border border-white/30 backdrop-blur-md
              ${
                currentIndex === 0
                  ? "bg-gray-200/60 text-gray-400 cursor-not-allowed dark:bg-white/5 dark:text-neutral-600" // Disabled
                  : "bg-white/50 text-gray-900 hover:bg-white/70 hover:shadow-2xl dark:bg-white/10 dark:text-neutral-100 dark:hover:bg-white/15"
              }`}
            aria-label="前の作品に戻る"
          >
            ← 戻る
          </button>
          <button
            onClick={onNext}
            disabled={currentIndex >= sessionTotal - 1}
            className={`flex-1 py-3 rounded-xl font-semibold text-lg transition-all border border-white/30 backdrop-blur-md
              ${
                currentIndex >= sessionTotal - 1
                  ? "bg-gray-200/60 text-gray-400 cursor-not-allowed dark:bg-white/5 dark:text-neutral-600"
                  : "bg-white/50 text-gray-900 hover:bg-white/70 hover:shadow-2xl dark:bg-white/10 dark:text-neutral-100 dark:hover:bg-white/15"
              }`}
            aria-label="次の作品へ進む"
          >
            次へ →
          </button>
        </div>

        {/* 時間軸・状態選択 (Now, Future, Life) */}
        <div className="mb-6 p-2 bg-white/30 backdrop-blur-md rounded-2xl border border-white/20 dark:bg-black/20 dark:border-white/5 flex gap-2">
          <button
            onClick={() => onStatusChange("Now")}
            className={`flex-1 py-3 rounded-xl font-bold text-base transition-all
                            ${
                              currentStatus === "Now"
                                ? "bg-indigo-600 text-white shadow-lg scale-100"
                                : "bg-transparent text-gray-600 dark:text-gray-400 hover:bg-white/40 dark:hover:bg-white/5"
                            }`}
          >
            👇 Now (今)
          </button>
          <button
            onClick={() => onStatusChange("Future")}
            className={`flex-1 py-3 rounded-xl font-bold text-base transition-all
                            ${
                              currentStatus === "Future"
                                ? "bg-indigo-600 text-white shadow-lg scale-100"
                                : "bg-transparent text-gray-600 dark:text-gray-400 hover:bg-white/40 dark:hover:bg-white/5"
                            }`}
          >
            📅 Future (未来)
          </button>
          <button
            onClick={() => onStatusChange("Life")}
            className={`flex-1 py-3 rounded-xl font-bold text-base transition-all
                            ${
                              currentStatus === "Life"
                                ? "bg-indigo-600 text-white shadow-lg scale-100"
                                : "bg-transparent text-gray-600 dark:text-gray-400 hover:bg-white/40 dark:hover:bg-white/5"
                            }`}
          >
            🔥 Life (人生)
          </button>
        </div>

        {/* 評価ボタン群 */}
        <div className="space-y-4">
          {/* 上段：評価系 (Tier1, Tier2, Tier3, 普通) */}
          <div className="grid grid-cols-4 gap-3">
            <RatingButton
              label="Tier1"
              subLabel="⭐ Tier1"
              colorClass="bg-yellow-200/60 hover:bg-yellow-300/70 dark:bg-yellow-900/40 dark:hover:bg-yellow-900/60 dark:text-yellow-100 dark:border-yellow-500/30"
              isSelected={getRatingValue(ratings[currentTitle]) === "Tier1"}
              onClick={() => onRate("Tier1")}
            />
            <RatingButton
              label="Tier2"
              subLabel="🌟 Tier2"
              colorClass="bg-orange-200/60 hover:bg-orange-300/70 dark:bg-orange-900/40 dark:hover:bg-orange-900/60 dark:text-orange-100 dark:border-orange-500/30"
              isSelected={getRatingValue(ratings[currentTitle]) === "Tier2"}
              onClick={() => onRate("Tier2")}
            />
            <RatingButton
              label="Tier3"
              subLabel="💙 Tier3"
              colorClass="bg-blue-200/60 hover:bg-blue-300/70 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 dark:text-blue-100 dark:border-blue-500/30"
              isSelected={getRatingValue(ratings[currentTitle]) === "Tier3"}
              onClick={() => onRate("Tier3")}
            />
            <RatingButton
              label="普通"
              subLabel={
                <span className="block text-xs leading-tight">
                  普通/
                  <br />
                  自分に合わなかった
                </span>
              }
              colorClass="bg-gray-200/60 hover:bg-gray-300/70 dark:bg-gray-800/60 dark:hover:bg-gray-700/60 dark:text-gray-200 dark:border-gray-500/30"
              isSelected={
                getRatingValue(ratings[currentTitle]) ===
                "普通 or 自分に合わない"
              }
              onClick={() => onRate("普通 or 自分に合わない")}
            />
          </div>

          {/* 下段：アクション系 (興味無し, 後で見る) */}
          <div className="grid grid-cols-2 gap-4">
            <RatingButton
              label="興味無し"
              subLabel="💀 興味無し"
              colorClass="bg-purple-200/60 hover:bg-purple-300/70 dark:bg-purple-900/40 dark:hover:bg-purple-900/60 dark:text-purple-100 dark:border-purple-500/30"
              isSelected={getRatingValue(ratings[currentTitle]) === "興味無し"}
              onClick={() => onRate("興味無し")}
            />
            <RatingButton
              label="後で見る"
              subLabel="⏳ 後で見る"
              colorClass="bg-emerald-200/60 hover:bg-emerald-300/70 dark:bg-emerald-900/40 dark:hover:bg-emerald-900/60 dark:text-emerald-100 dark:border-emerald-500/30"
              isSelected={getRatingValue(ratings[currentTitle]) === "後で見る"}
              onClick={() => onRate("後で見る")}
            />
          </div>
        </div>

        {/* キーボードヘルプ */}
        <div className="mt-6 p-4 rounded-xl shadow-xl bg-white/50 backdrop-blur-md border border-white/30 dark:bg-black/20 dark:border-white/5">
          <h3 className={`text-lg font-semibold mb-2 ${bodyTextClass}`}>
            ⌨️ キーボードショートカット
          </h3>
          <div className={`grid grid-cols-2 gap-2 text-sm ${bodyTextClass}`}>
            <div>
              <Kbd>1-3</Kbd> = Status (Now/Future/Life)
            </div>
            <div>
              <Kbd>4-6</Kbd> = Tier 1-3
            </div>
            <div>
              <Kbd>7</Kbd> = 普通/合わない
            </div>
            <div>
              <Kbd>8</Kbd> = 興味無し
            </div>
            <div>
              <Kbd>9</Kbd> = 後で見る
            </div>
            <div>
              <Kbd>← →</Kbd> = 前へ / 次へ
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

// サブコンポーネント: 評価ボタン
const RatingButton: React.FC<{
  label: string;
  subLabel: React.ReactNode;
  colorClass: string;
  isSelected?: boolean;
  onClick: () => void;
}> = ({ label, subLabel, colorClass, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`py-4 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-xl focus:ring-4 focus:ring-white/50 focus:ring-offset-4 backdrop-blur-md border border-white/30 active:scale-95 dark:focus:ring-white/20 dark:focus:ring-offset-gray-900 ${colorClass} ${isSelected ? "ring-4 ring-indigo-500 ring-offset-4 scale-105 border-indigo-500 shadow-2xl z-10" : ""}`}
    aria-label={`${typeof subLabel === "string" ? subLabel : label} ${isSelected ? "(選択中)" : ""}`}
    aria-pressed={isSelected}
  >
    <div>{subLabel}</div>
  </button>
);

// サブコンポーネント: キーボード表示
const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd className="px-3 py-1 rounded font-mono bg-white/70 border border-white/30 dark:bg-white/10 dark:border-white/20">
    {children}
  </kbd>
);
