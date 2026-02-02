# matching-manual レビュー
対象: src/components/matching-manual/**

## Findings
## src/components/matching-manual/manual-matching-console.tsx
src/components/matching-manual/manual-matching-console.tsx:17 - lucide-react のバレル import（bundle最適化観点で個別 import 推奨）
src/components/matching-manual/manual-matching-console.tsx:259 - クリック可能な div（ボタン/リンク化 or role+key 対応）
src/components/matching-manual/manual-matching-console.tsx:518 - 入力にラベル/aria-label 不足
src/components/matching-manual/manual-matching-console.tsx:630 - img の alt 不足
src/components/matching-manual/manual-matching-console.tsx:642 - img の alt 不足

## src/components/matching-manual/matching-settings.tsx
src/components/matching-manual/matching-settings.tsx:13 - lucide-react のバレル import（bundle最適化観点で個別 import 推奨）
src/components/matching-manual/matching-settings.tsx:431 - アイコンのみボタンに aria-label 不足
src/components/matching-manual/matching-settings.tsx:572 - アイコンのみボタンに aria-label 不足
src/components/matching-manual/matching-settings.tsx:580 - アイコンのみボタンに aria-label 不足
