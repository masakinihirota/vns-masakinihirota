---
description: package.jsonのバージョンを上げてタグを付け、GitHubのmainにプッシュする
---

1. mainブランチへantiブランチをマージします
   mainブランチへのマージに失敗したら終了します。

2. `package.json` のバージョンを上げます (Minor)。
   `npm version minor`
   ※ `npm version` コマンドが自動的に git commit と git tag 作成を行います。

3. 作成されたコミットとタグをリモートにプッシュします。
   `git push origin main --tags`

4. 成功したら anti ブランチに移動してユーザーに完了を報告します。
   `git checkout anti`
