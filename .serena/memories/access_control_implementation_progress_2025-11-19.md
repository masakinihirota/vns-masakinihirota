## 概要
2025-11-19: Serena MCP による実装状況の確認と進捗更新を実施しました。

## 発見した実装状況（要旨）
- 設計書: `0012-02-アクセス権限設計書-gemini3.md` が作成され、要件定義書と整合している（設計完了/レビュー済）。
- データベース: `database_design_update_complete` により、主要な基盤テーブル（auth_users、root_accounts、points_transactions 等）は実装済と報告。RLSポリシーは実装済みテーブルに対して適用済だが、ACL専用テーブル（acl_roles/acl_permissions/role_permissions 等）は Drizzle スキーマに未追加で、Supabase migrations にも未作成。
- コード/ルーティング: App Router 側（`src/app/(authorized)/access-control` ）やサーバーアクション（`upsertRole`等）の実装は確認できず、実装未着手の模様。
- テスト: `0012-03-アクセス権限テストリスト.md` を作成済（確認済）。DBのRLS向けテストは `pgTAP` または `Supabase Test Helpers` を推奨しているが、現状のテスト実装は未確認（未実装の可能性が高い）。

## 影響/リスク
- ACL表が未実装のため、権限委譲・権限付与・チェック処理のDB強制的な安全性が不足している。
- App Router/Server Actions未実装のため、UIやAPIによる権限管理機能がまだ操作できない状態。
- RLSの適用範囲は一部テーブルに留まっている可能性があるため、整合性のための追加確認が必要。

## 優先タスク（次ステップ）
1. **スキーマ追加**: Drizzle スキーマに `acl_roles`, `acl_permissions`, `role_permissions`, `user_system_roles` を定義し、migration を作成する。
2. **RLS関数/ポリシー**: `has_system_role`, `has_nation_role`, `has_org_role` の DB 関数と、各テーブルに対する Policy を実装/テストする。
3. **Server Actions**: `assignSystemRole`, `delegateNationRole`, `checkPermission` と `executePointTransfer` の実装を Server Actions / RPC として追加する。
4. **App Router/フロント**: `src/app/(authorized)/access-control` 下の管理画面・UIを追加し、操作による Server Actions が呼ばれるよう接続する。
5. **テスト導入**: `pgTAP` または Supabase Test Helpers を使ったユニット（RLS）および統合シナリオテストを作成する。特に `executePointTransfer` のトランザクション検証を自動化する。

## 今回の変更点（記録）
- 2025-11-19: `access_control_implementation_progress_2025-11-19` メモを作成。設計と未実装箇所をまとめ、優先タスクを記載。

## 推奨コミットメッセージ例
- feat(access-control): add acl tables and migrations
- feat(access-control): add server actions for role assignment and permission checks
- test(access-control): add pgTAP RLS unit tests

---

次の実行ステップ: 1) 上記の優先タスクのうち最優先（スキーマの追加）に着手するため、タスクを作成し `tasks/doing/` に移動することを推奨します。