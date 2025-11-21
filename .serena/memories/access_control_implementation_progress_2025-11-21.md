2025-11-21: 実装状況サマリ

現状:
- Drizzle schema: `drizzle/schema/access_control/*` 定義済
- Migration: `supabase/migrations/20251101073000_access_control.sql` で enums/tables/view/function `check_permission` 追加済
- Seed: `drizzle/seeds/accessControlSeed.ts` で baseline role/permission を挿入済
- サーバ/UI: `src/app/(protected)/access-control` と `src/lib/access-control` 等の Server Action・UI・ラッパー未作成
- テスト: `tests/access-control` 未実装

リスク:
- DBは整備済だがアプリ統合が未完了のため、UI/APIからの運用はまだ不可

次の優先タスク:
1) `src/lib/access-control`: DB呼び出し/型/ヘルパー追加
2) Server Actions/API エンドポイント追加
3) App Router UI (roles/memberships/audit) の実装
4) RLS/pgTAPでのテスト追加

更新: メモ作成と現状確認完了