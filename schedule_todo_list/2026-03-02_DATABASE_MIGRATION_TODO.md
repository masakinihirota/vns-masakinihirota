# 2026-03-02 データベース・マイグレーションと型生成 TODO

> 方針: RBAC実装で DB スキーマの基礎が整ったため、型安全性をデータベース層まで拡張し、バグを未然に防ぐ
> 対象: Drizzle ORM 統合深化 / マイグレーション管理 / 型生成 / データベースリレーション検証 / スキーマドキュメント化

---

## 🎯 ゴール

1. Drizzle ORM の型推論を最大限に活用（`SELECT` の結果型が自動推論）
2. すべてのマイグレーション を バージョン管理・ロールバック可能に
3. 本番・開発環境で DB スキーマの整合性を保証
4. データベース関係図・制約を自動生成・ドキュメント化

---

## ✅ Priority 1: Drizzle ORM 深化（5-6時間）

### 1. スキーマ完全化（既存 schema.postgres.ts の拡張）
- [x] 1.1 既存テーブル（users, root_accounts, userProfiles など）の定義を確認
- [ ] 1.2 不足しているテーブルを追加
  - [ ] `audit_logs` - RBAC アクセスログ（既存：audit-logger.ts）の永続化
  - [ ] `session_tokens` - セッション情報（Better Auth との統合）
  - [ ] `two_factor_secrets` - 2FA シークレット（Better Auth 2FA プラグイン対応）
  - [ ] `rate_limit_keys` - レート制限ヒストリ（本番環境の分析用）
  - [ ] `feature_flags` - 機能フラグ（段階的リリース対応）
- [ ] 1.3 テーブル関係の整理
  - [ ] `root_accounts.active_profile_id` FK チェック制約の追加
  - [ ] `user_profiles.root_account_id` ユニーク制約
  - [ ] Cascading delete ポリシーの明示化
- [ ] 1.4 インデックス最適化
  - [ ] よくクエリされる列にインデックスを設定（`userId`, `groupId`, `nationId` など）
  - [ ] **Index Shotgun** アンチパターンを避ける（不要なインデックスを削除）
  - [ ] 複合インデックス（`(userId, createdAt)` 等）の設計

**完了条件**
- [x] `pnpm db:check-schema` で全テーブル・リレーション確認
- [ ] 型推論テスト：Drizzle クエリの戻り値型が正しく推論される
- [ ] インデックス数 < テーブル数 × 1.5（過剰インデックスを避ける）

### 2. 型安全性の強化
- [ ] 2.1 `/src/lib/db/types.ts` で select 結果型を定義
  - ✅ **例**
    ```typescript
    import { db } from './client';
    import { users, userProfiles } from './schema.postgres';

    // Type inference: 自動生成される型
    export type SelectUser = typeof db.select().from(users).$inferSelect;
    export type SelectUserProfile = typeof db.select().from(userProfiles).$inferSelect;
    ```
- [ ] 2.2 ヘルパー関数に適切な戻り値型を指定
  - [ ] `rbac-helper.ts` のすべての関数に戻り値型を追加
  - [ ] `getUserProfileId()` → `Promise<string | null>` の明示
  - [ ] `checkGroupRole()` → `Promise<boolean>` の明示

**完了条件**
- [ ] TypeScript strict モードで `any` 使用がゼロ
- [ ] `pnpm validate:types` コマンドで全型チェック通過

### 3. Drizzle Studio での検査
- [ ] 3.1 Drizzle Studio 起動
  ```bash
  pnpm drizzle-kit studio
  ```
- [ ] 3.2 Visual interface で全テーブル・リレーションを確認
- [ ] 3.3 データスナップショットを取得（開発環境の参考データ）

**完了条件**
- [ ] Studio で全テーブル・フィールド・リレーション確認可能

---

## 🟠 Priority 2: マイグレーション管理（4-5時間）

### 4. 既存マイグレーション整理
- [x] 4.1 `drizzle/` ディレクトリ内の全マイグレーション確認
  - [x] `0000_tough_titania.sql` (初期スキーマ)
  - [x] `0001_*, 0002_*, ...` 既存
  - [x] `0005_superb_george_stacy.sql` （RBAC強化用、生成済み）
- [ ] 4.2 `drizzle/meta/_journal.json` の整合性確認
  - ✅ **検証**
    - すべてのマイグレーションファイルが journal に登録
    - file 名と SQL ファイルが一致
    - version 作成日時が昇順
- [ ] 4.3 ロールバック手順の文書化
  - [ ] 各マイグレーションの down SQL を作成（可能な範囲）
  - [ ] 本番環境でのロールバック計画書作成

**完了条件**
- [ ] `pnpm drizzle-kit migrate` 実行でエラーなし
- [ ] マイグレーション journal が正確

### 5. バージョン主義的マイグレーション戦略
- [ ] 5.1 セマンティックバージョニング適用
  - [ ] MAJOR: 破壊的変更（列削除、テーブル削除など）
  - [ ] MINOR: 追加的変更（列追加、テーブル追加）
  - [ ] PATCH: 修正（制約追加、インデックス修正）
