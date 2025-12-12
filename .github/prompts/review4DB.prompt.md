---
description: Review DBスキーマ
tools: ['serena/*', 'context7/*', 'Postgres(LOCAL-supabase)/*', 'supabase/execute_sql', 'supabase/list_tables', 'supabase/search_docs', 'supabase/generate_typescript_types', 'sequentialthinking/*', 'fetch', 'runCommands', 'runSubagent', 'changes', 'problems']
---

# Supabase DBレビュー（簡易版）

現在利用しているSupabaseのDB全体を対象に、Drizzle ORMのスキーマとの整合性を確認します。

## 事前準備
- Drizzleスキーマ: `drizzle/schema` 配下
- Supabase実スキーマ: Postgres(LOCAL-supabase)でのクエリ、`supabase/` 配下ツール、必要なら`supabase/migrations`
- 追加情報: serena系ツールで差分・問題を確認

## チェック観点
- 構造・制約が一致しているか（PK/FK/チェック/デフォルト/Enumなど）
- テーブル・カラム・インデックスの命名がプロジェクト規約に沿っているか
- 型・NOT NULL・DEFAULT・外部キー・チェック制約が要件に適合しているか
- インデックス/ユニーク/複合キー設計が想定クエリに妥当か
- テーブル・カラムに必要十分なコメントがあるか
- 不要なテーブル、カラム、ビュー、関数がないか

## 差異・未使用の洗い出し
- Supabaseに存在するがDrizzleで管理していない要素
- Drizzleで定義済みだがSupabaseで欠落している要素
- 参照実績が確認できないテーブル/カラムと、その調査結果
- 追加が必要と思われる制約・コメント・インデックス・RLS/RBAC
- マイグレーションの抜け漏れや適用順の不整合が疑われる箇所

## レポートフォーマット
- 指摘は優先度（致命的 > 重大 > 注意 > 軽微）順
- 各指摘で対象・ギャップ/影響・再現/根拠・期待挙動・推奨修正を簡潔に記載
- 想定と異なる挙動の疑いは確認事項として整理
- 大きな変更でテストが不足していれば、必要なテスト種別・想定ケース・テストデータを指摘

## クロージング
- 問題がなくても結果・残リスク・追加検証や保留事項をまとめる
- 今後のアクションを優先度付きで提示（例: マイグレーション作成、制約追加、命名修正など）
