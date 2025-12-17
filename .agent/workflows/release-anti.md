---
description: package.jsonのバージョンを上げてタグを付け、GitHubのmainにプッシュする
---

mainタグに移動します。
`git checkout main`
移動できなかったらこのworkflowを終了します。

`package.json` のバージョンを上げます (Minor)。

更新したバージョンの確認
`npm version patch`

tagをバージョンに合わせてつけます。

バージョン番号を上げたのと、タグを付けるのを成功したら、
変更とタグをmainのリモートリポジトリにプッシュします。
