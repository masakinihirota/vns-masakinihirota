---
name: vercel-react-best-practices
description: VercelエンジニアリングによるReactとNext.jsのパフォーマンス最適化ガイドライン。React/Next.jsコードの記述、レビュー、リファクタリング時に、最適なパフォーマンスパターンを保証するために使用します。Reactコンポーネント、Next.jsページ、データ取得、バンドル最適化、パフォーマンス改善に関するタスクでトリガーされます。
---

# Vercel React Best Practices

Vercelが管理する、ReactおよびNext.jsアプリケーションの包括的なパフォーマンス最適化ガイドです。8つのカテゴリにわたる45のルールが含まれており、自動リファクタリングとコード生成を導くために影響度順に優先順位付けされています。

## 適用タイミング (When to Apply)

以下の場合にこれらのガイドラインを参照してください：

- 新しいReactコンポーネントやNext.jsページを作成する時
- データ取得（クライアントまたはサーバーサイド）を実装する時
- コードのパフォーマンス問題をレビューする時
- 既存のReact/Next.jsコードをリファクタリングする時
- バンドルサイズや読み込み時間を最適化する時

## 優先度別ルールカテゴリ (Rule Categories by Priority)

| 優先度 | カテゴリ | 影響度 | プレフィックス |
| --- | --- | --- | --- |
| 1 | ウォーターフォールの排除 | **重要** | `async-` |
| 2 | バンドルサイズ最適化 | **重要** | `bundle-` |
| 3 | サーバーサイドパフォーマンス | 高 | `server-` |
| 4 | クライアントサイドデータ取得 | 中〜高 | `client-` |
| 5 | 再レンダリング最適化 | 中 | `rerender-` |
| 6 | レンダリングパフォーマンス | 中 | `rendering-` |
| 7 | JavaScriptパフォーマンス | 低〜中 | `js-` |
| 8 | 高度なパターン | 低 | `advanced-` |

## クイックリファレンス (Quick Reference)

### 1. ウォーターフォールの排除 (CRITICAL)

- `async-defer-await` - awaitを実際に使用される分岐内に移動する
- `async-parallel` - 独立した操作には Promise.all() を使用する
- `async-dependencies` - 部分的な依存関係には better-all を使用する
- `async-api-routes` - APIルートではPromiseを早く開始し、遅くawaitする
- `async-suspense-boundaries` - コンテンツのストリーミングに Suspense を使用する

### 2. バンドルサイズ最適化 (CRITICAL)

- `bundle-barrel-imports` - バレルファイルを避け、直接インポートする
- `bundle-dynamic-imports` - 重いコンポーネントには next/dynamic を使用する
- `bundle-defer-third-party` - 分析やログ機能はハイドレーション後に読み込む
- `bundle-conditional` - 機能が有効化された時のみモジュールを読み込む
- `bundle-preload` - 体感速度向上のためホバーやフォーカスでプリロードする

### 3. サーバーサイドパフォーマンス (HIGH)

- `server-cache-react` - リクエストごとの重複排除に React.cache() を使用する
- `server-cache-lru` - リクエスト間のキャッシュに LRU キャッシュを使用する
- `server-serialization` - クライアントコンポーネントに渡すデータを最小限にする
- `server-parallel-fetching` - フェッチを並列化するようにコンポーネントを再構成する
- `server-after-nonblocking` - ノンブロッキング操作には after() を使用する

### 4. クライアントサイドデータ取得 (MEDIUM-HIGH)

- `client-swr-dedup` - 自動リクエスト重複排除に SWR を使用する
- `client-event-listeners` - グローバルイベントリスナーを重複排除する

### 5. 再レンダリング最適化 (MEDIUM)

- `rerender-defer-reads` - コールバックでのみ使用される状態を購読しない
- `rerender-memo` - 重い処理をメモ化されたコンポーネントに抽出する
- `rerender-dependencies` - エフェクトの依存関係にプリミティブ値を使用する
- `rerender-derived-state` - 生の値ではなく、派生したブール値を購読する
- `rerender-functional-setstate` - 安定したコールバックのために関数型 setState を使用する
- `rerender-lazy-state-init` - 重い初期値には useState に関数を渡す
- `rerender-transitions` - 緊急でない更新には startTransition を使用する

### 6. レンダリングパフォーマンス (MEDIUM)

- `rendering-animate-svg-wrapper` - SVG要素ではなくdivラッパーをアニメーションさせる
- `rendering-content-visibility` - 長いリストには content-visibility を使用する
- `rendering-hoist-jsx` - 静的なJSXをコンポーネントの外に抽出する
- `rendering-svg-precision` - SVGの座標精度を下げる
- `rendering-hydration-no-flicker` - クライアント専用データにはインラインスクリプトを使用する
- `rendering-activity` - 表示/非表示には Activity コンポーネントを使用する
- `rendering-conditional-render` - 条件分岐には && ではなく三項演算子を使用する

### 7. JavaScriptパフォーマンス (LOW-MEDIUM)

- `js-batch-dom-css` - クラスや cssText でCSS変更をまとめる
- `js-index-maps` - 繰り返しの検索には Map を構築する
- `js-cache-property-access` - ループ内でのオブジェクトプロパティアクセスをキャッシュする
- `js-cache-function-results` - 関数の結果をモジュールレベルの Map にキャッシュする
- `js-cache-storage` - localStorage/sessionStorage の読み取りをキャッシュする
- `js-combine-iterations` - 複数の filter/map を1つのループにまとめる
- `js-length-check-first` - 重い比較の前に配列の長さをチェックする
- `js-early-exit` - 関数から早めにリターンする
- `js-hoist-regexp` - RegExpの作成をループの外に移動する
- `js-min-max-loop` - sort の代わりにループで最小/最大を求める
- `js-set-map-lookups` - O(1) 検索のために Set/Map を使用する
- `js-tosorted-immutable` - 不変性のために toSorted() を使用する

### 8. 高度なパターン (LOW)

- `advanced-event-handler-refs` - イベントハンドラを ref に保存する
- `advanced-use-latest` - 安定したコールバック ref に useLatest を使用する

## 使用方法 (How to Use)

詳細な説明とコード例については、個々のルールファイルを参照してください：

```
rules/async-parallel.md
rules/bundle-barrel-imports.md
rules/_sections.md
```

各ルールファイルには以下が含まれています：

- なぜそれが重要かという簡潔な説明
- 誤ったコード例とその説明
- 正しいコード例とその説明
- 追加のコンテキストと参照

## 完全なドキュメント (Full Compiled Document)

すべてのルールが展開された完全なガイドについては、`AGENTS.md` を参照してください。
