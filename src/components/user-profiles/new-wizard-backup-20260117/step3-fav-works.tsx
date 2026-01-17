import { Heart, Star, Trash2, Plus, Search } from "lucide-react";
import React, { useState } from "react";
import { WORK_CATEGORIES, GENRE_MAP } from "./constants";
import { FavWorkItem } from "./types";

// Mock data for registered work list
const REGISTERED_WORKS = [
  // 漫画
  { title: "SLAM DUNK", category: "漫画", genres: ["スポーツ", "学園"] },
  { title: "バガボンド", category: "漫画", genres: ["時代劇", "アクション"] },
  { title: "MONSTER", category: "漫画", genres: ["サスペンス", "ミステリー"] },
  { title: "20世紀少年", category: "漫画", genres: ["SF", "サスペンス"] },
  {
    title: "ジョジョの奇妙な冒険",
    category: "漫画",
    genres: ["アクション", "ファンタジー"],
  },
  { title: "3月のライオン", category: "漫画", genres: ["将棋", "ドラマ"] },
  { title: "ハチミツとクローバー", category: "漫画", genres: ["恋愛", "芸大"] },
  {
    title: "HUNTER×HUNTER",
    category: "漫画",
    genres: ["冒険", "ファンタジー"],
  },
  { title: "幽☆遊☆白書", category: "漫画", genres: ["アクション", "オカルト"] },
  {
    title: "ONE PIECE",
    category: "漫画",
    genres: ["少年漫画", "アクション", "ファンタジー"],
  },
  {
    title: "NARUTO -ナルト-",
    category: "漫画",
    genres: ["少年漫画", "アクション", "ファンタジー"],
  },
  {
    title: "BLEACH",
    category: "漫画",
    genres: ["少年漫画", "アクション", "ファンタジー"],
  },
  {
    title: "DRAGON BALL",
    category: "漫画",
    genres: ["少年漫画", "アクション", "ファンタジー"],
  },
  {
    title: "るろうに剣心 -明治剣客浪漫譚-",
    category: "漫画",
    genres: ["少年漫画", "アクション", "歴史"],
  },
  {
    title: "DEATH NOTE",
    category: "漫画",
    genres: ["少年漫画", "サスペンス", "ファンタジー"],
  },
  {
    title: "バクマン。",
    category: "漫画",
    genres: ["少年漫画", "青春", "ドラマ"],
  },
  {
    title: "ハイキュー!!",
    category: "漫画",
    genres: ["少年漫画", "スポーツ", "青春"],
  },
  {
    title: "僕のヒーローアカデミア",
    category: "漫画",
    genres: ["少年漫画", "アクション", "学園"],
  },
  {
    title: "ブラッククローバー",
    category: "漫画",
    genres: ["少年漫画", "アクション", "ファンタジー"],
  },
  {
    title: "ワールドトリガー",
    category: "漫画",
    genres: ["少年漫画", "アクション", "SF"],
  },
  {
    title: "キングダム",
    category: "漫画",
    genres: ["青年漫画", "アクション", "歴史"],
  },
  {
    title: "ゴールデンカムイ",
    category: "漫画",
    genres: ["青年漫画", "アドベンチャー", "歴史"],
  },
  {
    title: "月刊少女野崎くん",
    category: "漫画",
    genres: ["少女漫画", "ギャグ", "日常"],
  },
  { title: "よつばと！", category: "漫画", genres: ["日常", "コメディ"] },

  // アニメ
  {
    title: "ヴァイオレット・エヴァーガーデン",
    category: "アニメ",
    genres: ["ドラマ", "ファンタジー"],
  },
  {
    title: "響け！ユーフォニアム",
    category: "アニメ",
    genres: ["音楽", "学園"],
  },
  {
    title: "千と千尋の神隠し",
    category: "アニメ",
    genres: ["ファンタジー", "冒険"],
  },
  {
    title: "となりのトトロ",
    category: "アニメ",
    genres: ["ファンタジー", "ファミリー"],
  },
  { title: "君の名は。", category: "アニメ", genres: ["恋愛", "SF"] },
  { title: "天気の子", category: "アニメ", genres: ["ドラマ", "ファンタジー"] },
  { title: "パプリカ", category: "アニメ", genres: ["SF", "ミステリー"] },
  { title: "四畳半神話大系", category: "アニメ", genres: ["コメディ", "日常"] },
  {
    title: "新世紀エヴァンゲリオン",
    category: "アニメ",
    genres: ["SF", "メカ"],
  },
  { title: "鬼滅の刃", category: "アニメ", genres: ["アクション", "時代劇"] },
  {
    title: "呪術廻戦",
    category: "アニメ",
    genres: ["アクション", "ダーク・ファンタジー"],
  },
  {
    title: "鋼の錬金術師 FULLMETAL ALCHEMIST",
    category: "アニメ",
    genres: ["アクション", "ファンタジー"],
  },
  {
    title: "進撃の巨人",
    category: "アニメ",
    genres: ["アクション", "ファンタジー", "ホラー"],
  },
  {
    title: "魔法少女まどか☆マギカ",
    category: "アニメ",
    genres: ["ファンタジー", "サスペンス", "ドラマ"],
  },
  {
    title: "STEINS;GATE",
    category: "アニメ",
    genres: ["SF", "サスペンス", "アドベンチャー"],
  },
  {
    title: "コードギアス 反逆のルルーシュ",
    category: "アニメ",
    genres: ["SF", "アクション", "学園"],
  },
  {
    title: "攻殻機動隊 STAND ALONE COMPLEX",
    category: "アニメ",
    genres: ["SF", "ミリタリー", "アクション"],
  },
  {
    title: "Fate/Zero",
    category: "アニメ",
    genres: ["アクション", "ファンタジー", "ドラマ"],
  },
  {
    title: "化物語",
    category: "アニメ",
    genres: ["青春", "ファンタジー", "コメディ"],
  },
  {
    title: "涼宮ハルヒの憂鬱",
    category: "アニメ",
    genres: ["学園", "SF", "コメディ"],
  },
  {
    title: "チェンソーマン",
    category: "アニメ",
    genres: ["アクション", "ホラー", "ファンタジー"],
  },
  {
    title: "SPY×FAMILY",
    category: "アニメ",
    genres: ["アクション", "コメディ", "日常"],
  },
  {
    title: "【推しの子】",
    category: "アニメ",
    genres: ["ドラマ", "ミステリー", "音楽"],
  },
  {
    title: "葬送のフリーレン",
    category: "アニメ",
    genres: ["ファンタジー", "冒険", "ドラマ"],
  },
  {
    title: "薬屋のひとりごと",
    category: "アニメ",
    genres: ["ミステリー", "歴史", "ドラマ"],
  },
  {
    title: "ぼっち・ざ・ろっく！",
    category: "アニメ",
    genres: ["音楽", "コメディ", "日常"],
  },
  {
    title: "リコリス・リコイル",
    category: "アニメ",
    genres: ["アクション", "日常"],
  },
  {
    title: "四月は君の嘘",
    category: "アニメ",
    genres: ["音楽", "青春", "ドラマ"],
  },
  { title: "宇宙よりも遠い場所", category: "アニメ", genres: ["青春", "日常"] },
  { title: "SHIROBAKO", category: "アニメ", genres: ["ドラマ", "日常"] },
  {
    title: "Angel Beats!",
    category: "アニメ",
    genres: ["青春", "アクション", "ファンタジー"],
  },
  {
    title: "ソードアート・オンライン",
    category: "アニメ",
    genres: ["アクション", "ファンタジー", "SF"],
  },
  {
    title: "Re:ゼロから始める異世界生活",
    category: "アニメ",
    genres: ["ファンタジー", "ミステリー", "アクション"],
  },
  {
    title: "この素晴らしい世界に祝福を！",
    category: "アニメ",
    genres: ["コメディ", "ファンタジー", "冒険"],
  },
  {
    title: "オーバーロード",
    category: "アニメ",
    genres: ["ファンタジー", "アクション"],
  },
  {
    title: "転生したらスライムだった件",
    category: "アニメ",
    genres: ["ファンタジー", "アクション"],
  },
  {
    title: "無職転生 ～異世界行ったら本気だす～",
    category: "アニメ",
    genres: ["ファンタジー", "冒険", "青春"],
  },
  { title: "氷菓", category: "アニメ", genres: ["ミステリー", "学園", "日常"] },
  {
    title: "PSYCHO-PASS サイコパス",
    category: "アニメ",
    genres: ["SF", "アクション", "サスペンス"],
  },
  {
    title: "天元突破グレンラガン",
    category: "アニメ",
    genres: ["SF", "アクション"],
  },
  { title: "キルラキル", category: "アニメ", genres: ["アクション", "学園"] },
  { title: "けいおん！", category: "アニメ", genres: ["音楽", "日常", "学園"] },
  { title: "ゆるキャン△", category: "アニメ", genres: ["日常", "学園"] },
  {
    title: "映像研には手を出すな！",
    category: "アニメ",
    genres: ["日常", "学園"],
  },
  {
    title: "オッドタクシー",
    category: "アニメ",
    genres: ["ミステリー", "日常"],
  },
  {
    title: "サマータイムレンダ",
    category: "アニメ",
    genres: ["SF", "ミステリー", "サスペンス"],
  },
  {
    title: "86―エイティシックス―",
    category: "アニメ",
    genres: ["SF", "アクション", "ドラマ"],
  },
  {
    title: "Vivy -Fluorite Eye's Song-",
    category: "アニメ",
    genres: ["SF", "音楽", "アクション"],
  },
  {
    title: "モブサイコ100",
    category: "アニメ",
    genres: ["アクション", "青春", "コメディ"],
  },
  {
    title: "ワンパンマン",
    category: "アニメ",
    genres: ["アクション", "コメディ"],
  },
  {
    title: "メイドインアビス",
    category: "アニメ",
    genres: ["ファンタジー", "SF", "アドベンチャー"],
  },
  {
    title: "約束のネバーランド",
    category: "アニメ",
    genres: ["SF", "ホラー", "ミステリー"],
  },
  {
    title: "カウボーイビバップ",
    category: "アニメ",
    genres: ["SF", "アクション"],
  },
  {
    title: "ピンポン THE ANIMATION",
    category: "アニメ",
    genres: ["スポーツ", "青春"],
  },
];

