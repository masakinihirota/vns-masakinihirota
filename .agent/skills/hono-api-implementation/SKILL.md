# Hono API Implementation

## 概要

このプロジェクトでは、すべてのAPIエンドポイント実装にHonoフレームワークを使用します。
Next.js Route Handlerを直接使用せず、既存のHono統合インフラを活用してください。

## トリガー

以下のタスクでこのスキルが適用されます：

- 新規APIエンドポイントの実装
- REST APIの作成
- データ取得APIの実装
- CRUD操作のAPI化
- `/api/*` 配下の実装
- Server ActionsからAPIへの移行

## なぜHonoを使うのか

### 採用理由

1. **完全な型安全性**: RPC Clientによるend-to-endの型推論
2. **軽量・高速**: Next.js App Routerより高パフォーマンス
3. **標準化されたエラーハンドリング**: 統一されたエラーレスポンス形式
4. **強力なMiddleware**: 認証、RBAC、バリデーション、レート制限が実装済み
5. **テスタビリティ**: `hono/testing`による簡潔なテストコード

### 既存インフラ

すでに以下が完全実装済みです：

```
src/
├── app/api/[[...route]]/route.ts    # Honoメインルーター（115行）
├── lib/api/
│   ├── middleware/                   # 8つのミドルウェア実装済み
│   │   ├── auth.ts                  # Better Auth統合
│   │   ├── auth-session.ts          # セッション検証
│   │   ├── rbac.ts                  # ロールベースアクセス制御（225行）
│   │   ├── error-handler.ts         # 統一エラーハンドリング
│   │   ├── csrf.ts                  # CSRF保護
│   │   ├── rate-limit.ts            # レート制限
│   │   ├── zod-validator.ts         # バリデーション
│   │   └── index.ts
│   ├── routes/                       # ルート実装
│   │   ├── admin.ts                 # Admin API（906行、完全実装）
│   │   ├── users.ts                 # User API（部分実装）
│   │   ├── health.ts                # ヘルスチェック
│   │   └── poc.ts                   # RPC Client検証用
│   ├── schemas/                      # Zodスキーマ
│   ├── services/                     # ビジネスロジック
│   ├── types/                        # 型定義
│   └── client.ts                     # RPC Client設定
└── __tests__/api/                    # APIテスト
    ├── error-handler.test.ts         # ミドルウェアテスト
    └── admin.test.ts                 # 統合テスト
```

## 実装ルール

### 🚫 禁止事項

#### 1. Next.js Route Handlerの直接使用禁止

❌ **Bad: 直接Route Handler作成**
```typescript
// src/app/api/my-endpoint/route.ts
export async function GET(request: Request) {
  // これは禁止
  return Response.json({ data: "..." });
}
```

✅ **Good: Honoルーター使用**
```typescript
// src/lib/api/routes/my-feature.ts
import { Hono } from 'hono';

const myFeature = new Hono();

myFeature.get('/my-endpoint', (c) => {
  return c.json({ success: true, data: "..." });
});

export default myFeature;
```

#### 2. Server ActionsでのAPI化禁止

❌ **Bad: Server ActionsでREST API的な使い方**
```typescript
// app/actions/data.ts
'use server';

export async function getItems() {
  // フォーム送信以外でServer Actionsを使うのは非推奨
  return await db.query.items.findMany();
}
```

✅ **Good: HonoでGET endpoint作成**
```typescript
// src/lib/api/routes/items.ts
items.get('/', async (c) => {
  const data = await db.query.items.findMany();
  return c.json({ success: true, data });
});
```

### ✅ 必須パターン

#### 1. エラーレスポンス形式の遵守

すべてのエラーは統一フォーマットで返してください：

```typescript
interface ApiErrorResponse {
  success: false;
  error: {
    code: 'VALIDATION_ERROR' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'INTERNAL_ERROR';
    message: string;
    details?: Record<string, any>;
  };
}

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}
```

詳細: `.agent/decisions/error-response-spec.md`

#### 2. RBAC Middlewareの使用

権限チェックは必ずミドルウェアで実装：

```typescript
import { requirePlatformAdmin, requireGroupRole } from '../middleware/rbac';

// プラットフォーム管理者のみ
admin.delete('/users/:id', requirePlatformAdmin, async (c) => {
  // ...
});

// グループリーダーのみ
groups.patch('/:groupId/settings', requireGroupRole('leader'), async (c) => {
  // ...
});
```

詳細: `.agent/decisions/rbac-middleware-strategy.md`

#### 3. Zodバリデーション

すべてのリクエストボディをZodでバリデーション：

