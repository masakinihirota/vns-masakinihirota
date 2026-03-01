# 敵対的レビュー（Adversarial Review）最終レポート

**対象**: `vns-masakinihirota` プロジェクト
**実施日**: 2026-03-01
**モード**: Strict（最悪のケースを想定した厳格レビュー）

---

## エグゼクティブサマリー

4つの監査領域（セキュリティ、DB設計/パフォーマンス、UIアーキテクチャ、テスト品質）にわたる包括的レビューの結果、**計46件の発見事項**が確認されました。

| 重大度 | 件数 | 即時対応が必要 |
|--------|------|---------------|
| 🔴 Critical | **7** | はい |
| 🟠 High | **12** | できるだけ早く |
| 🟡 Medium | **19** | リリース前に |
| 🟢 Low | **8** | 改善推奨 |

---

## 🔴 Critical（即時対応必須）

### C-1. 環境変数の不一致：認証バイパスリスク

| 項目 | 詳細 |
|------|------|
| ファイル | `src/lib/auth/helper.ts` L76, `src/proxy.ts` |
| カテゴリ | セキュリティ |

`helper.ts` は `NEXT_PUBLIC_USE_REAL_AUTH` を参照し、`proxy.ts` は `USE_REAL_AUTH` を参照。
片方だけ設定された場合、proxy は認証済みと判断するが、helper はダミーユーザーを返す、または逆のケースが発生し、**認証状態の不整合**が起きます。

**修正方針**: 環境変数名を統一し、`NEXT_PUBLIC_` プレフィックスはクライアントサイドでの使用が不要であれば `USE_REAL_AUTH` に統一。

---

### C-2. Better Auth バイパス：直接DBセッション検索

| 項目 | 詳細 |
|------|------|
| ファイル | `src/lib/auth/helper.ts` L89-L112 |
| カテゴリ | セキュリティ |

`getSession()` 内で Better Auth の `auth.api.getSession()` が失敗した場合、フォールバックとして**直接DBからセッションを検索**。
Better Auth のトークン検証・ローテーション・失効チェックが**完全にバイパス**されます。
期限切れセッションや無効化済みセッションが有効として扱われるリスクがあります。

**修正方針**: 直接DBフォールバックを削除し、Better Auth API のみでセッション検証を行う。

---

### C-3. RLS ポリシーが全て `USING(TRUE)` — 実効性なし

| 項目 | 詳細 |
|------|------|
| ファイル | `drizzle/0002_enable_rls_policies.sql` L24-L61 |
| カテゴリ | セキュリティ / DB設計 |

Auth系テーブル（`user`, `session`, `account`, `verification`）の RLS ポリシーが全て `USING (TRUE)` で定義。
`account` テーブルには OAuth トークン（`access_token`, `refresh_token`, `id_token`）が含まれており、**全ユーザーから全トークンにアクセス可能**な状態。

- `rls-policies.sql` に適切な `auth.uid()` ベースのポリシーが定義されているが**全てコメントアウト**
- INSERT/UPDATE/DELETE のポリシーが**一切未定義**
- `app.auth_user_id` を `SET` するコードが `client.ts` に存在しない

**修正方針**: A) 適切な RLS ポリシーを有効化、B) RLS を無効化しアプリ層で制御、のいずれかを選択。中途半端な現状が最も危険。

---

### C-4. `nationCitizens` の `role` CHECK制約と実コードの不一致

| 項目 | 詳細 |
|------|------|
| ファイル | `src/lib/db/schema.postgres.ts` L804-L807, `src/lib/api/services/nations.ts` L275 |
| カテゴリ | バグ / データ整合性 |

`nationCitizens.role` の CHECK 制約は `ARRAY['official', 'citizen']` のみを許可。
しかし `createNation()` では `role: 'governor'` を INSERT しており、**CHECK制約違反でINSERTが100%失敗**します。

**修正方針**: CHECK 制約に `'governor'` を追加するマイグレーションを作成。

---

### C-5. `groups.ts` の二重JOIN — memberCount が不正

| 項目 | 詳細 |
|------|------|
| ファイル | `src/lib/api/services/groups.ts` L155-L165 |
| カテゴリ | バグ |

`listGroups()` で `groupMembers` テーブルへの `leftJoin` が無条件で1回実行された後、`userId` 指定時にもう1回実行。
結果セットがクロス結合になり、**memberCount が実際の値の二乗になる**可能性があります。

