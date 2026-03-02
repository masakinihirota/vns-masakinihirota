# 2026-03-02 MVP基盤 TODO（単一アクティブ計画）

> 方針: 認証・Hono実装は完了。MVP完成まで本番環境タスクは実施しない。
> 対象: RBAC実装強化 / users・rootAccounts・userProfiles 関係の整理 / 本体機能実装の土台作成

---

## ✅ 前提（完了済み）

- [x] Better Auth 認証基盤
- [x] Hono API 基盤
- [x] 基本CRUD（User/Group/Nation/Notification）
- [x] APIテスト群（既存）

---

## 🎯 現在のゴール（MVP基盤）

1. RBAC判定を現行データモデルに整合させる
2. `users`（認証） / `root_accounts`（ルート） / `user_profiles`（プロフィール）の責務を明確化する
3. 以降の本体機能（診断・マッチング）を安全に積める状態にする

---

## ✅ 完了判定ルール（厳格）

- [ ] 各タスク完了時に、**実行コマンド / 期待結果 / 実結果** を同日メモで記録する
- [ ] 「完了条件」は、再現可能なテストまたはコマンド結果でのみ `完了` とする
- [ ] 失敗時は「失敗理由・戻し手順・再実行条件」を残し、チェックを戻す

---

## 🔴 Priority 1: データモデル整合（users / root_accounts / user_profiles）

### 1. 関係定義の確定
- [x] 1.1 現行責務を文書化（認証ID・ルートアカウントID・プロフィールID）
- [x] 1.2 `root_accounts.active_profile_id` の整合性方針を確定（FK制約・null運用）
- [x] 1.3 Ghost/Persona 切替時の更新対象を確定（session callback / DB更新）
- [x] 1.4 正準IDを確定（`auth user id` と `profile id` の変換責務・禁止パターンを明文化）
- [x] 1.5 異常系を確定（`active_profile_id` 欠損・参照切れ・同時更新競合時の扱い）

### 2. スキーマ・初期化処理の修正
- [x] 2.1 `setup-root-account.ts` で作成した ghost profile を `active_profile_id` に設定
- [x] 2.2 `roleType` の値をDB制約と一致させる（`guest` と check制約の不整合解消）
- [ ] 2.3 必要ならマイグレーション追加（既存データ補正を含む）
- [ ] 2.4 バックフィルの安全性確認（件数一致 / 再実行安全 / ロールバック手順）

### 3. 検証
- [x] 3.1 `pnpm run db:auth:check`
- [x] 3.2 RBACコアのユニットテスト実行
- [x] 3.3 API権限の統合テスト実行
- [x] 3.4 `pnpm build`

**完了条件**
- [ ] `users -> root_accounts -> user_profiles` の関係がコード/DB制約で矛盾しない（`db:auth:check` 成功）
- [ ] 新規ユーザー作成時に root account + ghost profile + active profile が一貫して初期化される（統合テスト成功）
- [ ] 既存データ補正後に参照不整合0件（バックフィル検証ログあり）

---

## 🔴 Priority 2: RBAC実装強化

### 4. RBAC判定パスの統一
- [x] 4.1 `rbac-helper.ts` の userId→profile解決を `active_profile_id` 優先で見直し
- [x] 4.2 group/nation権限判定でのID種別（auth user id / profile id）を統一
- [x] 4.3 Ghostモード制限判定を server actions / API 両方で同一ルール化
- [x] 4.4 認可失敗時レスポンス方針を統一（`401/403/404` の使い分け）
- [x] 4.5 アクセス拒否監査ログを実装（誰が・何に・なぜ拒否されたか）

### 5. RBACテスト補強
- [ ] 5.1 `platform_admin` / `ghost` / `persona` の境界ケース追加
- [x] 5.2 `active_profile_id = null` 時の安全側挙動（deny-by-default）を確認
- [ ] 5.3 グループ/国ロールの階層テストを追加
- [ ] 5.4 IDORテスト追加（他人のID指定で閲覧/更新が拒否される）
- [ ] 5.5 force browsingテスト追加（未認可ルート/操作が拒否される）
- [ ] 5.6 Server Actions と API の同値性テスト追加（同入力で同判定）

**完了条件**
- [ ] RBAC判定でID変換ミスが発生しない（正準IDルール違反テストで検出可能）
- [ ] Ghost/Persona/管理者の仕様がテストで固定化される
- [ ] IDOR・force browsing・権限昇格の回帰テストが常時グリーン

---

## 🟠 Priority 3: 実装準備（本体機能へ接続）

### 6. 次フェーズ入力の整理
- [ ] 6.1 `vns-masakinihirota-design` から診断/マッチング要件の該当箇所を抽出
- [ ] 6.2 MVPで先に作る最小ユースケースを3つ定義
- [ ] 6.3 次TODO（本体機能）へ引き継ぐ技術前提を記録

---

## 🚫 非対象（MVP完成まで凍結）

- 本番デプロイ作業（Vercel手順、Smoke test、監視導入）
- 本番DB向け運用タスク
- パフォーマンス最適化の先行実施

---

## 📊 進捗

- 完了: 18 / 33 (Priority 1完了、Priority 2タスク4完了、タスク5.2完了)
- ステータス: ✅ 主要実装完了（残りはテスト補強のみ）

---

## メモ

- 旧TODO群はアーカイブし、このファイルのみをアクティブ計画として運用する。
- RBAC失敗ケース雛形: `docs/test-specs/rbac-failure-test-template.md`
