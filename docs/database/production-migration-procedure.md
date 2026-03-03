# 本番マイグレーション実行手順書

> **バージョン**: 1.0
> **更新日**: 2026-03-03
> **対象**: VNS Masakinihirota Production DB（PostgreSQL 14+）

## 概要

本番環境でのマイグレーション実行を安全・確実に実施するための標準手順です。ダウンタイムゼロを目指し、Blue-Green デプロイメントを推奨します。

---

## 前提条件

### 必須確認事項

- [ ] すべての マイグレーションが Staging 環境で検証済み
- [ ] ロールバック手順が文書化・テスト済み
- [ ] チーム全員がマイグレーション内容を理解している
- [ ] 本番環境のバックアップが取得可能
- [ ] メンテナンスウィンドウ（または Zero-Downtime 対応体制）が確保されている
- [ ] 監視・ロギングが有効

### 必要スキル

- PostgreSQL 基本知識
- Drizzle ORM の理解
- Bash / Node.js スクリプト実行の経験

---

## Phase 0: 準備（実行 24 時間前）

### P0-1. マイグレーション内容最終レビュー

```bash
# 1. 本番に反映予定のマイグレーションを確認
git log --oneline -- drizzle/ | head -10

# 2. 対象マイグレーションの差分を確認
git show <commit_hash>:drizzle/NNNN_<name>.sql

# 3. マイグレーション計画書に署名（複数レビュイアーの承認が望ましい）
```

### P0-2. バックアップ戦略確認

**完全バックアップ**（推奨）:

```bash
# Logical backup（復元が簡単）
pg_dump -d <production_db> \
  --format=custom \
  --file=backup_pre_0007_$(date +%Y%m%d_%H%M%S).sql

# File size を確認（GB単位で記録）
ls -lh backup_pre_*.sql
```

**時間点イメージ（WAL Archive）**:

```bash
# WAL Archive 有効確認
psql -d <production_db> \
  -c "SELECT setting FROM pg_settings WHERE name = 'archive_mode';"
# 結果: on であること

# Point-in-time recovery テスト（Staging で実施推奨）
```

### P0-3. 本番環境スナップショット

```bash
# RDS/Managed DB の場合：マネージドコンソールからスナップショット作成
# スナップショット名: production_pre_0007_<date>

# Self-hosted PostgreSQL の場合：VM スナップショット作成
```

---

## Phase 1: 実行準備（実行 1 時間前）

### P1-1. 環境変数確認

```bash
# .env.production から本番 DB URL を読み込み
echo $DATABASE_URL

# 接続テスト
psql -d "$DATABASE_URL" -c "SELECT version();"

# 結果例:
# PostgreSQL 14.6 (Ubuntu 14.6-1.pgdg20.04+1) on x86_64-pc-linux-gnu, ...
```

### P1-2. 現在のマイグレーション状態確認

```bash
# Drizzle Journal を確認
cat drizzle/meta/_journal.json | jq '.entries | length'

# 結果例: 6（現在 0006 までが適用済み）

# テーブル一覧を確認（メタデータレベル）
psql -d "$DATABASE_URL" -c "\dt public.*"

# 結果例:
#            List of relations
#  Schema |     Name     | Type  |  Owner
# --------+--------------+-------+---------
#  public | user         | table | app_user
#  public | session      | table | app_user
#  public | account      | table | app_user
#  ...
```

### P1-3. チェックスクリプト実行

本番環境で Schema 整合性を確認：

```bash
pnpm db:check-schema

# 出力例:
# ✅ Database checks passed
# ✓ Required tables exist
# ✓ RLS enabled on sensitive tables
# ✓ Column timezone consistency: OK
```

失敗した場合は ロールバック手順書 を参照してから進めない。

---

## Phase 2: 本番マイグレーション実行

### 方式 A: Zero-Downtime デプロイ（推奨）

以下の手順で、アプリケーションを実行中のままマイグレーションを適用します。

#### A1. Blue-Green デプロイ構成

```
Before Migration:
┌─────────────────────────────────────┐
│  Production Database (PostgreSQL)   │
│  - Current Schema V0.2.0            │
│  - User-facing connections          │
└─────────────────────────────────────┘

During Migration:
┌──────────────────────────────────────┐
│ Replica Database (from snapshot)     │
│ - Applied Migration 0007             │
│ - Test queries here                  │
├─────────────────────────────────────┤
│ Production Database (OLD)            │
│ - Still serving requests             │
└──────────────────────────────────────┘

After Migration:
┌──────────────────────────────────────┐
│ Production Database (NEW)            │
│ - Schema V0.3.0 Applied              │
│ - User-facing connections            │
└──────────────────────────────────────┘
```

