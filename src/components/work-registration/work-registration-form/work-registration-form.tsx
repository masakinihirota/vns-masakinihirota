"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle,
  ChevronDown,
  Clock,
  ExternalLink,
  Link as LinkIcon,
  Monitor,
  Moon,
  Sparkles,
  Sun,
  Tag,
  Trash2,
} from "lucide-react";
import type {
  AiDraftData,
  WorkCategory,
  WorkFormData,
} from "./work-registration-form.logic";
import {
  RELEASE_YEAR_OPTIONS,
  WORK_CATEGORY,
  WORK_LENGTH_OPTIONS,
} from "./work-registration-form.logic";

type Props = {
  readonly formData: WorkFormData;
  readonly activeCategory: WorkCategory;
  readonly isDark: boolean;
  readonly hasApiKey: boolean;
  readonly isAiProcessing: boolean;
  readonly showAiDiff: boolean;
  readonly showDeleteConfirm: boolean;
  readonly aiDraft: AiDraftData | null;
  readonly onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  readonly onCategoryChange: (category: WorkCategory) => void;
  readonly onToggleTheme: () => void;
  readonly onRunAiAutocomplete: () => void;
  readonly onApplyAiResult: () => void;
  readonly onSetShowAiDiff: (show: boolean) => void;
  readonly onSetShowDeleteConfirm: (show: boolean) => void;
  readonly onSetLength: (length: string) => void;
  readonly onTogglePurchasable: () => void;
};

