import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bot, HeartHandshake, ShieldAlert, Split, Star } from "lucide-react";

export function TroubleShooting() {
  return (
    <div className="space-y-12">
      {/* イントロダクション */}
      <div className="space-y-6 text-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400">
          ネット問題 トラブル対応集
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          トラブルの性質に応じて、5つのレベルで対応方針を定義します。
          冷静に状況を判断し、適切なアプローチを選択してください。
        </p>
      </div>

      {/* 対応優先度・解決アプローチ表 */}
      <Card className="border-0 shadow-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <CardHeader>
          <CardTitle>📊 対応優先度・解決アプローチ表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">レベル</TableHead>
                <TableHead className="w-[150px]">名称</TableHead>
                <TableHead>対応の核心</TableHead>
                <TableHead>備考</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaryData.map((item) => (
                <TableRow key={item.level}>
                  <TableCell className="font-bold">{item.level}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="font-semibold text-primary">
                    {item.coreResponse}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.note}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 詳細セクション */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold border-b pb-2 px-4">
          🔍 重大性階層リスト：具体的分類と対策
        </h2>

        {/* Level 1 */}
        <LevelSection
          level="Level 1"
          title="【違法】警察・法の領域"
          icon={ShieldAlert}
          iconColor="text-red-500"
          nature="プラットフォーム運営の裁量を超え、実社会の法律に抵触する重大事案。"
          response="直ちに通報を行い、法的措置を講じる。"
          tableData={[
            {
              category: "生命・身体への脅威",
              example: "殺害予告、爆破予告、ストーカー行為",
              action: "**即時通報**（警察等へのログ開示協力）",
            },
            {
              category: "財産犯・組織犯罪",
              example: "結婚詐欺、投資詐欺、闇バイト募集",
              action: "**即時通報**（警察・消費者庁）",
            },
            {
              category: "深刻な人権侵害",
              example: "リベンジポルノ、児童ポルノ、極度な名誉毀損",
              action: "**削除要請・法的措置**",
            },
            {
              category: "サイバー攻撃",
              example: "ハッキング、DDoS攻撃",
              action: "**法的措置**（セキュリティチーム対応）",
            },
          ]}
        />

        {/* Level 2 */}
        <LevelSection
          level="Level 2"
          title="【限界】人間の業・思想の領域"
          icon={Split}
          iconColor="text-orange-500"
          nature="違法ではないが、個人の核心的な価値観に関わるため、議論による解決が不可能な領域。"
          response="互いの視界に入らない「住み分け（アイソレーション）」を徹底する。"
          tableData={[
            {
              category: "思想・信条の対立",
              example: "政治、ジェンダー、宗教観の激突",
              action: "「正義と正義」の衝突であり妥協点がないため。",
              actionLabel: "なぜ対話で解決できないか",
            },
            {
              category: "創作の領分",
              example: "AI生成の是非、解釈違い、カップリング論争",
              action: "嗜好や美学の根幹が異なるため。",
              actionLabel: "なぜ対話で解決できないか",
            },
            {
              category: "感情の縺れ",
              example: "痴情のもつれ、過度な執着、変心",
              action: "個人の感情はシステム制御の範疇外であるため。",
              actionLabel: "なぜ対話で解決できないか",
            },
            {
              category: "心理的要因",
              example: "嫉妬、マウント、優越感の誇示",
              action: "人間の生存本能に起因する感情であるため。",
              actionLabel: "なぜ対話で解決できないか",
            },
            {
              category: "コミュニティ排他",
              example: "新規排除、内輪ノリ、過激な自治",
              action: "居場所を守る防衛本能の暴走であるため。",
              actionLabel: "なぜ対話で解決できないか",
            },
          ]}
        />

        {/* Level 3 */}
        <LevelSection
          level="Level 3"
          title="【機械】認証・AIの領域"
          icon={Bot}
          iconColor="text-blue-500"
          nature="悪意あるユーザーやbotが、「量」を武器に攻撃を仕掛けてくるケース。"
          response="エンジニアリング（Auth認証・AI・フィルター）による自動防御。"
          tableData={[
            {
              category: "身元の詐称",
              example: "なりすまし、荒らし目的の複数アカウント",
              action: "**【厳格認証】** eKYC、電話番号認証の導入",
            },
            {
              category: "反射的な暴言",
              example: "単純な罵詈雑言、ヘイトスピーチ",
              action: "**【AIフィルター】** 投稿前の検知・警告・ブロック",
            },
            {
              category: "自動化された攻撃",
              example: "広告スパム、スクレイピング",
              action: "**【CAPTCHA/AI分析】** 非人間的な挙動を検知",
            },
            {
              category: "不公正な行為",
              example: "初心者狩り（スマーフ）、偽装工作",
              action: "**【1人1垢原則】** 認証によるサブ垢作成の封じ込め",
            },
          ]}
        />

        {/* Level 4 */}
        <LevelSection
          level="Level 4"
          title="【人】文化・価値観の領域"
          icon={HeartHandshake}
          iconColor="text-green-500"
          nature="ルールの解釈違いや知識不足、プレイスタイルの不一致による摩擦。"
          response="マッチングの最適化と、メディエーター（仲裁者）による教育的介入。"
          tableData={[
            {
              category: "情報消費マナー",
              example: "ネタバレ、リーク情報、早出し情報",
              action: "**【タグ管理】** 嗜好タグによる表示の住み分け",
            },
            {
              category: "創作ガイドライン",
              example: "無断転載、加工、二次利用の範囲",
              action: "**【啓蒙・教育】** CCライセンス等の周知徹底",
            },
            {
              category: "プレイスタイル不一致",
              example: "ガチ勢 vs エンジョイ勢、過度な指示",
              action: "**【マッチング】** 価値観タグに基づき最適化",
            },
            {
              category: "日常の摩擦",
              example: "金銭感覚のズレ、些細な誤解、ドタキャン",
              action: "**【事前選別/介入】** プロフ充実化と第三者仲裁",
            },
          ]}
        />

        {/* Level 5 */}
        <LevelSection
          level="Level 5"
          title="【信用】相互評価・コミュニティの領域"
          icon={Star}
          iconColor="text-amber-500"
          nature="明確な規約違反ではないが、周囲に「不快・不誠実」と感じさせる振る舞い。"
          response="ユーザー同士による「相互評価（自浄作用）」と信用スコアの活用。"
          tableData={[
            {
              category: "約束の軽視",
              example: "遅刻常習、頻繁なドタキャン、既読無視",
              action: "**【可視化】** 負のエンゲージメント履歴の蓄積",
            },
            {
              category: "不快なパーソナリティ",
              example: "規約ギリギリの不快言動、粘着性",
              action: "**【スコア制限】** 低評価者同士のみをマッチング",
            },
            {
              category: "信用の毀損",
              example: "物品・金銭の些細な貸借トラブル",
              action: "**【権限管理】** ランクに応じた機能利用制限",
            },
          ]}
        />
      </div>

      {/* サンクチュアリ */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-100 dark:border-indigo-900">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <span className="text-3xl">🏗️</span>
            次世代コミュニティ安定化システム：サンクチュアリ（Sanctuary）
          </CardTitle>
          <CardDescription className="text-base text-indigo-700 dark:text-indigo-300">
            本システムは「排除」ではなく、「誠実さが利益を生み、悪意が孤独を招く」自律的な秩序形成を目的とします。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <SanctuaryCard
              title="1. 信頼継続日数"
              subtitle="Trust Streak"
              description="「加点方式」ではなく、「平穏に過ごした期間」をユーザーの資産として可視化します。"
              points={[
                "ロジック： （トラブル報告なしの継続日数）×（活動指数）＝ 信頼ランク",
                "ペナルティ： 通報受理で日数リセットまたは大幅削減",
                "効果： 「積み上げた資産を失いたくない」という心理的抑止力",
              ]}
            />
            <SanctuaryCard
              title="2. 動的隔離"
              subtitle="Dynamic Isolation"
              description="悪質ユーザーを追放する代わりに、環境を分離します。"
              points={[
                "仕組み： 低スコアユーザー同士のみのマッチング領域へ誘導",
                "効果： 優良ユーザーの視界を「浄化」し、悪意を自然消滅させる",
              ]}
            />
            <SanctuaryCard
              title="3. 段階的機能解放"
              subtitle="Gradual Permission"
              description="信頼度（信用資産）をプラットフォームの「権限」に直結させます。"
              points={[
                "Rank C: 基本チャットのみ",
                "Rank B: 通話、画像解放",
                "Rank A: グループ作成、イベント主催",
                "Rank S: 紛争解決権限（メディエーター）",
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* 総括 */}
      <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-2xl text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">
          🏁 総括
        </h3>
        <div className="flex flex-col md:flex-row justify-center gap-4 text-lg font-medium text-slate-600 dark:text-slate-300">
          <div className="bg-white dark:bg-slate-700 px-6 py-3 rounded-xl shadow-sm">
            1. 思想は混ぜるな（タグで棲み分け）
          </div>
          <div className="bg-white dark:bg-slate-700 px-6 py-3 rounded-xl shadow-sm">
            2. 無知は教えよ（教育とガイドライン）
          </div>
          <div className="bg-white dark:bg-slate-700 px-6 py-3 rounded-xl shadow-sm">
            3. 悪意は遮断せよ（エンジニアリング）
          </div>
        </div>
        <p className="pt-4 text-slate-500 dark:text-slate-400">
          このフレームワークに基づき、管理者の介入を最小限に抑え、システムが自律的に平穏を守り続ける「聖域」の構築を目指します。
        </p>
      </div>
    </div>
  );
}

// サブコンポーネント

/**
 * **太字** パターンを安全にReact要素に変換するヘルパーコンポーネント。
 * dangerouslySetInnerHTML の安全な代替。
 */
function ActionText({ text }: { readonly text: string }) {
  // **text** パターンを<strong>に安全に変換
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        const boldMatch = part.match(/^\*\*(.*)\*\*$/);
        if (boldMatch) {
          return <strong key={`bold-${boldMatch[1]}`}>{boldMatch[1]}</strong>;
        }
        return <span key={`text-${i}`}>{part}</span>;
      })}
    </>
  );
}

