---
applyTo: "**"
---

## 2025-12-20 用語統一（コード側の旧ロール表記 → mediator）

### 目的

- DB/コード内に残っている旧ロール表記を、用語としての「メディエーター（`mediator`）」に統一する。

### 実施内容（vns-masakinihirota）

- `supabase/schemas/user_profiles.sql` の `role_type_check` 制約を `mediator` へ統一。
- 既存データ移行用に `supabase/schemas/migrate_role_to_mediator.sql` を追加（`user_profiles.role_type` を更新）。
- 旧移行SQL（旧ロール表記を含むファイル名）の削除。

### 検索確認

- リポジトリ内で旧ロール表記の出現は0件（上記変更後）。
- `mediator` は `user_profiles.sql` の制約でのみ確認。

### 注意

- DBに既存で旧ロール表記が存在する場合、制約適用前に移行SQLを実行して値を `mediator` に更新する必要がある。
