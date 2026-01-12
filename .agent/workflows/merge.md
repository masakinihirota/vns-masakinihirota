---
description: commitとpushとmergeを行う。
---

pnpm run lint:fast
pnpm run format:fast
を行ってエラーがあれば修正を行います。
自動修正のために以下を実行してください：
pnpm run lint:fast:fix
（※ format:fast は実行時に自動修正(write)されます）

それでもエラーが修正できなかったら、
更に現在のエージェントが修正を行います。
修正が終わったら再び
pnpm run lint:fast
pnpm run format:fast
を実行します。
通らなかったら最初からやり直します。

一通り終わったら、現在のブランチでコミットとpushしてください。
commitが失敗したらエラーの原因を突き止めて修正します。

念のため、mainブランチを現在のブランチにマージして競合がないか確認してください（コンフリクトがあれば解消します）。
`git merge main`
（※ 必要であれば事前に `git fetch origin main` や `git pull origin main` を行ってください）

マージが完了したら、pnpm run build が通るかをチェックします。
チェックが通らなかったらエラーを修正します。

もしリファクタリングしたほうが良い箇所を見つけたら少しづつより良いコードにしていきましょう。
ボーイスカウトルールです。
（※ 修正を行った場合は再度コミットしてください）

全てのチェックが通ったら、最後にmainへのマージとpushを行います。

現在のブランチ名を控えておいてください。
`git checkout main`
`git pull origin main`
`git merge [控えておいたブランチ名]`
mainブランチへのマージに失敗したら終了します。

作成されたコミットをリモートにプッシュします。
`git push origin main`

成功したら元のブランチに戻ってユーザーに完了を報告します。
`git checkout [控えておいたブランチ名]`