#### A2. 実行手順

**Step 1: Replica DB を準備**

```bash
# RDS / Managed DB:
# 1. マネージドコンソールでバックアップから復元
#    名前: production-pre-0007
#    元 DB: production-main
# 2. 復元完了を待機（通常 5~10 分）
# 3. Endpoint を確認: production-pre-0007.xxxxx.rds.amazonaws.com

# Self-hosted:
# 1. 別マシンで復元
#    pg_restore -d <new_db> backup_pre_0007.sql
# 2. ネットワーク接続確認
```

**Step 2: Replica DB でマイグレーション実行**

```bash
# Replica 環境の DB URL を指定
export DATABASE_URL="postgresql://user:pass@replica-db:5432/masakinihirota"

# マイグレーション適用
pnpm db:apply-security

# 出力例:
# [Migration] Applying 0007_performance_indexes.sql
# [Migration] ✅ Successfully applied
# [Info] 0 warnings
```

**Step 3: Replica DB で動作テスト**

```bash
# スキーマ整合性チェック
pnpm db:check-schema

# 認証スキーマ互換性チェック
pnpm db:auth:check

# アプリケーション機能テスト（Staging 環境と同一）
npm run test:integration

# 結果:
# ✅ All tests passed
# ✅ Migration is safe for production
```

**Step 4: 本番 DB 切り替え**

```bash
# Step 3 のテスト すべてが ✅ の場合のみ進める

# RDS / Managed DB:
# 1. Route 53 / DNS を新 Endpoint に変更
# 2. Connection を Drain（既存接続の完了を待機）
# 3. アプリケーションから新 DB への接続確認

# Self-hosted:
# 1. PgBouncer / pgpool II で接続を新 DB へリダイレクト
# 2. 既存接続の Graceful Close を確認
# 3. アプリケーションのログを監視
```

**Step 5: 本番 DB の検証**

```bash
# 本番環境に切り替え後、すぐに確認
export DATABASE_URL="postgresql://user:pass@production-main:5432/masakinihirota"

# 整合性チェック
pnpm db:check-schema
pnpm db:auth:check

# ライブユーザーの操作がエラーなく進行することを確認
tail -f logs/production.log | grep -i error

# 5 分間の監視でエラーがないことを確認
```

---

### 方式 B: ダウンタイムあり（小規模マイグレーション向け）

マイグレーション実行時間が 5 分以内の場合のみ推奨。

#### B1. 準備

```bash
# 1. メンテナンスモード有効化（アプリケーション）
export MAINTENANCE_MODE=true
pnpm restart:app

# 2. 既存接続が完了するまで待機（タイムアウト: 30 秒）
sleep 30

# 3. セッション確認（接続がないことを、確認）
psql -d "$DATABASE_URL" -c \
  "SELECT count(*) FROM pg_stat_activity WHERE state != 'idle';"
# 結果: count: 0
```

#### B2. マイグレーション実行

```bash
# マイグレーション実行
pnpm db:apply-security

# 検証
pnpm db:check-schema
pnpm db:auth:check
```

#### B3. メンテナンスモード解除

```bash
# 1. アプリケーション再起動
export MAINTENANCE_MODE=false
pnpm restart:app

# 2. ヘルスチェック確認
curl http://localhost:3000/api/health
# 結果: { "status": "ok", "database": "connected" }

# 3. ユーザー機能を数個テスト
```

---

## Phase 3: 本番検証

### P3-1. 機能テスト

```bash
# ユーザー認証フロー
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"..."}'

# グループ機能
curl http://localhost:3000/api/groups
# 結果: [ { "id": "...", "name": "Tech Team", ... } ]

# 新規機能（マイグレーションで追加した場合）
curl http://localhost:3000/api/<new_feature>
```

### P3-2. パフォーマンス確認

```bash
# クエリ遅延を監視
psql -d "$DATABASE_URL" -c \
  "SELECT query, mean_time, calls FROM pg_stat_statements \
   ORDER BY mean_time DESC LIMIT 10;"

# インデックス効果を確認（マイグレーション 0007 の場合）
EXPLAIN ANALYZE
SELECT * FROM user_profiles WHERE created_at > NOW() - INTERVAL '30 days';

# 結果から Index Scan が出現することを確認
```

### P3-3. ログ監視

```bash
# アプリケーションログ（過去 5 分間）
tail -n 100 logs/production.log | grep -i "error\|warning"

# データベースログ
psql -d "$DATABASE_URL" -c \
  "SELECT log_time, message FROM pg_log \
   WHERE log_time > NOW() - INTERVAL '5 minutes' \
   ORDER BY log_time DESC;"
```