**修正方針**: `userId` 指定時の2回目の JOIN を削除し、WHERE 条件で絞り込む。

---

### C-6. `business-cards.ts` の upsert で `userProfileId` 欠落

| 項目 | 詳細 |
|------|------|
| ファイル | `src/lib/db/business-cards.ts` L97-L113 |
| カテゴリ | バグ |

`upsertBusinessCard()` の `insert().values()` に `userProfileId` が含まれていません。
新規作成時に NOT NULL 制約違反またはFK違反が発生し、**名刺の新規作成が常に失敗**します。

**修正方針**: `values` オブジェクトに `userProfileId` を追加。

---

### C-7. admin-queries.ts のトランザクション欠如（4箇所）

| 項目 | 詳細 |
|------|------|
| ファイル | `src/lib/db/admin-queries.ts` L229, L315, L478, L510 |
| カテゴリ | データ整合性 |

`issuePenalty`, `reviewApproval`, `updateUserRole`, `updateUserStatus` の各操作で、**データ変更 + 監査ログ記入がトランザクションなし**で実行。
途中でエラーが発生した場合、データと監査ログの不整合が発生します。

**修正方針**: `db.transaction()` でラップ。

---

## 🟠 High（早期対応推奨）

### H-1. CSRF 保護が admin ルートのみ

| ファイル | `src/lib/api/middleware/csrf.ts`, `src/lib/api/routes/admin.ts` |
|----------|------|

CSRF ミドルウェアは作成済みだが、admin ルートにのみ適用。
その他の Hono API ルート（`/api/auth/[...all]` 以外）は**CSRF 無保護**。

---

### H-2. `TRUSTED_ORIGINS` がスタートアップ時に未検証

| ファイル | `src/lib/api/middleware/csrf.ts` |
|----------|------|

環境変数 `TRUSTED_ORIGINS` が未設定の場合、空配列で初期化されるため、全リクエストの Origin チェックが事実上パスする可能性。

---

### H-3. レートリミット IP フォールバックが `'unknown'` 共有

| ファイル | `src/lib/api/middleware/rate-limit.ts` |
|----------|------|

IP アドレスが取得できない場合 `'unknown'` をキーに使用。
**全プロキシ経由リクエストが同一キーを共有**し、正当なユーザーが他ユーザーのレートリミットでブロックされます。

---

### H-4. timestamp vs timestamptz の混在

| ファイル | `src/lib/db/schema.postgres.ts` L29-L80 vs L99以降 |
|----------|------|

Auth系テーブルは `timestamp`（タイムゾーンなし）、カスタムテーブルは `timestamp({ withTimezone: true })`。
`session.expires_at` の比較でタイムゾーンずれが発生する可能性（UTC以外のサーバーで問題化）。

---

### H-5. インデックス不足（FKの参照元10箇所以上）

| ファイル | `src/lib/db/schema.postgres.ts` 多数 |
|----------|------|

PostgreSQL は FK 参照元に**自動インデックスを作成しません**。
`groups.leader_id`, `nations.owner_user_id`, `nationPosts.nation_id`, `marketTransactions.item_id/buyer_id/seller_id` 等にインデックスがなく、CASCADE DELETE やJOIN時にフルテーブルスキャンが発生。

---

### H-6. FK制約に ON DELETE 未指定（デフォルト RESTRICT）

| ファイル | `src/lib/db/schema.postgres.ts` L341, L361, L365, L468, L535 |
|----------|------|

`groups.leader_id`, `nations.owner_user_id`, `nations.owner_group_id`, `marketTransactions.*`, `nationEvents.organizer_id` が全て RESTRICT。
ユーザープロフィール削除時に関連グループ/ネーションの削除が**ブロック**される。

---

### H-7. FK制約自体が欠如（2箇所）

| ファイル | `src/lib/db/schema.postgres.ts` L138, L1313 |
|----------|------|

- `rootAccounts.activeProfileId` → `userProfiles.id` への FK が**未定義**
- `approvals.workId` → `works.id` への FK が**未定義**
孤立レコードが発生する可能性。

---

### H-8. Admin API テストが全て `it.skip`

| ファイル | `src/__tests__/api/admin.test.ts` |
|----------|------|

