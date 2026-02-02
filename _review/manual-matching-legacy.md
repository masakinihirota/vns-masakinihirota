# manual-matching-legacy レビュー
対象: src/components/manual-matching-legacy/**

## Findings
## src/components/manual-matching-legacy/manual-matching/manual-matching.tsx
✓ pass

## src/components/manual-matching-legacy/console/manual-matching-console.tsx
src/components/manual-matching-legacy/console/manual-matching-console.tsx:14 - lucide-react のバレル import（bundle最適化観点で個別 import 推奨）
src/components/manual-matching-legacy/console/manual-matching-console.tsx:82 - クリック可能な Card（ボタン/リンク化 or role+key 対応）
src/components/manual-matching-legacy/console/manual-matching-console.tsx:163 - 入力にラベル/aria-label 不足