---

## Phase 4: ロールバック（必要な場合のみ）

### トリガー条件

以下いずれかの場合、即座にロールバックを実行：

- [ ] ユーザー機能が動作しない（例：ログインできない）
- [ ] パフォーマンス悪化（クエリ時間が 10 倍以上）
- [ ] データ不整合が検出された
- [ ] セキュリティ警告が発生した

### P4-1. 迅速なロールバック

詳細は [Migration Rollback Procedure](./migration-rollback-procedure.md#level-2-migration-unapply) を参照。

```bash
# **最速: 前のデータベースを復元（RDS の場合）**
# Step 2 で保存した Replica DB（0007 適用済み）をそのまま廃棄し、
# Step 4 前の本番 DB（0006 のままのスナップショット）に DNS を戻す

# DNS 切り戻し（1 分以内）
aws route53 change-resource-record-sets \
  --hosted-zone-id <ZONE_ID> \
  --change-batch file://rollback.json

# 結果: ユーザーが旧 DB にアクセス
# ダウンタイム: ~1-2 分
```

### P4-2. ロールバック後の調査

```bash
# 1. マイグレーション内容を再レビュー
git log -p -- drizzle/0007_*.sql

# 2. Staging で同じマイグレーションを実行し、原因を特定
export DATABASE_URL="postgresql://staging-db:5432/masakinihirota"
pnpm db:apply-security

# 3. チームで原因分析ミーティング（30 分以内）
```

---

## チェックリスト

実行前の最終確認：

### 実行前（-24h）

- [ ] マイグレーション内容を複数人でレビュー
- [ ] Staging 環境で完全動作確認
- [ ] ロールバック手順をテスト実行（仮想データで）
- [ ] チェンジログと README が更新予定

### 実行前（-1h）

- [ ] 本番 DB バックアップ取得（size 記録）
- [ ] Replica DB から復元確認
- [ ] 監視ツール（New Relic / Datadog / CloudWatch）を起動
- [ ] 連絡先リスト（Slack チャンネル、On-Call Pager）を準備

### 実行中

- [ ] リアルタイムログを監視（ターミナル開きっぱなし）
- [ ] 5 分ごとにヘルスチェック実行
- [ ] ユーザー報告があれば即座に対応

### 実行後

- [ ] 30 分間のエラー監視
- [ ] ユーザー機能 2~3 個を手動テスト
- [ ] クエリパフォーマンスが劣化していないことを確認
- [ ] 本番マイグレーション完了記録を更新
- [ ] チームに完了通知（Slack）

---

## よくある質問

### Q: マイグレーション実行中、ユーザーがアクセスできる？

**A**: Blue-Green デプロイを使用すれば、YES

- Replica DB でテスト中、本番 DB は通常通り稼働
- DNS 切り替えまでユーザーは影響なし

### Q: ロールバック時間は？

**A**: 方式による

| 方式 | ロールバック時間 |
|------|------------------|
| DNS 切り替え（RDS）| 1-2 分 |
| Connection Pool Drain | 3-5 分 |
| Schema Rollback SQL | 5-15 分 |

### Q: バックアップのリテンション期間は？

**A**: 推奨 7 日間

```bash
# AWS S3 backup retention policy
aws s3api put-bucket-lifecycle-configuration \
  --bucket production-backups \
  --lifecycle-configuration file://lifecycle.json
```

### Q: テストして問題なかったのに、本番で失敗する可能性は？

**A**: 低确但存在

**リスク要因**:

- データ量（Staging は小）: Staging でデータ量を本番と同じにする
- 負荷（Staging は低）: 意識的に高負荷テストを実施
- Timeline（時間帯）: 本番と同じ時間帯に Staging テストを実施

**対策**:

```bash
# 本番と同じサイズの Replica でテスト
pg_dump <production_db> | psql -d <test_db>

# 本番と同じ負荷でテスト
pgbench -d <test_db> -T 60 -c 10 -j 4
```

---

## 参考リンク

- [Migration Rollback Procedure](./migration-rollback-procedure.md)
- [Migration Naming Strategy](./migration-naming-strategy.md)
- [Database Security Foundation](../database-security-foundation.md)（予定）

---

## サポート連絡先

マイグレーション実行中に問題が発生した場合：

- **Slack**: #database-migrations チャンネル
- **On-Call**: PagerDuty を確認
- **Documentation**: この文書の [FAQ](#よくある質問) セクション

**記録**: 実行完了後は、必ず `docs/database/migration_log.md` に結果を記載してください。
