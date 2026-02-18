---
name: ai-design-sync
description: Source design documents (anti-design) and agent rules (.agent/rules) monitor and synchronize to AI-managed design documents (ai-design).
---

# ai-design-sync スキル

## 目的

人間が更新する `anti-design` フォルダの内容と、エージェントの最新ルール（`.agent/rules`）を常に同期し、`vns-masakinihirota-ai-design`（以下 `ai-design`）を真実のソースとして維持します。

## 同期トリガー

- ユーザーによる明示的な `/sync-design` コマンドの実行。
- 開発作業開始時の自主的な更新チェック。

## 同期の優先順位

1. **最優先**: `.agent/rules` および `skills` 内の制約（AIGCとしての行動規範、技術スタック）。
2. **優先**: `anti-design` 内の業務要件・思想。
3. **反映先**: `ai-design` 内の各 Markdown ドキュメント。

## 同期手順

### 1. 変更検知

- 以下のディレクトリ内のファイルの最終更新日時（mtime）を確認し、`ai-design` 側の更新日時と比較します。
  - `u:\2026src\vns-masakinihirota-design.worktrees\anti-design` (設計ソース)
  - `u:\2026src\vns-masakinihirota.worktrees\anti\.agent\rules` (エージェントルール)
- 指定した時間よりファイルの更新時間が後でない場合は保存できていないと判断し、原因を調査します。

### 2. 解析と統合

- **ルール変更時**: `AI_UX_Design.md`、`System_Architecture.md`、`Operations_Policy.md` を中心に、新しいルールに基づいた修正を適用します。
- **要件変更時**: `01_Requirements` 以下の該当ドキュメントを更新し、それによるアーキテクチャへの影響がある場合は `02_Architecture_Design` も調整します。

### 3. 書き出しと記録

- 更新したファイルを `ai-design` ディレクトリへ上書き保存します。
- `walkthrough.md` または `decision_log.md` に同期内容の詳細を記録します。
- `notify_user` を使用して、同期した項目と変更内容のサマリーを報告します。

## 注意事項

- **破壊的変更の禁止**: `ai-design` 側で追加された AI 特有の最適化（ディレクトリ構造、ネーミング規則等）を、`anti-design` の更新によって消失させないよう注意してください。
- **整合性**: ファイル間のリンク（`file:///` 形式のリンク）が壊れていないか確認してください。
