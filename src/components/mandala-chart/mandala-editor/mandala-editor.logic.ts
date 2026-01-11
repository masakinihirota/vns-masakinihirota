import {
  Label,
  LABELS,
  MandalaData,
  MandalaBlock,
  SKELETON_DATA,
} from "./mandala-editor.types";

export type { Label, MandalaData, MandalaBlock };
export { LABELS, SKELETON_DATA };

/**
 * MarkdownテキストをMandalaDataオブジェクトにパースします。
 * 正規表現による一括処理ではなく、行ベースのステートマシンによりパースすることで
 * 構造の乱れに強く、保守性の高いロジックを実現しています。
 */
export function parseMarkdownToMandala(markdown: string): MandalaData {
  const lines = markdown.split("\n");

  // ミュータブルな作業用オブジェクト（最後にFreezeするかReadOnlyで返す）
  const data: {
    center: { label: "★"; title: string; items: string[] };
    blocks: { label: Label; title: string; items: string[] }[];
  } = {
    center: { label: "★", title: "", items: Array(8).fill("") },
    blocks: LABELS.map((label) => ({
      label,
      title: "",
      items: Array(8).fill(""),
    })),
  };

  let currentBlock: { title: string; items: string[] } | null = null;
  let currentItemIndex = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // セクションヘッド (# [★] または旧形式 # [C], ## [A-H])
    if (trimmed.startsWith("# [★]") || trimmed.startsWith("# [C]")) {
      currentBlock = data.center;
      currentItemIndex = 0;
      // タイトルが同じ行にある場合に対応 (# [★] タイトル)
      const titleMatch = trimmed.match(/^# \[(?:★|C)\]\s*(.*)$/);
      if (titleMatch && titleMatch[1]) {
        currentBlock.title = titleMatch[1].trim();
      }
    } else if (trimmed.startsWith("## [")) {
      const labelMatch = trimmed.match(/^## \[([A-H])\]\s*(.*)$/);
      if (labelMatch) {
        const label = labelMatch[1] as Label;
        const block = data.blocks.find((b) => b.label === label);
        if (block) {
          currentBlock = block;
          currentItemIndex = 0;
          if (labelMatch[2]) {
            currentBlock.title = labelMatch[2].trim();
          }
        }
      }
    } else if (trimmed.startsWith("- [")) {
      // 箇条書きアイテム (- [1] アイテム)
      if (currentBlock) {
        const itemMatch = trimmed.match(/^- \[\d+\]\s*(.*)$/);
        if (itemMatch && currentItemIndex < 8) {
          currentBlock.items[currentItemIndex] = itemMatch[1].trim();
          currentItemIndex++;
        }
      }
    }
  }

  return data as MandalaData;
}

/**
 * MandalaDataオブジェクトからMarkdownテキストを生成します。
 */
export function generateMarkdownFromMandala(data: MandalaData): string {
  let md = `# [★] ${data.center.title}\n`;
  data.center.items.forEach((item, i) => {
    md += `- [${i + 1}] ${item}\n`;
  });
  md += "\n";

  data.blocks.forEach((block) => {
    md += `## [${block.label}] ${block.title}\n`;
    block.items.forEach((item, i) => {
      md += `- [${i + 1}] ${item}\n`;
    });
    md += "\n";
  });

  return md.trim();
}

/**
 * 初期状態用のスケルトンMarkdownを取得します。
 */
export const SKELETON_MARKDOWN = generateMarkdownFromMandala(SKELETON_DATA);

/**
 * サンプルデータ
 */
export const INITIAL_MD = `# [★] 最強のエンジニア
- [1] 技術力(Frontend)
- [2] 技術力(Backend)
- [3] 設計能力
- [4] ソフトスキル
- [5] 発信・影響力
- [6] セルフマネジメント
- [7] 英語力
- [8] ビジネス視点

## [A] 技術力(Frontend)
- [1] React/Next.js熟達
- [2] パフォーマンス最適化
- [3] アクセシビリティ(a11y)
- [4] TypeScript高度利用
- [5] モダンCSS設計
- [6] ステート管理パターン
- [7] テスト駆動開発(Frontend)
- [8] Web標準の理解

## [B] 技術力(Backend)
- [1] DB設計/SQL最適化
- [2] API設計(REST/GraphQL)
- [3] クラウドインフラ(AWS)
- [4] Docker/K8sコンテナ
- [5] マイクロサービス理解
- [6] セキュリティベストプラクティス
- [7] キャッシュ戦略
- [8] Go/Rustなどの第二言語

## [C] 設計能力
- [1] クリーンアーキテクチャ
- [2] デザインパターン
- [3] ドメイン駆動設計(DDD)
- [4] システムアーキテクチャ
- [5] スケーラビリティ考慮
- [6] 技術選定眼
- [7] レガシーコード改善
- [8] シンプルさの追求

## [D] ソフトスキル
- [1] わかりやすい説明力
- [2] 非エンジニアとの対話
- [3] 傾聴・ファシリテーション
- [4] メンタリング
- [5] フィードバック受容
- [6] 交渉力・調整力
- [7] チームビルディング
- [8] 感情コントロール

## [E] 発信・影響力
- [1] 技術ブログ月1更新
- [2] 勉強会登壇
- [3] OSSコントリビュート
- [4] Twitter技術発信
- [5] 技術書執筆
- [6] 社内勉強会主催
- [7] コミュニティ参加
- [8] 個人のブランド化

## [F] セルフマネジメント
- [1] ポモドーロテクニック
- [2] 7時間睡眠の確保
- [3] 運動習慣(週3)
- [4] デスク環境整備
- [5] タスクの優先順位付け
- [6] 集中力の維持
- [7] 定期的な振り返り(KPT)
- [8] 燃え尽き防止

## [G] 英語力
- [1] 技術ドキュメント読解
- [2] 英語での検索力
- [3] 公式動画の聴解
- [4] GitHubでの英語議論
- [5] 英語ポッドキャスト
- [6] 技術カンファレンス視聴
- [7] 1日30分の学習
- [8] TOEIC 800点

## [H] ビジネス視点
- [1] 顧客課題の理解
- [2] 費用対効果(ROI)意識
- [3] KPIに基づく開発
- [4] マーケティング基礎
- [5] プロダクトマネジメント
- [6] 業界トレンド把握
- [7] 事業戦略の理解
- [8] 数字で語る`;
