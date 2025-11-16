Steps
Review the draft explanation from subagent analysis for completeness and gentleness.
Decide on file location: bak for proximity or docs for organization.
Create new file plans.jp.explanation.md with the finalized gentle explanation content.
Save and verify the file is readable.
Further Considerations
Location choice: Same directory keeps it close to original; docs folder centralizes docs—prefer docs for better project structure.
Content tweaks: Ensure all key sections (e.g., ExecPlans, Progress) are covered without jargon; add simple analogies if needed.

# 計画（日本語版：やさしい解説）

## 目的
masakinihirota プロジェクトの計画書（やさしい日本語版）を作成し、誰でも読みやすく理解できる説明を提供します。

## 手順
1. サブエージェント解析で作成されたドラフト説明を確認する
  - 内容が完全か（必要な項目が揃っているか）をチェック
  - 表現がやさしく、専門用語が多用されていないかを確認し、必要なら簡潔に言い換える

2. ファイル配置を決定する
  - bak（元ファイルと近い）か docs（ドキュメント集約）かを検討する
  - 推奨: docs 配下に配置してプロジェクトのドキュメント構造を整理する

3. 新規ファイルを作成する
  - ファイル名: plans.jp.explanation.md
  - 以下の主要セクションを含める: 概要(ExecPlans)、進捗(Progress)、背景、次のステップ、参照
  - 各セクションは短い段落＋箇条書きで要点を示す（見出しを付ける）

4. 保存と検証
  - UTF-8 で保存されているか、改行コードや表示崩れがないか確認する
  - 必要なら自動チェック（lint/CI）を実行して読み込み可能か検証する

5. レビューと配置
  - PR を作成してチームレビューを受ける
  - ドキュメントとして docs 配下に配置する場合は目次（SUMMARY.md 等）へのリンクを追加する

## 追加の配慮
- 配置の判断: docs に置くとドキュメントが一元化され管理しやすい。一方で bak は原稿や下書きの保管に適する。推奨は docs 配下に置き、必要なら bak にコピーを残すか、バージョン履歴で管理すること。
- 内容の調整:
  - ExecPlans：何を達成するか、なぜ重要か、成功の判断基準を短く記載
  - Progress：現在の状況、完了済みタスク、残タスク、次のアクションを簡潔に記載
- 表現: 技術的な用語は必要最低限にし、可能なら簡単な比喩を入れて説明を補強する
  - 例：ExecPlans は「地図」、Progress は「目的地への現在地を示す目印」のような比喩
- 検証: 少なくとも 1〜2 名のレビュワーによる校閲を行い、読みやすさと誤訳がないか確認する

## 参考フォーマット（例）
- 概要
  - 1〜2 文の要約
  - 目的、背景
- ExecPlans
  - 主要目標
  - 成功基準（OKR/成果指標）
- Progress
  - 現在の状態
  - 完了したことと次の作業
- 次のステップ
  - タスクと担当
- 参照
  - 関連資料、リンク、関連タスク

Tips:
- ドキュメントは小さな単位でコミットし、PR の説明に「何を変えたか」を明確に書くとレビューが速くなります。
- 文書更新時は必ず目次やリンクの整合性を確認してください。
- できれば native 日本語話者のレビューを入れて読みやすさを担保しましょう。
- GitHub Copilot
