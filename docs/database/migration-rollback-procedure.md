# マイグレーション・ロールバック手順書

> **バージョン**: 1.0
> **更新日**: 2026-03-03
> **対象**: Drizzle ORM + PostgreSQL

## 概要

このドキュメントはマイグレーション実行時に問題が発生した場合のロールバック手順を説明します。

---

## 前提条件

- PostgreSQL 14+
- Drizzle Kit 0.31.9+
- 本番DBへのバックアップ存在
- 実行権限（DBユーザーが `SUPERUSER` または `CREATE` 権限保有）

---

## ロールバック戦略

### Level 1: Application Level Rollback（推奨）

**シナリオ**: マイグレーション実行後、アプリケーション起動で型エラーが発生

**対応**:

1. アプリケーションを停止
2. コード上のマイグレーション参照を巻き戻す
   ```bash
   git checkout HEAD^ -- drizzle/
   git checkout HEAD^ -- src/lib/db/schema.postgres.ts
   ```
3. Drizzle Kit で再度 `generate` を実行
   ```bash
   pnpm db:generate
   ```
4. アプリケーションを再起動

**メリット**: DB状態は変わらない

---

### Level 2: Migration Unapply（部分ロールバック）

**シナリオ**: マイグレーション実行後、DBスキーマに予期しない変化（新規テーブルが削除されるなど）

**対応**:

1. 問題のあるマイグレーションを特定
   ```bash
   pnpm db:check-schema
   ```
2. `drizzle/meta/_journal.json` から該当マイグレーション行を削除
   ```json
   {
     "id": "0006",
     "breakpoints": true
   }
   ```
   ↓
   削除後、Drizzle Kit が「この migration は未実行」と判定

3. 手動でDB上の変更を戻す（SQL実行）
   ```sql
   SELECT * FROM information_schema.tables WHERE table_schema = 'public';
   -- 確認後、必要な DROP TABLE などを実行
   ```

**メリット**: 選択的なロールバックが可能

**デメリット**: SQLの知識が必要

---

### Level 3: Database Restore（完全ロールバック）

**シナリオ**: マイグレーションにより重大なデータ喪失が発生

**対応**:

1. **本番DBを停止**
   ```bash
   systemctl stop postgresql
   ```

2. **バックアップからリストア**
   ```bash
   # ファイルベースバックアップの場合
   pg_restore -d <dbname> /path/to/backup.sql

   # または SQL ダンプの場合
   psql -d <dbname> < /path/to/backup.sql
   ```

3. **Migration Journal をリセット**
   ```bash
   # drizzle/meta/_journal.json をマイグレーション前の状態に戻す
   git checkout <commit-hash> -- drizzle/meta/_journal.json
   ```

4. **アプリケーション再起動**

**メリット**: 完全なロールバック

**デメリット**: タイムロスが大きい、新規データが失われる

---

## 予防策

### 1. 本番環境デプロイ前のレビュー

```bash
# マイグレーション内容を事前確認（安全ラッパー経由）
pnpm db:migrate
```

### 2. Staging 環境テスト

本番環境への直接デプロイ前に、同じスキーマを持つ Staging DB で実行：

```bash
# Staging DB で実行
DATABASE_URL=postgresql://staging_user:pw@staging-host/staging_db \
pnpm db:apply-security

# 問題がなければ本番へ進める
```

### 3. メンテナンスウィンドウの確保

- マイグレーション実行は営業時間外（夜間）に実施
- ロールバック時間を考慮（最短で30分程度）

### 4. 定期バックアップ

```bash
# cronジョブで1時間ごとにバックアップ
0 * * * * pg_dump -d <dbname> -F c > /backup/db_$(date +\%Y\%m\%d_\%H\%M\%S).sql
```

---

## トラブルシューティング

### 問題: `column does not exist` エラー

**原因**: RLS ポリシーが `snake_case` と `camelCase` を混在している

**解決**:

```sql
-- 問題の列名を確認
SELECT column_name FROM information_schema.columns
WHERE table_name = '<table>' ORDER BY column_name;

-- スキーマとマイグレーション SQL を一致させる
-- src/lib/db/schema.postgres.ts と drizzle/0006_*.sql を対比
```

### 問題: `relation already exists` エラー

**原因**: マイグレーションが既に適用されている

**解決**:

```bash
# journal.json を確認
cat drizzle/meta/_journal.json | grep -A2 "0006"

# 既に存在するマイグレーションを再適用しない
pnpm db:apply-security  # このスクリプトは IF NOT EXISTS で保護されている
```

### 問題: `transaction rolled back` エラー

**原因**: マイグレーション内で制約違反が発生

**解決**:

1. `drizzle/<migration>.sql` を確認して制約を見つける
2. 既存データを移行するための一時的 SQL を追加
3. マイグレーション再実行

---

## チェックリスト

マイグレーション実行時のチェック：

- [ ] 本番DB バックアップが存在
- [ ] メンテナンスウィンドウが設定済み
- [ ] Staging DB で動作確認済み
- [ ] ロールバック手順が周知済み
- [ ] `pnpm db:check-schema` が PASS
- [ ] `pnpm db:auth:check` が PASS
- [ ] チーム全体で準備完了

---

## 関連リンク

- [DB マイグレーション戦略](./migration-strategy.md)（予定）
- [Drizzle ORM 公式ドキュメント](https://orm.drizzle.team)
- [PostgreSQL リストア手順](https://www.postgresql.org/docs/current/backup-restore.html)