- [ ] 5.2 マイグレーション命名規則の統一
  - [ ] ファイル名: `NNNN_semantic_name.sql`
  - [ ] 例: `0010_add_audit_logs_table.sql`, `0011_add_index_user_email.sql`
- [ ] 5.3 マイグレーション実行ログの記録
  - [ ] ファイル: `drizzle/migration-history.log`
  - [ ] 記録: 日時・バージョン・実行環境・実行者・ステータス

**完了条件**
- [ ] マイグレーション ファイル・ロジック・ドキュメント が 3つ揃っている

### 6. 開発・本番環境でのマイグレーション実行
- [ ] 6.1 ローカル開発環境でのマイグレーション
  ```bash
  pnpm drizzle-kit migrate --config drizzle.config.ts
  ```
- [ ] 6.2 本番環境での手順書作成
  - [ ] 実行前: バックアップ取得
  - [ ] 実行: `drizzle-kit migrate` with `--custom-data-migration` flag
  - [ ] 検証: `pnpm db:verify` で結果確認
  - [ ] ロールバック: 失敗時の手順
- [ ] 6.3 Blue-Green デプロイ対応（Vercel Postgres の場合）

**完了条件**
- [ ] 本番マイグレーション手順書が承認された
- [ ] 0005 マイグレーション（RBAC用）を本番反映（またはスケジュール設定）

---

## 🟡 Priority 3: スキーマドキュメント化（2-3時間）

### 7. ER図・Data Dictionary の自動生成
- [ ] 7.1 `/docs/database/` ディレクトリ作成
- [ ] 7.2 ER図 PlantUML 形式で生成
  ```bash
  # 推奨オプション
  pnpm drizzle-kit generate:diagram
  ```
- [ ] 7.3 Data Dictionary (列・型・制約の全リスト)
  - [ ] ファイル: `docs/database/data-dictionary.md`
  - [ ] フォーマット: Markdown テーブル
  - [ ] 内容：
    - テーブル名・説明
    - 列名・型・NULL許可・デフォルト値
    - インデックス
    - FK/生成列
    - アクセス権限（RLS policy）

**完了条件**
- [ ] ER図が `README.md` に組み込まれている
- [ ] Data Dictionary で全スキーマが理解可能

### 8. テーブル・列・制約 の説明コメント
- [ ] 8.1 `schema.postgres.ts` 内の Drizzle テーブル定義にコメント追加
  ```typescript
  export const users = pgTable('users', {
    id: text('id').primaryKey(),
    // Better Auth による認証ユーザーID（一意・不変）
    email: text('email').unique().notNull(),
    // ユーザーメール（大文字小文字区別なし）
    ...
  });
  ```
- [ ] 8.2 複雑な制約・計算列の説明を追加

**完了条件**
- [ ] 新規開発者が `schema.postgres.ts` だけで全構造を理解可能

---

## 🔵 Priority 4: リレーション検証・自動テスト（3-4時間）

### 9. リレーション整合性テスト
- [ ] 9.1 `/src/lib/db/__tests__/schema.test.ts` で自動テスト
  - [ ] テスト内容：
    - 外部キー制約の存在確認
    - テーブル間の関係が正しい
    - ユニーク制約が適切に設定
    - インデックスが効果的（N+1 回避確認）
- [ ] 9.2 データ整合性テスト
  ```typescript
  it('should enforce FK: user_profiles.root_account_id', async () => {
    const result = await db.query.userProfiles.findFirst();
    const rootAccount = await db.query.rootAccounts.findFirst({
      where: eq(rootAccounts.id, result.rootAccountId)
    });
    expect(rootAccount).toBeDefined();
  });
  ```

**完了条件**
- [ ] スキーマリレーション テスト 100% 通過

### 10. N+1 クエリ検出
- [ ] 10.1 ロギング設定（Drizzle query logging）
  ```typescript
  // drizzle.config.ts
  export default defineConfig({
    dbCredentials: { ... },
    logger: true,  // クエリ実行ログ出力
  });
  ```
- [ ] 10.2 パフォーマンステスト
  - [ ] ループ内の重複クエリを検出
  - [ ] `in()` フィルタ使用で複数オブジェクト一括取得可能か確認

**完了条件**
- [ ] ローカル開発時に全クエリが可視化
- [ ] 意図しない N+1 パターンが自動警告される

---

## 📋 テスト要件

すべてのフェーズで以下を実装：

- [ ] スキーマ検証テスト（型推論・リレーション）
- [ ] マイグレーション テスト（up/down 双方向）
- [ ] レプリケーション テスト（開発DB → ローカルDB で動作確認）
- [ ] パフォーマンス テスト（インデックス効果測定）

---

## ✅ 完了判定ルール

- **各マイグレーション** が ファイル・ロジック・ドキュメント 3点セット で用意される
- **すべてのクエリ** が型推論で `any` を含まない
- **本番マイグレーション手順** が承認・テスト済み

---

## 📊 進捗

- 完了: 0 / 40
- ステータス: 🔄 未開始
- 推定工数: 14-16時間

---

## 関連ドキュメント

- Drizzle ORM 公式: https://orm.drizzle.team/
- マイグレーション計画: `docs/database/migration-roadmap.md`
- スキーマ定義: [src/lib/db/schema.postgres.ts](../src/lib/db/schema.postgres.ts)