```typescript
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['user', 'admin']),
});

users.post('/', zValidator('json', createUserSchema), async (c) => {
  const validated = c.req.valid('json'); // 型安全に取得
  // ...
});
```

#### 4. RPC Client型エクスポート

必ずAppTypeを型エクスポート：

```typescript
// src/lib/api/routes/my-feature.ts
import { Hono } from 'hono';

const myFeature = new Hono()
  .get('/', (c) => c.json({ data: "test" }))
  .post('/', (c) => c.json({ data: "created" }));

export default myFeature;

// ルーターに登録
// src/app/api/[[...route]]/route.ts
import myFeature from '@/lib/api/routes/my-feature';

app.route('/my-feature', myFeature);

// 型エクスポートはすでに存在
export type AppType = typeof app;
```

クライアント側の使用：

```typescript
// クライアントコンポーネント
import { client } from '@/lib/api/client';

const response = await client['my-feature'].$get();
const data = await response.json(); // 完全な型推論
```

詳細: `.agent/decisions/rpc-client-pattern.md`

#### 5. レート制限

重要なエンドポイントにはレート制限を適用：

```typescript
import { rateLimit, adminRateLimit } from '../middleware/rate-limit';

// 管理者用（30req/min）
admin.use('/*', adminRateLimit());

// カスタム制限（例: 削除は3回/分）
const deleteRateLimit = rateLimit({
  maxRequests: 3,
  windowMs: 60000,
});

admin.delete('/users/:id', deleteRateLimit, requirePlatformAdmin, async (c) => {
  // ...
});
```

#### 6. CSRF保護

POST/PATCH/DELETEはCSRF保護を適用：

```typescript
import { validateCsrfToken } from '../middleware/csrf';

// すべての変更操作を保護
admin.use('/*', validateCsrfToken);
```

## 実装手順

### 新規APIエンドポイント作成の標準手順

#### Step 1: Zodスキーマ定義

```typescript
// src/lib/api/schemas/my-feature.ts
import { z } from 'zod';

export const createItemSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

export const updateItemSchema = createItemSchema.partial();
export const itemIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type CreateItemRequest = z.infer<typeof createItemSchema>;
export type UpdateItemRequest = z.infer<typeof updateItemSchema>;
```

#### Step 2: サービス層実装

```typescript
// src/lib/api/services/items.ts
import { db } from '@/lib/db';
import { items } from '@/lib/db/schema.postgres';
import { eq } from 'drizzle-orm';

export async function createItem(data: CreateItemRequest) {
  const [item] = await db.insert(items).values(data).returning();
  return item;
}

export async function getItemById(id: string) {
  const item = await db.query.items.findFirst({
    where: eq(items.id, id),
  });
  if (!item) throw new Error('Item not found');
  return item;
}

export async function updateItem(id: string, data: UpdateItemRequest) {
  const [updated] = await db
    .update(items)
    .set(data)
    .where(eq(items.id, id))
    .returning();
  if (!updated) throw new Error('Item not found');
  return updated;
}

export async function deleteItem(id: string) {
  const [deleted] = await db
    .delete(items)
    .where(eq(items.id, id))
    .returning();
  if (!deleted) throw new Error('Item not found');
}
```

#### Step 3: ルート実装

```typescript
// src/lib/api/routes/items.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { requireAuth } from '../middleware/auth';
import { requirePlatformAdmin } from '../middleware/rbac';
import { adminRateLimit } from '../middleware/rate-limit';
import { validateCsrfToken } from '../middleware/csrf';
import {
  createItemSchema,
  updateItemSchema,
  itemIdParamSchema,
} from '../schemas/items';
import * as itemService from '../services/items';
import type { SessionContext } from '../middleware/auth';

const items = new Hono<{ Variables: SessionContext }>();

// レート制限適用
items.use('/*', adminRateLimit());

// CSRF保護
items.use('/*', validateCsrfToken);

/**
 * GET /api/items
 *
 * @description アイテム一覧取得
 * @returns 200: { success: true, data: Item[] }
 */
items.get('/', requireAuth, async (c) => {
  try {
    const items = await itemService.getAllItems();
    return c.json({ success: true, data: items });
  } catch (error) {
    throw error; // errorHandlerが処理
  }
});

/**
 * POST /api/items
 *
 * @description アイテム作成（管理者のみ）
 * @param body CreateItemRequest
 * @returns 201: { success: true, data: Item }
 * @throws 400: Validation Error
 * @throws 403: Admin role required
 */
items.post(
  '/',
  requirePlatformAdmin,
  zValidator('json', createItemSchema),
  async (c) => {
    try {
      const data = c.req.valid('json');
      const item = await itemService.createItem(data);
      return c.json({ success: true, data: item }, 201);
    } catch (error) {
      throw error;
    }
  }
);

/**
 * PATCH /api/items/:id
 *
 * @description アイテム更新（管理者のみ）
 */
items.patch(
  '/:id',
  requirePlatformAdmin,
  zValidator('param', itemIdParamSchema),
  zValidator('json', updateItemSchema),
  async (c) => {
    try {
      const { id } = c.req.valid('param');
      const data = c.req.valid('json');
      const updated = await itemService.updateItem(id, data);
      return c.json({ success: true, data: updated });
    } catch (error) {
      throw error;
    }
  }
);

export default items;
```

