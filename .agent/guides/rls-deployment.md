---
applyTo: "**"
---

# RLS (Row Level Security) デプロイメントガイド

本番環境リリース前に必ず実行してください。

## 概要

RLS は PostgreSQL のセキュリティ機能で、ユーザーがアクセスできるテーブル行を制限します。

**対象テーブル**:
- `user` - ユーザー個人情報
- `session` - セッション情報
- `account` - OAuth トークン情報
- `verification` - メール検証トークン

## セットアップ手順

### 1. RLS ポリシー適用 (本番環境のみ)

```bash
# PostgreSQL に接続し、RLS ポリシーを適用
psql -d $DATABASE_URL -f drizzle/rls-policies.sql
```

**確認方法**:

```sql
-- RLS が有効か確認
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('user', 'session', 'account', 'verification');

-- 結果例
 schemaname | tablename | rowsecurity
 -----------+-----------+-------------
 public     | user      | t
 public     | session   | t
 public     | account   | t
 public     | verification | t
```

### 2. セッション変数設定

アプリケーションが RLS を使用するには、PostgreSQL セッション変数を設定する必要があります。

**src/db/client.ts** の初期化時:

```typescript
// セッション変数として現在のユーザーIDを設定
await db.execute(sql`SET app.current_user_id = ${userId}`);
```

例（src/lib/auth-guard.ts）:

```typescript
import { sql } from 'drizzle-orm';
import { db } from '@/lib/db/client';

export async function setCurrentUserId(userId: string): Promise<void> {
  // RLS ポリシーが参照するセッション変数を設定
  await db.execute(sql`SET app.current_user_id = ${userId}`);
}
```

### 3. デフォルトロール設定 (推奨)

**PostgreSQL スーパーユーザー** で実行:

```sql
-- アプリケーション用ロール作成（未認証ユーザー向け）
CREATE ROLE anonymous_user;

-- RLS ポリシーで「他のユーザーのデータは見えない」を強制
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES
  TO anonymous_user;
```

## トラブルシューティング

### Q1: RLS 適用後、SELECT が「permission denied」エラー

**原因**: セッション変数 `app.current_user_id` が設定されていない

**解決策**:

```typescript
// クエリ前に必ず設定
await setCurrentUserId(session.userId);
const user = await db.query.user.findFirst();
```

### Q2: 開発環境で RLS ポリシーをバイパスしたい

**回避方法**: 開発用 SQL で RLS を一時的に無効化

```sql
-- 開発環境のみ（本番環境では実行禁止）
ALTER TABLE "user" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "session" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "account" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "verification" DISABLE ROW LEVEL SECURITY;
```

再度有効化:

```sql
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "verification" ENABLE ROW LEVEL SECURITY;
```

### Q3: ロールベースアクセス制御 (RBAC)

RLS と別個にロールを定義する場合:

```sql
-- ロール定義
CREATE ROLE admin WITH NOLOGIN;
CREATE ROLE moderator WITH NOLOGIN;
CREATE ROLE user_role WITH NOLOGIN;

-- 権限割り当て
GRANT admin TO app_user;  -- app_user が admin ロールを持つ
```

RLS ポリシー内で `session_user` を確認:

```sql
-- ユーザーの role カラムを使用
CREATE POLICY user_rls ON "user" FOR SELECT
  USING (id = current_setting('app.current_user_id'));
```

## ロールバック計画

本番環境で問題が発生した場合:

```bash
# 1. RLS を一時的に無効化（緊急対応）
psql -d $DATABASE_URL -c "ALTER TABLE \"user\" DISABLE ROW LEVEL SECURITY;"

# 2. ポリシーをリセット
psql -d $DATABASE_URL -f drizzle/rls-policies.sql

# 3. 再度有効化
psql -d $DATABASE_URL -c "ALTER TABLE \"user\" ENABLE ROW LEVEL SECURITY;"
```

## モニタリング

### RLS によるクエリ拒否をログに記録

```sql
-- PostgreSQL 設定ファイル（postgresql.conf）
log_error_verbosity = verbose
log_connections = on
log_disconnections = on

-- RLS 違反ログ
SELECT * FROM pg_stat_statements
WHERE query LIKE '%permission denied%';
```

## 参考資料

- [PostgreSQL RLS 公式ドキュメント](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [drizzle/rls-policies.sql](../rls-policies.sql) - RLS ポリシー定義

---

**リリースチェックリスト** (本番環境):

- [ ] RLS ポリシーを `drizzle/rls-policies.sql` で定義済み
- [ ] RLS ポリシーを本番 PostgreSQL に適用済み (`psql -d $DATABASE_URL -f drizzle/rls-policies.sql`)
- [ ] セッション変数初期化処理が app コードに統合済み
- [ ] ロール設定が完了
- [ ] 開発環境で RLS テストコード実行済み
- [ ] ロールバック計画を文書化済み
- [ ] 監視・ロギング設定が本番環境で有効
