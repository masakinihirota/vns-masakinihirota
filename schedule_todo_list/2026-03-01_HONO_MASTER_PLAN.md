# Hono 導入 - 統合マスタープラン

**作成日:** 2026-03-01
**最終更新:** 2026-03-01（Option A 全面修正適用）
**ステータス:** ⚠️ **設計 80% 完了、フェーズ 0（事前検証、3.5～4.5h）が必須**

---

## 📊 現在の状況サマリー

### ✅ 完了した決定事項

| 項目 | 決定内容 | ドキュメント | ステータス |
|------|----------|------------|----------|
| **Runtime** | Node Runtime | `.agent/decisions/node-runtime.md` | ✅ 文書化済み、PoC で検証必須 |
| **Better Auth 共存** | Option A（並行運用） | `.agent/decisions/better-auth-pattern.md` | ✅ 文書化済み、PoC で検証必須 |
| **RPC Client** | Hono RPC Client | `.agent/decisions/rpc-client-pattern.md` | ✅ 文書化済み、PoC で検証必須 |
| **マイグレーション戦略** | Admin 優先の段階的アプローチ | 本ドキュメント | ✅ 決定済み |

### ⏳ 未完了タスク（フェーズ 0）

| タスク | 見積もり | 優先度 | ステータス |
|--------|---------|--------|----------|
| エラーレスポンス仕様決定 | 0.5h | 高 | ⏳ 未実施 |
| RPC Client PoC | 1h | 高 | ⏳ 未実施 |
| RBAC Middleware 互換性確認・実装 | 1.5～2h | 高 | ⏳ 未実施 |
| テスト戦略決定 | 0.5h | 中 | ⏳ 未実施 |

---

## 🗂️ ドキュメント構成

### マスタードキュメント（本ドキュメント）
- **本ファイル**: `2026-03-01_HONO_MASTER_PLAN.md`
  - 現在の状況
  - 決定事項
  - 実装フェーズ概要
  - 次のアクション

### 参考資料（詳細分析）
- **Better Auth 共存選択肢**: `reference/2026-03-01_BETTER_AUTH_HONO_OPTIONS.md`
  - Option A～D の詳細比較
  - 推奨度とメリット・デメリット
- **RPC Client 選択肢**: `reference/2026-03-01_RPC_CLIENT_OPTIONS.md`
  - Hono RPC、手動fetch、tRPC、OpenAPI の比較
  - PoC チェックリスト

### アーカイブ（過去の計画・レビュー）
- **元の実装計画**: `archive/2026-03-01_HONO_INTEGRATION_TODO.md`
- **修正版実装計画**: `archive/2026-03-01_HONO_IMPLEMENTATION_REVISED.md`
- **詳細レビュー**: `archive/2026-03-01_HONO_REVIEW_CRITIQUE.md`
- **レビュー要約**: `archive/2026-03-01_HONO_REVIEW_SUMMARY.md`

---

## 🎯 採用決定事項の詳細

### 1. Runtime: Node Runtime ✅

**決定内容:**
```typescript
// src/app/api/[[...route]]/route.ts
export const runtime = 'node';  // ← 必須
```

**理由:**
- ✅ Drizzle ORM + PostgreSQL の完全対応
- ✅ 既存の DB クエリ関数（30+ 個）がそのまま使用可能
- ✅ Server Actions との一貫性
- ❌ Edge Runtime は DB 接続に制限あり

**詳細:** `.agent/decisions/node-runtime.md`

---

### 2. Better Auth 共存: Option A（並行運用） ✅

**決定内容:**
```
/api/auth/*     → Better Auth（既存のまま維持）
/api/*          → Hono（新規、独立）
Server Actions  → 継続運用（または段階的に Hono へ移行）
```

**実装パターン:**
```typescript
// Better Auth（既存）
// src/app/api/auth/[...all]/route.ts
export const { POST, GET } = toNextJsHandler(auth);

// Hono（新規）
// src/app/api/[[...route]]/route.ts
const api = new Hono()
  .use('*', async (c, next) => {
    // Better Auth のセッション検証を再利用
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: 'Unauthorized' }, 401);
    c.set('userId', session.user.id);
    await next();
  })
  .route('/admin', adminRouter);
```