#### Step 4: ルーター登録

```typescript
// src/app/api/[[...route]]/route.ts
import items from '@/lib/api/routes/items';

// 既存のルート登録の後に追加
app.route('/items', items);
```

#### Step 5: テスト実装

```typescript
// src/__tests__/api/items.test.ts
import { describe, it, expect } from 'vitest';
import { testClient } from 'hono/testing';
import { app } from '@/app/api/[[...route]]/route';

describe('Items API', () => {
  it('GET /api/items - 認証なしで401', async () => {
    const res = await testClient(app).items.$get();
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('UNAUTHORIZED');
  });

  it('POST /api/items - バリデーションエラーで400', async () => {
    const res = await testClient(app).items.$post({
      json: { name: '' }, // 空文字はNG
    });
    expect(res.status).toBe(400);
  });
});
```

## 参考実装

### 完全実装済みの例

- **Admin API**: `src/lib/api/routes/admin.ts` (906行)
  - User/Group/Nation CRUD
  - RBAC、レート制限、CSRF保護完備
  - Zodバリデーション完備
  - 監査ログ記録

- **PoC**: `src/lib/api/routes/poc.ts` (181行)
  - RPC Client型推論の検証コード
  - エラーハンドリングのサンプル

- **User API**: `src/lib/api/routes/users.ts` (65行)
  - シンプルなGET /me実装
  - セッション取得のサンプル

## トラブルシューティング

### Q1: 型推論が効かない

**原因**: AppTypeが正しくエクスポートされていない

**解決**: `src/app/api/[[...route]]/route.ts`で必ず型エクスポート：

```typescript
export type AppType = typeof app;
```

### Q2: RPC Clientでパラメータエラー

**原因**: パラメータ名の不一致

**解決**: サーバー側の定義と一致させる：

```typescript
// サーバー側
app.get('/users/:userId', (c) => { ... });

// クライアント側
client.users[':userId'].$get({ param: { userId: '123' } });
//                                      ^^^^^^ 一致させる
```

### Q3: CSRF検証エラー

**原因**: CSRFトークンがヘッダーに含まれていない

**解決**: Better Authのトークンを使用：

```typescript
const session = await auth.api.getSession();
const csrfToken = session?.csrf;

await client.items.$post({
  json: { ... },
  headers: {
    'x-csrf-token': csrfToken,
  },
});
```

## チェックリスト

新規APIエンドポイント実装時の最終チェック：

- [ ] Honoルーターで実装（Route Handler直接使用していない）
- [ ] エラーレスポンス形式に準拠（success: true/false）
- [ ] RBAC middlewareで権限チェック実装
- [ ] Zodスキーマでバリデーション実装
- [ ] AppTypeに型が含まれることを確認
- [ ] レート制限を適切に設定
- [ ] CSRF保護を適用（POST/PATCH/DELETE）
- [ ] テストコード実装（hono/testing使用）
- [ ] JSDOCでAPIドキュメント記載
- [ ] エラーケースのテスト実装

## 関連ドキュメント

- `.agent/decisions/node-runtime.md` - Runtime設定
- `.agent/decisions/better-auth-pattern.md` - Better Auth統合
- `.agent/decisions/rpc-client-pattern.md` - RPC Clientパターン
- `.agent/decisions/error-response-spec.md` - エラーレスポンス仕様
- `.agent/decisions/rbac-middleware-strategy.md` - RBAC戦略
- `.agent/decisions/test-strategy.md` - テスト戦略
- `schedule_todo_list/2026-03-01_HONO_MASTER_PLAN.md` - Hono導入マスタープラン

## まとめ

すべてのAPIエンドポイント実装は：

1. **Honoフレームワークを使用**（Next.js Route Handler禁止）
2. **既存のMiddlewareインフラを活用**（auth, rbac, validation等）
3. **統一されたエラーフォーマットを遵守**
4. **RPC Clientによる型安全性を維持**
5. **テストファースト**（hono/testing使用）

これにより、型安全で保守性の高い、一貫したAPIを構築できます。
