import * as Sample from "./components";

const profiles = [
  {
    name: "山田太郎",
    role: "エンジニア",
    bio: "フルスタック開発者として、Next.jsとSupabaseを使用したWebアプリケーション開発に従事しています。",
  },
  {
    name: "佐藤花子",
    role: "デザイナー",
    bio: "UI/UXデザインを専門としており、ユーザー中心のデザインを心がけています。",
  },
  {
    name: "鈴木次郎",
    role: "プロダクトマネージャー",
    bio: "プロダクト戦略の立案と実行を担当し、チームの成功を支援しています。",
  },
  {
    name: "田中美咲",
    role: "データサイエンティスト",
    bio: "機械学習とデータ分析を活用したビジネスインサイトの創出に取り組んでいます。",
  },
  {
    name: "伊藤健一",
    role: "エンジニア",
    bio: "スケーラブルなAPIとマイクロサービスアーキテクチャの設計・実装を担当しています。",
  },
  {
    name: "中村あかり",
    role: "エンジニア",
    bio: "React/Next.jsを使用したモダンなWebアプリケーションの開発を行っています。",
  },
  {
    name: "小林大輔",
    role: "DevOps",
    bio: "CI/CDパイプラインの構築とインフラの自動化により開発効率を向上させています。",
  },
  {
    name: "高橋さくら",
    role: "QA",
    bio: "品質保証とテスト自動化により、高品質なプロダクト提供に貢献しています。",
  },
  {
    name: "渡辺隆",
    role: "テックリード",
    bio: "技術的な意思決定とチームのメンタリングを通じて、プロジェクト成功を導いています。",
  },
  {
    name: "松本優子",
    role: "デザイナー",
    bio: "ユーザーリサーチとデザイン思考を活用し、使いやすいプロダクトを創造しています。",
  },
];

/**
 * サンプルページ
 * プロフィールリストコンポーネントのデモを表示
 */
export default function SamplePage() {
  return (
    <div className="container mx-auto py-8">
      <main className="flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">サンプルページ</h1>
          <p className="text-muted-foreground">
            プロフィールリストコンポーネントのデモ - フィルタリング・ソート機能付き
          </p>
        </div>

        <Sample.ProfileListContainer profiles={profiles} />
      </main>
    </div>
  );
}
