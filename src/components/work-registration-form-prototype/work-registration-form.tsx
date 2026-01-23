import {
  Search,
  BookOpen,
  Tv,
  Star,
  Plus,
  ArrowLeft,
  Save,
  Sparkles,
  Clock,
  Globe,
  Loader2,
  Check,
  Heart,
  Info,
  Lock,
  Building2,
  Link as LinkIcon,
  ShoppingCart,
} from "lucide-react";
import React from "react";
import { Work, UserEntry, SCALE_OPTIONS } from "./work-registration-form.logic";

interface WorkRegistrationFormProps {
  view: string;
  setView: (view: any) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  category: string;
  setCategory: (c: any) => void;
  isSearching: boolean;
  dbResults: Work[];
  aiResults: Work[];
  handleSearch: () => void;
  handleSelectWork: (work: Work) => void;
  handleManualCreate: () => void;
  targetWork: Work | null;
  setTargetWork: (work: Work) => void;
  entryData: UserEntry | null;
  setEntryData: (entry: UserEntry) => void;
  handleSave: () => void;
}

export function WorkRegistrationForm({
  view,
  setView,
  searchQuery,
  setSearchQuery,
  category,
  setCategory,
  isSearching,
  dbResults,
  aiResults,
  handleSearch,
  handleSelectWork,
  handleManualCreate,
  targetWork,
  setTargetWork,
  entryData,
  setEntryData,
  handleSave,
}: WorkRegistrationFormProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 font-bold text-xl text-indigo-600 cursor-pointer"
            onClick={() => setView("search")}
          >
            <BookOpen className="w-6 h-6" />
            <span>OtakuLog AI</span>
          </div>
          <div className="text-sm text-slate-500">ユーザー: Guest</div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {view === "search" ? (
          <SearchScreen
            category={category}
            setCategory={setCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            isSearching={isSearching}
            dbResults={dbResults}
            aiResults={aiResults}
            onSelect={handleSelectWork}
            handleManualCreate={handleManualCreate}
          />
        ) : (
          <EntryScreen
            work={targetWork}
            setWork={setTargetWork}
            entry={entryData}
            setEntry={setEntryData}
            onSave={handleSave}
            onBack={() => setView("search")}
          />
        )}
      </main>
    </div>
  );
}

// --- 画面1: 検索画面 ---

