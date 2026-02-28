# Hono API テスト戦略

**作成日:** 2026-03-01
**ステータス:** ✅ 決定済み

## 概要

Hono API のテストは `vitest` + `hono/testing` を使用して実装します。

## テストツール

### 1. Vitest

- **理由**: Next.js 16 + Turbopack との親和性が高い
- **既存環境**: プロジェクトで既に使用中
- **設定**: `vitest.config.ts` で設定済み

### 2. hono/testing

- **公式テストユーティリティ**: Hono 標準のテストクライアント
- **型推論**: RPC Client と同じく完全な型安全性
- **簡潔な API**: `testClient(app)` で即座にテスト可能

## テスト階層

### Layer 1: Unit Test (Middleware)

**対象:**
- エラーハンドラー
- 認証 middleware
- RBAC middleware

**ツール:**
- `vitest`
- `hono/testing`

**例:**

```typescript
import { describe, it, expect } from 'vitest';
import { testClient } from 'hono/testing';
import { Hono } from 'hono';
import { requireAuth, requirePlatformAdmin } from '@/lib/api/middleware';

describe('Auth Middleware', () => {
  it('requireAuth - セッションなしで 401', async () => {
    const app = new Hono();
    app.get('/protected', requireAuth, (c) => c.json({ ok: true }));

    const res = await testClient(app).protected.$get();
    expect(res.status).toBe(401);
    
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('UNAUTHORIZED');
  });

  it('requirePlatformAdmin - 非管理者で 403', async () => {
    const app = new Hono();
    app.use('*', async (c, next) => {
      // モックセッションを設定
      c.set('userId', 'user-123');
      c.set('userRole', 'user'); // 非管理者
      await next();
    });
    app.get('/admin', requirePlatformAdmin, (c) => c.json({ ok: true }));

    const res = await testClient(app).admin.$get();
    expect(res.status).toBe(403);
    
    const data = await res.json();
    expect(data.error.code).toBe('FORBIDDEN');
  });
});
```

### Layer 2: Integration Test (Endpoint + DB)

**対象:**
- API エンドポイント全体
- 実際のデータベースクエリ
- RBAC ロジック

**ツール:**
- `vitest`
- `hono/testing`
- テスト用データベース（PostgreSQL）

**セットアップ:**

```typescript
import { beforeEach, afterEach } from 'vitest';
import { db } from '@/lib/db/client';
import { user, groupMembers } from '@/db/schema';

describe('Admin API Integration', () => {
  beforeEach(async () => {
    // テストデータをセットアップ
    await db.insert(user).values([
      { id: 'admin-1', email: 'admin@example.com', role: 'platform_admin' },
      { id: 'user-1', email: 'user@example.com', role: 'user' },
    ]);

    await db.insert(groupMembers).values([
      { groupId: 'group-1', userId: 'user-1', role: 'leader' },
    ]);
  });

  afterEach(async () => {
    // テストデータをクリーンアップ
    await db.delete(groupMembers);
    await db.delete(user);
  });

  it('GET /api/admin/users - Admin ロールで成功', async () => {
    const res = await testClient(app, {
      // モックセッションヘッダー
      headers: {
        'x-test-user-id': 'admin-1',
        'x-test-user-role': 'platform_admin',
      },
    }).admin.users.$get();

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(2);
  });

  it('PATCH /api/groups/:groupId - Leader ロールで成功', async () => {
    const res = await testClient(app, {
      headers: {
        'x-test-user-id': 'user-1',
        'x-test-user-role': 'user',
      },
    }).groups[':groupId'].$patch({
      param: { groupId: 'group-1' },
      json: { name: 'Updated Group' },
    });

    expect(res.status).toBe(200);
  });
});
```

### Layer 3: E2E Test (RPC Client)

**対象:**
- クライアント側の RPC Client
- 型推論の動作確認
- エラーハンドリング

**ツール:**
- `vitest`
- `@testing-library/react` (UI 統合時)
- RPC Client (`hono/client`)

**例:**

```typescript
import { describe, it, expect } from 'vitest';
import { client } from '@/lib/api/client';

describe('RPC Client E2E', () => {
  it('GET /api/health - 型推論が動作する', async () => {
    const res = await client.health.$get();
    expect(res.status).toBe(200);

    const data = await res.json();
    
    // 型推論により、data.success が存在することが保証される
    if (data.success) {
      // ✅ data.data.status にアクセス可能
      expect(data.data.status).toBe('ok');
      expect(data.data.timestamp).toBeTypeOf('number');
    } else {
      // ✅ data.error.code にアクセス可能
      fail('Should not reach here');
    }
  });

  it('エラーレスポンスの型推論', async () => {
    const res = await client.poc.error['404'].$get();
    expect(res.status).toBe(404);

    const data = await res.json();
    
    // 型推論により、data.success === false の場合 error プロパティが存在
    if (!data.success) {
      expect(data.error.code).toBe('NOT_FOUND');
      expect(data.error.message).toBeTruthy();
    }
  });
});
```

## モックセッション戦略

### 開発環境用ヘッダー (`NODE_ENV === 'development'`)

```typescript
// src/lib/api/middleware/auth.ts
export const requireAuth: MiddlewareHandler = async (c, next) => {
  // テスト用ヘッダーを優先（開発環境のみ）
  if (process.env.NODE_ENV === 'development') {
    const testUserId = c.req.header('x-test-user-id');
    const testUserRole = c.req.header('x-test-user-role');
    
    if (testUserId && testUserRole) {
      c.set('userId', testUserId);
      c.set('userRole', testUserRole as 'platform_admin' | 'user');
      return await next();
    }
  }

  // 通常のセッション取得
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  // ...
};
```

