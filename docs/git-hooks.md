# Git Hooks について

このプロジェクトでは、コード品質を保つために Git hooks を使用しています。

## Pre-commit Hook

コミット前に以下のチェックが自動実行されます:

### 1. ダークモード対応チェック

`src/app/` 配下のページコンポーネント (.tsx) が以下の条件を満たしているか確認:

- **チェック内容**:
  - `bg-white`, `bg-gray-*`, `text-gray-*`, `border-gray-*` など色指定のクラスがある場合
  - 対応する `dark:` バリアントが同じ className 内に含まれているか

- **エラー例**:
  ```tsx
  // ❌ NG: dark: バリアントがない
  <div className="bg-white text-gray-900">

  // ✅ OK: dark: バリアントがある
  <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  ```

### 2. i18n対応チェック

**現在無効化されています** (時期尚早のため)

将来的に有効化予定:
- ハードコードされた日本語テキストの検出
- `useLocale()` フックの使用確認
- `t()` 関数の使用確認

## 使用方法

### 自動実行

通常のコミット時に自動実行されます:

```bash
git add .
git commit -m "feat: 新機能追加"
# ↑ この時点で自動チェックが実行されます
```

### 手動実行

特定のファイルをチェックする場合:

```bash
pnpm check:pages src/app/page.tsx src/app/not-found.tsx
```

または

```bash
node scripts/check-page-compliance.js "src/app/page.tsx"
```

## チェックをスキップする（非推奨）

緊急時のみ、以下のコマンドでチェックをスキップできます:

```bash
git commit --no-verify -m "WIP: 作業中"
```

⚠️ **注意**: 本番環境へのデプロイ前には必ずチェックを通過させてください。

## トラブルシューティング

### Husky が動作しない場合

```bash
pnpm prepare
```

を実行して Husky を再初期化してください。

### チェックが厳しすぎる場合

`scripts/check-page-compliance.js` の以下の設定を調整できます:

- `SKIP_PATTERNS`: チェック対象から除外するパスパターン
- `COLOR_CLASSES`: ダークモード対応をチェックする色クラスのリスト

## 設定ファイル

- `.husky/pre-commit`: pre-commit hook スクリプト
- `package.json`: `lint-staged` 設定
- `scripts/check-page-compliance.js`: チェックスクリプト本体