function SearchScreen({
  category,
  setCategory,
  searchQuery,
  setSearchQuery,
  handleSearch,
  isSearching,
  dbResults,
  aiResults,
  onSelect,
  handleManualCreate,
}: any) {
  return (
    <div className="space-y-8">
      {/* 検索エリア */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <h2 className="text-lg font-bold text-slate-700">作品を探す</h2>

        {/* カテゴリ選択 */}
        <div className="flex bg-slate-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setCategory("manga")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              category === "manga"
                ? "bg-white shadow text-indigo-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen size={16} /> 漫画・書籍
            </div>
          </button>
          <button
            onClick={() => setCategory("anime")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              category === "anime"
                ? "bg-white shadow text-indigo-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Tv size={16} /> アニメ・映像
            </div>
          </button>
        </div>

        {/* 検索バー */}
        <div className="relative">
          <input
            type="text"
            placeholder="作品名、キーワードを入力..."
            className="w-full pl-4 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {isSearching ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* 結果表示エリア */}
      {(dbResults.length > 0 || aiResults.length > 0 || isSearching) && (
        <div className="space-y-6">
          {/* 1. 登録済み作品 (DB) */}
          {dbResults.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 text-slate-500 text-sm font-bold uppercase tracking-wider">
                <Check className="w-4 h-4 text-green-500" />
                登録済みの作品
              </div>
              <div className="grid gap-3">
                {dbResults.map((work: Work) => (
                  <WorkCard
                    key={work.id}
                    work={work}
                    onClick={() => onSelect(work)}
                    source="db"
                  />
                ))}
              </div>
            </div>
          )}

          {/* 2. AI検索結果 (Web) */}
          {(aiResults.length > 0 || isSearching) && (
            <div>
              <div className="flex items-center gap-2 mb-3 text-slate-500 text-sm font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                AI検索 / Webからの候補
              </div>

              {isSearching ? (
                <div className="space-y-3">
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              ) : (
                <div className="grid gap-3">
                  {aiResults.map((work: Work) => (
                    <WorkCard
                      key={work.id}
                      work={work}
                      onClick={() => onSelect(work)}
                      source="ai"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 見つからない場合 */}
          {!isSearching && (
            <div className="pt-4 text-center">
              <p className="text-slate-500 text-sm mb-3">
                お探しの作品が見つかりませんか？
              </p>
              <button
                onClick={handleManualCreate}
                className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:underline"
              >
                <Plus size={16} /> 新しく手動で登録する
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- 画面2: 登録・評価画面 ---

function EntryScreen({ work, setWork, entry, setEntry, onSave, onBack }: any) {
  const isNewWork = work.isNew;
  // 手動作成(isAiGenerated=false)以外は、新規でも編集不可
  const isEditable = isNewWork && !work.isAiGenerated;

  // 入力フィールド用の共通クラス
  const inputClass = `w-full p-2 border rounded-md text-sm ${!isEditable ? "bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed" : "bg-white border-slate-300"}`;

  // Amazonアフィリエイトリンク生成用 (モックID使用)
  const generateAmazonLink = (keyword: string) => {
    const affiliateId = "your-affiliate-id-22"; // 実際には環境変数やユーザー設定から取得
    return `https://www.amazon.co.jp/s?k=${encodeURIComponent(keyword)}&tag=${affiliateId}`;
  };

  return (
    <div className="grid md:grid-cols-12 gap-6 items-start">
      <button
        onClick={onBack}
        className="md:hidden flex items-center text-slate-500 mb-2"
      >
        <ArrowLeft size={16} className="mr-1" /> 戻る
      </button>

      {/* 左カラム: 作品データ (Work Model) */}
      <div className="md:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 sticky top-24">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            {isNewWork ? (
              <Sparkles size={16} className="text-indigo-500" />
            ) : (
              <Check size={16} className="text-green-500" />
            )}
            作品データ
          </h3>
          <span className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-500">
            {isNewWork
              ? work.isAiGenerated
                ? "AI取得データ"
                : "手動登録"
              : "登録済み"}
          </span>
        </div>

        {/* AIデータの場合の注釈 */}
        {work.isAiGenerated && (
          <div className="text-xs text-slate-500 bg-indigo-50 border border-indigo-100 p-2 rounded flex items-start gap-2">
            <Lock size={12} className="mt-0.5 text-indigo-500 flex-shrink-0" />
            AIが取得した公式データのため編集できません
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">
              タイトル
            </label>
            <input
              value={work.title}
              onChange={(e) =>
                isEditable && setWork({ ...work, title: e.target.value })
              }
              readOnly={!isEditable}
              className={`${inputClass} font-bold`}
              placeholder="作品タイトル"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">
              作者 / 制作
            </label>
            <input
              value={work.author || ""}
              onChange={(e) =>
                isEditable && setWork({ ...work, author: e.target.value })
              }
              readOnly={!isEditable}
              className={inputClass}
              placeholder="作者名"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1 flex items-center gap-1">
              <Building2 size={12} /> 出版社 / 制作スタジオ
            </label>
            <input
              value={work.publisher || ""}
              onChange={(e) =>
                isEditable && setWork({ ...work, publisher: e.target.value })
              }
              readOnly={!isEditable}
              className={inputClass}
              placeholder="出版社など"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1 flex items-center gap-1">
              <LinkIcon size={12} /> 公式サイトURL
            </label>
            {/* リンクとして機能させるか、入力欄として見せるか */}
            <div className="relative">
              <input
                value={work.officialUrl || ""}
                onChange={(e) =>
                  isEditable &&
                  setWork({ ...work, officialUrl: e.target.value })
                }
                readOnly={!isEditable}
                className={`${inputClass} pr-8 text-blue-600 underline cursor-pointer`}
                onClick={() =>
                  !isEditable &&
                  work.officialUrl &&
                  window.open(work.officialUrl, "_blank")
                }
                placeholder="https://..."
              />
              {!isEditable && work.officialUrl && (
                <Globe
                  size={14}
                  className="absolute right-2 top-2.5 text-slate-400"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">
              あらすじ (AI生成)
            </label>
            <textarea
              value={work.summary || ""}
              onChange={(e) =>
                isEditable && setWork({ ...work, summary: e.target.value })
              }
              readOnly={!isEditable}
              className={`${inputClass} min-h-[100px] leading-relaxed resize-none`}
            />
          </div>

          {/* 規模感設定 (Workの属性として扱う場合) */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">
              作品規模 (読了/視聴目安)
            </label>
            {isEditable ? (
              <select
                className="w-full p-2 border border-slate-200 rounded-md text-sm"
                value={work.scale || ""}
                onChange={(e) => setWork({ ...work, scale: e.target.value })}
              >
                <option value="">選択してください</option>
                {SCALE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 border border-slate-200 p-2 rounded w-full">
                <Clock size={14} />
                {SCALE_OPTIONS.find((o) => o.value === work.scale)?.label ||
                  "未設定 (AIデータなし)"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 右カラム: ユーザー評価 (UserEntry Model) */}
      <div className="md:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-700">あなたの評価・記録</h3>
          <button
            onClick={onBack}
            className="text-sm text-slate-400 hover:text-slate-600 hidden md:block"
          >
            キャンセル
          </button>
        </div>

        {/* 評価タイプ切り替え */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="block text-sm font-bold text-slate-700">
              評価方式を選択
            </label>
            <span className="text-xs text-rose-500 font-bold flex items-center gap-1">
              <Info size={12} /> 好きな作品のみ登録してください
            </span>
          </div>

          <div className="flex gap-4">
            {/* 2択モード */}
            <label
              className={`flex-1 cursor-pointer border rounded-xl p-3 flex flex-col items-center gap-2 transition-all ${entry.ratingType === "simple" ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm" : "border-slate-200 hover:bg-slate-50 text-slate-500"}`}
            >
              <input
                type="radio"
                name="ratingType"
                className="hidden"
                checked={entry.ratingType === "simple"}
                onChange={() =>
                  setEntry({ ...entry, ratingType: "simple", tier: "Tier 1" })
                }
              />
              <Heart
                className={
                  entry.ratingType === "simple" ? "fill-indigo-500" : ""
                }
              />
              <span className="font-bold text-sm">2択 (好き!)</span>
            </label>

            {/* 絶対相対評価モード */}
            <label
              className={`flex-1 cursor-pointer border rounded-xl p-3 flex flex-col items-center gap-2 transition-all ${entry.ratingType === "tier" ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm" : "border-slate-200 hover:bg-slate-50 text-slate-500"}`}
            >
              <input
                type="radio"
                name="ratingType"
                className="hidden"
                checked={entry.ratingType === "tier"}
                onChange={() =>
                  setEntry({ ...entry, ratingType: "tier", tier: "Tier 1" })
                } // 切り替え時もTier 1デフォルト
              />
              <Star
                className={entry.ratingType === "tier" ? "fill-indigo-500" : ""}
              />
              <span className="font-bold text-sm">絶対相対評価</span>
            </label>
          </div>
        </div>

        {/* 評価入力エリア */}
        <div className="p-4 bg-slate-50 rounded-xl space-y-4 min-h-[80px] flex items-center justify-center">
          {entry.ratingType === "simple" ? (
            <div className="text-center py-1 text-indigo-600 font-bold">
              <Heart className="w-6 h-6 mx-auto mb-2 fill-indigo-200 text-indigo-500" />
              「好き」リスト（実質Tier 1）として登録します
            </div>
          ) : (
            <div className="w-full space-y-2">
              <p className="text-xs text-center text-slate-400 font-bold mb-2">
                ランクを選択 (デフォルト: Tier 1)
              </p>
              <div className="grid grid-cols-3 gap-2">
                {["Tier 1", "Tier 2", "Tier 3"].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setEntry({ ...entry, tier: tier })}
                    className={`py-3 rounded-lg text-sm font-bold transition-all ${
                      entry.tier === tier
                        ? "bg-indigo-600 text-white shadow-md transform scale-105"
                        : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ステータス */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            ステータス
          </label>
          <select
            value={entry.status}
            onChange={(e) => setEntry({ ...entry, status: e.target.value })}
            className="w-full p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="want_to_read">読みたい / 気になる</option>
            <option value="reading">読書中 / 視聴中</option>
            <option value="completed">読了 / 視聴完了</option>
            <option value="on_hold">積読 / 一時停止</option>
          </select>
        </div>

        {/* メモ */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            ひとことメモ
          </label>
          <textarea
            value={entry.memo}
            onChange={(e) => setEntry({ ...entry, memo: e.target.value })}
            placeholder="感想や視聴メモなどを自由に入力..."
            className="w-full p-3 border border-slate-200 rounded-xl min-h-[100px] focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* アフィリエイト (Amazon自動生成) - 新規登録/表示時に自動表示 */}
        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl space-y-2">
          <label className="block text-sm font-bold text-orange-800 flex items-center gap-2">
            <ShoppingCart size={16} />
            Amazonアフィリエイト連携
          </label>
          <p className="text-xs text-orange-700 leading-relaxed">
            登録済みのアフィリエイトIDを使用して、Amazon検索リンクを自動生成します。
          </p>
          <div className="flex items-center gap-2 bg-white p-2 rounded border border-orange-200">
            <span className="text-xs font-mono text-slate-500 flex-1 truncate select-all">
              {generateAmazonLink(work.title)}
            </span>
            <a
              href={generateAmazonLink(work.title)}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-bold hover:bg-orange-200 flex-shrink-0"
            >
              リンク確認
            </a>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
            <Info size={14} className="mt-0.5 text-indigo-500 flex-shrink-0" />
            登録内容はユーザープロフィールと連動しています。公開設定に基づいて他のユーザーに表示される場合があります。
          </div>
          <button
            onClick={onSave}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            <Save size={20} />
            登録する
          </button>
        </div>
      </div>
    </div>
  );
}

// --- サブコンポーネント: 作品カード ---

function WorkCard({ work, onClick, source }: any) {
  const isAi = source === "ai";

  return (
    <div
      onClick={onClick}
      className={`group flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
        isAi
          ? "bg-indigo-50/30 border-indigo-100 hover:border-indigo-300"
          : "bg-white border-slate-100 hover:border-slate-300"
      }`}
    >
      {/* サムネイルプレースホルダー */}
      <div
        className={`w-16 h-20 rounded-lg flex-shrink-0 flex items-center justify-center ${isAi ? "bg-indigo-100 text-indigo-300" : "bg-slate-200 text-slate-400"}`}
      >
        <BookOpen size={24} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <h4 className="font-bold text-slate-800 truncate pr-2 group-hover:text-indigo-700 transition-colors">
            {work.title}
          </h4>
          {isAi && (
            <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full flex-shrink-0">
              New
            </span>
          )}
        </div>

        <p className="text-sm text-slate-500 truncate">{work.author}</p>

        <p className="text-xs text-slate-400 mt-2 line-clamp-2">
          {work.summary}
        </p>
      </div>

      <div className="self-center">
        <button className="p-2 rounded-full text-indigo-600 hover:bg-indigo-50 transition-colors">
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-white">
      <div className="w-16 h-20 bg-slate-100 rounded-lg animate-pulse" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse" />
        <div className="h-10 bg-slate-100 rounded w-full mt-2 animate-pulse" />
      </div>
    </div>
  );
}
