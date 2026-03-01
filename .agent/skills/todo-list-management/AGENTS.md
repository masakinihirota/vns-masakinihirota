# TODO List Management - Agent Instructions

> **Target**: GitHub Copilot / AI Agents
> **Purpose**: TODOリスト整理・管理時のベストプラクティスガイド

---

## 🔍 このスキルを使う場面

ユーザーが以下のような指示をしたときに、このスキルを適用してください：

- 「TODOリストが溜まりすぎた」
- 「完了したタスクと途中のタスクを分けてほしい」
- 「今のバックログを整理してくれ」
- 「古い計画をアーカイブしてほしい」
- 「残りのタスクを新しいリストに作成して」

---

## 📋 実行手順（Agent向け）

### Step 1: 現状調査（5～10分）

```bash
# schedule_todo_list フォルダのファイル一覧確認
list_dir "schedule_todo_list/"

# 各TODOファイルの完了度を確認
read_file "2026-XX-XX_TODO.md" (各ファイル)

# ファイルの行数を確認
wc -l schedule_todo_list/*.md
```

**判定項目**:
- [ ] ファイル数
- [ ] 各ファイルの完了度 (✅ / ⏳ / ❌)
- [ ] 完了したセクションのカウント
- [ ] 残りのセクションのカウント

---

### Step 2: 分類（5～10分）

各ファイルを以下のカテゴリに分類：

#### ✅ 完了（Archive対象）
条件: **すべてのチェックボックスが `[x]` でマークされている**

例:
- `2026-02-28_TODO.md` - すべてのセクション完了
- `SECURITY_FIX_TODO.md` - 11個のタスクすべて完了

**アクション**:
- [ ] `archive/` に移動
- [ ] 移動前に内容確認

#### ⏳ 進行中（保持）
条件: **一部のステップが完了 (1～99%)**

例:
- `2026-03-01_HONO_MASTER_PLAN.md`
  - Phase 0: 完了 ✅
  - Phase 1～3: 未実施 ❌

**アクション**:
- [ ] `schedule_todo_list/` に残す
- [ ] 新バックログで追跡

#### ❌ 未実施（参考用またはBacklog）
条件: **チェックボックスが `[ ]` または古い計画**

例:
- `2026-03-01_HONO_INTEGRATION_TODO.md` - レビュー指摘が多い (参考用)
- 新しい機能で未着手のTODO

**アクション**:
- [ ] レビュー指摘ある場合は `archive/` に移動（参考用）
- [ ] 実装予定の場合は `BACKLOG.md` に集約

---

### Step 3: ファイル移動（5～10分）

**PowerShellコマンド例**:

```powershell
# 完了ファイルをarchiveに移動
$files = @('FILE1.md', 'FILE2.md');
$files | ForEach-Object {
  Move-Item -Path "schedule_todo_list\$_" -Destination "schedule_todo_list\archive\$_"
  Write-Host "✅ Move: $_"
}

# 確認
Get-ChildItem "schedule_todo_list/archive" -File
```

**留意点**:
- [ ] 移動前にファイル内容を確認
- [ ] 相互参照がないか確認
- [ ] archive フォルダが存在することを確認

---

### Step 4: 新バックログ生成（10～15分）

**生成対象**:
- 進行中の残りステップ
- 新しい機能で未実施のタスク
- 次スプリントで実施予定のタスク

**ファイル名規則**:
```
schedule_todo_list/YYYY-MM-DD_BACKLOG.md
```

**セクション構成**:

```markdown
# YYYY-MM-DD - Active Backlog

## 🔴 CRITICAL (本番展開前に必須)
### 1. [Task Name]
**Status**: ⏳ 未実施
**Priority**: CRITICAL
**Estimated**: Xh
**Steps**:
- [ ] 1.1: ...
- [ ] 1.2: ...

## 🟠 MAJOR (リリース前に推奨)
### 4. [Task Name]
**Status**: ✅ 完了
...

## 📊 Progress Summary
| Category | Done | InProgress | Todo | Total |
|----------|------|-----------|------|-------|
| CRITICAL | 2 | 0 | 1 | 3 |
| MAJOR | 3 | 0 | 0 | 3 |

**Current Status**: 50% Complete
```

---

### Step 5: Archive README更新（5～10分）

