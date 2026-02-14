---
trigger: always_on
description: React/Next.jsアプリケーションのレンダリング制御、バンドル削減、データ取得最適化の基準
---

# パフォーマンス最適化基準 (Performance Optimization Standards)

VNS masakinihirota アプリケーションにおいて、高速で快適なユーザー体験を提供するための最適化基準を定義します。

## 1. React / Next.js 最適化

### レンダリング制御
- **不要な再レンダリング防止**: `useMemo`, `useCallback` を適切に使用し、重い計算や参照の安定化を行う。特に巨大なリストやグラフ描画コンポーネントでは必須。
- **コンポーネントの分割**: 状態を持つコンポーネントを小さく保ち、レンダリング範囲を局所化する。
- **Server Components の活用**: 可能な限り Server Components (`app` directory のデフォルト) を使用し、クライアントバンドルサイズを削減する。`use client` はインタラクティビティが必要な末端のコンポーネントでのみ使用する。

### 動的インポート
- **`next/dynamic` の使用**: 初期表示に不要な重いコンポーネント（チャート、地図、リッチエディタ等）は `dynamic(() => import(...))` で遅延読み込みする。
- **Lazy Loading**: ルート遷移やスクロールに応じたコンポーネント読み込みを行う。

### 画像・フォント最適化
- **`next/image` の必須化**: <img> タグではなく `<Image>` コンポーネントを使用し、自動サイズ最適化、Lazy Loading、WebP変換を活用する。
- **フォント最適化**: `next/font` を使用し、レイアウトシフト（CLS）を防ぐ。

## 2. バンドルサイズ削減

### Tree Shaking
- **不要なライブラリの排除**: Lodash 全体ではなく必要な関数のみインポートする等、Tree Shaking が効くインポート方法を徹底する。
- **軽量ライブラリの選定**: Date-fns や Day.js など、軽量なライブラリを優先する（Moment.js は非推奨）。

### Code Splitting
- **ルート単位の分割**: Next.js の機能により自動で行われるが、共通ロジックが肥大化しないよう注意する。

## 3. データフェッチ最適化

### サーバーサイドフェッチ優先
- **Backend for Frontend (BFF)**: クライアントから直接複数のAPIを叩くのではなく、Server Components や Route Handlers でデータを集約して返す。
- **Waterfall の排除**: `Promise.all` を活用し、並列データ取得を行う。依存関係のないリクエストを直列に繋げない。

### キャッシュ戦略
- **Request Memoization**: 同一リクエスト内での重複フェッチを排除する（React `cache` 関数）。
- **Data Cache**: 更新頻度の低いデータはキャッシュし、ISR (Incremental Static Regeneration) や `revalidate` オプションを活用する。

## 4. 計測とモニタリング

- **Web Vitals**: LCP (Largest Contentful Paint), FID (First Input Delay), CLS (Cumulative Layout Shift) を意識した実装を行う。
- **Lighthouse**: CI/CD パイプラインや開発中に定期的に Lighthouse スコアを確認する。
