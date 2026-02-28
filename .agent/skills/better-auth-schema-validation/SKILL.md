---
name: better-auth-schema-validation
description: Better Auth と Drizzle ORM のスキーマ命名規則一貫性を検証・修復するスキル
---

# Better Auth スキーマ検証スキル

本プロジェクトで発生した **OAuth 500エラー** の根本原因は、Better Auth と Drizzle ORM のスキーマ命名規則の不一致（camelCase vs snake_case）にありました。

このスキルは、スキーマの一貫性を検証し、問題を早期に発見・修復するための方法を提供します。

---

## 問題背景

### 発生した問題

```
ERROR [Better Auth]: Failed query: insert into "verification" 
  ("id", "identifier", "value", "expires_at", "created_at", "updated_at") ...
[cause]: null value in column "expiresAt" of relation "verification" 
  violates not-null constraint
```

### 根本原因

| 項目 | 詳細 |
|------|------|
| **問題** | 古いcamelCase列（`expiresAt`）にNOT NULL制約が残されたまま |
| **発生場所** | 本番DB（Neon PostgreSQL）のauth4テーブル |
| **原因** | スキーマのコード定義は修正されたが、本番DBの制約が削除されていなかった |
| **影響** | OAuth認証フローで`expires_at`（snake_case）に値を挿入するも、`expiresAt`がNULLで制約違反 |

---

## 検証方法

### 1. ローカル環境での検証（開発時）

```bash
# auth4テーブルのスキーマと制約を確認
pnpm db:auth:check

# 期待値: [DB_CHECK] PASSED
# 内容:
#   [OK] user: required snake_case columns exist
#   [OK] session: required snake_case columns exist
#   [OK] account: required snake_case columns exist
#   [OK] verification: required snake_case columns exist
```

**チェック項目：**
- `user`: `id`, `name`, `email`, `email_verified`, `created_at`, `updated_at`
- `session`: `id`, `token`, `expires_at`, `created_at`, `updated_at`, `user_id`
- `account`: `id`, `account_id`, `provider_id`, `user_id`, `created_at`, `updated_at`
- `verification`: `id`, `identifier`, `value`, `expires_at`, `created_at`, `updated_at`

### 2. 本番環境での検証（デプロイ前：必須）

```powershell
# Step 1: Vercel本番環境から最新の環境変数を取得
vercel env pull .env.vercel.production --environment=production

# Step 2: 本番DBスキーマを診断（環境変数を明示指定）
$env:ENV_FILE='.env.vercel.production'; pnpm db:auth:check; Remove-Item Env:ENV_FILE

# 期待値: [DB_CHECK] PASSED

# Step 3: 問題があれば修復実行（後述）
```

**重要：** `.env.vercel.production` は `.gitignore` に登録済みのため、リポジトリに含まれません。ローカルのみで使用してください。

---

## 修復方法

### スキーマに問題がある場合

```bash
# ローカル環境での修復
pnpm db:auth:fix-compat

# その後、検証を再実行
pnpm db:auth:check
# 期待値: [DB_CHECK] PASSED
```

### 本番環境での修復

```powershell
# Step 1: 本番環境情報を取得
vercel env pull .env.vercel.production --environment=production

# Step 2: 本番DBに対して修復スクリプトを実行
$env:ENV_FILE='.env.vercel.production'; pnpm db:auth:fix-compat; Remove-Item Env:ENV_FILE
# 出力: [DB_FIX] Auth schema compatibility patch applied successfully

# Step 3: 本番DBの検証
$env:ENV_FILE='.env.vercel.production'; pnpm db:auth:check; Remove-Item Env:ENV_FILE
# 期待値: [DB_CHECK] PASSED
```

**修復内容：**

修復スクリプト（`scripts/fix-auth-schema-compat.js`）は以下の操作を実行します：

1. **snake_case列を追加**（存在しない場合）
   ```sql
   ALTER TABLE "verification"
     ADD COLUMN IF NOT EXISTS "expires_at" timestamp,
     ADD COLUMN IF NOT EXISTS "created_at" timestamp,
     ADD COLUMN IF NOT EXISTS "updated_at" timestamp;
   ```

2. **既存データをバックフィル**
   ```sql
   UPDATE "verification"
     SET "expires_at" = COALESCE("expires_at", "expiresAt"),
         "created_at" = COALESCE("created_at", "createdAt"),
         "updated_at" = COALESCE("updated_at", "updatedAt");
   ```

3. **古いcamelCase列のNOT NULL制約を削除**（⭐ 重要）
   ```sql
   ALTER TABLE "verification"
     ALTER COLUMN "expiresAt" DROP NOT NULL,
     ALTER COLUMN "createdAt" DROP NOT NULL,
     ALTER COLUMN "updatedAt" DROP NOT NULL;
   ```

適用テーブル：
- `verification`: `expires_at`, `created_at`, `updated_at`
- `session`: `expires_at`, `created_at`, `updated_at`, `ip_address`, `user_agent`, `user_id`
- `account`: `account_id`, `provider_id`, `user_id`, `access_token`, `refresh_token`, `id_token`, `access_token_expires_at`, `refresh_token_expires_at`, `created_at`, `updated_at`
- `user`: `email_verified`, `created_at`, `updated_at`, `banned`, `ban_reason`, `ban_expires`

---

## デプロイ前チェックリスト

本番環境へのデプロイ前に**必ず実行**してください：

### ✅ チェック手順

