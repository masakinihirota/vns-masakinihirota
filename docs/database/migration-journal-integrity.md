# Migration Journal 整合性チェックガイド

> **バージョン**: 1.0
> **更新日**: 2026-03-03
> **対象**: Drizzle ORM Migration Journal（PostgreSQL）

## 概要

`drizzle/meta/_journal.json` の整合性を検証し、マイグレーション履歴の破損を防ぐためのガイドです。Journal は Drizzle が自動管理するメタデータファイルで、手動編集は厳禁です。

---

## Journal の役割

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
      "name": "user"
    },
    {
      "idx": 1,
      "version": "6",
      "when": 1700100000000,
      "type": "CREATE_TABLE",
      "name": "session"
    }
  ]
}
```

### 各フィールドの意味

| フィールド | 説明 | 例 | 編集可否 |
|-----------|------|-----|---------|
| `version` | Drizzle スキーマバージョン | `"6"` | ❌ NO |
| `dialect` | DB タイプ | `"postgresql"` | ❌ NO |
| `entries` | マイグレーション履歴 | Array | ❌ NO |
| `idx` | エントリインデックス（採番） | `0, 1, 2, ...` | ❌ NO |
| `version`（entries内） | Drizzle バージョン | `"6"` | ❌ NO |
| `when` | Unix タイムスタンプ（ミリ秒） | `1700000000000` | ❌ NO |
| `type` | SQL操作の種類 | `CREATE_TABLE`, `ALTER_TABLE`, `DROP_TABLE` | ❌ NO |
| `name` | テーブル/インデックス名 | `"user"`, `"idx_user_email"` | ❌ NO |

---

## 整合性チェック項目

### 1. ファイル存在確認

```bash
# Journal ファイルの存在確認
test -f drizzle/meta/_journal.json && echo "✅ Journal file exists" || echo "❌ Journal file missing"

# Size 確認（1MB 以下が正常）
du -h drizzle/meta/_journal.json
# 出力例: 4.2K drizzle/meta/_journal.json
```

### 2. JSON 形式の妥当性

```bash
# JSON パース可能性を確認
jq empty drizzle/meta/_journal.json && echo "✅ Valid JSON" || echo "❌ Invalid JSON"

# 詳細エラー出力
node -e "const fs = require('fs'); JSON.parse(fs.readFileSync('drizzle/meta/_journal.json'))"
```

### 3. 必須フィールド確認

```bash
# 必須キー `version`, `dialect`, `entries` が存在することを確認
jq '{version: .version, dialect: .dialect, entry_count: (.entries | length)}' drizzle/meta/_journal.json

# 出力例:
# {
#   "version": "6",
#   "dialect": "postgresql",
#   "entry_count": 7
# }
```

### 4. Entries 整合性確認

```bash
# idx の連続性を確認（0 から entry_count-1 まで）
jq 'if ([.entries[].idx] | unique | sort) == (range([.entries | length]) | [.]) then "✅ Idx sequence OK" else "❌ Idx gaps detected" end' drizzle/meta/_journal.json

# when（タイムスタンプ）が昇順であることを確認
jq 'if ([.entries[].when] | sort) == [.entries[].when] then "✅ Timeline OK" else "❌ Timeline disorder" end' drizzle/meta/_journal.json

# Drizzle version が一貫していることを確認
jq 'if ([.entries[].version] | unique | length) == 1 then "✅ Version consistent" else "⚠️  Multiple Drizzle versions detected" end' drizzle/meta/_journal.json
```

### 5. DB との同期確認

```bash
# DB に保存されているマイグレーション数と Journal のエントリ数を比較
JOURNAL_COUNT=$(jq '.entries | length' drizzle/meta/_journal.json)
DB_COUNT=$(psql -d "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'")

echo "Journal entries: $JOURNAL_COUNT"
echo "DB tables (public): $DB_COUNT"

