import { Heart, Star, Trash2, Plus, Search } from "lucide-react";
import React, { useState } from "react";
import { WORK_CATEGORIES, GENRE_MAP } from "./constants";
import { FavWorkItem } from "./types";

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

// Mock data for registered work list
const REGISTERED_WORKS = [
  // アニメ (50)
  {
    title: "新世紀エヴァンゲリオン",
    category: "アニメ",
    genres: ["SF", "アクション", "メンタル"],
  },
  {
    title: "鋼の錬金術師 FULLMETAL ALCHEMIST",
    category: "アニメ",
    genres: ["アクション", "ファンタジー", "ドラマ"],
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
    title: "呪術廻戦",
    category: "アニメ",
    genres: ["アクション", "ファンタジー", "ホラー"],
  },
  {
    title: "鬼滅の刃",
    category: "アニメ",
    genres: ["アクション", "ファンタジー", "歴史"],
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
    title: "ヴァイオレット・エヴァーガーデン",
    category: "アニメ",
    genres: ["ドラマ", "青春"],
  },
  {
    title: "あの日見た花の名前を僕達はまだ知らない。",
    category: "アニメ",
    genres: ["日常", "青春", "ファンタジー"],
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
  {
    title: "響け！ユーフォニアム",
    category: "アニメ",
    genres: ["音楽", "学園", "青春"],
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
  {
    title: "天元突破グレンラガン",
    category: "アニメ",
    genres: ["SF", "アクション"],
  },

  // 漫画 (50)
  {
    title: "ONE PIECE",
    category: "漫画",
    genres: ["少年漫画", "アクション", "ファンタジー"],
  },
  {
    title: "HUNTER×HUNTER",
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
    title: "ジョジョの奇妙な冒険",
    category: "漫画",
    genres: ["少年漫画", "アクション", "超常能力"],
  },
  {
    title: "SLAM DUNK",
    category: "漫画",
    genres: ["少年漫画", "スポーツ", "学園"],
  },
  {
    title: "幽☆遊☆白書",
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
    title: "鋼の錬金術師",
    category: "漫画",
    genres: ["少年漫画", "アクション", "ファンタジー"],
  },
  { title: "銀魂", category: "漫画", genres: ["少年漫画", "ギャグ", "時代劇"] },
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
  {
    title: "3月のライオン",
    category: "漫画",
    genres: ["青年漫画", "ドラマ", "将棋"],
  },
  {
    title: "ハチミツとクローバー",
    category: "漫画",
    genres: ["少女漫画", "青春", "ドラマ"],
  },
  {
    title: "ちはやふる",
    category: "漫画",
    genres: ["少女漫画", "スポーツ", "学園"],
  },
  { title: "宇宙兄弟", category: "漫画", genres: ["青年漫画", "SF", "ドラマ"] },
  {
    title: "リアル",
    category: "漫画",
    genres: ["青年漫画", "スポーツ", "ドラマ"],
  },
  {
    title: "バガボンド",
    category: "漫画",
    genres: ["青年漫画", "アクション", "歴史"],
  },
  {
    title: "ヴィンランド・サガ",
    category: "漫画",
    genres: ["青年漫画", "アクション", "歴史"],
  },
  {
    title: "ベルセルク",
    category: "漫画",
    genres: ["青年漫画", "アクション", "ファンタジー"],
  },
  {
    title: "MONSTER",
    category: "漫画",
    genres: ["青年漫画", "サスペンス", "ドラマ"],
  },
  {
    title: "20世紀少年",
    category: "漫画",
    genres: ["青年漫画", "SF", "サスペンス"],
  },
  {
    title: "おやすみプンプン",
    category: "漫画",
    genres: ["青年漫画", "ドラマ"],
  },
  {
    title: "宝石の国",
    category: "漫画",
    genres: ["青年漫画", "アクション", "ファンタジー"],
  },
  {
    title: "ブルーピリオド",
    category: "漫画",
    genres: ["青年漫画", "学園", "ドラマ"],
  },
  {
    title: "アオアシ",
    category: "漫画",
    genres: ["青年漫画", "スポーツ", "青春"],
  },
  {
    title: "ブルーロック",
    category: "漫画",
    genres: ["少年漫画", "スポーツ", "アクション"],
  },
  {
    title: "チ。―地球の運動について―",
    category: "漫画",
    genres: ["青年漫画", "歴史", "ドラマ"],
  },
  { title: "ルックバック", category: "漫画", genres: ["ドラマ", "青春"] },
  {
    title: "スキップとローファー",
    category: "漫画",
    genres: ["青年漫画", "日常", "学園"],
  },
  {
    title: "違国日記",
    category: "漫画",
    genres: ["女性漫画", "日常", "ドラマ"],
  },
  {
    title: "その着せ替え人形は恋をする",
    category: "漫画",
    genres: ["青年漫画", "恋愛", "日常"],
  },
  {
    title: "古見さんは、コミュ症です。",
    category: "漫画",
    genres: ["少年漫画", "学園", "コメディ"],
  },
  {
    title: "かぐや様は告らせたい",
    category: "漫画",
    genres: ["青年漫画", "恋愛", "学園"],
  },
  {
    title: "五等分の花嫁",
    category: "漫画",
    genres: ["少年漫画", "恋愛", "学園"],
  },
  {
    title: "僕の心のヤバイやつ",
    category: "漫画",
    genres: ["少年漫画", "恋愛", "学園"],
  },
  {
    title: "正反対な君と僕",
    category: "漫画",
    genres: ["少年漫画", "恋愛", "学園"],
  },
  {
    title: "ダンダダン",
    category: "漫画",
    genres: ["少年漫画", "アクション", "オカルト"],
  },
  {
    title: "怪獣8号",
    category: "漫画",
    genres: ["少年漫画", "アクション", "SF"],
  },
  {
    title: "あかね噺",
    category: "漫画",
    genres: ["少年漫画", "ドラマ", "落語"],
  },
];

export const Step3FavWorks: React.FC<Step3FavWorksProps> = ({
  favWorks,
  addFavWork,
  toggleBestWork,
  removeFavWork,
}) => {
  const [manualTitle, setManualTitle] = useState("");
  const [manualCategory, setManualCategory] = useState(
    WORK_CATEGORIES[0] as string
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "すべて" | "アニメ" | "漫画"
  >("すべて");
  const [selectedGenre, setSelectedGenre] = useState<string>("すべて");
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

  // Reset filters when category changes
  React.useEffect(() => {
    setSelectedGenre("すべて");
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  const filteredRegisteredWorks = REGISTERED_WORKS.filter((w) => {
    const matchesSearch =
      w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.category.includes(searchTerm);
    const matchesCategory =
      selectedCategory === "すべて" || w.category === selectedCategory;
    const matchesGenre =
      selectedGenre === "すべて" ||
      (w.genres && w.genres.includes(selectedGenre));
    const notSelected = !favWorks.some((f) => f.title === w.title);
    return matchesSearch && matchesCategory && matchesGenre && notSelected;
  });

  const totalPages = Math.ceil(filteredRegisteredWorks.length / ITEMS_PER_PAGE);
  const paginatedWorks = filteredRegisteredWorks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const availableGenres =
    selectedCategory !== "すべて" ? GENRE_MAP[selectedCategory] : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex items-center gap-3">
        <div className="bg-pink-100 p-2 rounded-lg">
          <Heart className="w-6 h-6 text-pink-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">好きな作品の登録</h2>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
        {/* LEFT: Selected List & Manual Input */}
        <div className="lg:col-span-7 flex flex-col gap-6 overflow-y-auto pr-2">
          {/* Manual Input */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-600 mb-3">
              ない場合は手動で追加
            </h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                className="p-2 border border-slate-300 rounded-lg bg-slate-50 text-sm"
                value={manualCategory}
                onChange={(e) => setManualCategory(e.target.value)}
              >
                {["漫画", "アニメ"].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="text"
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
            <h3 className="text-sm font-bold text-slate-600 flex items-center gap-2">
              登録済みリスト
              <span className="bg-slate-100 text-slate-400 text-[10px] px-2 py-0.5 rounded-full">
                {favWorks.length}
              </span>
            </h3>
            {favWorks.length === 0 && (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed text-slate-400 text-sm">
                <Heart className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p>右のリストから選ぶか、手動で追加してください</p>
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
                      className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${work.isBest ? "bg-yellow-100 text-yellow-700 shadow-sm" : "text-slate-400 hover:text-yellow-500 bg-slate-50 hover:bg-yellow-50/50"}`}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${work.isBest ? "fill-yellow-500" : ""}`}
                      />
                      {work.isBest ? "Best" : "Set Best"}
                    </button>
                    <button
                      onClick={() => removeFavWork(work.id)}
                      className="text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Search & Pick List */}
        <div className="lg:col-span-5 flex flex-col bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden h-[600px] lg:h-auto shadow-inner">
          <div className="p-5 bg-white border-b border-slate-200 space-y-4">
            {/* Category Tabs (Larger) */}
            <div className="flex gap-1.5 p-1.5 bg-slate-100 rounded-xl">
              {(["すべて", "アニメ", "漫画"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-1 py-2.5 px-3 text-sm font-bold rounded-lg transition-all ${selectedCategory === cat ? "bg-white text-pink-600 shadow-md transform scale-[1.02]" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Genre Chips (Filtering) */}
            {availableGenres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 scroll-smooth max-h-32 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedGenre("すべて")}
                  className={`px-3 py-1 text-xs font-bold rounded-full border transition-all ${selectedGenre === "すべて" ? "bg-pink-600 border-pink-600 text-white" : "bg-white border-slate-200 text-slate-500 hover:border-pink-300 hover:text-pink-600"}`}
                >
                  すべて
                </button>
                {availableGenres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-3 py-1 text-xs font-bold rounded-full border transition-all ${selectedGenre === genre ? "bg-pink-600 border-pink-600 text-white shadow-sm" : "bg-white border-slate-200 text-slate-500 hover:border-pink-300 hover:text-pink-600"}`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            )}

            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="登録済み作品を検索..."
                className="w-full pl-10 p-2.5 border border-slate-300 rounded-xl text-sm bg-slate-50 focus:bg-white transition-all outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() =>
                    setCurrentPage((p: number) => Math.max(1, p - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-[11px] font-black text-slate-400 hover:text-pink-600 disabled:opacity-20 transition-colors uppercase tracking-widest"
                >
                  Prev
                </button>
                <span className="text-[11px] font-black text-pink-600/50 bg-pink-50 px-3 py-1 rounded-full uppercase tracking-widest">
                  Page {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p: number) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-[11px] font-black text-slate-400 hover:text-pink-600 disabled:opacity-20 transition-colors uppercase tracking-widest"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 bg-slate-50/50">
            {paginatedWorks.map((work, idx) => (
              <button
                key={`${work.title}-${idx}`}
                onClick={() => handleSelectAdd(work)}
                className="w-full flex items-center justify-between p-3.5 bg-white hover:shadow-md hover:ring-2 hover:ring-pink-100 rounded-xl group transition-all text-left border border-slate-100"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-slate-700 font-bold group-hover:text-pink-600 tracking-tight">
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
