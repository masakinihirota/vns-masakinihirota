# ローカル環境マイグレーション実行ガイド

> **バージョン**: 1.0
> **更新日**: 2026-03-03
> **対象**: 開発者向け - ローカル PostgreSQL + Drizzle ORM

## 概要

開発環境でのマイグレーション実行（新規開発時、スキーマ変更時）の標準手順です。本番環境とは異なり、ダウンタイムや復旧の心配は不要です。

---

## 前提条件

- [ ] PostgreSQL 14+ がローカルマシンまたは Docker で実行中
- [ ] `pnpm` がインストール済み
- [ ] `.env.local` に `DATABASE_URL` が設定済み
- [ ] `pnpm install` 実行済み

---

## セットアップ（初回のみ）

### Step 1: PostgreSQL 起動

**Docker を使用する場合** （推奨）:

```bash
# docker-compose.yml の起動
docker-compose up -d

# DB が起動するまで待機（10～15 秒）
sleep 15

# 接続確認
psql -d "postgresql://postgres:password@localhost:5432/masakinihirota" -c "SELECT version();"
```

**ローカル PostgreSQL を使用する場合**:

```bash
# Windows
pg_ctl -D "C:\Program Files\PostgreSQL\14\data" start

# macOS (Homebrew)
brew services start postgresql@14

# Linux
sudo systemctl start postgresql
```

### Step 2: 環境変数確認

```bash
# .env.local を確認
cat .env.local | grep DATABASE_URL

# 出力例:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/masakinihirota
```

### Step 3: データベース初期化

```bash
# データベース作成
createdb -h localhost -U postgres -w masakinihirota

# または、psql から実行
psql -U postgres -c "CREATE DATABASE masakinihirota;"
```

---

## 通常のマイグレーション実行フロー

### 安全ラッパーの原則（必読）

本プロジェクトでは、ローカル適用は必ず `pnpm db:migrate` を使用します。

- `pnpm db:migrate` → `scripts/migrate-db.js` を実行し、DB 状態を判定して安全な経路を選択
- `pnpm db:migrate:drizzle`（=`drizzle-kit migrate` 直実行）→ **通常開発では非推奨**

`pnpm db:migrate` が行う安全処理：

1. baseline テーブルと `drizzle.__drizzle_migrations` の状態検査
2. Fresh DB の場合のみフル履歴適用
3. 既存 baseline + 空 migration 履歴の場合はフル再生をスキップ（`relation already exists` 回避）
4. 最後に `scripts/apply-db-security-migrations.js` を実行して RLS/セキュリティ系を冪等適用

> 例外的に `pnpm db:migrate:drizzle` を使うのは、マイグレーションエンジン単体の動作検証を行うときだけに限定してください。

### パターン A: スキーマを変更してマイグレーション生成

**想定シナリオ**: 新規テーブル追加、カラム追加、インデックス追加など、`schema.postgres.ts` を更新した場合

#### A1. スキーマを定義

`src/lib/db/schema.postgres.ts` に新規テーブルを追加：

```typescript
/**
 * Example: 新規テーブル追加
 */
export const newTable = pgTable("new_table", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
```

#### A2. マイグレーション自動生成

```bash
# Drizzle が schema.ts と DB の差分を検出し、マイグレーション SQL を生成
pnpm db:generate

# 出力例:
# √ Drizzle Studio is up on http://localhost:5555
# √ Pulling schema from the database...
# √ Introspection completed!
# √ Analyzing differences...
# √ 1 change detected
# √ drizzle/0007_new_table_addition.sql was created
#
# Please review the changes below:
#
# CREATE TABLE public.new_table (
#   id uuid DEFAULT gen_random_uuid() PRIMARY KEY ...
# );
```

#### A3. 生成されたマイグレーション確認

```bash
# 生成されたマイグレーション SQL を確認
cat drizzle/0007_new_table_addition.sql

# 内容確認後、問題がなければ続行
```