**メリット:**
- ✅ リスク最小（既存実装を変更しない）
- ✅ 実装が最も容易（1～2h）
- ✅ Better Auth の OAuth フローをそのまま活用
- ✅ Cookie 管理が統一される

**詳細:** `.agent/decisions/better-auth-pattern.md`

---

### 3. RPC Client: Hono RPC Client ✅

**決定内容:**
```typescript
// サーバー側
// src/app/api/[[...route]]/route.ts
const api = new Hono()
  .get('/users/:id', (c) => c.json({ id: c.req.param('id'), name: 'John' }));

export type AppType = typeof api;  // ← 型エクスポート

// クライアント側
// src/lib/api/client.ts
import { hc } from 'hono/client';
import type { AppType } from '@/app/api/[[...route]]/route';

export const client = hc<AppType>('/api');

// 使用例（完全な型推論）
const res = await client.users[':id'].$get({ param: { id: '123' } });
const data = await res.json();  // { id: string, name: string }
```

**メリット:**
- ✅ 完全な型安全性（サーバー定義から自動推論）
- ✅ ゼロ設定（追加の設定ファイル不要）
- ✅ IDE サポート完璧（VSCode で自動完成）
- ✅ 公式推奨パターン

**詳細:** `.agent/decisions/rpc-client-pattern.md`

---

## 📋 実装フェーズ概要

### フェーズ 0: 事前検証（計 3.5～4.5h） ⏳

| タスク | 見積もり | 必須度 | ステータス |
|--------|---------|--------|----------|
| **エラーレスポンス仕様決定** | 0.5h | ⭐⭐⭐ | ⏳ 未実施 |
| **RPC Client PoC** | 1h | ⭐⭐⭐ | ⏳ 未実施 |
| **RBAC Middleware 互換性確認・実装** | 1.5～2h | ⭐⭐⭐ | ⏳ 未実施 |
| テスト戦略決定 | 0.5h | ⭐⭐ | ⏳ 未実施 |

**RPC Client PoC の内容:**
1. サンプル endpoint 作成（health check）
2. クライアント生成テスト（型推論確認）
3. パラメータ型推論確認（param, query, body）
4. エラーハンドリング確認（404, 500）

詳細: `reference/2026-03-01_RPC_CLIENT_OPTIONS.md` の「Phase 0 PoC チェックリスト」

---

### フェーズ 1: Hono セットアップ（計 2.5～3h）

**実装内容:**
- Hono パッケージインストール（`pnpm add hono`）
- `src/app/api/[[...route]]/route.ts` 作成
- Middleware フレームワーク実装（auth, error-handler）
- Health endpoint 実装・テスト
- RPC Client セットアップ
- 既存テストの改修（`setup.ts`、`integration/auth.test.ts` 等）（+0.5～1h）

**成果物:**
```
src/lib/api/
├── middleware/
│   ├── auth.ts
│   └── error-handler.ts
├── routes/
│   └── health.ts
└── client.ts
```

---

### フェーズ 2: Admin API（計 4.5～5.5h）

**実装内容:**
- User Admin endpoints（GET, POST, DELETE, PATCH）
- Group / Nation Admin endpoints
- Integration test 実装
- 既存 Server Actions テストの移行・改修（+1～2h）

**エンドポイント一覧:**
```
GET    /api/admin/users          # ユーザー検索
GET    /api/admin/users/:id      # ユーザー詳細
DELETE /api/admin/users/:id      # ユーザー削除
PATCH  /api/admin/users/:id      # ロール・ステータス更新
GET    /api/admin/groups         # グループ一覧
DELETE /api/admin/groups/:id     # グループ削除
GET    /api/admin/nations        # ネーション一覧
DELETE /api/admin/nations/:id    # ネーション削除
```

---

### フェーズ 3: User/Group/Nation API（計 3～3.5h）

**実装内容:**
- ユーザー情報 API（GET /api/users、PATCH /api/users/:id）
- グループ API（GET /api/groups、GET /api/groups/:id、PATCH /api/groups/:id）
- ネーション API（GET /api/nations、GET /api/nations/:id、PATCH /api/nations/:id）
- 既存 Server Actions テストの移行・改修（+0.5h）

