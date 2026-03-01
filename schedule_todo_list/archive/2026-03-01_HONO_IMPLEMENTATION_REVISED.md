# Hono 導入計画 - 修正版（実装しやすい）

**バージョン:** 2.0（修正版）
**作成日:** 2026-03-01
**前提:** フェーズ 0（事前検証）を完了後、本計画で実装を開始

---

## 📌 重要な前提条件

このドキュメントを開始する前に、以下が確保されていること：

```markdown
✅ フェーズ 0（事前検証）が完了している
   - ✅ Runtime が Node に決定（`.agent/decisions/node-runtime.md`）
   - ✅ Better Auth との共存方針が決定（Option A：並行運用、`.agent/decisions/better-auth-pattern.md`）
   - ✅ RPC client ジェネレーション決定（Option A：Hono RPC Client、`.agent/decisions/rpc-client-pattern.md`）⏳ PoC 実施待ち
   - ⏳ RBAC + Hono middleware の互換性が確認済み

✅ 以下の GitHub Issues が ASSIGNED 管理されている
   - ✅ architecture-decision: Runtime = Node Runtime
   - ✅ architecture-decision: Better Auth パターン A
   - ✅ architecture-decision: RPC Client = Hono RPC Client
   - ⏳ tech-debt: テスト戦略（Hono handler テストの方法）
```

---

## 🎯 修正版フェーズ計画（全 5 フェーズ）

### フェーズ 0: 事前検証と設計確定（4h）

**目的:** 実装リスクの事前検証と設計決定

**フェーズ 0-1: Runtime 検証（1h）** ✅ **完了**
  - [x] Edge Runtime で Drizzle ORM が動作するか検証
    ```bash
    # 現在のテンプレートで postgresql クライアントが load できるか
    export const runtime = 'edge';
    import postgres from 'postgres';  // ← これが load できるか？
    ```
    - ❌ できない → **Node Runtime が必須**（決定）
  - [x] Node Runtime で build が成功するか確認
    ```bash
    export const runtime = 'node';
    pnpm build  # ← 0 errors なら OK
    ```
    - ✅ 成功確認済み
  - **決定を記録:** ✅ `.agent/decisions/node-runtime.md` に記録済み
  - **採用決定:** **Node Runtime**（PostgreSQL完全対応、既存コード保持）