export const WorkRegistrationForm = ({
  formData,
  activeCategory,
  isDark,
  hasApiKey,
  isAiProcessing,
  showAiDiff,
  showDeleteConfirm,
  aiDraft,
  onInputChange,
  onCategoryChange,
  onToggleTheme,
  onRunAiAutocomplete,
  onApplyAiResult,
  onSetShowAiDiff,
  onSetShowDeleteConfirm,
  onSetLength,
  onTogglePurchasable,
}: Props) => {
  const themeClasses = isDark
    ? "bg-[#0B0F1A] text-neutral-200"
    : "bg-linear-to-br from-white via-blue-50 to-purple-50 text-gray-800";

  const cardClasses = isDark
    ? "bg-white/5 backdrop-blur-lg border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
    : "bg-white/40 backdrop-blur-md border border-white/20 shadow-lg";

  const inputClasses = isDark
    ? "bg-black/20 border-white/10 focus:border-indigo-500"
    : "bg-white/50 border-white/30 focus:border-blue-400";

  return (
    <div
      className={`min-h-screen transition-colors duration-500 font-sans p-8 ${themeClasses}`}
      style={{ fontSize: "1rem" }}
    >
      <header className="max-w-[1600px] mx-auto mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight mb-2">
            作品登録
          </h1>
          <p className={`${isDark ? "text-neutral-400" : "text-gray-600"}`}>
            作品名からAIが情報を自動補完します
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <button
            type="button"
            onClick={onToggleTheme}
            className={`p-3 rounded-full transition-all cursor-pointer ${cardClasses}`}
            aria-label="テーマ切り替え"
          >
            {isDark ? <Sun size={24} /> : <Moon size={24} />}
          </button>

          <div className={`flex p-1 rounded-xl ${cardClasses}`}>
            <button
              type="button"
              onClick={() => onCategoryChange(WORK_CATEGORY.ANIME)}
              className={`px-8 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${activeCategory === WORK_CATEGORY.ANIME
                ? isDark
                  ? "bg-white/10"
                  : "bg-white/60 shadow-xs"
                : ""
                }`}
            >
              <Monitor size={20} /> アニメ
            </button>
            <button
              type="button"
              onClick={() => onCategoryChange(WORK_CATEGORY.MANGA)}
              className={`px-8 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${activeCategory === WORK_CATEGORY.MANGA
                ? isDark
                  ? "bg-white/10"
                  : "bg-white/60 shadow-xs"
                : ""
                }`}
            >
              <BookOpen size={20} /> 漫画
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8 items-start">
        {/* 左カラム: 入力フォーム */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <section className={`p-8 rounded-3xl ${cardClasses}`}>
            <div className="space-y-6">
              {/* 作品名 & AIボタン */}
              <div className="relative">
                <label className="block text-sm font-medium mb-2 opacity-70">
                  作品名
                </label>
                <div className="flex gap-3">
                  <input
                    name="title"
                    value={formData.title}
                    onChange={onInputChange}
                    placeholder="作品タイトルを入力..."
                    className={`flex-1 px-4 py-3 rounded-xl outline-hidden border transition-all ${inputClasses}`}
                  />
                  <button
                    disabled={!hasApiKey || !formData.title || isAiProcessing}
                    onClick={onRunAiAutocomplete}
                    className={`px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-all cursor-pointer ${hasApiKey && formData.title && !isAiProcessing
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                      : "bg-neutral-500/20 text-neutral-500 cursor-not-allowed"
                      }`}
                  >
                    {isAiProcessing ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white" />
                    ) : (
                      <Sparkles size={20} />
                    )}
                    AIで埋める
                  </button>
                </div>
                {!hasApiKey && (
                  <p className="text-xs mt-2 text-amber-500 flex items-center gap-1">
                    <AlertCircle size={14} />{" "}
                    拡張機能からGemini API Keyを読み込んでいます...
                  </p>
                )}
              </div>

              {/* 作者 / スタジオ */}
              <div>
                <label className="block text-sm font-medium mb-2 opacity-70">
                  {activeCategory === WORK_CATEGORY.MANGA
                    ? "作者 (漫画家)"
                    : "制作スタジオ"}
                </label>
                <input
                  name="creator"
                  value={formData.creator}
                  onChange={onInputChange}
                  placeholder={
                    activeCategory === WORK_CATEGORY.MANGA
                      ? "漫画家名"
                      : "スタジオ名"
                  }
                  className={`w-full px-4 py-3 rounded-xl outline-hidden border transition-all ${inputClasses}`}
                />
              </div>

              {/* 発表年代 (ドロップダウン) */}
              <div>
                <label className="block text-sm font-medium mb-2 opacity-70">
                  発表年代
                </label>
                <div className="relative">
                  <select
                    name="releaseYear"
                    value={formData.releaseYear}
                    onChange={onInputChange}
                    className={`w-full px-4 py-3 rounded-xl outline-hidden border transition-all cursor-pointer appearance-none ${inputClasses}`}
                  >
                    {RELEASE_YEAR_OPTIONS.map((year) => (
                      <option
                        key={year}
                        value={year}
                        className={
                          isDark ? "bg-neutral-900 text-white" : "bg-white text-gray-800"
                        }
                      >
                        {["1970以前", "発売未定"].includes(year)
                          ? year
                          : `${year}年`}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <ChevronDown size={20} />
                  </div>
                </div>
              </div>

              {/* 作品の長さ */}
              <div>
                <label className="block text-sm font-medium mb-2 opacity-70 flex items-center gap-2">
                  <Clock size={16} /> 作品の長さ（視聴・読了目安）
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {WORK_LENGTH_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => onSetLength(opt)}
                      className={`py-2 px-3 rounded-lg border text-sm transition-all cursor-pointer ${formData.length === opt
                        ? isDark
                          ? "bg-indigo-500/20 border-indigo-500"
                          : "bg-blue-100 border-blue-400 text-blue-800"
                        : isDark
                          ? "border-white/10 bg-white/5"
                          : "border-white/40 bg-white/30"
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* URL系 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-70 flex items-center gap-2">
                    <ExternalLink size={16} /> 公式サイトURL
                  </label>
                  <input
                    name="officialUrl"
                    value={formData.officialUrl}
                    onChange={onInputChange}
                    placeholder="https://..."
                    className={`w-full px-4 py-3 rounded-xl outline-hidden border transition-all ${inputClasses}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-70 flex items-center gap-2">
                    <LinkIcon size={16} /> アフィリエイトURL
                  </label>
                  <input
                    name="affiliateUrl"
                    value={formData.affiliateUrl}
                    onChange={onInputChange}
                    placeholder="https://..."
                    className={`w-full px-4 py-3 rounded-xl outline-hidden border transition-all ${inputClasses}`}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 右カラム: 詳細・AI差分・アクション */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div
            className={`p-8 rounded-3xl min-h-[400px] flex flex-col ${cardClasses}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <Sparkles size={24} className="text-indigo-400" /> 作品内容・AI解析
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-sm opacity-70">国内で購入可能</span>
                <button
                  type="button"
                  onClick={onTogglePurchasable}
                  className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${formData.isPurchasable ? "bg-indigo-600" : "bg-neutral-600"
                    }`}
                  aria-label="購入可能フラグ切り替え"
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isPurchasable ? "left-7" : "left-1"
                      }`}
                  />
                </button>
              </div>
            </div>

            {/* AI提案との差分表示モード */}
            <AnimatePresence mode="wait">
              {showAiDiff ? (
                <motion.div
                  key="ai-diff"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 flex-1"
                >
                  <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5">
                    <p className="text-sm text-indigo-400 mb-4">
                      AIが見つけた情報と比較してください
                    </p>
                    <div className="space-y-3">
                      {aiDraft &&
                        (Object.keys(aiDraft) as (keyof WorkFormData)[]).map(
                          (key) => {
                            if (key === "synopsis") return null;
                            const isDiff =
                              String(formData[key]) !== String(aiDraft[key]);
                            return (
                              <div
                                key={key}
                                className={`flex items-center justify-between p-3 rounded-lg ${isDiff ? "bg-amber-500/10" : ""
                                  }`}
                              >
                                <span className="text-xs opacity-50 uppercase">
                                  {key}
                                </span>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm line-through opacity-30">
                                    {String(formData[key]) || "(なし)"}
                                  </span>
                                  <ArrowRight size={14} className="opacity-50" />
                                  <span
                                    className={`text-sm font-medium ${isDiff ? "text-amber-400" : ""
                                      }`}
                                  >
                                    {String(aiDraft[key])}
                                  </span>
                                </div>
                              </div>
                            );
                          }
                        )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={onApplyAiResult}
                      className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
                    >
                      <CheckCircle size={20} /> 提案を反映する
                    </button>
                    <button
                      type="button"
                      onClick={() => onSetShowAiDiff(false)}
                      className={`px-8 py-4 rounded-2xl border transition-all cursor-pointer ${isDark
                        ? "border-white/10 hover:bg-white/5"
                        : "border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                      キャンセル
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6 flex-1"
                >
                  {/* あらすじ */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium opacity-70">
                      あらすじ (AI生成テキスト)
                    </label>
                    <div
                      className={`p-6 rounded-2xl min-h-[180px] leading-relaxed italic ${isDark
                        ? "bg-black/30 border border-white/5"
                        : "bg-white/60 border border-white/40"
                        }`}
                    >
                      {formData.synopsis ||
                        "AIで埋めるボタンを押すと、ここにあらすじが生成されます。"}
                    </div>
                  </div>

                  {/* タグ */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium opacity-70 flex items-center gap-2">
                      <Tag size={16} /> タグ
                    </label>
                    <input
                      name="tags"
                      value={formData.tags}
                      onChange={onInputChange}
                      placeholder="カンマ区切りで入力 (例: SF, 学園, ミステリー)"
                      className={`w-full px-4 py-3 rounded-xl outline-hidden border transition-all ${inputClasses}`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 下部アクションボタン */}
            <div className="pt-8 mt-auto flex justify-between items-center border-t border-white/10">
              <button
                type="button"
                onClick={() => onSetShowDeleteConfirm(true)}
                className="p-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <Trash2 size={24} /> 作品を削除
              </button>

              <div className="flex gap-4">
                <button
                  type="button"
                  className={`px-10 py-4 rounded-2xl font-bold transition-all cursor-pointer ${isDark ? "bg-white/10 hover:bg-white/20" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                >
                  下書き保存
                </button>
                <button
                  type="button"
                  className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  登録を完了する
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 削除確認モーダル */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => onSetShowDeleteConfirm(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`relative max-w-lg w-full p-12 rounded-[2.5rem] shadow-2xl text-center ${isDark ? "bg-[#1a1f2e]" : "bg-white"
                }`}
            >
              <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <Trash2 size={48} />
              </div>
              <h2 className="text-3xl font-bold mb-4">作品を削除しますか？</h2>
              <p className="text-xl opacity-60 mb-10 leading-relaxed">
                この操作は取り消せません。
                <br />
                登録したすべての情報が失われます。
              </p>
              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => onSetShowDeleteConfirm(false)}
                  className="w-full py-5 bg-red-500 text-white rounded-2xl text-2xl font-bold hover:bg-red-600 shadow-xl shadow-red-500/30 transition-all cursor-pointer"
                >
                  はい、完全に削除する
                </button>
                <button
                  type="button"
                  onClick={() => onSetShowDeleteConfirm(false)}
                  className={`w-full py-5 rounded-2xl text-2xl font-bold transition-all cursor-pointer ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                >
                  キャンセル
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
