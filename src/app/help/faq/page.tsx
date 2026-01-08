"use client";

import {
  ArrowLeft,
  HelpCircle,
  Search,
  ChevronDown,
  MessageCircle,
  Shield,
  Zap,
  Sparkles,
  AlertCircle,
  Info,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const CATEGORIES = [
  { id: "all", label: "すべて", icon: HelpCircle },
  { id: "philosophy", label: "理念・思想", icon: Sparkles },
  { id: "system", label: "制度・システム", icon: Shield },
  { id: "experience", label: "体験・操作", icon: Zap },
  { id: "amazon", label: "Amazonアソシエイト", icon: ShoppingBag },
] as const;

interface FAQItem {
  id: string;
  category: (typeof CATEGORIES)[number]["id"];
  question: string;
  answer: string;
  tags?: string[];
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "q1",
    category: "philosophy",
    question: "「ネガティブ禁止」が息苦しくてたまらない",
    answer:
      "既存のSNSが「言葉の剣」だとしたら、VNSは「言葉の盾」です。批判や議論をしたい場合は既存のSNSを使ってください。VNSは、砂漠のようなインターネットの中で「翼を休めるオアシス」として機能するために、あえてネガティブを禁止し、幸福追求権を優先させています。「褒めるときは大きな声で、叱るときは二人きりで」というマナーを大切にする、全体主義的な強制ではなく、お互いのための合意形成です。",
  },
  {
    id: "q2",
    category: "system",
    question: "「調停者」という強制労働をさせられるのが嫌だ",
    answer:
      "これは「強制労働」ではなく、権力の分散と公平性の担保です。特定の管理者に権限が集中すると独裁や腐敗が生まれます。組織のメンバーが持ち回りで（例えば18日ごとに）担当することで、全員が当事者意識を持ち、公平なコミュニティ運営が可能になります。調停任務にはポイント報酬というインセンティブも用意されています。",
  },
  {
    id: "q3",
    category: "system",
    question: "「信頼継続日数」という監視社会システムが怖い",
    answer:
      "個人の思想や性格を格付けするものではなく、単に「他者を攻撃していない期間」を可視化する指標です。条件の厳しいグループに入るための「通行手形」のようなもので、他の監視社会的な制度とは異なり、ルールを守っていれば勝手に増えていく、いわば「無事故無違反証明書」です。",
  },
  {
    id: "q4",
    category: "philosophy",
    question: "「批判」のない作品評価なんて信用できない",
    answer:
      "VNSは「作品の良し悪しを批評する場」ではなく、「昨日僕が感動した作品」を共有し、価値観が合う人とマッチングする場です。批判レビューで地雷を避けるのではなく、「価値観が似ている人が推しているから信頼できる」というポジティブな動機での発見を重視しています。",
  },
  {
    id: "q5",
    category: "system",
    question: "「拍手」するだけでポイントが減るのがケチくさい",
    answer:
      "「いいね」のインフレを防ぎ、感情の重みを守るためです。コスト（1pt）がかかるからこそ、その拍手には「本当の価値」が生まります。なお、ポイントは毎日1,000ptまで自動回復するため、日常的なコミュニケーションで不足することはありません。",
  },
  {
    id: "q6",
    category: "experience",
    question: "構造が複雑すぎて理解する気になれない",
    answer:
      "現実社会も複雑です。それをネット上で安全に再現するために、人は「ルートアカウント（本人証明）」と「プロフィール（千の仮面）」を使い分ける必要があります。仕事、趣味、家族など、人が持つ多面性を表現するためにこの構造が必要不可欠なのです。",
  },
  {
    id: "q7",
    category: "system",
    question: "「国」の維持費（税金）を払いたくない",
    answer:
      "維持費が必要なのは大規模な「国」だけで、小規模なグループ運営にはポイントはかかりません。国は「市場」や「イベント会場」のような公的な場所であり、放置された廃墟（ゴーストタウン）が乱立するのを防ぐために、維持コストというフィルターを設けています。",
  },
  {
    id: "q8",
    category: "system",
    question: "「BANはない」と言いつつ、「異次元追放」の方が陰湿に見える",
    answer:
      "単純なBAN（存在の抹消）こそ、ユーザーのデータを一方的に奪う暴力です。「No BAN, Just Drift」は、居場所を失っても存在とデータは消さないという究極の救済措置です。合わないコミュニティからは離れ（Drift）、別の世界で生き続けることができます。",
  },
  {
    id: "q9",
    category: "philosophy",
    question: "いちいち「宣言」させられるのが宗教っぽい",
    answer:
      "ネット上のトラブルの多くは「前提となる価値観の不一致」から起きます。入会時の宣言は「入国審査」のようなものです。最初にお互いが「優しくあること」に合意しているからこそ、見知らぬ人とも安心して交流できる環境が保たれます。",
  },
  {
    id: "q10",
    category: "experience",
    question: "匿名なのに「身元」を握られているのが不安",
    answer:
      "不安を解消するために「パージ機能」があります。ルートアカウントとの紐付けを完全に切断し、公開鍵暗号方式に切り替えることで、運営ですら身元を特定できない「完全な匿名プロフィール」として独立させることが可能です。",
  },
  {
    id: "q11",
    category: "experience",
    question: "ゲームなのかSNSなのか中途半端",
    answer:
      "「ゲーミフィケーション」は学習と継続のためのガイドラインです。複雑な機能を段階的に理解してもらうための演出であり、ビジネス目的で実用ツールとして使いたい場合は、機能をスキップして利用することも可能です。",
  },
  {
    id: "q12",
    category: "system",
    question: "リーダーの権力が強すぎる",
    answer:
      "リーダーの暴走を防ぐために「選挙制度」や「リーダー交代」のシステムがあります。また、メンバーはいつでも「リーブ（脱退）」して他の組織へ移る自由（Driftの権利）が保障されています。",
  },
  {
    id: "q13",
    category: "philosophy",
    question: "「シュレディンガーの猫主義」という名の現実逃避ではないか",
    answer:
      "無理やり異なる価値観を同じ土俵に乗せた結果が、現在のSNSの分断です。VNSは適切な境界線を引くことで、それぞれの世界が平和に並立することを目指しています。多様性とは「混ざり合うこと」ではなく、「互いに干渉せずに存在を認めること」です。",
  },
  {
    id: "q14",
    category: "experience",
    question: "検索避けや隠語文化が面倒くさそう",
    answer:
      "その「閉鎖的な村社会」を求めている層（二次創作やセンシティブなコミュニティ）のための機能です。Google検索や無関係な人の目に触れたくないユーザーを守る「盾」として機能します。",
  },
  {
    id: "q15",
    category: "experience",
    question: "「5x2」カードゲームをやらされる意味が不明",
    answer:
      "これはマッチングの「待ち時間」を埋めるためのオプションです。単に待つだけの時間をエンターテインメントに変える試みであり、必須ではありません。",
  },
  {
    id: "q16",
    category: "system",
    question: "ポイント（お金）がないと発言権がないのか",
    answer:
      "コメントの文字数課金は、スパムや無思慮な連投を防ぐフィルタです。日次で1,000pt回復するため、通常のコミュニケーションで制限を感じることはありません。言葉にコストを持たせることで、発言の質を高める狙いがあります。",
  },
  {
    id: "q17",
    category: "experience",
    question: "「幽霊」から始まるのがダルい",
    answer:
      "いきなり戦場に出るのではなく、まずは安全な「観測者」として世界を見て回る期間を設けています。VNSの独特な文化を理解し、自分に合った場所を見つけるための重要なオンボーディングプロセスです。",
  },
  {
    id: "q18",
    category: "philosophy",
    question: "用語がいちいちポエミーで恥ずかしい",
    answer:
      "「機能」ではなく「世界観」を提供しているからです。「翼を休める」「オアシス」といった言葉は、殺伐としたネット社会に疲れた人々に対する、VNSのスタンスを明確に示すためのブランドメッセージです。",
  },
  {
    id: "q19",
    category: "experience",
    question: "広告の順位が「価値観」で決まるのは不合理ではないか",
    answer:
      "広告主にとっても、興味のないユーザーに無理やり見せるより、価値観が合うユーザーに届ける方がエンゲージメントが高まります。単なる露出ではなく「共感」を生むための新しい広告モデルです。",
  },
  {
    id: "q20",
    category: "philosophy",
    question: "運営の「きれいな世界」の押し付け、ディストピアではないか",
    answer:
      "VNSは「きれいな世界」を維持すると宣言したプラットフォームです。人間の汚い部分も含めて楽しみたい方は既存のSNSを使い、VNSはそこでの争いに疲れた人々の「逃げ場所（シェルター）」として選択してください。",
  },
  {
    id: "q21",
    category: "system",
    question: "自浄作用の喪失と独裁のリスクはないか",
    answer:
      "腐敗を感じたら別の国へ移動する自由があります。VNSは多様な小国が並立する連邦制のような構造をとることで、システム全体としての健全性を保ちます。自浄作用は内部議論ではなく「ユーザーの流動性」によって働きます。",
  },
  {
    id: "q22",
    category: "system",
    question: "「調停者」という感情労働をユーザーに押し付けるべきではない",
    answer:
      "運営による審査は時間とコストがかかりすぎます。VNSではピア（仲間）による迅速な解決を優先し、持ち回り制で負担を分散しています。判断に不満があれば別のリーダーの元へ移ることでエコシステムが回転します。",
  },
  {
    id: "q23",
    category: "experience",
    question: "「多重構造」による認知負荷が重すぎる",
    answer:
      "複雑さは「学習クエスト」として段階的に解放されます。居場所を見つける過程をゲーミフィケーション化しており、複雑さを乗りこなすこと自体をエンターテインメントとして設計しています。",
  },
  {
    id: "q24",
    category: "system",
    question: "「ルートアカウント」という単一障害点のリスク",
    answer:
      "基本データはオープンにされ透明性が担保されます。プライバシーとセキュリティの両立のため「パージ機能」などの究極の対策も用意されており、集権的なリスクを構造的に回避しています。",
  },
  {
    id: "q_basic_1",
    category: "experience",
    question: "使い方がよく分かりません。どこから始めればいいですか？",
    answer:
      "まずは「チュートリアル」を進めることをお勧めします。VNSの世界観を体験しながら、幽霊状態から「受肉」して実体を得るまでのプロセスを段階的に学ぶことができます。",
  },
  {
    id: "q_basic_2",
    category: "experience",
    question: "間違えて「オアシス宣言」に同意しなかった場合はどうなりますか？",
    answer:
      "同意しない場合、他者との交流（拍手やコメント）はできませんが、「観測者」として世界を眺めることは可能です。後から設定で同意することで、いつでも市民権を得ることができます。",
  },
  {
    id: "q_basic_3",
    category: "experience",
    question: "パスワードを忘れてしまいました",
    answer:
      "VNSはパスワードをサーバーに保存しないため、運営側で再発行やリセットを行うことはできません。アカウント作成時に発行された「復旧コード」を大切に保管してください。",
  },
  {
    id: "q_amazon_1",
    category: "amazon",
    question: "自分のAmazonアフィリエイトIDを使うことはできますか？",
    answer:
      "はい、可能です。ルートアカウントの設定画面から、ご自身のアマゾン・トラッキングID（例：masakinihirota-22）を登録できます。登録すると、あなたが紹介した作品のリンクにあなたのIDが優先的に付与されます。なお、安全上の理由（アカウントの不正売買防止等）から、一度登録したIDを後から変更することはできません。登録時は十分にご注意ください。",
  },
  {
    id: "q_amazon_2",
    category: "amazon",
    question: "アフィリエイト報酬はどうすれば受け取れますか？",
    answer:
      "報酬はAmazonから直接支払われます。VNSはリンクの生成を支援するだけで、報酬の支払いや管理には関与しません。現在の売上状況などはAmazonアソシエイトの管理画面でご確認ください。",
  },
  {
    id: "q_amazon_3",
    category: "amazon",
    question: "Amazonアソシエイトに登録する際の注意点は？",
    answer:
      "規約上、ご自身のAmazon管理画面で、アフィリエイトリンクを表示するサイト（VNSのURL）を「Webサイト情報」として登録する必要があります。登録がない場合、報酬が支払われなくなる可能性があるため、必ず設定を行ってください。",
  },
  {
    id: "q_amazon_4",
    category: "amazon",
    question: "登録したアマゾン・トラッキングIDを後から変更できますか？",
    answer:
      "いいえ、一度登録したトラッキングIDを後から変更することはできません。これは、アカウントの不正売買を防止し、システムの安全性を維持するための措置です。登録の際は間違いがないか十分にご確認ください。",
  },
  {
    id: "q_tutorial_1",
    category: "experience",
    question: "組織は何をする場所ですか？",
    answer:
      "価値観が合う少人数で深く交流する「家」のような場所です。組織のリーダーが掲げるルール（思想）に共感するメンバーが集まります。",
  },
  {
    id: "q_tutorial_2",
    category: "system",
    question: "メディエーター（調停者）とは何ですか？",
    answer:
      "組織内の揉め事を仲裁する役割です。18日ごとの持ち回りでメンバーが公平に担当し、特定の個人に権限が集中するのを防いでいます。",
  },
  {
    id: "q_tutorial_3",
    category: "system",
    question: "嫌な人がいた場合、どう対処すればいいですか？",
    answer:
      "ミュートやブロックのほか、組織からの「リーブ（追放）」が可能です。VNSにはBAN（存在の消去）はなく、別の場所へ移る「Drift（漂流）」を基本としています。",
  },
  {
    id: "q_tutorial_4",
    category: "system",
    question: "「国」と「組織」にはどのような違いがありますか？",
    answer:
      "組織は「人」の集まりであり、国は複数の組織が集まる「マーケットやイベント会場などの場所」という位置づけです。",
  },
  {
    id: "q_tutorial_5",
    category: "system",
    question: "入国や滞在にポイント（費用）はかかりますか？",
    answer:
      "一時的な入国は無料ですが、特定の国に常駐したり、大規模なマーケット機能を利用したりする場合には維持費としてのポイントが必要になります。",
  },
  {
    id: "q_tutorial_6",
    category: "experience",
    question: "マーケットではどのようなものが取引されていますか？",
    answer:
      "イラスト作成、翻訳、悩み相談など、個人の「スキル」が主な取引対象です。VNS内のポイントを介して価値が交換されます。",
  },
  {
    id: "q_tutorial_7",
    category: "experience",
    question: "特別なスキルがないと、マーケットは利用できませんか？",
    answer:
      "いいえ。「好きなこと」を語るのも立派なスキルです。マンダラチャートで興味を整理したり、誰かの活動に拍手を送ることから始められます。",
  },
  {
    id: "q_tutorial_8",
    category: "experience",
    question: "勝手に作品情報を登録しても大丈夫ですか？",
    answer:
      "はい、可能です。ただし情報は全ユーザーで共有される資産となるため、正確な情報の入力が求められます。",
  },
  {
    id: "q_tutorial_9",
    category: "system",
    question: "「チェーン」とはどのような機能ですか？",
    answer:
      "「これを見た人はこれも好きかも」という、作品同士の文脈をユーザー自身の手で繋いでいく機能です。価値観の繋がりを可視化します。",
  },
  {
    id: "q_tutorial_10",
    category: "system",
    question: "ポイントではなく、実際の現金でのやり取りは可能ですか？",
    answer:
      "VNS内ではポイント取引が基本です。外部を介した金銭授受については、各ユーザーの責任において行っていただく形をとっています。",
  },
  {
    id: "q_tutorial_11",
    category: "experience",
    question: "他のマッチングサービスとは何が違うのですか？",
    answer:
      "外見やスペックよりも、作品の好み（Tier）や人生の価値観といった「内面の一致」を深く掘り下げる仕組みを重視しています。",
  },
  {
    id: "q_tutorial_12",
    category: "philosophy",
    question: "「パートナー」は恋人と何が違うのですか？",
    answer:
      "恋人や配偶者、親友など、1対1の深い信頼を築く相手を総称した言葉です。あなたの「仮面（目的）」に応じて定義することができます。",
  },
  {
    id: "q_tutorial_13",
    category: "experience",
    question: "相談した内容が他のユーザーに漏れることはありませんか？",
    answer:
      "相談カテゴリには強力な閲覧制限をかけることができ、信頼できる特定の相手以外には情報が見えないように設定可能です。",
  },
  {
    id: "q_tutorial_14",
    category: "philosophy",
    question: "組織を追放（リーブ）されたら、活動できなくなりますか？",
    answer:
      "いいえ。どこの組織にも属さない「漂流者（Drifter）」として活動を続け、新しい自分に合う場所を探す自由が保障されています。",
  },
  {
    id: "q_tutorial_15",
    category: "system",
    question: "「アナザーディメンション」とは何のことですか？",
    answer:
      "価値観が激しく対立する者同士が、システム上で互いを一切観測できなくなる完全分離状態を。お互いの世界を守るための最終手段です。",
  },
];