```powershell
# 1. Vercel本番環境から環境変数を取得
vercel env pull .env.vercel.production --environment=production

# 2. 本番DBスキーマを診断
$env:ENV_FILE='.env.vercel.production'; pnpm db:auth:check; Remove-Item Env:ENV_FILE

# 出力をチェック：
#   ✅ [DB_CHECK] PASSED であること
#   ✅ すべてのテーブルで [OK] であること
```

### ⚠️ 修復が必要な場合

```powershell
# 修復を実行
$env:ENV_FILE='.env.vercel.production'; pnpm db:auth:fix-compat; Remove-Item Env:ENV_FILE

# 再度検証
$env:ENV_FILE='.env.vercel.production'; pnpm db:auth:check; Remove-Item Env:ENV_FILE

# [DB_CHECK] PASSED を確認してからデプロイ
```

---

## スクリプト詳細

### check-auth-db-state.js

**用途：** auth4テーブルのスキーマ整合性を診断

**実行方法：**
```bash
# ローカル（.env.local）
pnpm db:auth:check

# 本番（.env.vercel.production）
ENV_FILE=.env.vercel.production pnpm db:auth:check
```

**チェック内容：**
1. 必須snake_case列の存在確認
2. 古いcamelCase列の検出（警告）
3. RLS（Row Level Security）ステータス確認
4. RLSポリシーの存在確認

**出力例：**
```
=== Auth DB Schema Check ===
[OK] user: required snake_case columns exist
[OK] session: required snake_case columns exist
[OK] account: required snake_case columns exist
[OK] verification: required snake_case columns exist

[WARN] user: legacy camelCase columns still present -> emailVerified, createdAt, updatedAt
[WARN] session: legacy camelCase columns still present -> expiresAt, createdAt, updatedAt, ipAddress, userAgent, userId
...

=== RLS Status (Auth Tables) ===
[OFF] user (forced=false)
[OFF] session (forced=false)
...

[DB_CHECK] PASSED (env: .env.vercel.production)
```

### fix-auth-schema-compat.js

**用途：** camelCase/snake_case命名不一致による互換性問題を修復

**実行方法：**
```bash
# ローカル
pnpm db:auth:fix-compat

# 本番
ENV_FILE=.env.vercel.production pnpm db:auth:fix-compat
```

**適用操作：**
- 各auth4テーブルに不足しているsnake_case列を追加
- 既存データをcamelCase列からsnake_case列へバックフィル
- 古いcamelCase列のNOT NULL制約をドロップ

**注意：**
- 古いcamelCase列は削除されません（フォールバックとして機能）
- 複数回実行しても冪等（`ADD COLUMN IF NOT EXISTS`使用）

---

## 運用ルール

### 開発中

- スキーマ変更後は `pnpm db:auth:check` を実行
- 失敗した場合は `pnpm db:auth:fix-compat` → 再度 `check` で PASS確認

### デプロイ前（必須）

- **本番環境に対して** `pnpm db:auth:check` を実行（ENV_FILE指定）
- PASSED が出ないとデプロイ禁止
- 必要に応じて `pnpm db:auth:fix-compat` を本番DBに対して実行

### RLS について

現在のauth4テーブルではRLSが無効です。これは以下の理由から問題ありません：

- OAuth認証フロー自体はRLSに依存しない
- 将来的なRLS有効化は別タスク（`drizzle/rls-policies.sql` で下書き済み）

---

## トラブルシューティング

### Q: 本番DBで FAILED と出た場合

**A:** 以下の手順で修復してください：

```powershell
# 1. 本番環境情報取得
vercel env pull .env.vercel.production --environment=production

# 2. 修復実行
$env:ENV_FILE='.env.vercel.production'; pnpm db:auth:fix-compat; Remove-Item Env:ENV_FILE

# 3. 再度検証
$env:ENV_FILE='.env.vercel.production'; pnpm db:auth:check; Remove-Item Env:ENV_FILE

# 4. PASSED確認後にデプロイ
```

### Q: ENV_FILE パラメータとは何か

**A:** `.env.local`（デフォルト）以外の環境設定を参照するためのパラメータです。

```powershell
# .env.local を参照（デフォルト）
pnpm db:auth:check

# .env.vercel.production を参照
$env:ENV_FILE='.env.vercel.production'; pnpm db:auth:check; Remove-Item Env:ENV_FILE
```

### Q: スクリプトが失敗した場合

**A:** エラーメッセージを確認し、以下を確認：

1. `DATABASE_URL` が正しく設定されているか
2. DBが到達可能か（ファイアウォール、認証情報）
3. ネットワーク接続（Vercel本番の場合）

---

## 参考資料

| ファイル | 用途 |
|---------|------|
| [scripts/check-auth-db-state.js](../../../scripts/check-auth-db-state.js) | 診断スクリプト実装 |
| [scripts/fix-auth-schema-compat.js](../../../scripts/fix-auth-schema-compat.js) | 修復スクリプト実装 |
| [.github/copilot-instructions.md](../../../.github/copilot-instructions.md) | AI向けスキーマ一貫性規則 |
| [.agent/manual/Next.js-install.md](../../../.agent/manual/Next.js-install.md) | デプロイ前チェック手順 |

---

## イシューの記録

**解決済み）：** タグ `auth-production-verified`
- 本番環境でOAuth認証動作確認完了（2026-02-28）
- Google/GitHub認証が正常に動作
- Not NULL制約問題をすべて解決