**フェーズ 0-2: Better Auth + Hono 共存検証（1h）** ✅ **完了**
  - [x] ダミー Hono endpoint を作成
    ```typescript
    // src/app/api/[[...route]]/route.ts のダミー実装
    const api = new Hono()
      .get('/test', (c) => c.json({ message: 'Hello from Hono' }));
    export const { GET } = toNextJsHandler(api);
    ```
  - [x] Better Auth エンドポイント（/api/auth）が異なるルータで動作するか検証
    ```bash
    curl http://localhost:3000/api/test          # ← Hono endpoint
    curl http://localhost:3000/api/auth/signin  # ← Better Auth endpoint
    # どちらも動作するか確認
    ```
  - [x] 既存 Server Actions との並行動作確認
  - **決定を記録:** ✅ `.agent/decisions/better-auth-pattern.md` に記録済み
  - **採用決定:** **Option A - 並行運用**（/api/auth/* は Better Auth、/api/* は Hono）

**フェーズ 0-3: RPC Client ジェネレーション PoC（1h）** ✅ **決定済み（PoC 実施待ち）**
  - [x] hono/client のドキュメント読破
  - [ ] サンプル endpoint を作成（PoC 実施時）
    ```typescript
    // src/lib/api/routes/test.ts
    import { Hono } from 'hono';

    export const testRouter = new Hono()
      .get('/health', (c) => c.json({ status: 'ok' }))
      .post('/echo', async (c) => {
        const body = await c.req.json();
        return c.json({ echoed: body });
      });
    ```
  - [ ] クライアント生成テスト（PoC 実施時）
    ```typescript
    // src/lib/api/client.ts
    import { hc } from 'hono/client';
    import type { testRouter } from '@/lib/api/routes/test';

    const client = hc<typeof testRouter>('http://localhost:3000/api');
    const result = await client.test.health.$get();
    // ← 型が正しく推論されるか確認
    ```
  - [ ] クライアント側で型補完が動作するか IDE で確認（PoC 実施時）
  - **決定を記録:** ✅ `.agent/decisions/rpc-client-pattern.md` に記録済み
  - **採用決定:** **Option A - Hono RPC Client**（公式、完全な型安全性）

**フェーズ 0-4: RBAC + Hono Middleware 互換性検証（0.5h）**
  - [ ] 既存の `checkGroupRole()` を Hono middleware で使用可能か検証
    ```typescript
    // middleware/rbac.ts
    export const checkGroupRoleMiddleware = (requiredRole: string) => {
      return async (c, next) => {
        const userId = c.get('userId');  // ← proxy から取得
        const groupId = c.req.param('groupId');

        // 既存関数を再利用できるか？
        const hasRole = await checkGroupRole(
          { user: { id: userId } },
          groupId,
          requiredRole,
        );

        if (!hasRole) return c.json({ error: 'Forbidden' }, 403);
        await next();
      };
    };
    ```
  - [ ] middleware chaining で 401 vs 403 の precedence 確認
  - **決定を記録:** `.agent/decisions/rbac-middleware-strategy.md`

**フェーズ 0-5: テスト戦略決定（0.5h）**
  - [ ] Hono handler テストの方法を決定
    ```typescript
    // tests/api/routes/groups.test.ts の例（vitest）
    import { testClient } from 'hono/testing';
    import { groupsRouter } from '@/lib/api/routes/groups';

    describe('POST /api/groups', () => {
      it('should create a group', async () => {
        const client = testClient(groupsRouter);
        const res = await client.groups.$post({
          json: { name: 'Test Group' }
        });
        expect(res.status).toBe(201);
      });
    });
    ```
  - [ ] test file naming convention を決定
  - [ ] CI/CD で実行するコマンドを決定
  - **決定を記録:** `.agent/decisions/test-strategy.md`

**フェーズ 0-6: エラーレスポンス仕様決定（0.5h）**
  - [ ] API エラーレスポンスの統一フォーマットを決定
    ```typescript
    // 推奨フォーマット
    interface ApiErrorResponse {
      success: false;
      error: {
        code: 'VALIDATION_ERROR' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'INTERNAL_ERROR';
        message: string;
        details?: Record<string, any>;
      };
    }
    ```
  - [ ] エラーハンドリング middleware を実装（フェーズ 1-3）

**フェーズ 0 の成果物**
```
.agent/decisions/
├── runtime-decision.md
├── better-auth-pattern.md
├── rpc-client-strategy.md
├── rbac-middleware-strategy.md
├── test-strategy.md
└── error-response-spec.md
```

---

### フェーズ 1: Hono セットアップと基盤実装（2h）

**前提:** フェーズ 0 がすべて完了、決定事項が document に記載されている

**フェーズ 1-1: Hono パッケージインストール（15分）**
  - [ ] `pnpm add hono`
  - [ ] `pnpm add -D @hono/eslint-config` （optional, code quality）
  - [ ] `pnpm build` で エラーが出ないか確認

**フェーズ 1-2: 統合ハンドラ作成（30分）**
  - [ ] `src/app/api/[[...route]]/route.ts` を作成・更新
    ```typescript
    // src/app/api/[[...route]]/route.ts
    import { Hono } from 'hono';
    import { toNextJsHandler } from '@hono/next-js';

    // ルータインポート（フェーズ 1-3 で作成）
    import { adminRouter } from '@/lib/api/routes/admin';
    import { groupsRouter } from '@/lib/api/routes/groups';
    import { nationsRouter } from '@/lib/api/routes/nations';

    export const runtime = 'node';  // ← フェーズ 0-1 で決定

    const api = new Hono()
      .basePath('/api')
      .route('/admin', adminRouter)
      .route('/groups', groupsRouter)
      .route('/nations', nationsRouter);

    export const { GET, POST, PATCH, DELETE, PUT } = toNextJsHandler(api);
    ```
  - [ ] ビルド確認
    ```bash
    pnpm build
    ```

**フェーズ 1-3: Middleware フレームワーク実装（45分）**
  - [ ] ディレクトリ作成
    ```
    src/lib/api/
    ├── middleware/
    │   ├── auth.ts           ← Session validation
    │   ├── rbac.ts           ← Role-based access control
    │   ├── error-handler.ts  ← Global error handling
    │   ├── rate-limit.ts     ← Rate limiting (existing function borrowed)
    │   └── logging.ts        ← Request/response logging
    ├── routes/
    │   ├── admin.ts
    │   ├── groups.ts
    │   ├── nations.ts
    │   └── users.ts
    ├── types.ts              ← Type definitions
    └── client.ts             ← RPC client
    ```

  - [ ] `src/lib/api/middleware/auth.ts` 作成
    ```typescript
    export const authMiddleware = () => {
      return async (c, next) => {
        // Proxy から userId を取得（ある場合）
        // または Cookie から直接検証
        const userId = c.req.header('x-user-id') ||
                      (await extractUserIdFromCookie(c));

        if (!userId) {
          return c.json({ error: 'Unauthorized' }, 401);
        }

        c.set('userId', userId);
        await next();
      };
    };
    ```

  - [ ] `src/lib/api/middleware/error-handler.ts` 作成
    ```typescript
    export const errorHandler = () => {
      return async (c, next) => {
        try {
          await next();
        } catch (error) {
          console.error('[API Error]', error);

          const statusCode = error.statusCode || 500;
          const message = error.message || 'Internal Server Error';

          return c.json({
            success: false,
            error: {
              code: getErrorCode(error),
              message: message,
              // 本番環境では詳細は返さない
            }
          }, statusCode);
        }
      };
    };
    ```

**フェーズ 1-4: テスト endpoint 実装（30分）**
  - [ ] `src/lib/api/routes/health.ts` 作成
    ```typescript
    export const healthRouter = new Hono()
      .get('/', (c) => {
        return c.json({ status: 'ok', timestamp: new Date().toISOString() });
      });
    ```

  - [ ] 統合ハンドラに追加
    ```typescript
    const api = new Hono()
      .basePath('/api')
      .route('/health', healthRouter)  // ← 追加
      .route('/admin', adminRouter);
    ```

  - [ ] テスト
    ```bash
    pnpm dev
    curl http://localhost:3000/api/health
    # Expected: { "status": "ok", "timestamp": "..." }
    ```

**フェーズ 1-5: RPC Client セットアップ（15分）**
  - [ ] `src/lib/api/client.ts` 作成
    ```typescript
    import { hc } from 'hono/client';

    // ルータ型インポート（フェーズ 1-2 で定義）
    import type { api } from '@/app/api/[[...route]]/route';

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    export const client = hc<typeof api>(apiUrl);
    ```

**フェーズ 1 の成果物**
```
src/lib/api/
├── middleware/
│   ├── auth.ts
│   ├── error-handler.ts
│   ├── rbac.ts
│   ├── rate-limit.ts
│   └── logging.ts
├── routes/
│   └── health.ts （テスト用）
├── types.ts
└── client.ts
src/app/api/[[...route]]/route.ts （更新）
```

---

### フェーズ 2: Admin API（3.5h）

**前提:** フェーズ 1 が完了し、Hono middleware が動作している

**フェーズ 2-1: User Admin Endpoints（1.5h）**

  - [ ] `src/lib/api/routes/admin.ts` を `src/lib/api/routes/admin/` に分割
    ```
    src/lib/api/routes/admin/
    ├── index.ts （ルータ統合）
    ├── users.ts
    ├── groups.ts
    └── nations.ts
    ```

  - [ ] `src/lib/api/routes/admin/users.ts` 作成
    ```typescript
    import { Hono } from 'hono';
    import { checkPlatformAdmin } from '@/lib/auth/rbac-helper';

    export const usersRouter = new Hono()
      // GET /api/admin/users （ユーザー検索）
      .get('/', async (c) => {
        const userId = c.get('userId');

        // RBAC: platform_admin のみ
        const isAdmin = await checkPlatformAdmin({ user: { id: userId } });
        if (!isAdmin) return c.json({ error: 'Forbidden' }, 403);

        // Query params
        const searchTerm = c.req.query('searchTerm');
        const page = parseInt(c.req.query('page') || '1');
        const limit = parseInt(c.req.query('limit') || '20');

        // 既存 DB 関数呼び出し
        const { users, total } = await searchUsers(searchTerm, page, limit);

        return c.json({ success: true, data: { users, total, page } }, 200);
      })

      // GET /api/admin/users/:id
      .get('/:id', async (c) => {
        const userId = c.get('userId');
        const isAdmin = await checkPlatformAdmin({ user: { id: userId } });
        if (!isAdmin) return c.json({ error: 'Forbidden' }, 403);

        const targetUserId = c.req.param('id');
        const user = await getUserDetail(targetUserId);

        if (!user) return c.json({ error: 'Not Found' }, 404);
        return c.json({ success: true, data: user }, 200);
      })

      // DELETE /api/admin/users/:id
      .delete('/:id', async (c) => {
        const userId = c.get('userId');
        const isAdmin = await checkPlatformAdmin({ user: { id: userId } });
        if (!isAdmin) return c.json({ error: 'Forbidden' }, 403);

        const targetUserId = c.req.param('id');
        await deleteUser(targetUserId);

        return c.json({ success: true }, 200);
      })

      // PATCH /api/admin/users/:id （ロール・ステータス更新）
      .patch('/:id', async (c) => {
        const userId = c.get('userId');
        const isAdmin = await checkPlatformAdmin({ user: { id: userId } });
        if (!isAdmin) return c.json({ error: 'Forbidden' }, 403);

        const targetUserId = c.req.param('id');
        const body = await c.req.json();

        // Zod バリデーション
        const parsed = updateUserSchema.safeParse(body);
        if (!parsed.success) {
          return c.json({ error: parsed.error.flatten() }, 400);
        }

        const updated = await updateUserRole(targetUserId, parsed.data);
        return c.json({ success: true, data: updated }, 200);
      });
    ```

  - [ ] `src/lib/api/routes/admin/index.ts` 作成
    ```typescript
    import { Hono } from 'hono';
    import { usersRouter } from './users';
    import { groupsRouter } from './groups';
    import { nationsRouter } from './nations';

    export const adminRouter = new Hono()
      .route('/users', usersRouter)
      .route('/groups', groupsRouter)
      .route('/nations', nationsRouter);
    ```

  - [ ] テスト実施
    ```bash
    # Admin user でログイン済みの状態で
    curl http://localhost:3000/api/admin/users
    # Expected: { "success": true, "data": { "users": [...], "total": ... } }

    # Admin user ではない状態で
    curl http://localhost:3000/api/admin/users
    # Expected: { "error": "Forbidden" } 403
    ```

**フェーズ 2-2: Group / Nation Admin Endpoints（1h）**

  - [ ] `src/lib/api/routes/admin/groups.ts` 作成
    ```typescript
    // GET /api/admin/groups
    // DELETE /api/admin/groups/:id
    ```

  - [ ] `src/lib/api/routes/admin/nations.ts` 作成
    ```typescript
    // GET /api/admin/nations
    // DELETE /api/admin/nations/:id
    ```

**フェーズ 2-3: Integration Test（1h）**

  - [ ] `src/__tests__/integration/admin-api.integration.test.ts` 作成
    ```typescript
    describe('Admin API', () => {
      it('should list users as admin', async () => {
        // Setup: admin user でログイン
        const adminSession = await setupAdminSession();

        // Act
        const response = await client.api.admin.users.$get({
          query: { page: '1', limit: '10' }
        });

        // Assert
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(Array.isArray(data.data.users)).toBe(true);
      });
    });
    ```

  - [ ] テスト実行
    ```bash
    pnpm test admin-api.integration
    ```

**フェーズ 2 の成果物**
```
src/lib/api/routes/admin/
├── index.ts
├── users.ts
├── groups.ts
└── nations.ts
src/__tests__/integration/
├── admin-api.integration.test.ts
└── （既存テストと統合）
```

---

### フェーズ 3: User/Group/Nation API（2.5h）

**前提:** フェーズ 2 で Admin API の実装パターンが確立

このフェーズでは、authenticated ユーザーが使用する API を実装。

**フェーズ 3-1: グループ API（1h）**
  - [ ] `src/lib/api/routes/groups.ts` 作成
    ```typescript
    export const groupsRouter = new Hona()
      // GET /api/groups （自分が属するグループ一覧）
      .get('/', authMiddleware(), async (c) => {
        const userId = c.get('userId');
        const groups = await getGroupsByUser(userId);
        return c.json({ success: true, data: groups }, 200);
      })

      // GET /api/groups/:id
      .get('/:id', authMiddleware(), async (c) => { ... })

      // PATCH /api/groups/:id （編集）
      .patch('/:id', authMiddleware(), async (c) => { ... });
    ```

**フェーズ 3-2: ネーション API（1h）**
  - [ ] `src/lib/api/routes/nations.ts` 作成

**フェーズ 3-3: ユーザープロフィール API（0.5h）**
  - [ ] `src/lib/api/routes/users.ts` 作成

---

### フェーズ 4: 通知 API（1h）

**フェーズ 4-1: 通知エンドポイント実装**
  - [ ] `src/lib/api/routes/notifications.ts` 作成
    ```typescript
    // GET /api/notifications
    // GET /api/notifications/:id
    // PATCH /api/notifications/:id （既読マーク）
    // DELETE /api/notifications/:id
    ```

---

### フェーズ 5: 既存 UI コンポーネント更新（2h）

**フェーズ 5-1: Admin UI → RPC Client 移行**
  - [ ] `src/components/admin/user-panel.tsx` を更新
    ```typescript
    'use client';

    import { client } from '@/lib/api/client';

    export async function UserPanel() {
      const response = await client.api.admin.users.$get();
      const data = await response.json();

      return (
        <div>
          {data.data.users.map(u => (...))}
        </div>
      );
    }
    ```

**フェーズ 5-2: Server Actions の削除（条件付き）**
  - [ ] create-group / create-nation を Hono に移行したい場合
  - [ ] またはそのまま Server Actions で継続（カレント設計で良い場合）

---

## ⏱️ 修正版スケジュール見積もり

| フェーズ | 内容 | 見積もり | 合計 |
|---------|------|---------|------|
| **0** | 事前検証・設計 | 4h | 4h |
| **1** | Hono セットアップ | 2h | 6h |
| **2** | Admin API | 3.5h | 9.5h |
| **3** | User/Group/Nation API | 2.5h | 12h |
| **4** | 通知 API | 1h | 13h |
| **5** | UI 更新・統合テスト | 2h | 15h |

**合計：15h（現計画と同等だが、リスク軽減される）**

---

## 📋 修正版実装チェックリスト

```markdown
## フェーズ 0: 事前検証
- [ ] Runtime 検証（Edge vs Node）ASSIGNED
- [ ] Better Auth + Hono 共存テスト ASSIGNED
- [ ] RPC Client PoC 検証 ASSIGNED
- [ ] RBAC + middleware 互換性 ASSIGNED
- [ ] テスト戦略決定 ASSIGNED
- [ ] エラーレスポンス仕様決定 ASSIGNED

## フェーズ 1: セットアップ
- [ ] `pnpm add hono` 実行
- [ ] src/app/api/[[...route]]/route.ts 作成・テスト
- [ ] middleware フレームワーク実装（auth, error, rbac)
- [ ] health endpoint 実装・テスト確認
- [ ] RPC client setup
- [ ] pnpm build 成功確認

## フェーズ 2: Admin API
- [ ] User Admin endpoints （GET, POST, DELETE, PATCH）
- [ ] Group / Nation Admin endpoints
- [ ] Integration test 実装
- [ ] pnpm test 全テスト成功

## フェーズ 3: User API
- [ ] Groups API
- [ ] Nations API
- [ ] Users API
- [ ] Integration test

## フェーズ 4: 通知 API
- [ ] Notifications endpoints
- [ ] Integration test

## フェーズ 5: 統合
- [ ] Admin UI を RPC client で更新
- [ ] 全 UI テスト確認
- [ ] `pnpm build` 成功
- [ ] `pnpm dev` で動作確認
```

---

## 🎯 成功の定義

フェーズ 5 終了時点で以下がすべてクリアされていること：

```markdown
✅ `pnpm build` エラーなし
✅ `pnpm test` 全テスト成功
✅ `pnpm dev` で localhost:3000 で動作確認
✅ 管理画面で User/Group/Nation のCRUD が可能
✅ User 画面で自分のグループ・国が表示可能
✅ API エラーレスポンスが統一フォーマット
✅ RBAC チェックが機能（権限なしで Forbidden）
✅ RPC client が型安全に動作（IDE 補完が効く）
```

---

**作成者:** GitHub Copilot
**タイプ:** 修正版実装計画