**セキュリティ:**
- ✅ `NODE_ENV === 'development'` のみ有効
- ✅ 本番環境では無視される
- ✅ テストヘッダーが設定されていない場合は通常のフロー

### MSW (Mock Service Worker) for UI Tests

UI コンポーネントのテストでは MSW を使用:

```typescript
// src/__tests__/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        name: 'Test User',
      },
    });
  }),

  http.get('/api/admin/users', () => {
    return HttpResponse.json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    }, { status: 401 });
  }),
];
```

## テストデータベース

### PostgreSQL Test Container

```typescript
// vitest.setup.ts
import { beforeAll, afterAll } from 'vitest';
import { GenericContainer } from 'testcontainers';

let postgresContainer: any;

beforeAll(async () => {
  // PostgreSQL コンテナを起動
  postgresContainer = await new GenericContainer('postgres:16')
    .withEnvironment({
      POSTGRES_USER: 'test',
      POSTGRES_PASSWORD: 'test',
      POSTGRES_DB: 'vns_test',
    })
    .withExposedPorts(5432)
    .start();

  // 環境変数を設定
  process.env.DATABASE_URL = `postgresql://test:test@localhost:${postgresContainer.getMappedPort(5432)}/vns_test`;

  // マイグレーション実行
  await runMigrations();
});

afterAll(async () => {
  await postgresContainer.stop();
});
```

**代替案（軽量）:**
- SQLite in-memory database（開発中のみ）
- モッククエリ（vitest.mock）

## CI/CD 統合

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: vns_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run migrations
        run: pnpm db:migrate
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/vns_test
      
      - name: Run tests
        run: pnpm test
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/vns_test
          NODE_ENV: test
```

## テストコマンド

### package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch"
  }
}
```

### 実行例

```bash
# すべてのテストを実行
pnpm test

# 特定のファイルのみ
pnpm test -- auth.test.ts

# カバレッジレポート生成
pnpm test:coverage

# Watch モード（開発中）
pnpm test:watch
```

## カバレッジ目標

| カテゴリ | 目標 | 現状 |
|---------|------|------|
| **Middleware** | 90% | - |
| **API Endpoints** | 80% | - |
| **RBAC Logic** | 95% | - |
| **Error Handling** | 85% | - |
| **全体** | 85% | - |

## テストファイル構成

```
src/
├── lib/
│   └── api/
│       ├── middleware/
│       │   ├── auth.ts
│       │   ├── __tests__/
│       │   │   ├── auth.test.ts
│       │   │   ├── rbac.test.ts
│       │   │   └── error-handler.test.ts
│       │   ├── error-handler.ts
│       │   └── rbac.ts
│       └── routes/
│           ├── health.ts
│           └── __tests__/
│               └── health.test.ts
└── __tests__/
    ├── integration/
    │   ├── admin-api.test.ts
    │   ├── user-api.test.ts
    │   └── group-api.test.ts
    └── e2e/
        └── rpc-client.test.ts
```

## ベストプラクティス

### 1. AAA (Arrange-Act-Assert) パターン

```typescript
it('requireAuth - セッションなしで 401', async () => {
  // Arrange: テストデータを準備
  const app = new Hono();
  app.get('/protected', requireAuth, (c) => c.json({ ok: true }));

  // Act: 実際の操作を実行
  const res = await testClient(app).protected.$get();

  // Assert: 結果を検証
  expect(res.status).toBe(401);
  const data = await res.json();
  expect(data.error.code).toBe('UNAUTHORIZED');
});
```

### 2. テストの独立性

```typescript
describe('Admin API', () => {
  beforeEach(async () => {
    // 各テストの前にクリーンな状態を作成
    await setupTestDatabase();
  });

  afterEach(async () => {
    // 各テストの後にクリーンアップ
    await cleanupTestDatabase();
  });

  it('テスト1', async () => {
    // テスト1 のみに依存するデータ
  });

  it('テスト2', async () => {
    // テスト2 のみに依存するデータ
    // テスト1 の影響を受けない
  });
});
```

### 3. 明確なテストケース名

```typescript
// ❌ Bad
it('test auth', async () => { ... });

// ✅ Good
it('requireAuth - セッションなしで 401 Unauthorized を返す', async () => { ... });

// ✅ Better
describe('requireAuth middleware', () => {
  it('セッションが存在しない場合、401 Unauthorized を返す', async () => { ... });
  it('セッションが存在する場合、Context に userId を設定して次へ進む', async () => { ... });
  it('セッション取得エラーの場合、500 Internal Error を返す', async () => { ... });
});
```

## 次のステップ

1. ✅ テスト戦略決定（本ドキュメント）
2. ⏳ middleware Unit Test 実装
3. ⏳ endpoint Integration Test 実装
4. ⏳ RPC Client E2E Test 実装
5. ⏳ CI/CD パイプライン設定

## 関連ドキュメント

- [RBAC Middleware 戦略](.agent/decisions/rbac-middleware-strategy.md)
- [エラーレスポンス仕様](.agent/decisions/error-response-spec.md)
- [RPC Client パターン](.agent/decisions/rpc-client-pattern.md)

## 変更履歴

- 2026-03-01: 初版作成
