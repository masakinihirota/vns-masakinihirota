---
description: チェック、ビルド、コミット、プッシュ、マージ、およびバージョンタグ付けを一括で行う。
---

現在のブランチ（anti or dev）でのコード品質チェックとビルド確認、および main へのマージとリリース（バージョン更新・タグ付け）を自動または半自動で行います。

**前提条件**: コミット済みの変更があります。未コミットの変更がある場合は先に処理してください。

⚠️ **GitHub Push Protection について**: 秘密スキャンで過去のコミットがブロックされる場合、[リモート秘密スキャンの Bypass/Unblock ページ](https://github.com/masakinihirota/vns-masakinihirota/security/secret-scanning) から該当する秘密をアンロックしてください。または、以下を参照：https://docs.github.com/code-security/secret-scanning/working-with-secret-scanning-and-push-protection/working-with-push-protection-from-the-command-line#resolving-a-blocked-push

### 1. 現在のブランチを確認

```bash
git branch -vv
```

✅ 現在 `anti` ブランチにいて、uncommitted changes がないことを確認します。

### 2. 品質チェック（lint + typecheck + test）

```bash
pnpm ci
```

このコマンドは以下を順に実行します：
- `pnpm typecheck` - TypeScript 型チェック
- `pnpm lint` - ESLint による静的解析
- `pnpm build` - ビルド確認
- `pnpm test` - ユニットテスト実行

✅ すべてのチェックが pass することを確認してください。

### 3. anti ブランチを push

```bash
git push origin anti
```

⚠️ **重要**: 現在のブランチは `origin/anti` より ahead の状態です。必ずここで push してください。

### 4. 上流（main）の取り込み

```bash
git fetch origin main
git merge origin/main
```

✅ コンフリクトがないことを確認してください。
※ コンフリクトが発生した場合は、手動で解消し、解消後に `git add .` → `git commit -m "chore: resolve merge conflict"` を実行してください。

### 5. マージ後の品質チェック（ビルド確認）

```bash
pnpm build
```

✅ ビルドが成功することを確認してください。

### 6. main ブランチへの切り替えと最新化

```bash
git checkout main
git pull origin main
```

✅ `main` ブランチが最新の状態になったことを確認してください。

### 7. anti ブランチを main にマージ

```bash
git merge anti
```

✅ マージが成功することを確認してください。

### 8. バージョンアップとタグ付け

```bash
pnpm version minor
```

※ このコマンドにより以下が自動的に行われます：
- `package.json` のバージョン更新
- コミット作成（メッセージ: `v[新バージョン]`）
- タグ作成（タグ名: `v[新バージョン]`）

✅ バージョンが正しく更新されたことを確認してください。

### 9. タグ付きコミットをリモートに push

```bash
git push origin main --tags
```

✅ main ブランチとタグがリモートに push されたことを確認してください。

### 10. anti ブランチに復帰

```bash
git checkout anti
```

✅ 作業ブランチに戻ったことを確認してください。

### 11. anti ブランチをリモートに push（今後の作業用）

```bash
git push origin anti
```

✅ すべての操作が完了しました。ユーザーに完了を報告してください。
