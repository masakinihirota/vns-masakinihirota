---
description: UIコンポーネントの網羅的レビューとボーイスカウトルール適用
---

# UI Components Review Workflow

このワークフローは、`src/components/` 以下のUIレイヤー全体に対して、プロジェクトのコーディング規約（TDD、ディレクトリ構造、アクセシビリティ等）が正しく守られているかを網羅的にチェックし、軽微な問題は自動で修正（ボーイスカウトルール）します。

## 対象ディレクトリ・ファイル（推奨）

- `src/components/` 配下の全コンポーネントディレクトリ

## 手順

1.  **対象の抽出**: ユーザーが指定したコンポーネントディレクトリ、または `src/components/` 以下のサブディレクトリを順次対象とします。
2.  **規約・品質チェック**: 以下の観点でコードベースを検査します。
    - **Directory Structure**: フォルダとファイル名の一致、コロケーション原則（`.tsx`, `.logic.ts`, `.test.tsx` の分離）、`index.ts` によるBarrel Exportの徹底。
    - **TypeScript & Immutability**: `as const`, `readonly` 等の適切な使用、`any` の排除状況。
    - **Accessibility (a11y)**: UIコンポーネント用のテスト（`.test.tsx`）にて、`vitest-axe` を用いたアクセシビリティテスト(`toHaveNoViolations`)が実装されているか。コントラストやセマンティックHTMLへの配慮。
    - **Design/UX**: Glassmorphism / Elegant テーマのトークン変数（`--bg`, `--card` 等）が正しく使われているか。
3.  **ボーイスカウト適用**: 未使用変数の削除、明白な型エラーの修正、軽微なリファクタリング（インポート順の整理やコメントの日本語化など）を積極的に実施します。
4.  **レポート作成**: 修正した内容のサマリーと、自動修正できなかった中〜大規模な設計上の課題（コンポーネントの肥大化など）をユーザーに報告します。

## コマンド例

- `/ui-components-review`: 全 UI コンポーネントを順次レビューし、ボーイスカウトを適用
- `/ui-components-review src/components/profile-list`: 特定のコンポーネント群に対して実行