10件のテストケースが**全て `it.skip`** でスキップされています。
**Admin CRUD API のテストカバレッジが0%**。最もクリティカルな管理者機能がテスト不在。

---

### H-9. helper.test.ts のテストが TODO（空アサーション）

| ファイル | `src/lib/__tests__/helper.test.ts` L20-L36 |
|----------|------|

`getSession()` の3つの主要テストケースが `expect(true).toBe(true)` のプレースホルダー。
**認証ヘルパーのコア機能がテストされていません。**

---

### H-10. ルートレベル `error.tsx` が存在しない

| ファイル | `src/app/error.tsx` (欠落) |
|----------|------|

`(protected)` グループには `error.tsx` があるが、ルートレイアウト直下のグローバルなエラーバウンダリが不在。
予期しないエラー発生時にユーザーに何も表示されません。

---

### H-11. `loading.tsx` がプロジェクト全体で0個

| ファイル | `src/app/**/loading.tsx` (全て欠落) |
|----------|------|

非同期 Server Component（admin, home 等）のデータフェッチ中に Suspense フォールバックが表示されず、UX が損なわれます。

---

### H-12. `create-group.ts` で Zod バリデーション未使用

| ファイル | `src/app/actions/create-group.ts` L76-L99 |
|----------|------|

`create-nation.ts` は `createNationSchema.safeParse()` を使用しているが、`create-group.ts` は手動チェック。
`schemas.ts` に `createGroupSchema` が定義済みにもかかわらず未使用。型安全性とバリデーション一貫性が損なわれています。

---

## 🟡 Medium（リリース前に対応）

### M-1. スタックトレース漏洩（admin.ts 残り~7箇所）

前回一部修正済みだが、[admin.ts](src/lib/api/routes/admin.ts) の残りの `catch` ブロックで `error.stack` が無条件にログ出力されています。

### M-2. Server Action のエラーオブジェクトログ

`create-group.ts`, `create-nation.ts` の `catch` でエラーオブジェクト全体がログ出力。本番環境ではスタックトレースが含まれます。

### M-3. `users.ts` ルートで `c: any`

`src/lib/api/routes/users.ts` で Hono コンテキストに `any` 型を使用。型安全性が失われています。

### M-4. `auth-session.ts` で `as any` のロールチェック

ミドルウェアの `session.user.role as any` でRBACチェック。型が一致しない場合のサイレント失敗リスク。

### M-5. Drizzle ORM 型回避の `as any`（events.ts, business-cards.ts）

`insert().values()` に渡すオブジェクトを `as any` でキャスト。カラム名の不一致やデータ型の不整合がコンパイル時に検出されません。

### M-6. `@ts-expect-error` 使用（events.ts）

`events.ts` L64 で Drizzle where 句の型問題を `@ts-expect-error` で抑制。正しい型アサーションに置き換えるべき。

### M-7. 本番コードに `console.log` 残留（3箇所）

- `diagnose-db.ts` (6箇所)
- `anonymous-login-form.logic.ts` L54 (リダイレクト先URL — 情報漏洩リスク)
- `rate-limiter.ts` L126

### M-8. `(public)` / `(static)` ルートグループに `error.tsx` 未配置

ログインページや FAQ ページでエラーが発生した場合のフォールバック UI が不在。

### M-9. `not-found.tsx` の全体 Client Component 化

`window.history.back()` のために全ページが `"use client"` 。ボタン部分のみ Client Component に分離すべき。

### M-10. KPIダッシュボード：6連続DBクエリ

`admin-queries.ts` の `getDashboardKPI` で6回の逐次DBクエリ。`Promise.all` または単一SQLへの統合が必要。

### M-11. オーバーフェッチ（SELECT *）（5箇所）

`users.ts`, `admin-queries.ts` で全カラム取得。`userProfiles` テーブルは `jsonb` カラムを含むため帯域の無駄。

### M-12. `schema.postgres.ts` が1391行の巨大ファイル

コーディング規約の1000行閾値を超過。ドメイン別にファイル分割すべき。

### M-13. アクセシビリティ：検索 `<input>` に `<label>` 未関連付け

`group-panel.tsx` L91-L97。スクリーンリーダーのユーザーにフィールドの目的が伝わりません。

### M-14. アクセシビリティ：アイコンボタンに `aria-label` なし

`group-panel.tsx` L126-L141 の詳細ボタン・削除ボタン。

### M-15. コロケーション不足：テストのないコンポーネント多数

