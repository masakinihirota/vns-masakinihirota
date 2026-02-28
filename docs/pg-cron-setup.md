# pg_cron セットアップガイド

PostgreSQL のセッションクリーンアップ自動化を実装するための手順書です。

## 概要

- **目的**: 期限切れのセッションを自動的に削除
- **スケジュール**: 毎日午前3時（UTC）
- **関連テーブル**: `session` （Better Auth スキーマ）
- **クリーンアップ関数**: `cleanup_expired_sessions()` （drizzle/rls-policies.sql で定義）

---

## ステップ 1: pg_cron 拡張のインストール

```sql
-- PostgreSQL に接続
CREATE EXTENSION IF NOT EXISTS pg_cron;
```

**確認コマンド:**
```sql
-- インストール確認
SELECT * FROM pg_extension WHERE extname = 'pg_cron';

-- 結果例:
-- extname | extowner | extnamespace | extrelocatable | extversion | extconfig | extcondition
-- pg_cron | 10 | 2200 | f | 1.4 | |
```

---

## ステップ 2: クリーンアップ関数の確認

`cleanup_expired_sessions()` 関数が既に定義されているかを確認します：

```sql
-- 関数一覧を表示
SELECT routine_name
FROM information_schema.routines
WHERE routine_name LIKE 'cleanup%';

-- 結果例:
-- routine_name
-- cleanup_expired_sessions
```

もし関数がない場合、drizzle/rls-policies.sql の内容を実行します：

```sql
-- drizzle/rls-policies.sql から cleanup_expired_sessions を実行
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS TABLE(deleted_count BIGINT) AS $$
DECLARE
  deleted_rows BIGINT;
BEGIN
  DELETE FROM session
  WHERE expires_at < NOW();

  GET DIAGNOSTICS deleted_rows = ROW_COUNT;
  RETURN QUERY SELECT deleted_rows;
END;
$$ LANGUAGE plpgsql;
```

---

## ステップ 3: pg_cron ジョブの作成

```sql
-- 毎日午前3時（UTC）にクリーンアップを実行
SELECT cron.schedule(
  'cleanup-sessions',        -- ジョブ名
  '0 3 * * *',               -- タイムゾーン: 毎日03:00 UTC
  'SELECT cleanup_expired_sessions();'
);

-- 結果例:
-- schedule
-- 1
```

**時間表記（cron フォーマット）:**
- `0 3 * * *` = 毎日 03:00 UTC
- `0 2 * * *` = 毎日 02:00 UTC （JST なら 11:00）
- `*/30 * * * *` = 30分ごと
- `0 */6 * * *` = 6時間ごと

---

## ステップ 4: ジョブの確認

```sql
-- スケジュール済みのジョブ一覧を表示
SELECT cron.job_name, cron.schedule, cron.command
FROM cron.job;

-- 結果例:
-- job_name | schedule | command
-- cleanup-sessions | 0 3 * * * | SELECT cleanup_expired_sessions();
```

---

## ステップ 5: 実行ログの確認

```sql
-- 最近の実行ログを確認
SELECT * FROM cron.job_run_details
ORDER BY start_time DESC
LIMIT 10;

-- 結果列:
-- job_id, database, username, command, status, return_message, start_time, end_time
```

**ステータス値:**
- `succeeded` = 成功
- `failed` = 失敗
- `skipped` = スキップ

---

## トラブルシューティング

### よくある問題と解決方法

#### **Q1: pg_cron がインストールされない**

**原因:** PostgreSQL の設定で pg_cron がデフォルトでは読み込まれない場合があります

**解決方法:**
```sql
-- PostgreSQL 設定ファイル (postgresql.conf) を修正
-- shared_preload_libraries = 'pg_cron'
-- を追加してから PostgreSQL を再起動

-- 再起動後、再度実行:
CREATE EXTENSION IF NOT EXISTS pg_cron;
```

---

#### **Q2: ジョブが実行されない**

**原因:** pg_cron のデーモンが起動していない

**解決方法:**
```sql
-- pg_cron の状態確認
SELECT cron.alter_job(job_id, command => 'SELECT cleanup_expired_sessions();')
FROM cron.job WHERE job_name = 'cleanup-sessions';

-- または PostgreSQL を再起動
```

---

#### **Q3: セッションが削除されない**

**原因:** `cleanup_expired_sessions()` 関数のロジックに問題がある可能性

**解決方法:**
```sql
-- 関数を手動実行してテスト
SELECT cleanup_expired_sessions();

-- 期限切れセッションを確認
SELECT id, expires_at, NOW() as current_time
FROM session
WHERE expires_at < NOW()
LIMIT 5;
```

---

## 代替案: API エンドポイント経由でのクリーンアップ

pg_cron が利用できない場合、定期的な API エンドポイントでクリーンアップする代替手段があります：

```typescript
// src/app/api/cron/cleanup-sessions/route.ts
import { cleanup_expired_sessions } from "@/lib/db/admin-queries";

export async function POST(req: Request) {
  // Secret トークン検証
  const token = req.headers.get("x-cron-secret");
  if (token !== process.env.CRON_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const result = await cleanup_expired_sessions();
    return Response.json({ success: true, deletedCount: result.deleted_count });
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
```

**外部 Cron サービスで定期実行:**
```bash
# curl で定期実行（Cron.io, EasyCron など）
curl -X POST https://your-domain.com/api/cron/cleanup-sessions \
  -H "x-cron-secret: your-secret-token"
```

---

## 本番環境チェックリスト

デプロイ前に以下を確認してください：

- [ ] PostgreSQL へのアクセス権限を確認
- [ ] `CREATE EXTENSION` 権限があるか確認
- [ ] pg_cron 拡張がインストール可能か確認
- [ ] `cleanup_expired_sessions()` 関数を実行
- [ ] スケジュール済みジョブを確認

**実行コマンド:**
```bash
# すべてを自動実行（管理者権限必須）
psql -U postgres -d vns_app -f setup-pg-cron.sql
```

---

## 監視・メンテナンス

### 定期的に確認すべき項目

1. **失敗したジョブのログ確認**
   ```sql
   SELECT * FROM cron.job_run_details
   WHERE status = 'failed'
   ORDER BY start_time DESC;
   ```

2. **削除されたセッション数の監視**
   ```sql
   -- 過去24時間の削除数を確認
   SELECT COUNT(*) as deleted_count
   FROM cron.job_run_details
   WHERE job_id = (SELECT job_id FROM cron.job WHERE job_name = 'cleanup-sessions')
   AND start_time > NOW() - INTERVAL '24 hours';
   ```

3. **performance チューニング**
   ```sql
   -- cleanup 関数の実行時間を確認
   EXPLAIN ANALYZE
   SELECT cleanup_expired_sessions();
   ```

---

## 参考リンク

- [pg_cron 公式ドキュメント](https://github.com/citusdata/pg_cron)
- [PostgreSQL CREATE EXTENSION](https://www.postgresql.jp/document/current/html/sql-createextension.html)
- [Better Auth セッション管理](https://www.better-auth.com)
