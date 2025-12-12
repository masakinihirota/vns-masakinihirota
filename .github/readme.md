# GitHub Copilot で OpenAI の plans.md 戦略を実行するための説明

このドキュメントは、GitHub Copilot を用いて `plans.md` 戦略を実行するための運用手順と参照ファイルをまとめたものです。

## plans.md 戦略で必要なファイル

- GitHub Copilotを制御する指示書: `copilot-instructions.md`
- plans.md 戦略の実行を制御する指示書: `agents.md`
- plans.md 戦略本体: `plans.md`
- GitHub Copilot の起動トリガー（/plans）: `plans.prompt.md`
- GitHub Copilot の起動トリガー（/review）: `review.prompt.md`

※トリガーはGitHub Copilot chat欄にスラッシュコマンドを入力することで起動します。
スラッシュコマンドとは単語の前にスラッシュ記号を付けて実行されるGitHub Copilotの機能です。
GitHub Copilotのプロンプトファイルの使い方を十分に理解して利用してください。
作成方法や実行方法などは、GitHub Copilotの公式ドキュメントを参照してください。

### plans.md

Qiita記事をご覧ください

### plans.prompt.md

このファイルにAIに書いてもらった設計書を記載しています。
起動前に、設計書を `plans.md` に読んでもらうように指示しています。
起動するとコードの実装が始まります。

### review.prompt.md

コード実装後に、GPT-5-Codex(別AIでも可) にレビューを依頼するためのトリガーです。
実装されたコードのレビューをしてもらいます。

## 起動方法(トリガー)

GitHub Copilot のチャット欄に以下を入力すると、それぞれの機能が起動します。

- `/plans` — plans.md 戦略を起動 モデルは GPT-5-Codex を使用 もしくは別のAIを使用
- `/review` — レビューを実施 GPT-5-Codex もしくは別のAIを使用

GPT-5-Codexは、コードレビューの実施と重大な欠陥の発見に特化した学習を受けています。
レビューを別のAIに任せると客観的な評価が得られます。

※GitHub Copilotのpromptシステムを十分に理解して利用してください。

## ドキュメントの更新

`agents.md`に、コードの変更があった場合、`docs\index.md`のドキュメントも同時に更新するように指示しています。

## 主要ファイル（リポジトリ内リンク）

### Copilot 関連指示ファイル

- [copilot-instructions.md](./copilot-instructions.md)

### plans.md 戦略関連指示ファイル

- [agents.md](../agents.md)
- [plans.md](../plans.md)
- [plans.prompt.md](./prompts/plans.prompt.md) #トリガー
- [review.prompt.md](./prompts/review.prompt.md) #トリガー

## 参考URL

plans.md 戦略の解説（外部）: Qiita 記事等をご参照ください。

GPT-5-Codex の概要 npaka
https://note.com/npaka/n/n8538f2ad7004

# 感想

GPT-5-Codex が高性能でコードの実装能力やレビューに特化した学習を受けていることがわかりました。
それに、AIがMCPなどを利用してネットにつながった今、指示書にいろいろな設定を書くよりも
ネットから最新の情報を直接取得したほうが良い場合があります。
なので、Webアプリ特有の指示以外はネットから情報を取得してもらうことで、
指示書をできるだけシンプルに保つことが出来るようになりました。
