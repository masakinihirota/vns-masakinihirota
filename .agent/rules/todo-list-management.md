# TODO List Management Rules

> **Applies To**: All TODO and Backlog documents in `schedule_todo_list/`
> **Owner**: GitHub Copilot
> **Status**: Active (v1.0)

---

## 📋 Rule Categories

### R1: File Naming Convention

**Rule**: TODOファイルは `YYYY-MM-DD_PROJECT_OR_FUNCTION.md` の形式で名付ける

**Examples** (✅ Good):
- `2026-02-28_TODO.md` - 日次TODO
- `2026-03-01_BACKLOG.md` - アクティブバックログ
- `SECURITY_FIX_TODO.md` - 機能別TODO

**Counter-examples** (❌ Bad):
- `TODO.md` - 日付がない
- `hono_integration.md` - 大文字が混在していない
- `2026-02-28_hono_review_critique_final_v3.md` - 長すぎる

---

### R2: Completion Status Indicators

**Rule**: 各TODO項目に以下のいずれかを付与

| Symbol | Meaning | Definition |
|--------|---------|-----------|
| ✅ | Complete | すべてのステップが `[x]` で完了 |
| ⏳ | In Progress | 1つ以上のステップが実施中 |
| ❌ | Not Started | チェックボックスが `[ ]` のまま |
| 📋 | Reference | 参考資料（直接実装に使用しない） |

**Usage**:
```markdown
### 1. Schema Unification 🔴 ✅
### 2. Hono Integration 🟡 ⏳
### 3. E2E Testing 🟢 ❌
### 4. Review Critique 📋
```

---

### R3: Priority Classification

**Rule**: 優先度を3段階で分類

| Level | Tag | Criteria | Action |
|-------|-----|----------|--------|
| **Critical** | 🔴 | 本番展開前に**必須** | 即座に実施 |
| **Major** | 🟠 | リリース前の**推奨** | 今週中に実施 |
| **Minor** | 🟡 | 実施が**望ましい** | 時間あれば実施 |
| **Optional** | 🟢 | **将来検討** | バックログ保留 |

### R4: Progress Tracking Format

**Rule**: 各TODOは以下の構造で記述

```markdown
### N. [Task Title] [Priority] [Status]

**Description**: [What and Why]

**Steps**:
- [x] N.1: [Step Title]
- [ ] N.2: [Step Title]
- [ ] N.3: [Step Title]

**Acceptance Criteria**:
- ✅ Criterion 1
- ✅ Criterion 2
- ⏳ Criterion 3

**Related Docs**:
- [Link to Decision](path/to/doc.md)

**Current Progress**: X/Y steps (ZZ%)
**Last Updated**: 2026-03-01
```

---

### R5: Checkbox Management

**Rule**: [x] と [ ] のみ使用

**Good** ✅:
```markdown
- [x] Completed task
- [ ] Not started task
- [x] Another completed task
```

**Bad** ❌:
```markdown
- ✅ Done (checkbox を使わない)
- TODO: Not started (非構造化)
- [?] Partial (不明確な状態)
```

**Updates**:
- ステップ実施時に `[ ]` → `[x]` に変更
- 一度 `[x]` をつけたら戻さない（すべてが `[x]` で完了）

---

### R6: Archive Strategy

**Rule**: 以下のファイルは `archive/` に移動

条件:

1. **✅ 完了ファイル**
   - Definition: すべてのチェックボックスが `[x]`
   - Action: 即座に移動
   - Naming: そのまま（`YYYY-MM-DD_*_TODO.md`）

2. **📋 参考用ドキュメント**
   - Definition: レビュー結果、選択肢分析、廃止された計画
   - Trigger: より新しい版が `schedule_todo_list/` に存在
   - Action: archive に移動
   - Naming: そのまま

3. **🗑️ デッドコード**
   - Definition: プロジェクトで使用されないファイル
   - Action: 削除または archive
   - Caution: 相互参照を確認してから削除

**Non-Archivable**:
- 進行中のバックログ
- 未実施の重要タスク
- 現在のマスタープラン

---

### R7: Active Files Maintenance

**Rule**: `schedule_todo_list/` ルートに置かれるファイルは「今作業中」

**例**:
- `2026-03-01_HONO_MASTER_PLAN.md` - 進行中
- `2026-03-01_BACKLOG.md` - アクティブ
- `CODE_REVIEW_STRICT_2026-03-01.md` - 修復中

