# mandala-chart-legacy レビュー

対象: src/components/mandala-chart-legacy/\*\*

## Findings

## src/components/mandala-chart-legacy/mandala-chart.tsx

src/components/mandala-chart-legacy/mandala-chart.tsx:4 - lucide-react のバレル import（bundle最適化観点で個別 import 推奨）
src/components/mandala-chart-legacy/mandala-chart.tsx:174 - アイコンのみボタンに aria-label 不足
src/components/mandala-chart-legacy/mandala-chart.tsx:244 - アイコンのみボタンに aria-label 不足
src/components/mandala-chart-legacy/mandala-chart.tsx:263 - アイコンのみボタンに aria-label 不足
src/components/mandala-chart-legacy/mandala-chart.tsx:270 - アイコンのみボタンに aria-label 不足