# 差異がある場合は警告
if [ $JOURNAL_COUNT -gt $DB_COUNT ]; then
  echo "⚠️  Journal has more entries than DB tables"
else
  echo "✅ Journal and DB roughly in sync"
fi
```

### 6. マイグレーションファイルとの照合

```bash
# Journal に記載されている全てのマイグレーション SQL ファイルが存在することを確認
jq -r '.entries[].name' drizzle/meta/_journal.json | while read -r name; do
  if test -f "drizzle/${name}.sql" 2>/dev/null || test -f "drizzle/${name}.ts" 2>/dev/null; then
    echo "✅ $name"
  else
    echo "❌ $name - FILE NOT FOUND"
  fi
done
```

### 7. Daily Backup との照合（重要）

```bash
# 日次バックアップに保存されている Journal との差分を確認
diff -u <(jq '.entries | length' drizzle/meta/_journal.json.backup-20260302) \
        <(jq '.entries | length' drizzle/meta/_journal.json)

# 出力例:
# < 6          (前日の Journal エントリ数)
# > 7          (本日の Journal エントリ数)
#
# つまり、1 個新規マイグレーションが追加された
```

---

## 整合性チェック スクリプト

より簡潔に複数の検査を実行：

```bash
#!/bin/bash
# scripts/validate-migration-journal.sh

set -e

JOURNAL_PATH="drizzle/meta/_journal.json"

echo "🔍 Validating Migration Journal..."

# 1. ファイル存在確認
if [ ! -f "$JOURNAL_PATH" ]; then
  echo "❌ Journal file not found: $JOURNAL_PATH"
  exit 1
fi

# 2. JSON 妥当性
if ! jq empty "$JOURNAL_PATH" 2>/dev/null; then
  echo "❌ Invalid JSON in $JOURNAL_PATH"
  exit 1
fi
echo "✅ JSON syntax OK"

# 3. 必須フィールド
REQUIRED_FIELDS=("version" "dialect" "entries")
for field in "${REQUIRED_FIELDS[@]}"; do
  if ! jq -e ".$field" "$JOURNAL_PATH" > /dev/null 2>&1; then
    echo "❌ Missing required field: $field"
    exit 1
  fi
done
echo "✅ Required fields OK"

# 4. Idx 連続性
IDX_VALID=$(jq 'if ([.entries[].idx] | unique | sort) == (range([.entries | length]) | [.]) then true else false end' "$JOURNAL_PATH")
if [ "$IDX_VALID" = "true" ]; then
  echo "✅ Idx sequence OK"
else
  echo "❌ Idx sequence broken"
  exit 1
fi

# 5. Timeline 昇順
TIMELINE_VALID=$(jq 'if ([.entries[].when] | sort) == [.entries[].when] then true else false end' "$JOURNAL_PATH")
if [ "$TIMELINE_VALID" = "true" ]; then
  echo "✅ Timeline OK"
else
  echo "❌ Timeline out of order"
  exit 1
fi

# 6. マイグレーション SQL ファイルの存在確認
SQL_COUNT=0
MISSING_COUNT=0

