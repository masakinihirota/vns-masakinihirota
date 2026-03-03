# マイグレーション命名規則・バージョン戦略

> **バージョン**: 1.0
> **更新日**: 2026-03-03
> **対象**: Drizzle ORM + PostgreSQL + VNS Masakinihirota

## 概要

マイグレーションファイルの命名とバージョニング戦略を統一して、保守性と履歴追跡性を向上させます。

---

## 命名規則

### フォーマット

```
NNNN_semantic_name.sql
```

### コンポーネント

| パート | 説明 | 例 |
|--------|------|-----|
| `NNNN` | 4桁の連番（ゼロ埋め） | `0001`, `0010`, `0100` |
| `semantic_name` | 機能を表す英数字（スネークケース） | `user_profile_creation`, `rbac_enforcement` |
| `.sql` | ファイル拡張子 | 固定 |

---

### 命名例

**Good**（セマンティック）:

- `0001_initial_user_auth_schema.sql` - 初期認証スキーマ
- `0002_role_based_access_control_tables.sql` - RBAC テーブル追加
- `0003_group_nation_separation.sql` - グループ・国分離モデル
- `0004_audit_logging_infrastructure.sql` - 監査ログインフラ
- `0005_user_preferences_extension.sql` - ユーザープリファレンス
- `0006_database_security_foundation.sql` - セキュリティ基盤
- `0007_performance_indexes.sql` - パフォーマンス改善

**Bad**（非セマンティック）:

- `0006.sql` - 目的が不明
- `fix_bug.sql` - NNNN 番号がない
- `0006_v2_update_users_table.sql` - バージョン記号を含まない

---

## セマンティックバージョニング

### 適用方法

マイグレーション連番とは別に、プロジェクトのセマンティックバージョンで追跡します。

```
Package Version: 0.2.0
Latest Migration: 0006_database_security_foundation.sql

Next Migration: 0007_...
Next Version: 0.3.0 (minor: 機能追加)
         or:  0.2.1 (patch: バグ修正のみ)
```

### ルール

| 変更 | 例 | バージョン |
|------|-------|---------|
| **Breaking Change** | テーブル削除、列型変更 | `MAJOR` |
| **Feature Addition** | 新規テーブル、新規ポリシー | `MINOR` |
| **Bug Fix** | インデックス追加、制約修正 | `PATCH` |

#### 例

```yaml
version: 0.2.0  # 現在のリリース版
migrations:
  - 0001_initial_user_auth_schema.sql
  - 0002_role_based_access_control_tables.sql
  - 0003_group_nation_separation.sql
  - 0004_audit_logging_infrastructure.sql
  - 0005_user_preferences_extension.sql

---

version: 0.3.0  # 次のリリース（MINOR: 機能追加）
pending_migrations:
  - 0006_database_security_foundation.sql  # 新テーブル追加 → MINOR
  - 0007_performance_indexes.sql           # パフォーマンス改善 → PATCH
```

---

##マイグレーション計画テンプレート

新規マイグレーション作成時に以下のテンプレートを使用：

```sql
-- filepath: drizzle/NNNN_<semantic_name>.sql
-- description: <マイグレーション概要>
-- breaking_change: no | yes
-- version_bump: patch | minor | major
-- estimated_duration: <所要時間（分）>

-- ============================================================================
-- <マイグレーションの目的>
-- ============================================================================

-- [概要]
-- <このマイグレーションで何をするか、なぜするか>

-- [影響範囲]
-- - 新規テーブル: <テーブル名>
-- - 変更テーブル: <テーブル名>
-- - 削除テーブル: <テーブル名>

-- [RLS更新]
-- - 新規ポリシー: <ポリシー名>
-- - 変更ポリシー: <ポリシー名>

-- [ロールバック手順]
-- 1. <ロールバック手順1>
-- 2. <ロールバック手順2>

--> statement-breakpoint
-- < 実際のSQL >

CREATE TABLE IF NOT EXISTS ...;

--> statement-breakpoint
ALTER TABLE ... ;

--> statement-breakpoint
CREATE INDEX IF NOT EXISTS ...;

```

---

## マイグレーション実行ガイト

### 開発環境

```bash
# 自動生成（Drizzle が変更を検出）
pnpm db:generate

# 新規マイグレーションの内容確認
cat drizzle/NNNN_<name>.sql

# 実行
pnpm db:apply-security
pnpm db:check-schema
pnpm db:auth:check
```

### Staging / 本番環境

```bash
# 1. マイグレーション内容レビュー
git diff HEAD~1 -- drizzle/

# 2. Staging で実行
DATABASE_URL=<staging_url> pnpm db:apply-security
DATABASE_URL=<staging_url> pnpm db:check-schema

# 3. 本番環境でバックアップ取得
pg_dump -d <production_db> -F c > backup_pre_0007.sql

# 4. 本番環境で実行
DATABASE_URL=<production_url> pnpm db:apply-security
DATABASE_URL=<production_url> pnpm db:check-schema

# 5. 結果確認
pnpm db:studio  # 結果を目視確認
```

---

## Migration Journal 管理

### 構造

```json
{
  "version": "6",
  "dialect": "postgresql",
  "entries": [
    {
      "idx": 0,
      "version": "6",
      "when": 1700000000000,
      "type": "CREATE_TABLE",
      "name": "user",
      "schema": "public"
    },
    {
      "idx": 1,
      "version": "6",
      "when": 1700100000000,
      "type": "CREATE_TABLE",
      "name": "user_preferences",
      "schema": "public"
    }
  ]
}
```

### ルール

- `idx`: 自動採番（手動編集禁止）
- `when`: Drizzle がタイムスタンプを自動記録（手動編集禁止）
- `type`, `name`: いずれも Drizzle が自動記録（参考用）

---

## チェックリスト

マイグレーション作成時：

- [ ] ファイル名が `NNNN_semantic_name.sql` 形式
- [ ] `semantic_name` が機能を明確に表現
- [ ] マイグレーション内に `-- statement-breakpoint` を含む
- [ ] 新規テーブル/列に RLS を考慮
- [ ] `IF NOT EXISTS` で冪等性を確保
- [ ] ロールバック手順をコメント記載
- [ ] Staging 環境で動作確認済み
- [ ] Package version を更新予定

---

## 参考リンク

- [Migration Rollback Procedure](./migration-rollback-procedure.md)
- [DB Security Foundation](./database-security-foundation.md)（予定）
- [RLS Policy Specification](./rls-policy-specification.md)（予定）