**期限**:
- 進行中の場合: 置いておく
- 完了した場合: 即座に archive に移動
- 参考用化した場合: archive に移動

**Update Frequency**:
- 1週間以上更新されない場合は「放置ファイル」で検査対象

---

### R8: Backlog Creation Rules

**Rule**: 新しいバックログは以下の条件で生成

**Trigger** (いずれかに該当):
- [ ] 古いTODOファイルが完了した
- [ ] 複数のタスクが残っている
- [ ] 新しいスプリントを開始する
- [ ] 隔週リプランニング

**Content**:
- [ ] CRITICAL / MAJOR / MINOR の3階級分類
- [ ] すべての残タスクを含める
- [ ] 推定工数を記載
- [ ] 関連ドキュメントへのリンク

**Naming**:
```
schedule_todo_list/YYYY-MM-DD_BACKLOG.md
```

**Retention**:
- アクティブなバックログは常に1つ
- 古いバックログは archive に移動

---

### R9: Cross-References Management

**Rule**: ファイル間参照は `[display text](path/to/file.md)` Markdown形式

**Good** ✅:
```markdown
**Related Docs**:
- [Security Fix TODO](SECURITY_FIX_TODO.md)
- [Archive README](archive/README.md)
- [Decision: Node Runtime](.agent/decisions/node-runtime.md)
```

**Caution**:
- ファイル移動時に参照を確認
- 移動前に grep で相互参照をチェック
- archive 移動時、他のファイルから参照されていないか確認

**Format**:
```
相対パス: `../archive/README.md` ✅
絶対パス: `u:/path/to/file` ❌
相互参照リスト: 各ファイルのセクション末尾に記載
```

---

### R10: Update & Maintenance Schedule

**Rule**: TODO管理は定期的に実施

**Daily** (毎日):
- [ ] 実施したステップを `[x]` にマーク
- [ ] Current Progress を更新

**Weekly** (毎週 金曜):
- [ ] 完了度が 100% のファイルを archive に移動
- [ ] 実施予定エンドポイント単位で新バックログ作成
- [ ] archive/README.md を更新

**Bi-Weekly** (隔週 月曜):
- [ ] すべてのアクティブファイルの状況確認
- [ ] 優先度の再評価
- [ ] 新規タスク発見時にバックログに追加

**Release** (リリース前):
- [ ] すべての CRITICAL / MAJOR タスクが完了か確認
- [ ] テスト関連をチェックリスト化
- [ ] デプロイ前チェックリスト作成

---

### R11: Document Quality Standards

**Rule**: すべてのTODOドキュメントは以下品質基準を満たす

**Format**:
- [ ] Markdown形式
- [ ] UTF-8エンコーディング
- [ ] 日本語で記述

**Structure**:
- [ ] Header（作成日、更新ルール）
- [ ] 優先度分類セクション
- [ ] 各タスク詳細
- [ ] Progress Summary
- [ ] 関連ドキュメントリンク

