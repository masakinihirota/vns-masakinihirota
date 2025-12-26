---
description: package.jsonのバージョンを上げてタグを付け、GitHubのmainにプッシュする
---

1. 作業を開始する前に、現在のブランチに未コミットの変更がないか確認します。
   `git status`
   変更がある場合は、ユーザーに報告して終了するか、stashしてcleanな状態にしてください。

2. mainブランチに移動し、最新化します。
   `git checkout main`
   `git pull origin main`
   移動やpullに失敗したら終了します。

3. `package.json` のバージョンを上げます (Minor)。
   `npm version minor`
   ※ `npm version` コマンドが自動的に git commit と git tag 作成を行います。

4. 作成されたコミットとタグをリモートにプッシュします。
   `git push origin main --tags`

5. 成功したら anti ブランチに戻り、ユーザーに完了を報告します。
   `git checkout anti`