**実装ガイド:**
- 📘 `.agent/skills/hono-api-implementation/SKILL.md` を参照
- 参考実装: `src/lib/api/routes/admin.ts` (906行)

---

### フェーズ 4: 通知 API（計 1.5h）

**実装内容:**
- 通知エンドポイント（GET, PATCH, DELETE）
- 既読マーク機能
- 通知削除機能
- Integration test 実装（+0.5h）

**実装ガイド:**
- 📘 `.agent/skills/hono-api-implementation/SKILL.md` を参照
- DBスキーマ: `src/lib/db/schema.postgres.ts` (notifications)

---

### フェーズ 5: UI 統合（計 3～4h）

**実装内容:**
- Admin UI コンポーネント更新（RPC Client 使用）
- Server Actions の移行方針決定と実施
  - **Option A（推奨）**: Server Actions を残す（Better Auth との一貫性維持）
  - **Option B**: Hono API へ完全移行（追加 2～3h、リスク中）
- 全体統合テスト（+1～2h）

**実装ガイド:**
- 📘 `.agent/skills/hono-api-implementation/SKILL.md` の「RPC Client型エクスポート」セクション参照
- クライアント側: `src/lib/api/client.ts`

---

## ⏱️ スケジュール見積もり

| フェーズ | 内容 | 見積もり | 累計（最小） | 累計（最大） |
|---------|------|---------|------------|------------|
| **0** | 事前検証 | 3.5～4.5h | 3.5h | 4.5h |
| **1** | Hono セットアップ | 2.5～3h | 6h | 7.5h |
| **2** | Admin API | 4.5～5.5h | 10.5h | 13h |
| **3** | User/Group/Nation API | 3～3.5h | 13.5h | 16.5h |
| **4** | 通知 API | 1.5h | 15h | 18h |
| **5** | UI 統合 | 3～4h | 18h | 22h |
| **バッファ** | 予期せぬ問題対応 | 8% | +1.5h | +3h |

**合計: 19.5～25h**（既存テスト改修、バッファ含む）

**前提条件:**
- Phase 0 の RBAC Middleware 実装が成功すること
- RPC Client PoC で重大な問題が発見されないこと
- 既存テストの改修コストは最小限に抑えられること

**リスク要因:**
- RBAC Middleware の複雑性（426行のヘルパー関数の統合）
- Server Actions の移行判断（Option B を選択した場合 +2～3h）
- テスト改修の追加コスト（想定以上の工数が必要な場合）

---

## 🚀 次のアクション

### 1. フェーズ 0 の実施（3.5～4.5h）

**実施順序（重要）:**
1. エラーレスポンス仕様決定（0.5h）
2. RPC Client PoC（1h）
3. RBAC Middleware 互換性確認・実装（1.5～2h）
4. テスト戦略決定（0.5h）

**タスク 1: エラーレスポンス仕様決定（0.5h） - 最優先**

RPC Client PoC や RBAC Middleware 実装の前に、エラーレスポンス仕様を決定することで、実装時の判断を統一します。

```typescript
// 決定事項を .agent/decisions/error-response-spec.md に記録
interface ApiErrorResponse {
  success: false;
  error: {
    code: 'VALIDATION_ERROR' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'INTERNAL_ERROR';
    message: string;
    details?: Record<string, any>;
  };
}

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}
```

**タスク 2: RPC Client PoC（1h）**

```bash
# タスク 1: 基本的な型推論確認（20分）
1. src/lib/api/routes/poc.ts を作成
2. 簡単な GET/POST エンドポイント実装
3. AppType をエクスポート
4. クライアント側で hc<AppType> でインスタンス生成
5. VSCode で型推論・自動完成が動作することを確認

# タスク 2: パラメータ型推論確認（15分）
1. パラメータ（:id）を使用するエンドポイント実装
2. クエリパラメータを使用するエンドポイント実装
3. クライアント側で型推論が正しく動作することを確認

# タスク 3: エラーハンドリング確認（15分）
1. 意図的に 404、500 エラーを返すエンドポイント実装
2. クライアント側でエラーレスポンスの型推論確認
3. try-catch でのエラーハンドリング確認

# タスク 4: Next.js 統合確認（10分）
1. pnpm build でエラーが出ないか確認
2. pnpm dev で動作確認
3. ブラウザから /api/poc/health にアクセス確認
```

