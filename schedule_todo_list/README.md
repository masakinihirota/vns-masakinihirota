# Schedule TODO List - VNS masakinihirota

> **更新日**: 2026-03-02
> **運用方針**: 単一アクティブTODO運用（MVP完成まで本番タスク凍結）

---

## 📌 現在の運用ルール

1. `schedule_todo_list/` に置くアクティブTODOは **1ファイルのみ**。
2. 完了または不要になったTODOは `archive/` へ移動する。
3. 未完了TODOが残っている間は新規計画ファイルを増やさない。
4. MVP完成まで、本番デプロイ（Vercel/本番DB運用）タスクは実施しない。
5. 新規TODO作成前に、アクティブTODO 1本の未完了数（`- [ ]`）を必ず確認する。
	- 未完了数 > 0: 新規TODO作成禁止
	- 未完了数 = 0: 新規TODO作成可

---

## ✅ 現在のアクティブTODO

- `2026-03-02_MVP_FOUNDATION_TODO.md`

**対象スコープ**:
- RBAC実装強化
- `users` / `root_accounts` / `user_profiles` の関係整理
- 本体機能（診断・マッチング）へ入る前の土台固め

**非対象（凍結）**:
- 本番デプロイ関連
- 本番監視・本番負荷試験

---

## 📂 フォルダ構成

```
schedule_todo_list/
├── 2026-03-02_MVP_FOUNDATION_TODO.md  # 唯一のアクティブTODO
├── README.md
├── archive/                            # 旧計画・完了TODO
└── reference/
```

---

## 🔗 参照

- TODO管理スキル: `.agent/skills/todo-list-management/SKILL.md`
- エージェント指示: `.agent/skills/todo-list-management/AGENTS.md`

---

**Last Updated**: 2026-03-02
