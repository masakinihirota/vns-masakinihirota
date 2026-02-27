# Home Trial Component

体験版（ログイン前）のホーム画面およびマンダラチャート機能を提供するコンポーネント群です。

## ディレクトリ構成

- `home-trial/`: 体験版ホーム画面のメインコンポーネント
- `mandala-chart/`: マンダラチャートの表示・編集コア機能
- `trial-migration-modal/`: 体験版データの正規アカウントへの引き継ぎ機能

## 主な修正内容 (Boy Scout Rule)

### 1. ESLint エラー & 警告の解消
- **set-state-in-effect**: `useState` の初期化関数（Lazy Initialization）を活用し、`useEffect` 内での同期的な状態更新を排除しました。
- **no-restricted-syntax (try/catch)**: ビュー層（React Component）から `try/catch` を排除し、ロジック層（`*.logic.ts`）に例外処理を委譲、または `.catch()` チェーンに変更しました。
- **no-explicit-any**: テストコードやモック、データ構造における `any` 型を具体的な型定義に置き換えました。

### 2. コンポーネント構造のリファクタリング
- `mandala-chart.tsx` 内で定義されていた `MiniGrid` サブコンポーネントをトップレベル（ファイル外）に移動しました。これにより、レンダリングごとの関数再定義を防ぎ、パフォーマンスと可読性を向上させました。

### 3. 型安全性の向上
- `MandalaChartProps` および関連するデータ構造に `readonly` 修飾子を付与し、不変性を強化しました。
- 座標定義（`GRID_POSITIONS`）などの定数を `as const` で定義しました。

### 4. テストとアクセシビリティ
- `home-trial.test.tsx` で `vitest-axe` によるアクセシビリティチェックを維持し、型エラーを解消しました。
- ロジックの抽出に伴い、テストの信頼性を向上させました。