詳細: `reference/2026-03-01_RPC_CLIENT_OPTIONS.md`

---

### 2. 残りのフェーズ 0 タスク（1.5h）

**タスク 3: RBAC Middleware 互換性確認・実装（1.5～2h）**

既存の RBAC ヘルパー関数（426行、`src/lib/rbac.ts`）を Hono middleware で使用可能にします。

```typescript
// src/lib/api/middleware/rbac.ts
import { checkGroupRole, checkNationRole, checkSystemRole } from '@/lib/rbac';
import type { MiddlewareHandler } from 'hono';

// システムロールチェック
export const requireSystemRole = (role: string): MiddlewareHandler => {
  return async (c, next) => {
    const userId = c.get('userId');
    const hasRole = await checkSystemRole({ user: { id: userId } }, role);
    if (!hasRole) {
      return c.json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `System role '${role}' required`,
          details: { requiredRole: role }
        }
      }, 403);
    }
    await next();
  };
};

// グループロールチェック
export const requireGroupRole = (role: string): MiddlewareHandler => {
  return async (c, next) => {
    const userId = c.get('userId');
    const groupId = c.req.param('groupId');
    if (!groupId) {
      return c.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'groupId required' }
      }, 400);
    }
    const hasRole = await checkGroupRole({ user: { id: userId } }, groupId, role);
    if (!hasRole) {
      return c.json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Group role '${role}' required`,
          details: { requiredRole: role, groupId }
        }
      }, 403);
    }
    await next();
  };
};

// ネーションロールチェック（同様に実装）
```

**検証項目:**
1. `checkGroupRole()` などの既存関数が Hono の Context で動作するか
2. パフォーマンスが許容範囲か（< 50ms per request）
3. エラーハンドリングが統一フォーマットに従うか

**タスク 4: テスト戦略決定（0.5h）**

```typescript
// vitest での Hono handler テスト例
import { describe, it, expect } from 'vitest';
import { testClient } from 'hono/testing';
import { api } from '@/app/api/[[...route]]/route';