interface Step3FavWorksProps {
  favWorks: FavWorkItem[];
  addFavWork: (
    isManual: boolean,
    data: {
      category: string;
      selectedTitle: string;
      title: string;
      genres?: string[];
    }
  ) => void;
  toggleBestWork: (id: number) => void;
  removeFavWork: (id: number) => void;
}

const ALLOWED_CATEGORIES = ["漫画", "アニメ"] as const;
type AllowedCategory = (typeof ALLOWED_CATEGORIES)[number];

export const Step3FavWorks: React.FC<Step3FavWorksProps> = ({
  favWorks,
  addFavWork,
  toggleBestWork,
  removeFavWork,
}) => {
  const [manualTitle, setManualTitle] = useState("");
  // Filter WORK_CATEGORIES to only include "漫画" and "アニメ"
  const allowedManualCategories = (
    WORK_CATEGORIES as unknown as string[]
  ).filter((c): c is AllowedCategory =>
    (ALLOWED_CATEGORIES as unknown as string[]).includes(c)
  );
  const [manualCategory, setManualCategory] = useState<AllowedCategory>(
    allowedManualCategories[0] || "漫画"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [mainTab, setMainTab] = useState<"すべて" | "アニメ" | "漫画">(
    "すべて"
  );
  const [selectedTag, setSelectedTag] = useState<string>("すべて");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  const handleManualAdd = () => {
    if (!manualTitle) return;
    addFavWork(true, {
      category: manualCategory,
      selectedTitle: "",
      title: manualTitle,
    });
    setManualTitle("");
  };

  const handleSelectAdd = (work: {
    title: string;
    category: string;
    genres?: string[];
  }) => {
    if (favWorks.some((f) => f.title === work.title)) return;
    addFavWork(false, {
      category: work.category,
      selectedTitle: work.title,
      title: "",
      genres: work.genres,
    });
  };

  const filteredRegisteredWorks = REGISTERED_WORKS.filter((w) => {
    // 1. Tab filter (Scope)
    const isInScope = mainTab === "すべて" || mainTab === w.category;

    if (!isInScope) return false;

    // 2. Search filter
    const matchesSearch =
      w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.category.includes(searchTerm);

    // 3. Tag filter
    let matchesTag = false;
    if (selectedTag === "すべて") {
      matchesTag = true;
    } else if (
      (ALLOWED_CATEGORIES as unknown as string[]).includes(selectedTag)
    ) {
      // It's a category tag
      matchesTag = w.category === selectedTag;
    } else {
      // It's a genre tag
      matchesTag = w.genres?.includes(selectedTag) || false;
    }

    const notSelected = !favWorks.some((f) => f.title === w.title);
    return matchesSearch && matchesTag && notSelected;
  });

  const totalPages = Math.ceil(filteredRegisteredWorks.length / ITEMS_PER_PAGE);

  // Reset current page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [mainTab, searchTerm, selectedTag]);

  // Reset tag when tab changes
  React.useEffect(() => {
    setSelectedTag("すべて");
  }, [mainTab]);

  // Adjust current page if it becomes out of bounds due to items being selected
  React.useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedWorks = filteredRegisteredWorks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const availableTags = React.useMemo(() => {
    const tags = ["すべて"];
    if (mainTab === "すべて") {
      tags.push("アニメ", "漫画");
    } else if (mainTab === "アニメ") {
      tags.push("アニメ", ...(GENRE_MAP["アニメ"] || []));
    } else if (mainTab === "漫画") {
      tags.push("漫画", ...(GENRE_MAP["漫画"] || []));
    }
    return tags;
  }, [mainTab]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex items-center gap-3">
        <div className="bg-pink-100 p-2 rounded-lg">
          <Heart className="w-6 h-6 text-pink-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">好きな作品の登録</h2>
      </div>
      <p className="text-slate-500 text-sm -mt-4 leading-relaxed">
        <span className="hidden lg:inline">右側の候補リスト</span>
        <span className="lg:hidden">下側の候補リスト</span>
        から作品を選んで、あなたの「好き」を
        <span className="hidden lg:inline">左側の</span>
        リストに集めてください。
      </p>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
        {/* LEFT: Selected List & Manual Input */}
        <div className="lg:col-span-7 flex flex-col gap-6 overflow-y-auto pr-2">
          {/* Manual Input */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-600 mb-3">
              右のリストにない場合は手動で追加してください。
            </h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                aria-label="作品カテゴリ"
                className="p-2 border border-slate-300 rounded-lg bg-slate-50 text-sm"
                value={manualCategory}
                onChange={(e) =>
                  setManualCategory(e.target.value as AllowedCategory)
                }
              >
                {allowedManualCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="text"
                aria-label="作品タイトル"
                placeholder="作品タイトル"
                className="flex-1 p-2 border border-slate-300 rounded-lg text-sm"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleManualAdd()}
              />
              <button
                onClick={handleManualAdd}
                disabled={!manualTitle}
                className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 disabled:opacity-50 transition-colors"
              >
                追加
              </button>
            </div>
          </div>

          {/* Selected List */}
          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-bold text-slate-600 flex items-center gap-2">
                登録済みリスト
                <span className="bg-slate-100 text-slate-400 text-[10px] px-2 py-0.5 rounded-full">
                  {favWorks.length}
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 leading-tight">
                絶対相対評価のため、リストの中から
                <span className="text-pink-500 font-bold">
                  「特に好きな作品（Tier1）」
                </span>
                を星（★）で選んでください。
              </p>
            </div>
            {favWorks.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border-2 border-slate-100 border-dashed text-slate-400 shadow-inner group">
                <div className="relative mb-4">
                  <Heart className="w-12 h-12 mx-auto text-pink-100 group-hover:text-pink-200 transition-colors animate-pulse" />
                  <Heart className="w-6 h-6 absolute top-0 right-1/2 translate-x-6 text-pink-200 opacity-50" />
                </div>
                <p className="font-bold text-slate-600 mb-1">
                  あなたの「好き」をここに集めましょう
                </p>
                <p className="text-xs text-slate-400">
                  <span className="hidden lg:inline">右側</span>
                  <span className="lg:hidden">下側</span>
                  の候補リストにある作品の「＋」ボタンを押して追加してください
                </p>
              </div>
            )}
            <div className="space-y-2">
              {favWorks.map((work) => (
                <div
                  key={work.id}
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm transition-all hover:border-pink-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 uppercase tracking-wider">
                          {work.category}
                        </span>
                        <span className="font-bold text-slate-700 tracking-tight">
                          {work.title}
                        </span>
                      </div>
                      {work.genres && work.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {work.genres.map((g) => (
                            <span
                              key={g}
                              className="text-[9px] text-slate-400 bg-slate-50 px-1 rounded-sm"
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBestWork(work.id)}
                      className={`p-2 rounded-lg transition-all ${work.isBest ? "text-yellow-500 bg-yellow-50 shadow-inner" : "text-slate-300 hover:text-yellow-400 hover:bg-slate-50"}`}
                      aria-label={
                        work.isBest
                          ? "Tier1から外す"
                          : "Tier1（最も好きな作品）に設定"
                      }
                      title={
                        work.isBest
                          ? "Tier1から外す"
                          : "Tier1（最も好きな作品）に設定"
                      }
                    >
                      <Star
                        className={`w-5 h-5 ${work.isBest ? "fill-current" : ""}`}
                      />
                    </button>
                    <button
                      onClick={() => removeFavWork(work.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="削除"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-4 min-h-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-6 bg-pink-500 rounded-full" />
            <h3 className="font-bold text-slate-700">
              作品を探す（ここから選択）
            </h3>
          </div>
          <div className="flex flex-col gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="候補から検索..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Main Tabs */}
            <div className="flex bg-white p-1 rounded-lg border border-slate-200">
              {["すべて", "アニメ", "漫画"].map((tab) => (
                <button
                  key={tab}
                  data-testid={`tab-${tab}`}
                  onClick={() => setMainTab(tab as any)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${mainTab === tab ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tag Chips (Filtering) */}
            {availableTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 scroll-smooth max-h-32 overflow-y-auto pr-1">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    data-testid={`tag-${tag}`}
                    className={`px-3 py-1 text-xs font-bold rounded-full border transition-all ${selectedTag === tag ? "bg-pink-600 border-pink-600 text-white shadow-sm" : "bg-white border-slate-200 text-slate-500 hover:border-pink-300 hover:text-pink-600"}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Registered Works List */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-2 min-h-0">
            {paginatedWorks.map((work) => (
              <button
                key={work.title}
                onClick={() => handleSelectAdd(work)}
                className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 hover:border-pink-300 hover:shadow-md transition-all group text-left"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-slate-700 group-hover:text-pink-600 transition-colors">
                    {work.title}
                  </span>
                  {work.genres && (
                    <div className="flex flex-wrap gap-1">
                      {work.genres.slice(0, 3).map((g) => (
                        <span key={g} className="text-[9px] text-slate-400">
                          {g}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full group-hover:bg-pink-100 group-hover:text-pink-600 transition-colors">
                    {work.category}
                  </span>
                  <div className="bg-slate-100 p-1.5 rounded-full group-hover:bg-pink-500 group-hover:text-white transition-all transform group-hover:rotate-90">
                    <Plus className="w-3 h-3" />
                  </div>
                </div>
              </button>
            ))}

            {filteredRegisteredWorks.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center gap-3">
                <div className="p-4 bg-slate-100 rounded-full">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-sm font-bold text-slate-400">
                  条件に一致する作品が見つかりません
                </p>
                <p className="text-xs text-slate-300">
                  検索ワードを変えるか、左側から手動で追加してください
                </p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)]">
              <button
                onClick={() =>
                  setCurrentPage((p: number) => Math.max(1, p - 1))
                }
                disabled={currentPage === 1}
                className="px-4 py-2 text-xs font-black text-slate-400 hover:text-pink-600 disabled:opacity-20 transition-all active:scale-95"
              >
                ← 前のページ
              </button>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-x border-slate-100 px-6">
                {currentPage} <span className="text-slate-200">/</span>{" "}
                {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p: number) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-xs font-black text-slate-400 hover:text-pink-600 disabled:opacity-20 transition-all active:scale-95"
              >
                次のページ →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
