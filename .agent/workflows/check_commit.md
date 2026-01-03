---
description: formatとlintツールでのチェック 最後にbuildが通るかをチェックする
---

pnpm run lint:fast
pnpm run format:fast
を行ってエラーがあれば修正を行い、
pnpm run format:fast:fix

それでエラーが修正できなかったら、
更に現在のエージェントが修正を行います。
修正が終わったら再び
pnpm run lint:fast
pnpm run format:fast
を実行します。
通らなかったら最初からやり直します。

一通り終わったら、最後に
pnpm run build が通るかをチェックします。
チェックが通らなかったらエラーを修正します。

終わったらレビューを行ってください。

レビューが終わったらgit commit をしてください。
