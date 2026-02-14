import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Heart,
  HelpCircle,
  Info,
  Plus,
  Trash2,
  Trophy,
} from "lucide-react";
import React from "react";
import { PURPOSES, VALUE_QUESTIONS } from "../user-profile-creation.constants";
import { UserProfile } from "../user-profile-creation.types";

interface Step5ValuesProps {
  formData: UserProfile;
  togglePurpose: (id: string) => void;
  ratingType: "LIKE" | "TIER";
  setRatingType: (type: "LIKE" | "TIER") => void;
  setShowRatingHelp: (show: boolean) => void;
  valueSelections: Record<string, string[]>;
  valueTiers: Record<string, number>;
  addedQuestionIds: string[];
  removedQuestionIds: string[];
  setAddedQuestionIds: React.Dispatch<React.SetStateAction<string[]>>;
  setRemovedQuestionIds: React.Dispatch<React.SetStateAction<string[]>>;
  handleValueSelection: (questionId: string, choiceId: string) => void;
  toggleValueTier: (questionId: string, tier?: number) => void;
  openQuestionId: string | null;
  setOpenQuestionId: (id: string | null) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export const Step5Values = ({
  formData,
  togglePurpose,
  ratingType,
  setRatingType,
  setShowRatingHelp,
  valueSelections,
  valueTiers,
  addedQuestionIds,
  removedQuestionIds,
  setAddedQuestionIds,
  setRemovedQuestionIds,
  handleValueSelection,
  toggleValueTier,
  openQuestionId,
  setOpenQuestionId,
  currentPage,
  setCurrentPage,
}: Step5ValuesProps) => {
  // List Logic: Separation of Concerns
  // 1. Registered List (Left Column):
  //    (Interacted OR Purpose-Related OR Manually Added) AND (NOT Manually Removed)
  const registeredValues = VALUE_QUESTIONS.filter((q) => {
    // If manually removed, exclude (even if purpose-related or answered)
    if (removedQuestionIds.includes(q.id)) return false;

    // If manually added, include
    if (addedQuestionIds.includes(q.id)) return true;

    // 1. Explicitly interacted with (Answered or Tiered)
    const hasInteraction =
      (valueSelections[q.id]?.length || 0) > 0 || (valueTiers[q.id] || 0) > 0;
    if (hasInteraction) return true;

    // 2. Related to selected Purpose (Auto-register)
    if (
      q.relatedPurposes &&
      q.relatedPurposes.some((p) => formData.purposes.includes(p))
    ) {
      return true;
    }

    return false;
  });

  // 2. Candidate List (Right Column): All questions (Library Mode)
  // Display ALL existing values EXCEPT those already registered (Left) to simulate "Moving".
  const candidateQuestions = VALUE_QUESTIONS.filter(
    (q) => !registeredValues.some((r) => r.id === q.id)
  );

  // Pagination for Candidate List
  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(candidateQuestions.length / ITEMS_PER_PAGE);
  const safePage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));

  const paginatedCandidates = candidateQuestions.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const handleAddValue = (id: string) => {
    setAddedQuestionIds((prev) => [...prev, id]);
    setRemovedQuestionIds((prev) => prev.filter((rid) => rid !== id)); // Clear removal if re-added
  };

  const handleRemoveValue = (id: string) => {
    setRemovedQuestionIds((prev) => [...prev, id]);
    setAddedQuestionIds((prev) => prev.filter((aid) => aid !== id)); // Clear addition if removed
    setOpenQuestionId(null); // Close if open
  };

  // Helper: Render Question Card (Shared between Left/Right columns)
  const renderQuestionCard = (
    q: (typeof VALUE_QUESTIONS)[0],
    idx: number,
    source: "REGISTERED" | "CANDIDATE"
  ) => {
    const isOpen = openQuestionId === q.id;
    const isAnswered = (valueSelections[q.id]?.length || 0) > 0;
    const myTier = valueTiers[q.id];
    const selectedChoices = valueSelections[q.id] || [];

    // Visual distinction for Registered vs Candidate
    const isRegistered = source === "REGISTERED";
    const baseBorderColor = isRegistered
      ? "border-indigo-200 dark:border-indigo-800/50"
      : "border-slate-200 dark:border-slate-700";
    const baseBgColor = isRegistered
      ? "bg-indigo-50/20 dark:bg-indigo-900/10"
      : "bg-white dark:bg-slate-800";

    if (!isRegistered) {
      // --- CANDIDATE (Right Column) ---
      // Click to ADD
      return (
        <div
          key={q.id}
          onClick={() => handleAddValue(q.id)}
          className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-4 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group flex items-start gap-3"
        >
          <div className="mt-0.5 w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Plus className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 mb-1 inline-block">
              {q.category}
            </span>
            <h3 className="font-bold text-sm text-slate-600 dark:text-slate-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
              {q.title}
            </h3>
          </div>
          <div className="text-indigo-600 opacity-0 group-hover:opacity-100 text-xs font-bold self-center transition-opacity">
            追加
          </div>
        </div>
      );
    }

    // --- REGISTERED (Left Column) ---
    // Accordion + Delete
    return (
      <div
        key={q.id}
        className={`rounded-xl border transition-all overflow-hidden ${isOpen
            ? "shadow-lg border-indigo-300 dark:border-indigo-500 ring-1 ring-indigo-200 dark:ring-indigo-900 bg-white dark:bg-slate-900"
            : `${baseBorderColor} ${baseBgColor} hover:border-indigo-300 dark:hover:border-indigo-700`
          }`}
      >
        {/* Header */}
        <div
          onClick={() => {
            // Toggle Open
            setOpenQuestionId(isOpen ? null : q.id);
          }}
          className={`p-4 cursor-pointer flex items-start gap-3 transition-colors ${isOpen
              ? "bg-indigo-50/40 dark:bg-indigo-900/20"
              : "hover:bg-indigo-50/20 dark:hover:bg-indigo-900/10"
            }`}
        >
          <div className="mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
            {isAnswered ? (
              <CheckCircle2 className="w-4 h-4 text-teal-500" />
            ) : (
              "Q"
            )}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
                {q.category}
              </span>
              {myTier === 1 && (
                <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
              )}
              {myTier === 2 && (
                <span className="text-[10px] font-bold text-indigo-500">
                  T2
                </span>
              )}
              {myTier === 3 && (
                <span className="text-[10px] font-bold text-teal-500">T3</span>
              )}
            </div>
            <h3
              className={`font-bold text-sm md:text-base leading-snug ${isOpen || isAnswered
                  ? "text-indigo-900 dark:text-indigo-300"
                  : "text-slate-700 dark:text-slate-300"
                }`}
            >
              {q.title}
            </h3>
          </div>
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveValue(q.id);
              }}
              className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
              title="リストから削除"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            {/* Accordion Indicator */}
            <div className="text-slate-400 mt-1">
              <div
                className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                  }`}
              >
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        {isOpen && (
          <div className="p-4 md:p-5 border-t border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-900/50 space-y-5 animate-in slide-in-from-top-1">
            {/* Rating Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500">重要度:</span>
              {ratingType === "LIKE" ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleValueTier(q.id);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all shadow-sm text-sm ${myTier === 1
                      ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 ring-1 ring-pink-300 dark:ring-pink-700"
                      : "bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-400"
                    }`}
                >
                  <Heart
                    className={`w-4 h-4 ${myTier === 1 ? "fill-pink-500" : ""}`}
                  />
                  {myTier === 1 ? "重視する" : "普通"}
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((t) => (
                    <button
                      key={t}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleValueTier(q.id, t as any);
                      }}
                      className={`w-9 h-8 text-xs font-bold rounded flex items-center justify-center transition-all ${myTier === t
                          ? t === 1
                            ? "bg-purple-600 text-white shadow-md"
                            : t === 2
                              ? "bg-indigo-500 text-white shadow-md"
                              : "bg-teal-500 text-white shadow-md"
                          : "bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600"
                        }`}
                    >
                      T{t}
                    </button>
                  ))}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleValueTier(q.id, undefined);
                    }}
                    className="px-2 py-1 text-xs text-slate-400 underline hover:text-slate-600 ml-2"
                  >
                    クリア
                  </button>
                </div>
              )}
            </div>

            {/* Choices */}
            <div className="space-y-2.5">
              {q.choices.map((choice) => (
                <label
                  key={choice.id}
                  onClick={() => handleValueSelection(q.id, choice.id)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selectedChoices.includes(choice.id)
                      ? "border-teal-500 dark:border-teal-400 bg-teal-50 dark:bg-teal-900/20"
                      : "border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-700 hover:border-slate-200 dark:hover:border-slate-600"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedChoices.includes(choice.id)
                          ? "bg-teal-500 border-teal-500"
                          : "bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-500"
                        }`}
                    >
                      {selectedChoices.includes(choice.id) && (
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span
                      className={`font-bold text-sm ${selectedChoices.includes(choice.id)
                          ? "text-teal-900 dark:text-teal-300"
                          : "text-slate-700 dark:text-slate-300"
                        }`}
                    >
                      {choice.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            {/* Info Blocks */}
            {q.infoBlocks.map((info, i) => (
              <div
                key={i}
                className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-xs"
              >
                <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
                  <Info className="w-3 h-3 text-slate-500 dark:text-slate-400" />{" "}
                  {info.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  {info.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-12">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          価値観セットの確認
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          左側で「活動目的」を選ぶと、答えるべき価値観がリストアップされます。
          <br />
          まずは左側のリストに回答してプロフィールを完成させましょう。
          <br />
          右側のライブラリは、さらに項目を追加したい場合に使ってください。
        </p>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Registered Values (Output/Profile) */}
        <div className="lg:col-span-1 lg:sticky lg:top-8 space-y-4">
          {/* Purpose Selector (Added to Profile) */}
          <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/50 rounded-xl shadow-sm p-4 ring-1 ring-indigo-50 dark:ring-indigo-900/20">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                あなたの目的
              </span>
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              目的を選ぶと、関連する価値観がリストに追加されます。
            </p>
            <div className="flex flex-wrap gap-2">
              {PURPOSES.map((p) => {
                const isActive = formData.purposes.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePurpose(p.id)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 ${isActive
                        ? "bg-indigo-600 text-white border-indigo-600 font-bold shadow-md hover:bg-indigo-700"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400"
                      }`}
                  >
                    {isActive && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rating Type Toggle (Moved to Left Top) */}
          <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/50 rounded-xl shadow-sm p-3 ring-1 ring-indigo-50 dark:ring-indigo-900/20 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              評価モード:
            </span>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => setRatingType("LIKE")}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${ratingType === "LIKE" ? "bg-white dark:bg-slate-700 text-pink-500 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
              >
                <Heart className="w-3.5 h-3.5" /> LIKE
              </button>
              <button
                onClick={() => setRatingType("TIER")}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${ratingType === "TIER" ? "bg-white dark:bg-slate-700 text-indigo-500 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
              >
                <Trophy className="w-3.5 h-3.5" /> TIER
              </button>
              <button
                onClick={() => setShowRatingHelp(true)}
                className="p-1 ml-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                title="評価の基準について"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/50 rounded-xl shadow-sm p-4 overflow-hidden ring-1 ring-indigo-50 dark:ring-indigo-900/20">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500" /> プロフィール
                (登録済)
              </span>
              <span className="bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 text-[10px] px-2 py-0.5 rounded-full">
                {registeredValues.length}
              </span>
            </h3>

            {registeredValues.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 dark:bg-slate-800 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 text-xs">
                まだ登録がありません
              </div>
            ) : (
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                {registeredValues.map((q, idx) =>
                  renderQuestionCard(q, idx, "REGISTERED")
                )}
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
              現在 {registeredValues.length} 個の価値観を登録中
            </div>
          </div>
        </div>

        {/* Right Column: Candidate Pool (Input/Library) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Library Header */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm font-bold text-slate-500 dark:text-slate-400">
              <span className="text-xs font-normal mr-2">
                ライブラリから探す:
              </span>
              {candidateQuestions.length}
              <span className="text-xs font-normal ml-1">件のお題</span>
            </div>
          </div>

          {/* Questions List (Right Column - Candidates) */}
          <div className="space-y-4 min-h-[400px]">
            {paginatedCandidates.map((q, idx) =>
              renderQuestionCard(q, idx, "CANDIDATE")
            )}
          </div>

          {candidateQuestions.length === 0 && (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 mt-4">
              <p className="text-slate-500 text-sm">
                現在表示できるお題はありません。
                <br />
                「その他すべて」をONにするか、登録済みを確認してください。
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                disabled={safePage === 1}
                onClick={() => {
                  setCurrentPage((prev) => Math.max(1, prev - 1));
                  setOpenQuestionId(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 inline mr-1" />
                前へ
              </button>

              <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                {safePage} / {totalPages}
              </span>

              <button
                disabled={safePage === totalPages}
                onClick={() => {
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                  setOpenQuestionId(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                次へ
                <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
