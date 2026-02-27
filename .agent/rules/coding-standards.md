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

## 2. TypeScript Typing (`any` vs `unknown`)

TypeScriptの型安全性を最大限に高めるため、以下の原則を徹底してください。

- **`any` の原則禁止**: 型チェックを無効化する `any` 型の使用は原則として禁止します。
- **`unknown` の使用**: 任意の型を受け入れる必要がある場合は、代わりに `unknown` を使用してください。
- **型ガードと検証**: `unknown` 型の値を使用する場合は、必ず `typeof` などの **型ガード (Type Guard)** や **Zod** 等による型検証 (バリデーション) を実装し、安全性を担保してから使用してください。
- 例外: 複雑なジェネリクスや外部ライブラリの型定義の不備で型解決が極めて困難な場合にのみ、最終手段として `any` を許容しますが、必ず `// eslint-disable-next-line @typescript-eslint/no-explicit-any` などのコメントを残し、理由を明記してください。

## 2. Build Stability (ビルド安定性)

- **事前のファイル確認**: import文を追加する前に、対象ファイルが存在することを必ず確認する。
- **依存関係の先行実装**: 新機能（Actionsなど）が必要な場合、参照する側のコードを書く前に、依存先のファイルを先に作成する。
- **完了前のビルドチェック**: タスク完了やレビュー依頼の前に、`npm run build` または `next build` を実行し、モジュール不足や型エラーがないことを保証する。

## 3. General Coding Rules

- **変数名**: 英語で分かりやすく命名する（ローマ字不可）。
- **Barrel Export**: `index.ts` を活用し、公開すべきものだけをエクスポートする。