**Content**:
- [ ] タスク名は動詞を含む（「スキーマ統合」「修復完了」など）
- [ ] 各ステップは具体的（「〇〇を確認」「××関数を実装」）
- [ ] ファイルパスは相対パス
- [ ] 見出しレベルは統一 (###)

**Errors to Avoid**:
- ❌ 曖昧な説明（「何かやる」「確認する」）
- ❌ ステップなしのタスク
- ❌ 完了度が不明確
- ❌ 古い日付のまま放置

---

### R12: Exception Handling

**Rule**: 以下の例外はエスカレーション対象

| Situation | Action |
|-----------|--------|
| タスク自体が実装不可能と判明 | バックログから削除 + 理由を README に記載 |
| 新しい環境変更で優先度変動 | 所有者に報告 + バックログ更新 |
| 複数タスクの依存関係発見 | 依存関係図を作成してドキュメント |
| ファイル遺失・破損 | Git履歴から復旧、アーカイブ確認 |

---

### R13: Session Completion Protocol ⚡ **MANDATORY**

**Rule**: セッション終了時、エージェントは必ず TODO リストの進捗をチェックし、アーカイブ処理を実行する

**Trigger Keywords** (これらの発言を検知):
- "終了"
- "完了"
- "今日は以上"
- "セッションを終了"
- "TODO をチェック"
- "アーカイブして"

**Mandatory Steps**:

```markdown
STEP 1: Scan Active Files
  → Read `schedule_todo_list/README.md`
  → List all files in `schedule_todo_list/` (excluding archive/)
  → Identify completion status (✅/⏳/❌)

STEP 2: Evaluate Completion
  For each file:
    IF all checkboxes are [x] AND acceptance criteria met:
      → Mark as "Ready for Archive"
    ELSE IF file is reference doc (review, critique, options):
      → Mark as "Reference Archive"
    ELSE:
      → Mark as "In Progress - Keep Active"

STEP 3: Archive Files
  For "Ready for Archive" files:
    → Move to `schedule_todo_list/archive/`
    → Update `archive/README.md`
  For "Reference Archive" files:
    → Move to `schedule_todo_list/archive/`
    → Add note "参考資料" in archive README

STEP 4: Update Documentation
  → Update `schedule_todo_list/README.md` dashboard:
    - Active Files count
    - Archived count
    - Last updated date
  → Update archive/README.md with new entries

STEP 5: Report to User
  → Display concise summary (2-3 sentences):
    - "✅ N個のタスクが完了し、archive に移動しました"
    - "⏳ M個のタスクが進行中です"
    - "次回セッションの開始ポイント: [最優先タスク]"
```

**Execution Guardrails**:

| Check | Action | Blocker |
|-------|--------|--------|
| File has cross-references | Verify references still valid after move | ⚠️ WARNING |
| README dashboard outdated | Update before archiving | 🔴 BLOCKER |
| Multiple active backlogs | Consolidate into one | ⚠️ WARNING |
| Archive README missing | Create it first | 🔴 BLOCKER |

**Output Format**:

```markdown
## 🎯 セッション完了レポート

**実施日時**: YYYY-MM-DD HH:MM

**アーカイブ完了** (N個):
- 📦 [File1.md](archive/File1.md) - 完了 100%
- 📦 [File2.md](archive/File2.md) - 参考資料

**進行中** (M個):
- ⏳ [Active1.md](Active1.md) - 進捗 60%
- ⏳ [Active2.md](Active2.md) - 進捗 40%

**次回優先タスク**:
1. 🔴 [最優先タスク名]
2. 🟠 [次点タスク名]

**Dashboard更新**: ✅ README.md updated
```

**Exception Cases**:

| Situation | Resolution |
|-----------|------------|
| User says "終了" but critical task incomplete | ⚠️ Warn user: "🔴 CRITICAL タスクが未完了です。本当に終了しますか？" |
| File移動権限エラー | Report error + provide manual PowerShell command |
| README.md not found | Create new README with current state |
| No files to archive | Report "すべてのタスクは進行中です" + skip archive |

**Compliance**:
- ✅ **MUST** execute when trigger keywords detected
- ✅ **MUST** update dashboard after archiving
- ✅ **MUST** provide summary report to user
- ⚠️ **SHOULD** verify cross-references before moving
- ⚠️ **SHOULD** consolidate multiple backlogs

---

## 🎯 Compliance Checklist

このファイルを読んだ AI Agents は以下を遵守：

- [ ] R1: ファイル名が形式に従う
- [ ] R2: 各タスクにステータスが付与されている
- [ ] R3: 優先度判定が適切
- [ ] R4: 構造が統一されている
- [ ] R5: チェックボックスのみ使用
- [ ] R6: Archive 条件を確認してから移動
- [ ] R7: Active ファイルは「進行中」のみ
- [ ] R8: 新バックログに残タスクをすべて含める
- [ ] R9: 相互参照をチェック
- [ ] R10: 定期更新スケジュール遵守
- [ ] R11: ドキュメント品質確認
- [ ] R12: 例外はエスカレーション
- [ ] R13: セッション終了時プロトコル実行 ⚡

---

## 🔗 Related Documents

- **Skill**: `.agent/skills/todo-list-management/SKILL.md`
- **Agent Instructions**: `.agent/skills/todo-list-management/AGENTS.md`
- **Active Backlog**: `schedule_todo_list/2026-03-01_BACKLOG.md`
- **Archive Guide**: `schedule_todo_list/archive/README.md`

---

**Version**: 1.0
**Effective Date**: 2026-03-01
**Last Review**: 2026-03-01
**Owner**: GitHub Copilot Instruction System