#### A4. マイグレーション適用

```bash
# ローカル DB に適用（安全ラッパー）
pnpm db:migrate

# 出力例:
# [Migration] Applying 0007_new_table_addition.sql
# [Migration] ✅ Successfully applied
# [Info] 1 change applied
```

#### A5. スキーマ整合性チェック

```bash
# RLS 設定、タイムゾーン整合性などを確認
pnpm db:check-schema

# 出力例:
# ✅ Database checks passed
# ✓ All required tables exist
# ✓ RLS enabled on sensitive tables
# ✓ Column timezone consistency: OK
```

#### A6. 型定義再生成

```bash
# Drizzle がスキーマから TypeScript 型を生成
pnpm db:generate-types

# 出力例:
# √ Types generated successfully for 15 tables
# Generated: src/lib/db/types.ts
```

#### A7. テスト実行

```bash
# 該当するテストを実行（スキーマ関連）
pnpm test -- schema

# または全テスト
pnpm test

# 型エラーがないかも確認
pnpm tsc --noEmit
```

### パターン B: マイグレーション SQL を手動作成

**想定シナリオ**: 複雑な RLS ポリシー追加、パフォーマンスチューニング、データ修復など

#### B1. マイグレーションファイルを作成

```bash
# ファイル名を作成（連番 + セマンティック名）
# 例: drizzle/0008_add_rls_policies.sql

# 内容:
cat > drizzle/0008_add_rls_policies.sql << 'EOF'
--> statement-breakpoint
-- ============================================================================
-- Add RLS policies to new_table
-- ============================================================================

CREATE POLICY "new_table_select_public" ON public.new_table
  FOR SELECT
  USING (true);

CREATE POLICY "new_table_insert_authenticated" ON public.new_table
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

--> statement-breakpoint
EOF
```

#### B2. マイグレーション適用

```bash
pnpm db:migrate
```

#### B3. Journal 確認

```bash
# マイグレーション履歴を確認
jq '.entries | length' drizzle/meta/_journal.json

# 新規エントリが追加されていることを確認
cat drizzle/meta/_journal.json | jq '.entries[-1]'
```

---

## データベースのリセット（開発時）

### オプション 1: データを保持してスキーマをリセット

```bash
# すべてのテーブルを削除（RLS ポリシーも一緒に削除）
pnpm db:reset

# または、手動で実行:
psql "$DATABASE_URL" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

### オプション 2: データベース全体を再初期化

```bash
# DB を削除して再作成
dropdb -h localhost -U postgres -w masakinihirota
createdb -h localhost -U postgres -w masakinihirota

# マイグレーション再適用
pnpm db:apply-security
```

### オプション 3: 最後の N 個のマイグレーションをロールバック

```bash
# 最後のマイグレーション 1 個をロールバック（Drizzle は自動ロールバック SQL を生成していない場合がほとんど）
# 手動で ロールバック SQL を作成:

cat > drizzle/rollback_0008.sql << 'EOF'
DROP POLICY IF EXISTS "new_table_select_public" ON public.new_table;
DROP POLICY IF EXISTS "new_table_insert_authenticated" ON public.new_table;
EOF

psql "$DATABASE_URL" -f drizzle/rollback_0008.sql
```

> **注意**: Drizzle は ロールバック SQL を自動生成しないため、ロールバックは手動操作が必要です。本番では [Migration Rollback Procedure](./migration-rollback-procedure.md) を参照してください。

---

## Drizzle Studio での対話的スキーマ確認

```bash
# Studio を起動（ブラウザで https://local.drizzle.studio が開きます）
pnpm db:studio

# 機能:
# - テーブル・カラムの確認・編集
# - CRUD 操作の実行
# - RLS ポリシーの確認
# - インデックス・制約の確認
```

---

## トラブルシューティング

### 問題 1: "database does not exist" エラー

```
psql: error: FATAL: database "masakinihirota" does not exist
```

**解決**:

```bash
# データベース作成
psql -U postgres -c "CREATE DATABASE masakinihirota;"

