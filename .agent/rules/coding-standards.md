---
trigger: always_on
---

# Coding Standards

コード品質、型安全性、およびビルド安定性を保つための技術的基準です。

## 1. TypeScript Immutability (不変性)

コンパイル時の安全性とDXのバランスを考慮し、以下の基準で型定義を行ってください。

- **Level 2 (`as const`)**: 静的な定数、設定値、マスタデータには必ず `as const` を使用する。
  ```typescript
  export const NAV_ITEMS = [{ label: "Home", href: "/" }] as const;
  ```
- **Level 1 (`readonly`)**: コンポーネントのPropsやデータ受け渡しには `readonly` 修飾子を使用する。
- **禁止事項**: `Object.freeze` (実行時コスト) や `DeepReadonly` (複雑すぎ) は使用しない。

## 2. Build Stability (ビルド安定性)

- **事前のファイル確認**: import文を追加する前に、対象ファイルが存在することを必ず確認する。
- **依存関係の先行実装**: 新機能（Actionsなど）が必要な場合、参照する側のコードを書く前に、依存先のファイルを先に作成する。
- **完了前のビルドチェック**: タスク完了やレビュー依頼の前に、`npm run build` または `next build` を実行し、モジュール不足や型エラーがないことを保証する。

## 3. General Coding Rules

- **日本語コメント**: コード内のコメント（Docstring含む）はすべて**日本語**で記述する。
- **変数名**: 英語で分かりやすく命名する（ローマ字不可）。
- **Barrel Export**: `index.ts` を活用し、公開すべきものだけをエクスポートする。