describe('Admin API', () => {
  it('GET /admin/users - 未認証で 401', async () => {
    const res = await testClient(api).admin.users.$get();
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error.code).toBe('UNAUTHORIZED');
  });

  it('GET /admin/users - Admin ロールで成功', async () => {
    // モックセッションを設定
    const res = await testClient(api, {
      headers: { 'x-test-user-id': 'admin-user-id' }
    }).admin.users.$get();
    expect(res.status).toBe(200);
  });
});
```

**決定事項を `.agent/decisions/test-strategy.md` に記録:**
- vitest + `hono/testing` を使用
- モックセッションの設定方法
- CI/CD での実行コマンド（`pnpm test`）

---

### 3. フェーズ 0 完了後の記録

以下の決定事項を `.agent/decisions/` に記録：
- ✅ `error-response-spec.md`（タスク 1 で作成）
- ✅ `rbac-middleware-strategy.md`（タスク 3 で作成）
- ✅ `test-strategy.md`（タスク 4 で作成）

**チェックリスト:**
```markdown
- [ ] エラーレスポンス仕様が決定され、文書化されている
- [ ] RPC Client PoC が成功し、型推論が動作している
- [ ] RBAC Middleware が実装され、テストが成功している
- [ ] テスト戦略が決定され、サンプルコードが動作している
- [ ] すべての決定事項が `.agent/decisions/` に記録されている
- [ ] `pnpm build` がエラーなしで成功している
```

---

## ✅ 成功の定義（Acceptance Criteria）

### 必須要件（すべて満たすこと）

フェーズ 5 終了時点で以下がすべてクリアされていること：

**1. ビルド・テスト**
- ✅ `pnpm build` がエラーなしで完了（< 60秒）
- ✅ `pnpm test` が全テスト成功（既存 + 新規）
- ✅ `pnpm dev` で localhost:3000 が正常起動

**2. 機能動作**
- ✅ 管理画面で User/Group/Nation の CRUD が可能
  - User 一覧表示、削除、ロール変更が動作
  - Group/Nation 一覧表示、削除が動作
- ✅ User 画面で自分のグループ・国が表示可能
- ✅ 通知一覧、既読マーク、削除が動作

**3. API 品質**
- ✅ API エラーレスポンスが統一フォーマット（`ApiErrorResponse` 準拠）
- ✅ RBAC チェックが機能（権限なしで 403 Forbidden、適切なエラーメッセージ）
- ✅ RPC client が型安全に動作（VSCode で型推論・自動補完が効く）

**4. 既存機能の継続**
- ✅ Better Auth の OAuth フロー（Google, GitHub）が継続動作
- ✅ `/api/auth/*` エンドポイントが影響を受けない
- ✅ 既存の Server Actions が動作（Option A の場合）

**5. パフォーマンス**
- ✅ `/api/admin/users` のレスポンスタイム < 500ms（100件取得）
- ✅ `/api/users` のレスポンスタイム < 200ms（自分の情報取得）

**6. セキュリティ**
- ✅ 未認証アクセスで 401 Unauthorized
- ✅ 権限なしアクセスで 403 Forbidden（具体的なエラーメッセージ付き）
- ✅ CSRF 保護が機能（Better Auth のトークン検証）

### 測定方法

```bash
# ビルドテスト
pnpm build

# 単体・統合テスト
pnpm test

# 手動テスト
pnpm dev
# → ブラウザで管理画面の各機能を確認

# パフォーマンステスト
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:3000/api/admin/users"
```

---

## � ロールバック戦略

### Phase 0～1 での失敗時

**判断基準:**
- RPC Client PoC で型推論が動作しない
- RBAC Middleware の統合が不可能（技術的制約）
- `pnpm build` が解決不可能なエラーで失敗

**ロールバック手順:**
```bash
# 1. Hono 関連ファイルの削除
rm -rf src/app/api/[[...route]]
rm -rf src/lib/api

# 2. package.json から hono を削除
pnpm remove hono

# 3. Git でコミットを戻す
git reset --hard HEAD~N  # N = Hono 導入以降のコミット数

# 4. ビルドテスト
pnpm build
pnpm test
```

**影響範囲:**
- Phase 0～1: 影響なし（既存機能は変更していない）
- 失われる工数: 最大 7.5h

### Phase 2～4 での失敗時

**判断基準:**
- Admin API の実装が予定の 2 倍以上の工数を消費
- 既存テストの改修が困難（技術的制約）
- パフォーマンスが許容範囲を大幅に超える（> 2秒）

**ロールバック手順:**
```bash
# 1. Admin API のみロールバック（Hono インフラは残す）
git revert <commit-hash>  # Admin API 実装のコミット

# 2. または全体ロールバック（Phase 0～1 と同じ手順）
```

**代替案:**
- Server Actions を継続使用（Hono は health endpoint のみ）
- Hono 導入を延期、技術検証を再実施

### Phase 5 での失敗時

**判断基準:**
- UI 統合で致命的なバグが発生
- パフォーマンスが劣化（既存比 50% 以上遅延）
- ユーザー体験が悪化

**ロールバック手順:**
```bash
# 1. UI コンポーネントのみ元に戻す
git revert <commit-hash>  # UI 更新のコミット

# 2. API は残し、Server Actions と併用
# → Hono API は管理機能のみ使用、User 向けは Server Actions 継続
```

**部分的な成功:**
- Admin API は Hono で提供
- User 向け API は Server Actions 継続
- 段階的な移行を継続

---

## �📁 関連ドキュメント一覧

### スキル（.agent/skills/）
- ✅ `hono-api-implementation/` - Hono API実装の強制ルールとベストプラクティス（2026-03-02作成）

### 決定事項（.agent/decisions/）
- ✅ `node-runtime.md` - Runtime 決定
- ✅ `better-auth-pattern.md` - Better Auth 共存方法
- ✅ `rpc-client-pattern.md` - RPC Client 決定
- ✅ `rbac-middleware-strategy.md` - RBAC Middleware 戦略
- ✅ `test-strategy.md` - テスト戦略
- ✅ `error-response-spec.md` - エラーレスポンス仕様

### 参考資料（schedule_todo_list/reference/）
- `2026-03-01_BETTER_AUTH_HONO_OPTIONS.md` - Better Auth 共存選択肢の詳細分析
- `2026-03-01_RPC_CLIENT_OPTIONS.md` - RPC Client 選択肢の詳細分析

### アーカイブ（schedule_todo_list/archive/）
- `2026-03-01_HONO_INTEGRATION_TODO.md` - 元の実装計画
- `2026-03-01_HONO_IMPLEMENTATION_REVISED.md` - 修正版実装計画
- `2026-03-01_HONO_REVIEW_CRITIQUE.md` - 詳細レビュー
- `2026-03-01_HONO_REVIEW_SUMMARY.md` - レビュー要約

---

## 🎯 実装チェックリスト

**重要:** すべての実装は `.agent/skills/hono-api-implementation/SKILL.md` のルールに従ってください。

### フェーズ 0: 事前検証（3.5～4.5h）
- [x] エラーレスポンス仕様決定（0.5h）
- [x] `.agent/decisions/error-response-spec.md` 作成
- [x] RPC Client PoC（タスク1: 基本的な型推論） 20分
- [x] RPC Client PoC（タスク2: パラメータ型推論） 15分
- [x] RPC Client PoC（タスク3: エラーハンドリング） 15分
- [x] RPC Client PoC（タスク4: Next.js 統合） 10分
- [x] RBAC Middleware 互換性確認・実装（1.5～2h）
- [x] `.agent/decisions/rbac-middleware-strategy.md` 作成
- [x] テスト戦略決定（0.5h）
- [x] `.agent/decisions/test-strategy.md` 作成
- [x] すべての決定事項が記録されていることを確認
- [x] `pnpm build` 成功確認

### フェーズ 1: セットアップ
- [x] `pnpm add hono` 実行
- [x] `src/app/api/[[...route]]/route.ts` 作成
- [x] middleware フレームワーク実装
- [x] health endpoint 実装・テスト
- [x] RPC client setup
- [x] `pnpm build` 成功確認

### フェーズ 2: Admin API
- [x] User Admin endpoints 実装
- [x] Group / Nation Admin endpoints 実装
- [x] Integration test 実装
- [x] `pnpm test` 全テスト成功

### フェーズ 3: User API
- [ ] ユーザー情報 API 実装
- [ ] グループ API 実装
- [ ] ネーション API 実装
- [ ] Integration test 実装

### フェーズ 4: 通知 API
- [ ] 通知 endpoints 実装
- [ ] Integration test 実装

### フェーズ 5: 統合
- [ ] Admin UI を RPC client で更新
- [ ] 全 UI テスト確認
- [ ] `pnpm build` 成功
- [ ] `pnpm dev` で動作確認

---

**作成者:** GitHub Copilot
**最終更新:** 2026-03-01（Option A 全面修正適用）
**修正内容:**
- ✅ ステータスを「設計完了」→「設計 80% 完了、Phase 0 必須」に変更
- ✅ 決定事項を「決定済み」→「文書化済み、PoC で検証必須」に変更
- ✅ スケジュール見積もりを 13.5h → 19.5～25h に修正（バッファ、テスト改修含む）
- ✅ Phase 0 の RBAC 見積もりを 0.5h → 1.5～2h に修正
- ✅ エラーレスポンス仕様決定の優先度を「低」→「高」に変更
- ✅ Phase 0 の実施順序を変更（エラー仕様 → RPC PoC → RBAC → テスト戦略）
- ✅ 各フェーズに既存テスト改修コストを追加
- ✅ Server Actions 移行方針を Phase 5 に追加
- ✅ Acceptance Criteria を具体化・測定可能に変更
- ✅ ロールバック戦略セクションを追加

**次のアクション:** フェーズ 0 のタスク 1（エラーレスポンス仕様決定、0.5h）を実施
