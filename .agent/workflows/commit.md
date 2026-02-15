---
description: チェック、ビルド、コミット、プッシュ、マージ、およびバージョンタグ付けを一括で行う。
---

現在のブランチでの品質チェックとビルド確認、および main へのマージとリリース（タグ付け）を自動または半自動で行います。

### 1. 静的チェックと自動修正

// turbo
pnpm run lint:fix
// turbo
pnpm run format:fix
// turbo
pnpm audit --audit-level=moderate

### 2. 利用者向けドキュメントの最新化

コミット前に、現在の実装状況（実態）と要件定義を対比させた最新のドキュメントを生成します。

// turbo
`/generate-docs` ワークフローを実行し、以下のファイルを更新します。

- `doc/features.md`
- `doc/user-guide.md`
- `doc/updates.md`

更新されたドキュメントを含めて、次のステップでコミットを行います。

### 3. 現在のブランチの保護（コミット & プッシュ）

作業中のブランチ（例: `anti`）で、これまでの変更をコミットし、リモートにプッシュします。
`git add .`
`git commit -m "chore: pre-merge checks and updates"`
`git push origin [現在のブランチ名]`

### 4. 上流（main）の取り込み

最新の `main` を作業ブランチにマージし、競合がないか確認します。
`git fetch origin main`
`git merge origin/main`
※ コンフリクトが発生した場合は、エージェントが解消を支援します。

### 5. ビルド確認

マージ後の状態でビルドが通るか最終確認します。
// turbo
pnpm run build

### 6. main ブランチへのマージとリリース

全てのチェックが通過したら、`main` ブランチに切り替えてマージし、バージョンを上げます。

現在のブランチ名を控えておいてください。
`git checkout main`
`git pull origin main`
`git merge [作業ブランチ名]`

**バージョンアップとタグ付け**
`npm version minor`
※ このコマンドにより、`package.json` の更新、Git コミット、および Git タグの作成が自動的に行われます。

### 7. リモートへの最終プッシュ

作成されたコミットとタグを `main` にプッシュします。
`git push origin main --tags`

### 8. 元のブランチへの復帰

作業を継続するため、元のブランチに戻ります。
`git checkout [作業ブランチ名]`

元のブランチに戻った後、まだpushされてなかったらpushを実行します。

完了したらユーザーに報告してください。
