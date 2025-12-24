---
description: antiブランチでバージョンを上げてタグを付け、GitHubにプッシュする
---

1. 現在のブランチが `anti` であることを確認し、repositoryの状態を最新にします。
   - `git checkout anti`

2. `package.json` のバージョンを上げます (patch)。
   - `npm version patch`
   - これにより、`package.json` の更新、コミットの作成、gitタグの作成が自動的に行われます。

3. 変更とタグをリモートリポジトリにプッシュします。
   // turbo
   - `git push origin anti --tags`
