---
name: migration-safety
description: DBマイグレーションの安全性担保、データ損失防止、ダウンタイム最小化のためのガイドラインとチェックリスト
triggers:
  - migration
  - upgrade
  - alter table
  - drop column
---

# Migration Safety Skill

DBマイグレーションは、アプリケーションのライフサイクルの中で最もリスクの高い操作の一つです。このスキルは、データ損失や予期せぬダウンタイムを防ぐための安全なマイグレーション手順を定義します。

## 1. 原則 (Principles)

- **非破壊的変更を優先**: 既存のデータを削除・変更する操作は避け、追加のみを行う。
- **後方互換性の維持**: アプリケーションコード（新旧バージョン）が、マイグレーション適用中も動作するように設計する。
- **可逆性の確保**: 何か問題が起きた場合に、即座に元の状態に戻せるようにする。

## 2. マイグレーション前チェックリスト (Pre-Migration Checklist)

マイグレーション実行前に必ず確認してください。

- [ ] **バックアップ**: 直近のバックアップが存在し、復元可能であることを確認したか？
- [ ] **ロックの影響**: `ALTER TABLE` などが長時間ロックを取得し、サービスを停止させないか？（特に大規模テーブル）
- [ ] **データ量**: 対象テーブルの行数を確認したか？数百万行以上のテーブルへのカラム追加・型変更は要注意。
- [ ] **インデックス作成**: `CREATE INDEX CONCURRENTLY` を使用しているか？（通常の `CREATE INDEX` は書き込みをブロックする）

## 3. 安全なSQLパターン (Safe SQL Patterns)

### トランザクションの使用

DDL操作は可能な限りトランザクション内で実行します。

```sql
BEGIN;

-- 変更内容
ALTER TABLE users ADD COLUMN new_feature_flag BOOLEAN DEFAULT FALSE;

-- 検証クエリ（エラーならロールバックされる）
-- DO $$
-- BEGIN
--   IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'new_feature_flag') THEN
--     RAISE EXCEPTION 'Column not created';
--   END IF;
-- END $$;

COMMIT;
```

### カラムの削除 (Drop Column)

カラム削除は即座に行わず、以下の手順で行います。
1. アプリケーションコードから該当カラムへの参照を削除する。
2. DBマイグレーションでカラムを `RENAME` する（例: `old_column` -> `_deprecated_old_column`）。
3. しばらく運用し、エラーが出ないことを確認する。
4. 安全が確認されたら、別のマイグレーションでカラムを `DROP` する。

### カラムの型変更 (Alter Column Type)

型変更はテーブル全体を書き換える可能性があるため、リスクが高いです。
新しいカラムを作成し、データを移行するパターンを推奨します。

```sql
-- 1. 新しいカラムを追加
ALTER TABLE users ADD COLUMN email_new TEXT;

-- 2. データを移行（バッチ処理で少しずつ行うのが安全）
UPDATE users SET email_new = email::TEXT WHERE email_new IS NULL LIMIT 1000;

-- 3. トリガーを設定して、新旧カラムを同期（アプリ移行期間中）
-- ...

-- 4. アプリが新カラムを参照するように変更

-- 5. 旧カラムを削除
```

## 4. Supabase固有の注意点

- **Dashboard vs Migration File**: `supabase db push` やローカル開発環境でのマイグレーションファイル管理を徹底し、Dashboardでの直接変更は避ける。
- **Realtime**: `supabase_realtime` パブリケーションに含まれるテーブルを変更する場合、レプリケーションへの影響を考慮する。

## 5. リカバリ手順 (Recovery)

マイグレーションに失敗した場合：

1. **即時ロールバック**: トランザクション内であれば `ROLLBACK;`。適用済みの場合は `down.sql` を実行。
2. **状況把握**: エラーログを確認し、データ不整合が発生していないか確認。
3. **修正と再試行**: 問題を修正し、開発環境で再度テストしてから本番適用。

## 6. コマンドリファレンス

```bash
# マイグレーションステータス確認
supabase db diff

# マイグレーション適用（ローカル）
supabase db reset

# マイグレーション適用（リモート）
supabase db push
```