const StructuralAnswer = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-all hover:border-teal-500/50">
    <h4 className="text-teal-600 dark:text-teal-400 font-bold mb-3 flex items-center gap-2">
      <Zap className="w-4 h-4" />
      {title}
    </h4>
    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
      {children}
    </div>
  </div>
);

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggleAccordion = (id: string) => {
    const newOpenIds = new Set(openIds);
    if (newOpenIds.has(id)) {
      newOpenIds.delete(id);
    } else {
      newOpenIds.add(id);
    }
    setOpenIds(newOpenIds);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setOpenIds(new Set());
  };

  const filteredItems = FAQ_ITEMS.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-12 pb-6">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href="/help"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            ヘルプセンターに戻る
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h1
                onClick={handleReset}
                className="text-3xl font-black text-slate-900 dark:text-white tracking-tight cursor-pointer hover:text-teal-600 transition-colors inline-block"
              >
                FAQ
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                VNS masakinihirotaの思想とシステムに関する疑問と回答
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Search and Filters */}
        <div className="sticky top-6 z-10 space-y-4 mb-12">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col gap-6">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="質問内容を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500 dark:text-white transition-all shadow-inner"
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

        {/* FAQ List */}
        <div className="space-y-4 mb-20">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full text-left px-6 py-5 flex items-start justify-between gap-4"
                >
                  <div className="flex gap-4">
                    <span className="text-teal-600 dark:text-teal-400 font-black text-xl leading-none pt-1">
                      Q.
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-teal-600 transition-colors">
                      {item.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0 mt-1 ${
                      openIds.has(item.id) ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${
                    openIds.has(item.id)
                      ? "max-h-[500px] pb-6 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                    <span className="text-rose-500 dark:text-rose-400 font-black text-xl leading-none pt-4">
                      A.
                    </span>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed py-4">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                見つかりませんでした
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                検索ワードを変えてお試しください
              </p>
            </div>
          )}
        </div>

        {/* Structural Answers Section */}
        <section className="mt-20">
          <div className="flex items-center gap-3 mb-8">
            <Info className="w-6 h-6 text-teal-600" />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              VNSの構造的回答
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <StructuralAnswer title="自浄作用：流動性による淘汰">
              不適切な組織からは立ち去り（Drift）、自分に合う場所へ移動する自由が保障されています。魅力のないコミュニティは「過疎化」という市場原理によって自然淘汰されます。
            </StructuralAnswer>
            <StructuralAnswer title="調停制度：解決のスピード優先">
              裁判所のような厳密さより、ピア（仲間）による「解決の速さ」を優先。持ち回り制（ローテーション）により特定の個人への負担と権力の固定化を防ぎます。
            </StructuralAnswer>
            <StructuralAnswer title="拍手のコスト：インフレ抑制">
              全ての反応に「1pt」のコストを設けることで、称賛の価値が薄れるのを防ぎます。ポイントは毎日自動回復するため、通常の使用において制限にはなりません。
            </StructuralAnswer>
            <StructuralAnswer title="多重構造：ゲーミフィケーション">
              複雑な階層構造は、段階的な解放（Progressive
              Disclosure）と演出によって「物語体験」として学習できるよう設計されています。
            </StructuralAnswer>
          </div>

          <div className="mt-12 p-8 bg-teal-500/5 border border-teal-500/20 rounded-3xl">
            <h3 className="text-xl font-black text-teal-700 dark:text-teal-400 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              結論
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-400 leading-relaxed font-medium">
              VNS
              masakinihirotaは「完璧な正義」ではなく、「人間関係の不完全さ」を前提とした動的なエコシステムです。
              嫌なら逃げる（Drift）、合わないものは観測しない（シュレディンガーの猫主義）。生物的なアプローチによって全体の調和を保ちます。
            </p>
          </div>
        </section>
      </div>

      {/* Footer CTA */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <AlertCircle className="w-10 h-10 text-teal-500 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            それでも解決しない場合は
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            運営チーム、またはお近くの「メディエーター」までご相談ください。
          </p>
        </div>
      </footer>
    </div>
  );
}
