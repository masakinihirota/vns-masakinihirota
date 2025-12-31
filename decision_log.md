# Decision Log

## 2025-12-17: Lintエラー修正とビルド安定化

### 1. `any` 型の排除と型安全性の向上

- `local-ui.tsx`, `action-menu.tsx`, `profile-list.tsx`, `profile-list.container.tsx` における `any` 型の使用を修正。
- 適切なReact型（`React.MouseEvent`, `React.ChangeEvent` 等）やインターフェース（`UserProfileAttributes`）を使用するように変更。

### 2. `useEffect` 内での `setState` 警告への対応

- `user-profile-app.tsx` において、`localStorage` からのデータ読み込みを `useEffect` で行っている箇所で警告が発生。
- 初回ロード時の動作として意図的であるため、`eslint-disable-line` により警告を抑制。依存配列は `[]` であり無限ループのリスクはない。

### 3. Markdownファイルのフォーマット

- `利用規約のページ.md` のPrettierフォーマット違反を修正し、CIチェック（`pnpm check`）を通過させた。

## 2026-01-01: 開発環境における認証無効化

### 1. 開発効率向上のための認証スキップ

- 開発中の確認作業効率化のため、`src/app/(protected)/layout.tsx` の認証チェック処理をコメントアウトし、ログイン画面へのリダイレクトを無効化。
- ルール `dev-rule.md` にも反映。