for migration_file in drizzle/*.sql; do
  if [ -f "$migration_file" ]; then
    ((SQL_COUNT++))
  fi
done

echo "✅ Found $SQL_COUNT migration SQL files"

# 7. 最終的なサマリー
ENTRY_COUNT=$(jq '.entries | length' "$JOURNAL_PATH")
echo ""
echo "📊 Summary:"
echo "  Entries in Journal: $ENTRY_COUNT"
echo "  Migration files: $SQL_COUNT"
echo ""
echo "✅ All validation checks passed!"
```

### スクリプト実行方法

```bash
# スクリプトを実行可能にする
chmod +x scripts/validate-migration-journal.sh

# 実行
./scripts/validate-migration-journal.sh

# 出力例:
# 🔍 Validating Migration Journal...
# ✅ JSON syntax OK
# ✅ Required fields OK
# ✅ Idx sequence OK
# ✅ Timeline OK
# ✅ Found 7 migration SQL files
#
# 📊 Summary:
#   Entries in Journal: 7
#   Migration files: 7
#
# ✅ All validation checks passed!
```

---

## トラブルシューティング

### 問題 1: JSON Parse エラー

```
❌ Invalid JSON in drizzle/meta/_journal.json
```

**原因**: Journal ファイルが破損している、または不完全な編集

**解決手順**:

```bash
# 1. Git から最後の正常な Journal を復元
git checkout HEAD~1 -- drizzle/meta/_journal.json

# 2. 最後のマイグレーションをやり直す
pnpm db:generate
pnpm db:apply-security
```

### 問題 2: Idx ギャップ検出

```
❌ Idx gaps detected
```

**原因**: 手動で Journal を編集、またはマイグレーション削除

**解決手順**:

```bash
# 1. 正常な状態のバックアップから復元
cp drizzle/meta/_journal.json.backup drizzle/meta/_journal.json

# 2. 確認
./scripts/validate-migration-journal.sh

# 3. 問題となったマイグレーションを再実行
pnpm db:generate
```

### 問題 3: Timeline 逆順

```
❌ Timeline out of order
```

**原因**: 異なるタイムゾーンのマシンで生成されたマイグレーション（稀）

**解決手順**:

```bash
# 1. Timeline を修正
node scripts/fix-journal-timeline.js

# 2. 確認
./scripts/validate-migration-journal.sh
```

---

## ベストプラクティス

### DO ✅

- [ ] マイグレーション作成時に自動的に `pnpm db:generate` を実行
- [ ] 日次でバックアップを取得：`cp drizzle/meta/_journal.json drizzle/meta/_journal.json.backup-$(date +%Y%m%d)`
- [ ] CI/CD パイプラインで Journal 整合性チェックを自動実行
- [ ] ロールバック前に Journal バックアップを保存

### DON'T ❌

- [ ] Journal ファイルを手動で編集
- [ ] `idx` や `when` フィールドを変更
- [ ] マイグレーション削除後に Journal を編集（必ず `git checkout` で復元）
- [ ] タイムゾーンが異なる複数のマシンで同時にマイグレーション生成

---

## CI/CD 統合

### GitHub Actions での自動チェック

```yaml
# .github/workflows/migration-validation.yml

name: Migration Journal Validation

on:
  push:
    paths:
      - 'drizzle/**'
  pull_request:
    paths:
      - 'drizzle/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install dependencies
        run: npm install -g jq

      - name: Validate Migration Journal
        run: ./scripts/validate-migration-journal.sh

      - name: Check for manual edits
        run: |
          git diff HEAD -- drizzle/meta/_journal.json | grep -E '^\+|^-' | grep -v '^+++\|^---' && \
          echo "❌ Manual edits detected in Journal" && exit 1 || \
          echo "✅ No manual edits detected"
```

---

## チェックリスト

定期的なメンテナンス：

- [ ] 週 1 回、Journal 整合性チェック実行
- [ ] 月 1 回、バックアップの整合性確認
- [ ] マイグレーション適用前に必ず検証スクリプト実行
- [ ] 本番環境マイグレーション前に複数人で Journal レビュー

---

## 参考リンク

- [Migration Naming Strategy](./migration-naming-strategy.md)
- [Migration Rollback Procedure](./migration-rollback-procedure.md)
- [Production Migration Procedure](./production-migration-procedure.md)

---

## サポート

Journal の不整合が検出された場合：

1. **即座に**: マイグレーション作業を中止
2. **確認**: 上記トラブルシューティング セクションを参照
3. **相談**: Slack #database-migrations に投稿
4. **ロールバック**: Mission Critical な場合は [Migration Rollback Procedure](./migration-rollback-procedure.md) に従う