**更新項目**:

```markdown
## 📋 完了したTODO (YYYY-MM-DD)

| File | Status | CompletedDate |
|------|--------|---------------|
| 2026-02-28_TODO.md | ✅ | 2026-02-28 |
| SECURITY_FIX_TODO.md | ✅ | 2026-03-01 |

## 📚 参考用 - レビュー・計画ドキュメント

| File | Content | Status |
|------|---------|--------|
| 2026-03-01_HONO_INTEGRATION_TODO.md | 元の計画 | ⚠️ Review済み → 修正版へ |
```

---

## ✅ チェックリスト（実行時）

整理作業の際に以下を確認：

### 前準備
- [ ] `schedule_todo_list/` フォルダにアクセス可能か
- [ ] `archive/` サブフォルダが存在するか
- [ ] 実装開始ツール（run_in_terminal）が利用可能か

### 実行中
- [ ] 各ファイルの完了度を正確に判定したか
- [ ] 相互参照を確認したか
- [ ] ファイル移動のログを記録したか
- [ ] 新バックログにすべての残タスクを含めたか

### 実行後
- [ ] すべての `✅ 完了` ファイルが archive に移動したか
- [ ] `schedule_todo_list/` に残るファイルは適切か
- [ ] `archive/README.md` が更新されたか
- [ ] 新バックログが完成したか

---

## ⚠️ 注意点

### 重要な警告

| 警告 | 対応 |
|------|------|
| **参考用ドキュメントの誤削除** | `archive/` に移動、削除しない |
| **相互参照の見落とし** | ファイル移動前に grep で確認 |
| **新バックログの漏れ** | CODE_REVIEW_STRICT など新たに発見されたタスクも含める |
| **ドキュメント付け忘れ** | archive/README.md 必ず更新 |

### エッジケース対応

**Case 1: 完了度が 90% だが、最後のテストが未実施**
```
→ ⏳ 進行中 として BACKLOG.md に集約
→ テストステップのみ残す
```

**Case 2: 古い計画なので参考用だが、すべてチェック済み**
```
→ ✅ 完了 扱い
→ archive/ に移動
→ README.md に「参考用」と明記
```

**Case 3: 複数の依存関係がある場合**
```
→ 各ファイルをまとめて移動
→ archive/README.md に依存関係の説明を記載
```

---

## 📝 レポート例

整理完了後、ユーザーに以下のようにレポート：

```
## ✅ TODO整理完了

### 📊 処理結果

| Action | Count |
|--------|-------|
| Archived (完了) | 7ファイル |
| Archived (参考用) | 6ファイル |
| Active | 5ファイル |
| **総処理** | **13ファイル** |

### 📂 ファイル配置

**Active（schedule_todo_list/）**:
- 2026-03-01_BACKLOG.md ✨ (新規)
- 2026-03-01_HONO_MASTER_PLAN.md
- CODE_REVIEW_STRICT_2026-03-01.md
- SCHEMA_DESIGN_ISSUE_2026-03-01.md
- REMEDIATION_SUMMARY_2026-03-01.md

**Archived（archive/）**:
✅ 完了:
- 2026-02-28_TODO.md
- SECURITY_FIX_TODO.md
- 2026-02-28_implementation-tickets.md
- (その他4ファイル)

📋 参考用:
- 2026-03-01_HONO_INTEGRATION_TODO.md
- 2026-03-01_HONO_REVIEW_CRITIQUE.md
- (その他4ファイル)

### 🎯 残タスク

| Category | Status | Priority | Est. Hours |
|----------|--------|----------|-----------|
| スキーマ統合 | ⏳ | CRITICAL | 2～3h |
| (その他) | ... | ... | ... |

**Next Action**:
- [ ] スキーマ統合タスクを実施 (`.agent/decisions/schema-migration.md` 参照)
```

---

## 🔄 継続的改善

このスキルの改善が必要な場合：

1. `2026-03-01_BACKLOG.md` に「スキル改善」タスクを追加
2. 実施内容を `.agent/skills/todo-list-management/IMPROVEMENTS.md` に記録
3. SKILL.md と AGENTS.md を更新

---

**Version**: 1.0
**Last Updated**: 2026-03-01
**Maintained By**: GitHub Copilot
