# DB 用タスクリスト (初期スキーマ / ルートアカウント中心)

本ファイルを編集する前に必ず `.github/.copilot-task-instructions.md` を参照し、粒度 / 依存関係 / 完了条件 / テスト観点ルールを再確認してください。

## 方針
- MVP では `root_accounts` を中核テーブルとし、拡張を想定した正規化 (履歴 / 参照 / ログ) は段階導入。
- "集計系 (totalPoints 等)" はまずアプリ層更新。トリガ等は後続タスクで検討。
- 変更容易性のため enum は `enums.ts` に集約。
- 移行順序: 参照 (lookup) -> コア (root_accounts) -> 付随 (providers / ledger / logs / relation) -> インデックス最適化 -> シード / 初期データ -> 将来拡張。

---

## タスク一覧

### DB-TASK-001 languages テーブル初期シード
**説明**: 既存 `languages` テーブルへ主要言語コード (en, ja, etc.) をシードする migration / seed スクリプト整備。
**関連設計書**: `vns-masakinihirota-design/0020-設計/0010-設計書.md` (国際化/言語方針セクション予定)
**前提条件**: なし
**成果物**: `supabase_drizzle/seeds/001_languages.ts` / migration / ドキュメント更新
**テスト要件**: シード後 SELECT で件数 & 主キー重複なし確認。

### DB-TASK-002 enums 定義ファイル追加
**説明**: 認証プロバイダ / ポイント理由 / 認証イベント種別 / 言語熟練度 enum を `enums.ts` に作成。
**前提条件**: DB-TASK-001
**成果物**: `supabase_drizzle/schema/enums.ts`
**テスト要件**: Drizzle 型出力で enum literal が推論されること。

### DB-TASK-003 account_providers テーブル作成
**説明**: Supabase OAuth(google, github) や anonymous 初期認証の外部 ID 連携管理テーブル。
**前提条件**: DB-TASK-002
**成果物**: `account_providers` schema + migration
**テスト要件**: (rootAccountId, provider) UNIQUE / providerUserId UNIQUE 動作確認。

### DB-TASK-004 points_transactions (ポイント台帳) テーブル
**説明**: `root_accounts.totalPoints` 更新根拠となる不可逆台帳。delta / reason / description を保持。
**前提条件**: DB-TASK-002
**成果物**: `points_transactions` schema + migration
**テスト要件**: delta 正負混在挿入 / 合計が root_accounts 更新ロジックと一致。

### DB-TASK-005 auth_events (認証イベントログ) テーブル
**説明**: サインイン/サインアウト/匿名アップグレード/失敗 などの監査・分析用ログ。
**前提条件**: DB-TASK-002
**成果物**: `auth_events` schema + migration
**テスト要件**: イベント種別 enum 制約 / rootAccountId NULL 許容(失敗時) 挿入確認。

### DB-TASK-006 user_languages (追加言語) テーブル
**説明**: 母語/サイト言語以外の利用者言語と熟練度を管理する中間テーブル。
**前提条件**: DB-TASK-002
**成果物**: `user_languages` schema + migration
**テスト要件**: (rootAccountId, languageId) 主キー / proficiency enum 制約。

### DB-TASK-007 インデックス / パフォーマンス調整 (初期)
**説明**: 頻出クエリ (プロバイダ検索 / ポイント集計 / 最近ログイン) を想定したインデックス追加。
**前提条件**: DB-TASK-003 ~ DB-TASK-006
**成果物**: 追加 migration (index) / 設計書インデックス記述更新
**テスト要件**: EXPLAIN で seq scan 回避 (ローカル検証メモ)。

### DB-TASK-008 シードスクリプト統合 & pnpm script 追加
**説明**: シード実行用 `pnpm db:seed` を追加。 idempotent 実行保証。
**前提条件**: DB-TASK-001, 003-006
**成果物**: `scripts/seed.ts` / `package.json` script / README 追記
**テスト要件**: 2 回連続実行で差分挿入なし。

### DB-TASK-009 ER 図 (Mermaid) 文書化
**説明**: 現在スキーマを `docs/db/er-diagram.md` へ可視化。CI (将来) 自動検証余地をメモ。
**前提条件**: DB-TASK-003 ~ DB-TASK-006
**成果物**: Mermaid ER 図 / 設計書リンク
**テスト要件**: Mermaid 記法エラーなし (プレビュー確認)。

### DB-TASK-010 totalPoints 整合性検証ジョブ (将来)
**説明**: `points_transactions` 台帳合計と `root_accounts.totalPoints` の差分検出スクリプト (定期整合性チェック)。MVP 後回し。
**前提条件**: DB-TASK-004
**成果物**: `scripts/verify-points.ts` (後日) / CRON 設計メモ
**テスト要件**: 意図的差分挿入で検出ログ出力。

---

## 受入基準 (抜粋)
- すべての migration がクリーン適用可能 (空 DB -> 最新)。
- Drizzle 型エクスポートで enum/列型が IDE 上補完。
- ER 図と schema ファイル内容が一致 (フィールド/リレーション差異なし)。
- シードは再実行安全。

## 今後の拡張候補 (未タスク化メモ)
- ポイント自動付与トリガ (login streak 等)
- soft delete / 監査 (temporal table) 導入
- 行レベルセキュリティ (RLS) ポリシー詳細化
- partitioning (大量ログ向け) 検討
