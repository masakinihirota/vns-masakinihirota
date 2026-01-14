---
description: チェック、ビルド、コミット、プッシュ、マージ、およびバージョンタグ付けを一括で行う。
---

現在のブランチでの品質チェックとビルド確認、および main へのマージとリリース（タグ付け）を自動または半自動で行います。

### 1. 静的チェックと自動修正

// turbo
pnpm run lint:fast:fix
// turbo
pnpm run format:fast

エラーが残っている場合は、エージェントが手動で修正を試みます。
再度チェックを実行し、合格するまで繰り返します。

### 2. 現在のブランチの保護（コミット & プッシュ）

作業中のブランチ（例: `anti`）で、これまでの変更をコミットし、リモートにプッシュします。
`git add .`
`git commit -m "chore: pre-merge checks and updates"`
`git push origin [現在のブランチ名]`

### 3. 上流（main）の取り込み

最新の `main` を作業ブランチにマージし、競合がないか確認します。
`git fetch origin main`
`git merge origin/main`
※ コンフリクトが発生した場合は、エージェントが解消を支援します。

### 4. ビルド確認

マージ後の状態でビルドが通るか最終確認します。
// turbo
pnpm run build

### 5. main ブランチへのマージとリリース

全てのチェックが通過したら、`main` ブランチに切り替えてマージし、バージョンを上げます。

現在のブランチ名を控えておいてください。
`git checkout main`
`git pull origin main`
`git merge [作業ブランチ名]`

**バージョンアップとタグ付け**
`npm version minor`
※ このコマンドにより、`package.json` の更新、Git コミット、および Git タグの作成が自動的に行われます。

### 6. リモートへの最終プッシュ

作成されたコミットとタグを `main` にプッシュします。
`git push origin main --tags`

### 7. 元のブランチへの復帰

作業を継続するため、元のブランチに戻ります。
`git checkout [作業ブランチ名]`

完了したらユーザーに報告してください。
