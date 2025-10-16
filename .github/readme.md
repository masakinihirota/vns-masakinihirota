# GitHub Copilot で plans.md 戦略を実行するための説明

このドキュメントは、GitHub Copilot を用いて `plans.md` 戦略を実行するための運用手順と参照ファイルをまとめたものです。

リポジトリでは役割を分離しています：

- GitHub Copilot を制御する指示書: `copilot-instructions.md`
- plans.md 戦略の実行を制御する指示書: `agents.md`
- plans.md 戦略本体: `plans.md`
- Copilot の起動トリガー（prompt）: `plans.prompt.md` など（`.github/prompts/` 配下）

## 起動方法(トリガー)
GitHub Copilot のチャット欄に以下を入力すると、それぞれの機能が起動します。

- `/plans` — plans.md 戦略を起動 モデルは GPT-5-Codex を使用
- `/review` — レビューを実施 GPT-5-Codex もしくは別のAIを使用

レビューを別のAIに任せると、より客観的な評価が得られます。

※GitHub Copilotのpromptシステムを十分に理解して利用してください。

## 参考資料
- plans.md 戦略の解説（外部）: Qiita 記事等をご参照ください。

## 主要ファイル（リポジトリ内リンク）

### Copilot 関連
- [copilot-instructions.md](./copilot-instructions.md)

### plans.md 戦略関連
- [agents.md](../agents.md)
- [plans.md](../plans.md)
- [plans.prompt.md](./prompts/plans.prompt.md) #トリガー
- [review.prompt.md](./prompts/review.prompt.md) #トリガー



