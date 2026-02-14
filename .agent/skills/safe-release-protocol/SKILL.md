---
name: safe-release-protocol
description: 安全にコード変更をリリースするためのプロトコル。ブランチ管理、リリース前チェック、gitフック失敗時の対応を含みます。
---

# Safe Release Protocol

このプロトコルは、本番環境（`main` ブランチ）への変更のリリースとバージョンダグ管理の標準ワークフローを定義します。

## 1. リリース前チェックリスト (Pre-Release Checklist)

`main` にマージする前に、`anti`（開発）ブランチがクリーンで検証済みであることを確認してください。

1.  **静的解析 (Static Analysis)**:
    ```bash
    pnpm run lint:fix
    pnpm run format:fix
    pnpm audit --audit-level=moderate
    ```
2.  **型チェック (Type Check)**:
    ```bash
    pnpm run check  # または tsc --noEmit
    ```
3.  **ビルド検証 (Build Verification)** (重要):
    ```bash
    pnpm run build
    ```
    _もしビルドが失敗した場合は、絶対に先に進まないでください。まず `anti` で修正してください。_

## 2. リリースワークフロー (Release Workflow)

1.  **Mainへのマージ**:
    ```bash
    git checkout main
    git pull origin main
    git merge anti
    ```
2.  **バージョン更新**:
    ```bash
    npm version minor # または patch/major
    # これにより package.json の更新と git tag の作成が行われます
    ```
3.  **リモートへのプッシュ**:
    ```bash
    git push origin main --tags
    ```

## 3. リリース後の同期 (Post-Release Sync)

開発ブランチを同期された状態に保ちます。

1.  **Antiの同期**:
    ```bash
    git checkout anti
    git merge main
    ```
2.  **Antiのプッシュ**:
    ```bash
    git push origin anti
    ```

## 4. トラブルシューティング (Troubleshooting)

### Pre-push Hook の失敗 (Husky/Oxlint)

`git push` が pre-push hook (例: exit code 139, segfault, timeout) により失敗し、**かつ** ステップ1で手動によるビルドとリントの検証が完了している場合:

1.  **再試行**: 一時的な問題である場合があります。
2.  **バイパス**: 問題が解決せず、コード品質に自信がある場合（ステップ1がパスしているため）:
    ```bash
    git push origin anti --no-verify
    ```
    _注意: 正当なリントエラーを無視するために `--no-verify` を使用しないでください。ツール自体がクラッシュする場合のみ使用してください。_

### `route.ts` でのビルドエラー

APIルートの型エラーで `next build` が失敗する場合:

- `Context` 型のインポートを確認してください。
- 重大なリリースのブロックを解除するために厳密に必要な場合は、一時的に `any` を使用し、直後に型修正のタスクを作成してください。

### エディタの破損 (Editor Corruptions)

意味不明な構文エラー（不可視文字、壊れた文字列など）が表示される場合:

- `view_file` を使用して生のコンテンツを検査してください。
- 何度もパッチを当てるのではなく、`write_to_file` (overwrite) でファイル全体をクリーンなコードで書き換えてください。
