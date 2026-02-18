---
trigger: always_on
---

# General Project Rules

プロジェクト全体に適用される基本ルール、プロセス、および行動指針です。

## 1. Language & Communication (言語・コミュニケーション)

- **日本語対応**: ユーザーとの対話、計画策定、説明文、チャットの回答はすべて**日本語**で行ってください。
- **技術用語**: Request, Response, Commit などの技術用語は、文脈に応じてカタカナまたは英語のまま使用して構いませんが、説明は日本語で行ってください。
- **出力言語**: ファイル生成やツール出力を含むすべての出力は、原則として日本語とします（コード内の変数名や予約語を除く）。
- **Implementation Plan**: `implementation_plan.md` は日本語で記述してください。

## 2. Windows Environment Compatibility (Windows環境対応)

Shift-JIS環境での文字化けやデータ破壊を防ぐため、以下の手順を遵守してください。

- **シェル実行時のエンコーディング固定**:
  - **PowerShell**: `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8;` を冒頭に付与。
  - **CMD**: `chcp 65001 > nul &&` を冒頭に付与。
- **ファイル書き込み**: `Set-Content` や `Out-File` を使用する際は、必ず `-Encoding UTF8` を明示してください。
- **外部ランタイム**: Python等の実行時は `PYTHONUTF8=1` 環境変数などでUTF-8を強制してください。

## 3. Web Search Protocol (Web検索ルール)

- **推測禁止**: 事実が不確かな場合は推測せずWebで確認し、根拠に引用を付けてください。
- **クロスチェック**: 複数ソースで重要点を検証し、矛盾があれば整理して結論を出してください。
- **深掘り**: 追加調査の価値がなくなるまで掘り下げてください（ただし脱線は避ける）。
- **網羅性**: ユーザーの質問で止まらず、想定される意図や関連事項まで網羅して回答してください。
- **出力形式**: Markdownを使用し、定義→要点→比較→具体例の順に整理して出力してください。

## 4. Decision Log Protocol (決定ログ運用)

仕様変更や重要な技術的決定は `decision_log.md` で管理します。

- **Single Source of Truth**: 会話で決定した「設計書と異なる変更点」は、すべて `decision_log.md` に集約します。
- **優先順位**: `decision_log.md` > 直近の会話 > 各種設計書 (`.md`)
- **アクション**:
  - 作業開始前に必ず `decision_log.md` を確認する。
  - 会話で仕様変更が決まったら、まず `decision_log.md` を更新する。
  - 設計書の更新は機能実装完了時などにまとめて行う。

## 5. Git Commit Guidelines (Gitコミット規約)

- **言語**: コミットメッセージは**日本語**で記述してください。
- **形式**:

  ```
  <type>: <subject>

  <body>
  ```

- **Type**:
  - `feat`: 新機能
  - `fix`: バグ修正
  - `docs`: ドキュメントのみの変更
  - `style`: コードの動作に影響しない変更（フォーマットなど）
  - `refactor`: バグ修正や機能追加を含まないコード変更
  - `perf`: パフォーマンス改善
  - `test`: テスト関連
  - `chore`: ビルドプロセスやツールの変更