# または Docker を再起動
docker-compose down
docker-compose up -d
```

### 問題 2: "permission denied" エラー

```
ERROR: permission denied to create extension "uuid-ossp"
```

**原因**: PostgreSQL スーパーユーザー権限が必要

**解決**:

```bash
# スーパーユーザーで接続
psql -h localhost -U postgres -d masakinihirota -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
```

### 問題 3: "connection refused" エラー

```
psql: error: could not connect to server: Connection refused
```

**解決**:

```bash
# PostgreSQL が起動しているか確認
ps aux | grep postgres

# Docker の場合
docker ps | grep postgres

# 起動していなければ起動
docker-compose up -d
```

### 問題 4: マイグレーション適用後、 RLS ポリシーが見当たらない

```bash
# RLS が有効か確認
psql "$DATABASE_URL" -c "SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename = 'new_table';"

# 結果例: rowsecurity = true が必須

# RLS ポリシー一覧確認
psql "$DATABASE_URL" -c "SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'new_table';"
```

**解決**:

```bash
# RLS を有効化し、ポリシーを再適用
psql "$DATABASE_URL" << 'EOF'
ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "new_table_default_policy" ON public.new_table
  FOR SELECT
  USING (true);
EOF
```

---

## ベストプラクティス

### DO ✅

- [ ] マイグレーション生成前に、スキーマ変更内容を自分でレビュー
- [ ] 本番マイグレーション前に、Staging 環境で同じマイグレーションを実行・テスト
- [ ] マイグレーション適用後、`db:check-schema` で整合性を確認
- [ ] マイグレーション SQL に記述的なコメント (-- description) を含める
- [ ] Journal (`drizzle/meta/_journal.json`) をコミットに含める

### DON'T ❌

- [ ] スキーマ定義をコミットせずにマイグレーション SQL をコミット
- [ ] `DROP TABLE` などの破壊的マイグレーションを `pnpm db:generate` で自動作成させたままコミット
- [ ] マイグレーション SQL を手動編集している場合、Journal に手動で変更を加える
- [ ] RLS ポリシー追加前にマイグレーションを本番適用

---

## チェックリスト

開発時のマイグレーション確認:

### スキーマ変更時

- [ ] `src/lib/db/schema.postgres.ts` をレビュー・承認済み
- [ ] `pnpm db:generate` で新規マイグレーション生成
- [ ] `drizzle/NNNN_*.sql` をレビュー（破壊的操作がないか確認）
- [ ] `pnpm db:apply-security` で適用
- [ ] `pnpm db:check-schema` で整合性確認
- [ ] `pnpm test` でテスト全パス
- [ ] `pnpm tsc --noEmit` で型エラーなし確認

### 手動マイグレーション作成時

- [ ] `drizzle/meta/_journal.json` に含めるか確認（自動？手動？）
- [ ] マイグレーション内に十分なコメント記載
- [ ] `pnpm db:studio` で適用後の状態を確認
- [ ] RLS ポリシー適用確認
- [ ] 関連テスト実行

---

## 参考リンク

- [Migration Naming Strategy](./migration-naming-strategy.md)
- [Migration Rollback Procedure](./migration-rollback-procedure.md)
- [Production Migration Procedure](./production-migration-procedure.md)
- [ER Diagram](./er-diagram.md)
- [Data Dictionary](./data-dictionary.md)

---

## サポート

ローカル開発でマイグレーション問題が発生した場合：

1. **ログを確認**: `pnpm db:apply-security` の出力メッセージ
2. **DB を確認**: `psql "$DATABASE_URL" -c "\dt"` でテーブル一覧確認
3. **RLS を確認**: `psql "$DATABASE_URL" -c "SELECT * FROM pg_policies;"`
4. **チーム相談**: Slack #database-migrations
5. **リセット**: 必要に応じて `pnpm db:reset` で初期化

