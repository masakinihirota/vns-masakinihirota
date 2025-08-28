---
applyTo: "**"
---

## Serena MCP の運用統合（標準フロー）

Serena MCP はプロジェクト全体のメタ情報と開発ツール群を提供します（設定: [.serena/project.yml](U:\2025src___masakinihirota\vns-masakinihirota.serena\project.yml)）。以下の運用フローを各 Phase で徹底します。

- 初回セットアップ（リポジトリクローン後/環境更新時のみ）

  - activate_project（プロジェクト有効化）
  - onboarding または check_onboarding_performed（初期タスク検出）
  - get_current_config（利用可能ツール確認）

- タスク開始時チェック（毎タスク）

  - list_dir と read_file で `.serena/` と設計書の最新状態を確認
  - think_about_collected_information（現在の前提/抜け漏れ検出）
  - prepare_for_new_conversation（必要に応じて会話リセット指示）
  - task 定義を要件のどの項目に紐づけるか明示（設計書パスと章立てを添える）

- タスク実行中（実装・設計・テスト）

  - find_symbol / find_referencing_symbols（影響範囲の静的調査）
  - search_for_pattern（横断検索で既存実装の再利用）
  - summarize_changes（差分の要約とレビューポイント抽出）
  - think_about_task_adherence（現在の作業がタスク範囲内かのセルフチェック）

- タスク終了時（毎タスク）
  - write_memory（今回の決定事項/前提/未決事項をメモリに反映）
  - think_about_whether_you_are_done（完了宣言前の最終自己点検）
  - 必要に応じて restart_language_server（IDE 同期不整合がある場合）

## Serena MCP ツールの代表用途

詳細は [.serena/project.yml](U:\2025src___masakinihirota\vns-masakinihirota.serena\project.yml) を参照。主に以下を使用します。

- activate_project / get_current_config / onboarding / check_onboarding_performed
- list_dir / read_file / search_for_pattern
- find_symbol / find_referencing_symbols / find_referencing_code_snippets
- summarize_changes / prepare_for_new_conversation
- think_about_collected_information / think_about_task_adherence / think_about_whether_you_are_done
- write_memory / delete_memory
- replace_lines / insert_at_line（自動編集はレビュー前提、破壊的変更禁止）

## Serena MCP チャット用テンプレート

- 開始時
  - 「このタスクの前提を整理。設計書パスと該当章は X。抜け漏れを think_about_collected_information で指摘して」
  - 「影響範囲を find_symbol と find_referencing_symbols で洗い出して」
- 実装中
  - 「差分を summarize_changes。レビューフォーカス（型安全/責務分離/500 行以内/any 禁止）で」
  - 「今の作業はタスク範囲に収まっているか think_about_task_adherence」
- 終了時
  - 「write_memory で決定事項と未決事項を記録。次タスクへの TODO を箇条書きで」
  - 「完了チェックを think_about_whether_you_are_done」

## メモリ運用ルール

- 記録対象: 決定事項、採用/不採用案の理由、既知の制約、保留事項、次アクション
- 粒度: 1 タスクで要点を 3-7 項目、URL/ファイルパス/章番号を必ず添付
- 二重化: Serena の write_memory に加え、プロジェクトの「memory.md（運用場所はチーム規約に従う）」も更新

## 既存ルールとの統合

- 段階集中: 本指示書の「Phase 1〜4」の各フェーズ開始・終了で Serena を必ず実行
- 破壊的変更禁止: replace_lines 等の自動編集は PR レビュー前提。範囲は当該タスクに限定
- ドキュメント更新: タスク完了時に設計書/ドキュメントの該当ファイルも更新（例: vns-masakinihirota-design, vns-masakinihirota-doc）

## トラブルシュート

- 設定不整合: get_current_config → restart_language_server
- 情報不足: think_about_collected_information → 足りないリファレンスを list_dir/read_file で補完
- 会話の混線: prepare_for_new_conversation → 直近の作業コンテキストのみ再提示

## コーディング・運用ルール

- **不要コードの削除**: 失敗・不要なコードは残さず削除
- **コミット/プッシュ時の自動チェック**: husky で`pnpm check`（コミット時）、`pnpm run build`（プッシュ時）を実行。build 失敗時は push 中止
- **セキュリティ・品質重視**: API キーや秘密情報は環境変数で管理。エラー時は意味のあるメッセージと段階的なデバッグ手順を記載