`error-boundary.tsx`, `toast-container.tsx`, `group-panel.tsx`, `auth-form-card/`, `logout-button/` 等にテストなし。

### M-16. 統合テストがDB依存で単体実行不可

`*.integration.test.ts`（7ファイル）が全て `DATABASE_URL` 必須。CI/CD パイプラインで DB を用意しない限り実行不可。

### M-17. `suspendPendingResult` が `activeUsers` と同一クエリ

`admin-queries.ts` L436-L441。WHERE条件が `isActive = true` のみで `activeUsers` と同じ。コメントに「JOINが必要」とあるが未実装。

### M-18. Relations定義の不整合

`userProfilesRelations` に `penalties`, `approvals`, `auditLogs` の `many()` が未定義。`db.query.userProfiles.findFirst({ with: { penalties: true } })` がエラーになります。

### M-19. カバレッジ閾値が未設定

`vitest.config.ts` に `coverage` セクションがあるが、**閾値（`thresholds`）が未設定**。カバレッジが下がっても CI で検出されません。

---

## 🟢 Low（改善推奨）

### L-1. `dangerouslySetInnerHTML` 使用（layout.tsx）

FOUC防止スクリプト用。内容は固定値で低リスクだが、コメントでの意図明記を推奨。

### L-2. レートリミットの `any` 型（rate-limit.ts）

内部実装の型定義が不完全。

### L-3. メモリベースのレートリミット

`Map` ベース。マルチインスタンスデプロイ時にインスタンス間で共有されません。

### L-4. 開発用認証の ADMIN ロールが不一致

Dev auth では `role: 'admin'` だが、RBAC は `'platform_admin'` を期待。ダミー認証時に管理者機能にアクセスできない可能性。

### L-5. UI バレルエクスポートのバンドルサイズ影響

`src/components/ui/index.ts` で30以上のコンポーネントを一括エクスポート。tree-shaking に依存。

### L-6. 空の `providers.tsx`

子要素をそのまま返すだけのラッパー。不要であれば削除。

### L-7. 開発用 `api-test-client.tsx` の残留

本番デプロイには不要。使用箇所がなければ削除を検討。

### L-8. `LogoutButton` の重複

`home/logout-button.tsx` と `components/auth/logout-button/` に別実装。リダイレクト先を props で受け取る統合設計が推奨。

---

## テスト品質サマリー

### テストファイル一覧（vns-masakinihirota メインブランチ）

| ファイル | テスト対象 | 状態 | 品質 |
|----------|-----------|------|------|
| `src/__tests__/proxy.test.ts` | proxy.ts | ✅ 有効 | B |
| `src/__tests__/api/admin.test.ts` | Admin CRUD API | ⚠️ **全10件 skip** | D |
| `src/__tests__/api/error-handler.test.ts` | error-handler middleware | ✅ 有効 | A |
| `src/__tests__/rbac-authorization.test.ts` | RBAC helper | ✅ 有効 | A |
| `src/__tests__/integration/auth-flow.integration.test.ts` | 認証フロー | ⚠️ DB依存 | C |
| `src/lib/__tests__/helper.test.ts` | auth/helper.ts | ⚠️ **3件 TODO** | D |
| `src/lib/auth/__tests__/ghost-mode.test.ts` | ゴーストモード | ✅ 有効 | B |
| `src/lib/auth/__tests__/rbac-hierarchy.test.ts` | RBAC 階層 | ✅ 有効 | A |
| `src/lib/auth/__tests__/rbac-helper.test.ts` | RBAC ヘルパー | ✅ 有効 | A |
| `src/lib/auth/__tests__/rbac-deny-by-default.test.ts` | RBAC deny-by-default | ✅ 有効 | A |
| `src/lib/auth/__tests__/rate-limiter.test.ts` | レートリミッター | ✅ 有効 | B |
| `src/lib/auth/root-account-guard.test.ts` | ルートアカウントガード | ✅ 有効 | B |
| `src/lib/trial-storage.test.ts` | トライアルストレージ | ✅ 有効 | B |
| `src/lib/auth-guard.test.tsx` | 認証ガード | ✅ 有効 | B |
| `src/lib/db/business-cards.test.ts` | ビジネスカードDB | ✅ 有効 | B |
| `src/lib/db/admin-queries.test.ts` | 管理者クエリ | ⚠️ DB依存 | C |
| `src/lib/db/__tests__/group-queries.test.ts` | グループクエリ | ✅ 有効 | B |
| `src/lib/db/__tests__/nation-queries.test.ts` | ネーションクエリ | ✅ 有効 | B |
| `src/lib/db/*.integration.test.ts` (7ファイル) | DB統合テスト | ⚠️ DB依存 | C |
| `src/app/actions/__tests__/server-actions.test.ts` | Server Actions | ✅ 有効 | B |
| `src/app/(protected)/admin/page.test.tsx` | Admin ページ | ✅ 有効 | B |
| `src/components/auth/*/logic.test.ts` (3ファイル) | ログインフォーム | ✅ 有効 | A |

