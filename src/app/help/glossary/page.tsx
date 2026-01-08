"use client";

import {
  ArrowLeft,
  BookOpen,
  Quote,
  Sparkles,
  ShieldCheck,
  Globe,
  Users,
  Search,
  Zap,
  Heart,
  Briefcase,
  GraduationCap,
  MapPin,
  Scale,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const CATEGORIES = [
  { id: "all", label: "すべて", icon: BookOpen },
  { id: "concept", label: "理念・基本", icon: Sparkles },
  { id: "community", label: "関係・組織", icon: Users },
  { id: "system", label: "システム・評価", icon: Zap },
  { id: "security", label: "安全・アカウント", icon: ShieldCheck },
  { id: "work", label: "働き方", icon: Briefcase },
] as const;

const GLOSSARY_ITEMS = [
  // --- 理念・基本 ---
  {
    id: "vns",
    term: "VNS (Value Network Service)",
    category: "concept",
    categoryLabel: "理念・基本",
    description:
      "価値観でつながる新しいネットワークサービス。SNSが社会的なつながりを重視するのに対し、VNSは個人の価値観を尊重し、同じ価値観を持つ人同士のつながりを支援します。",
  },
  {
    id: "masakinihirota",
    term: "masakinihirota (真っ先に拾った)",
    category: "concept",
    categoryLabel: "理念・基本",
    description:
      "本サービスの名称。「インターネットという情報の洪水の中から真っ先に価値のあるものを拾い上げる」というコンセプトを表しています。",
  },
  {
    id: "honesty",
    term: "正直宣言",
    category: "concept",
    categoryLabel: "理念・基本",
    description:
      "できるだけ正直に行動する考え方。自分に対しても他者に対しても誠実であることを目指します。",
    details: [
      "「私は、正直に生きていくよう努力します」という誓い。",
      "ポイントや評価のために自分の心を偽らないことを重視します。",
    ],
  },
  {
    id: "creator-first",
    term: "クリエイターファースト",
    category: "concept",
    categoryLabel: "理念・基本",
    description:
      "創作活動を行うクリエイターを最優先に考え、その権利と活動環境を重視する考え方です。",
  },
  {
    id: "user-driven",
    term: "ユーザー主導",
    category: "concept",
    categoryLabel: "理念・基本",
    description:
      "プラットフォームではなく、ユーザー自身が管理権限（広告表示の制御など）を持ち、主導権を握る設計思想。",
  },
  {
    id: "syu-yu-kon",
    term: "職遊婚一体",
    category: "concept",
    categoryLabel: "理念・基本",
    description:
      "働くこと（職）、遊ぶこと（遊）、そして人生を共にすること（婚）をバラバラにせず、一つの価値観のネットワークの中でシームレスにつなげる思想。VNSが目指す究極のライフスタイルです。",
  },
  {
    id: "fair-use",
    term: "フェアユース",
    category: "concept",
    categoryLabel: "理念・基本",
    description:
      "批評、報道、教育、研究などの目的で、著作権者の許可なく著作物を利用しても著作権侵害にならないとする例外規定。コンテンツの健全な流通と発展を支えます。",
  },
  {
    id: "oasis",
    term: "オアシス宣言",
    category: "concept",
    categoryLabel: "理念・基本",
    description:
      "本サービスにおける基本理念。誹謗中傷のない、安心・安全なインターネット上の「オアシス」を目指す宣言です。",
    motto:
      "褒めるときは大きな声でみんなの前で、叱るときは二人きりで小さな声で。",
    details: [
      "インターネット上で翼を休める場所、砂漠の中で命の水を授かる場所を作ります。",
      "共通の価値観を持った人々のオアシスという場所を作ります。",
      "きれいな世界、優しい世界を守り、広めます。",
    ],
  },
  {
    id: "human",
    term: "人間宣言",
    category: "concept",
    categoryLabel: "理念・基本",
    description:
      "人は完璧ではなく間違いを犯す生き物であり、そこから立ち直り再挑戦することができるという考え方。包容力を持って見守り、成長を促す環境を目指します。",
  },
  {
    id: "schrodinger-cat",
    term: "シュレディンガーの猫主義",
    category: "concept",
    categoryLabel: "理念・基本",
    description:
      "複数の価値観が同時に存在することを表す考え方。矛盾する複数の世界が衝突せずに並立でき、「あなたが観測したものが、あなたの世界になる」というVNSの核心的な仕組みです。",
    details: [
      "観測する（その世界を訪れる）まで状態が確定せず、矛盾する世界が並立できます。",
      "フィルタリングにより、お互いの世界が干渉し合わない（デコヒーレンス）状態を作ります。",
      "「世界がどうあるか」ではなく、「ユーザーが世界をどう信じているか」によって現実が確定します。",
      "他人の違う価値観も尊重し、不毛な衝突（対消滅）を回避しながら共生します。",
    ],
  },

  // --- 関係・組織 ---
  {
    id: "thousand-masks",
    term: "千の仮面 (Thousand Masks)",
    category: "community",
    categoryLabel: "関係・組織",
    description:
      "1つのアカウントから複数の「プロフィール（仮面）」を作成できる機能。仕事、遊び、趣味など、目的ごとに仮面を使い分けることで文脈に合わせたマッチングを行います。",
  },
  {
    id: "partner",
    term: "パートナー",
    category: "community",
    categoryLabel: "関係・組織",
    description:
      "相互承認によって結ばれる正式な関係。「どの仮面で繋がっているか」によってその意味が定義されます。",
    details: [
      "仕事用仮面：ビジネスパートナー、共同創業者、相棒。",
      "趣味用仮面：固定パーティ、相方。",
      "婚活用/家族用仮面：人生の伴侶（婚約者、配偶者）。",
      "排他制御：婚活・家族の文脈では1対1のみ（排他）。成立時、他のプレパートナーは自動解除されます。",
    ],
  },
  {
    id: "pre-partner",
    term: "プレパートナー",
    category: "community",
    categoryLabel: "関係・組織",
    description:
      "相互フォロー状態で、価値観をすり合わせる「お試し期間（仮交際）」にある候補者。仮面ごとに独立して複数の人とプレパートナーになれます。",
  },
  {
    id: "matching",
    term: "マッチング",
    category: "community",
    categoryLabel: "関係・組織",
    description:
      "価値観やスキルの類似性から相性の良い相手を見つける機能。自動および手動での探索が可能です。",
  },
  {
    id: "watch",
    term: "ウォッチ",
    category: "community",
    categoryLabel: "関係・組織",
    description:
      "通知なしで相手の活動を観察する、一方向の緩やかな関係性。幽霊状態（受肉前）でも可能です。",
    details: [
      "価値観ミックス：相手をウォッチすると、自分のTier表（好きなものリスト）に相手の「好き」が混ざり込み、独自のランキングが構築されます。",
    ],
  },
  {
    id: "follow",
    term: "フォロー / フォローバック",
    category: "community",
    categoryLabel: "関係・組織",
    description:
      "相手や組織に関心を持ち、関係性を一歩進めるためのステップ。双方が行うことで相互フォロー状態となります。",
  },
  {
    id: "community-leave",
    term: "リーブ (Leave)",
    category: "community",
    categoryLabel: "関係・組織",
    description:
      "所属している組織（グループ）から自発的に離脱すること。またはリーダーによる除名を指します。",
  },
  {
    id: "group-home",
    term: "グループ / ホーム (Group/Home)",
    category: "community",
    categoryLabel: "関係・組織",
    description:
      "ネットワークの最小単位（レベル1）。構成人数は1〜10人で、家族や少人数のチーム、親友同士などの集まりを想定しています。",
  },
  {
    id: "organization",
    term: "組織",
    category: "community",
    categoryLabel: "関係・組織",
    description:
      "複数人の集まりであり、階層構造の最小単位。システム上では「グループ」として表示されます。",
  },
  {
    id: "alliance",
    term: "アライアンス (Alliance)",
    category: "community",
    categoryLabel: "関係・組織",
    description:
      "組織（グループ）同士が独立性を保ったまま協力体制を結ぶ仕組み。資源共有や合同プロジェクトが可能になります。",
  },
  {
    id: "country",
    term: "国",
    category: "community",
    categoryLabel: "関係・組織",
    description:
      "複数の組織が集まる巨大な公共コミュニティ。国が提示する理念（条件）に賛同するグループが集まって形成されます。",
  },
  {
    id: "leader",
    term: "リーダー",
    category: "community",
    categoryLabel: "関係・組織",
    description:
      "組織や国の管理者。メンバー管理やルール運用、マーケットプレイスの運営などの権限を持ちます。",
  },
  {
    id: "governance-type",
    term: "建国（トップダウン）と作成（ボトムアップ）",
    category: "community",
    categoryLabel: "関係・組織",
    description:
      "全体の目的から組織を集めるのが「建国」、最小単位から徐々に拡大して組織を作るのが「作成」です。",
  },
  {
    id: "marketplace",
    term: "マーケットプレイス / 国内イベント",
    category: "community",
    categoryLabel: "関係・組織",
    description:
      "国や組織の中で仕事の受発注を行ったり、勉強会や交流会を開催したりするための内部経済・活動システム。",
  },

  // --- システム・評価 ---
  {
    id: "absolute-relative",
    term: "絶対相対評価",
    category: "system",
    categoryLabel: "システム・評価",
    description:
      "「自分が最も好きなもの」を基準点とし、それと比較して他の対象を相対的に評価するVNS独自の手法。",
  },
  {
    id: "tier-evaluation",
    term: "ティア評価 (Tier1〜3)",
    category: "system",
    categoryLabel: "システム・評価",
    description:
      "評価を3段階のティアで管理する方式。自分にとっての重要度を明確にします。",
  },
  {
    id: "skills",
    term: "スキル",
    category: "system",
    categoryLabel: "システム・評価",
    description:
      "保有能力の可視化。自分の現状のスキル、理想のスキル、また相手（パートナー等）に求めるスキル。レベル0（未経験）〜5（専門家）で表現されます。",
  },
  {
    id: "mandala-chart",
    term: "マンダラチャート",
    category: "system",
    categoryLabel: "システム・評価",
    description:
      "8つの思考原則に基づく目標設定・達成ツール。思考を整理し、価値観に基づいた行動を支援します。",
  },
  {
    id: "chain",
    term: "チェーン",
    category: "system",
    categoryLabel: "システム・評価",
    description:
      "作品、価値観、スキルなどを自由に関連付ける機能。個別の情報を繋ぎ、新しい文脈を生み出します。",
  },
  {
    id: "list-function",
    term: "リスト",
    category: "system",
    categoryLabel: "システム・評価",
    description:
      "自分のお気に入りや特定のテーマに沿った作品まとめを作成・公開する機能。",
  },

  // --- 安全・アカウント ---
  {
    id: "account-root",
    term: "ルートアカウント",
    category: "security",
    categoryLabel: "安全・アカウント",
    description:
      "ユーザーに1つ与えられる基盤。複数のプロフィール（仮面）や、ポイント・信頼度を一元管理する実体アカウントです。",
  },
  {
    id: "purge-function",
    term: "パージ機能",
    category: "security",
    categoryLabel: "安全・アカウント",
    description:
      "ルートアカウントと各プロフィールを完全に分離する機能。身バレを防止し、プライバシーを極限まで高めます。",
  },
  {
    id: "restart-system",
    term: "リスタート制度",
    category: "security",
    categoryLabel: "安全・アカウント",
    description:
      "過去の実績やプロフィールをリセットして、新しい価値観でゼロから出発できる仕組み。",
  },
  {
    id: "trust-days",
    term: "信頼継続日数",
    category: "security",
    categoryLabel: "安全・アカウント",
    description:
      "問題なく利用を続けている期間。日数が高いほど、より厳格な信頼条件を持つグループへの参加が可能になります。",
  },
  {
    id: "incinerator",
    term: "焚書タイマー (Digital Incinerator)",
    category: "security",
    categoryLabel: "安全・アカウント",
    description:
      "一定期間ログインがない場合に、データを自動消去する遺言機能。デジタルデータの「死後」を管理します。",
  },
  {
    id: "mimicry",
    term: "擬態モード (Mimicry Mode)",
    category: "security",
    categoryLabel: "安全・アカウント",
    description:
      "画面をExcelやコード画面に瞬時に切り替える機能。公共の場でのプライバシーを確保します。",
  },
  {
    id: "another-dimension",
    term: "アナザーディメンション",
    category: "security",
    categoryLabel: "安全・アカウント",
    description:
      "最重度のペナルティ。アカウント単位での完全隔離（次元追放）を指します。",
  },
  {
    id: "mediator",
    term: "メディエーター",
    category: "security",
    categoryLabel: "安全・アカウント",
    description:
      "AIと人間が協力して行うコンテンツ監視・相談業務。コミュニティの健全性を保ちます。",
    details: [
      "権力の分散：特定の管理者に権限が集中するのを防ぐため、メンバー持ち回りで担当する「調停者」制度を採用しています。",
      "持ち回り期間は18日間で、その働きには報酬（ポイント）が支払われます。",
    ],
  },
  {
    id: "retroactive-rules",
    term: "規則の遡及適用",
    category: "security",
    categoryLabel: "安全・アカウント",
    description:
      "新しく制定された規則を、それ以前から存在するコンテンツや行動に対しても適用すること。コミュニティの安全性を最新の基準で維持します。",
  },
  {
    id: "incarnation",
    term: "受肉 (Incarnation)",
    category: "concept",
    categoryLabel: "理念・基本",
    description:
      "「幽霊」から「住人」へ。誓いを終え、プロフィール（仮面）を作成することで実体を得る儀式的なプロセス。",
  },
  {
    id: "secret-spots",
    term: "隠れ家 (Secret Spots)",
    category: "security",
    categoryLabel: "安全・アカウント",
    description:
      "検索やワープのリストには表示されない物理アクセス限定の特殊エリア。コミュニティの秘匿性を守るための場所です。",
  },
  {
    id: "mask-lifespan",
    term: "プロフィールの寿命",
    category: "security",
    categoryLabel: "安全・アカウント",
    description:
      "仮面（プロフィール）には寿命が設定されており、意思を持ってポイントを消費することで継続・更新が可能です。",
  },

  // --- 働き方 ---
  {
    id: "remote-work",
    term: "リモートワーク",
    category: "work",
    categoryLabel: "働き方",
    description:
      "オフィスという「ハブ」を中心とした、オフィスの代替としての働き方。ハブ＆スポーク型の形態を指します。",
  },
  {
    id: "distributed-work",
    term: "分散型ワーク",
    category: "work",
    categoryLabel: "働き方",
    description:
      "インターネットの網目（メッシュ）状に組織が存在する、VNS推奨の次世代の組織形態。物理的な本社に縛られず、場所という概念そのものから解放された働き方です。",
  },
];

export default function GlossaryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = GLOSSARY_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-teal-500/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-5xl mx-auto py-12 px-6 space-y-12">
        {/* Navigation */}
        <Link
          href="/help"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors group"
        >
          <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl group-hover:border-teal-200 dark:group-hover:border-teal-800 shadow-sm transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span>ヘルプセンターに戻る</span>
        </Link>

        {/* Hero Section */}
        <div className="space-y-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="inline-flex items-center justify-center bg-teal-600 dark:bg-teal-500 p-4 rounded-2xl shadow-xl shadow-teal-500/20 w-fit mx-auto md:mx-0">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tight">
                用語集
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium max-w-2xl">
                VNS (Value Network Service)
                の独自の概念やシステムを理解するためのガイドです。
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="sticky top-6 z-10 space-y-4">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col gap-6">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="用語を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500 dark:text-white transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2 w-full">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      selectedCategory === cat.id
                        ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Glossary List */}
        <div className="grid grid-cols-1 gap-8">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                id={item.id}
                className="group relative bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm p-8 md:p-10 scroll-mt-24 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/5 hover:border-teal-200 dark:hover:border-teal-900 overflow-hidden"
              >
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-150 transition-transform duration-700" />

                <div className="relative space-y-6">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 uppercase tracking-widest border border-teal-100 dark:border-teal-800">
                          {item.categoryLabel}
                        </span>
                        {item.motto && (
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 uppercase tracking-widest border border-amber-100 dark:border-amber-800">
                            <Sparkles className="w-3 h-3" />
                            Policy
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {item.term}
                      </h2>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed font-medium">
                    {item.description}
                  </p>

                  {item.motto && (
                    <div className="relative bg-teal-50/30 dark:bg-teal-900/20 border-l-4 border-teal-500 p-6 rounded-r-2xl transform transition-transform group-hover:translate-x-1">
                      <div className="flex items-start gap-4">
                        <Quote className="w-6 h-6 text-teal-500 mt-1 flex-shrink-0 opacity-50" />
                        <p className="text-teal-700 dark:text-teal-300 text-lg font-bold italic leading-relaxed">
                          {item.motto}
                        </p>
                      </div>
                    </div>
                  )}

                  {item.details && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      {item.details.map((detail, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-600 dark:text-slate-400 leading-relaxed group/item transition-colors hover:bg-white dark:hover:bg-slate-800"
                        >
                          <div className="w-2 h-2 rounded-full bg-teal-400 dark:bg-teal-500 mt-1.5 flex-shrink-0 group-hover/item:scale-125 transition-transform" />
                          {detail}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[2rem] border border-dashed border-slate-300 dark:border-slate-800">
              <div className="inline-flex p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                見つかりませんでした
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                検索条件を変えてみてください。
              </p>
            </div>
          )}
        </div>

        {/* Footer Support Section */}
        <div className="bg-slate-800 dark:bg-white rounded-[2.5rem] p-12 text-center space-y-6 shadow-2xl transition-all hover:scale-[1.01]">
          <h2 className="text-3xl font-black text-white dark:text-slate-900">
            さらなる疑問がありますか？
          </h2>
          <p className="text-slate-300 dark:text-slate-500 max-w-xl mx-auto text-lg">
            用語集で解決しない場合は、FAQを確認するか、公式コミュニティで質問してみてください。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              href="/help/faq"
              className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white rounded-2xl font-black transition-all shadow-lg shadow-teal-500/25 active:scale-95"
            >
              FAQを見る
            </Link>
            <Link
              href="/community"
              className="px-8 py-4 bg-slate-700 dark:bg-slate-100 hover:bg-slate-600 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-2xl font-black transition-all active:scale-95"
            >
              コミュニティに参加
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
