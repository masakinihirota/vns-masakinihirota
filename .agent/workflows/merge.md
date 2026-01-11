---
description: commitとマージを行う。
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

一通り終わったら、
pnpm run build が通るかをチェックします。
チェックが通らなかったらエラーを修正します。

もしリファクタリングしたほうが良い箇所を見つけたら少しづつより良いコードにしていきましょう。
ボーイスカウトルールです。

問題なければコミットしてください。
commitが失敗したらエラーの原因を突き止めて修正します。
そして最後にcommitとpushを行います。

mainブランチへantiブランチをマージします
   mainブランチへのマージに失敗したら終了します。

`package.json` のバージョンを上げます (Minor)。
   `npm version minor`
   ※ `npm version` コマンドが自動的に git commit と git tag 作成を行います。

作成されたコミットとタグをリモートにプッシュします。
   `git push origin main --tags`

成功したら anti ブランチに移動してユーザーに完了を報告します。
   `git checkout anti`