### テストカバレッジギャップ（重大な欠落）

| カバレッジなしのファイル | 重要度 |
|--------------------------|--------|
| `src/lib/auth.ts` (Better Auth 設定) | 🟠 高 |
| `src/lib/api/routes/admin.ts` (902行) | 🔴 Critical |
| `src/lib/api/services/users.ts` | 🟠 高 |
| `src/lib/api/services/groups.ts` | 🟠 高 |
| `src/lib/api/services/nations.ts` | 🟠 高 |
| `src/lib/api/middleware/auth-session.ts` | 🟠 高 |
| `src/lib/api/middleware/csrf.ts` | 🟡 中 |
| `src/lib/api/middleware/rate-limit.ts` | 🟡 中 |
| `src/lib/db/events.ts` | 🟡 中 |

---

## Next.js 16 準拠状況

| チェック項目 | 状況 |
|---|---|
| `src/proxy.ts` 使用（`middleware.ts` ではない） | ✅ 準拠 |
| `export async function proxy()` 関数名 | ✅ 準拠 |
| `await params` / `await searchParams` | ✅ 準拠 |
| `await headers()` | ✅ 準拠 |
| `middleware.ts` 不在 | ✅ 準拠 |

---

## 良好な点（評価できる設計）

1. **SC/CC 分離が適切**: データフェッチは Server Component で行い、インタラクティブ部分のみ Client Component に分離
2. **auth コンポーネントのコロケーション**: `.logic.ts` / `.logic.test.ts` / `.tsx` / `index.ts` パターンを一貫して使用
3. **RBAC の deny-by-default 設計**: テストも充実しており、設計思想が明確
4. **Next.js 16 準拠**: `proxy.ts`, async APIs が正しく使用されている
5. **Zod バリデーション**: admin ルートのバリデーションスキーマが体系的に定義されている
6. **Server Actions のセキュリティ**: セッション検証、RBAC チェック、エラーハンドリングの基本構造がある

---

## 優先修正ロードマップ

### Phase 1: 即時修正（1-2日）

1. **C-4**: `nationCitizens` の CHECK 制約に `'governor'` を追加するマイグレーション作成
2. **C-5**: `groups.ts` の二重JOIN を修正
3. **C-6**: `business-cards.ts` の upsert に `userProfileId` を追加
4. **C-1**: 環境変数名を統一（`USE_REAL_AUTH`）

### Phase 2: セキュリティ強化（3-5日）

5. **C-2**: Better Auth バイパス（直接DBフォールバック）を削除
6. **C-7**: admin-queries.ts に `db.transaction()` を追加（4箇所）
7. **H-1/H-2**: CSRF を全APIルートに適用 + TRUSTED_ORIGINS 検証
8. **H-3**: レートリミットのIPフォールバック改善

### Phase 3: DB設計改善（1-2週間）

9. **C-3**: RLS 方針を決定し実装（有効化 or 無効化）
10. **H-4**: timestamp → timestamptz 統一マイグレーション
11. **H-5**: FK参照元へのインデックスを追加するマイグレーション
12. **H-6/H-7**: FK制約の ON DELETE 設定 + 欠落FK追加

### Phase 4: テスト・UX改善（2-3週間）

13. **H-8/H-9**: admin.test.ts の skip 解除 + helper.test.ts の TODO 実装
14. **H-10/H-11**: `error.tsx`, `loading.tsx` の追加
15. **H-12**: `create-group.ts` に Zod バリデーション適用
16. **M-10/M-11**: クエリ最適化（Promise.all, SELECT カラム指定）
17. **M-19**: Vitest カバレッジ閾値を設定

---

*レポート終了*
