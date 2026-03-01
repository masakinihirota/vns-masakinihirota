---
description: コア基盤・セキュリティ特化レビュー（堅牢性・パフォーマンスの徹底検証）
---

# Core & Security Review Workflow

このワークフローは、アプリの土台となるシステム（認証、APIルート、データベース設計、共通ユーティリティ）の堅牢性、セキュリティ、パフォーマンス（N+1問題など）を徹底的に検証します。「敵対的レビュー（Adversarial Review）」モードを適用し、最悪のケースを想定して厳しくチェックします。

## 対象ディレクトリ・ファイル（推奨）

- `src/lib/` (共通ロジック等)
- `src/app/api/` (Route Handlers)
- `src/proxy.ts` (ミドルウェア相当)
- `src/components/**/*.logic.ts` などのデータフェッチ層

## 手順

1.  **対象の特定**: 上記のディレクトリ、またはユーザーが指定したコア・アーキテクチャ関連ファイルを対象とします。
2.  **セキュリティ＆パフォーマンス検証**: `code-review` スキルを活用し、以下の観点を重点的にチェックします。
    - **RSC & API Security**: Server Actionsの不適切な利用（RPC的利用）がないか、Route Handlersが適切に使われているか。Zodによる入出力のバリデーション漏れがないか。SQLインジェクション対策は十分か。OAuth credentialsの起動時検証、および本番環境での `NEXT_PUBLIC_USE_REAL_AUTH=true` 強制が行われているか。Next.js 16の非同期リクエストAPI（`await cookies()`, `await headers()`など）の適用漏れがないか確認。
    - **Architecture**: UIとロジック（副作⽤）の分離原則が守られ、`page.tsx` で過度なデータ取得が行われていないか。全Postgresテーブルに対するRLSポリシー（`drizzle/rls-policies.sql`）が有効になっているか確認。
    - **Performance**: ループ内でのクエリ発行（N+1問題）、不要なカラムの取得（オーバーフェッチ）の有無。エラー時にスタックトレース出力やセキュリティイベント（権限チェック失敗など）が詳細にログ記録されているか。
3.  **レポート作成**: 発見した重大な脆弱性やスケーラビリティの問題を、[Critical], [Major] などの重要度を付けて報告し、具体的な改善策（Zodスキーマ例）を提示します。

## コマンド例

- `/core-security-review`: コア基盤全体のレビューを実行
- `/core-security-review src/app/api`: 特定のAPIディレクトリを対象に実行