function LevelSection({
  level,
  title,
  icon: Icon,
  iconColor,
  nature,
  response,
  tableData,
}: {
  level: string;
  title: string;
  icon: React.ElementType;
  iconColor: string;
  nature: string;
  response: string;
  tableData: {
    category: string;
    example: string;
    action: string;
    actionLabel?: string;
  }[];
}) {
  return (
    <Card className="overflow-hidden border-l-4 border-l-primary/20 dark:border-l-primary/40">
      <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 pb-4">
        <div className="flex items-center gap-3">
          <Icon className={`w-8 h-8 ${iconColor}`} />
          <div>
            <Badge variant="outline" className="mb-1">
              {level}
            </Badge>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
            <span className="font-bold block text-slate-500 dark:text-slate-400 text-xs mb-1">
              性質
            </span>
            {nature}
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <span className="font-bold block text-blue-500 dark:text-blue-400 text-xs mb-1">
              対応方針
            </span>
            {response}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">問題のカテゴリー</TableHead>
              <TableHead>具体的な事例</TableHead>
              <TableHead>
                {tableData[0]?.actionLabel || "推奨される対応策"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium align-top">
                  {row.category}
                </TableCell>
                <TableCell className="align-top">{row.example}</TableCell>
                <TableCell className="align-top">
                  <ActionText text={row.action} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function SanctuaryCard({
  title,
  subtitle,
  description,
  points,
}: {
  title: string;
  subtitle: string;
  description: string;
  points: string[];
}) {
  return (
    <div className="bg-white/60 dark:bg-slate-900/60 p-5 rounded-xl border border-white/40 shadow-sm space-y-3">
      <div>
        <h4 className="font-bold text-lg text-indigo-900 dark:text-indigo-100">
          {title}
        </h4>
        <p className="text-xs font-mono text-indigo-400 uppercase tracking-widest">
          {subtitle}
        </p>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {description}
      </p>
      <ul className="text-sm space-y-1 text-slate-500 dark:text-slate-400 list-disc list-inside">
        {points.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>
    </div>
  );
}

const summaryData = [
  {
    level: "Level 1",
    name: "違法行為",
    coreResponse: "法的措置・外部通報",
    note: "警察・専門機関との連携案",
  },
  {
    level: "Level 2",
    name: "価値観の対立",
    coreResponse: "物理的・心理的隔離",
    note: "対話不能な領域（住み分け）",
  },
  {
    level: "Level 3",
    name: "機械的悪意",
    coreResponse: "システム自動排除",
    note: "認証・AIによる量への対抗",
  },
  {
    level: "Level 4",
    name: "文化的摩擦",
    coreResponse: "仲裁・マッチング最適化",
    note: "教育と第三者介入",
  },
  {
    level: "Level 5",
    name: "不誠実な振る舞い",
    coreResponse: "相互評価・自浄作用",
    note: "信用スコアによる抑止",
  },
];
