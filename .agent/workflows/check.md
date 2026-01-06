---
description: formatとlintツールでのチェック 最後にbuildが通るかをチェックする
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

一通り終わったら、最後に
pnpm run build が通るかをチェックします。
チェックが通らなかったらエラーを修正します。

終わったらレビューを行い、問題なければコミットしてください。
commitが失敗したらエラーの原因を突き止めて修正します。
そして最後にcommitとpushを行います。
