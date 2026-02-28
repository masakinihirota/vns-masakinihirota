# RBAC Middleware 戦略

**作成日:** 2026-03-01
**ステータス:** ✅ 実装完了

## 概要

既存の RBAC ヘルパー関数（`src/lib/auth/rbac-helper.ts`、426行）を Hono middleware で再利用する戦略。

## 設計原則

### 1. 既存ロジックの再利用

- ✅ 既存の RBAC ヘルパー関数を変更しない
- ✅ Hono middleware は薄いラッパーとして実装
- ✅  Contextから userId/userRole を取得してセッションオブジェクトを構築

### 2. セッションオブジェクトの構築

```typescript
// Hono Context から取得
const userId = c.get('userId');
const userRole = c.get('userRole');

// AuthSession オブジェクトを構築（既存ヘルパー関数互換）
const session: AuthSession = {
  user: { id: userId, role: userRole },
};

// 既存ヘルパー関数を呼び出し
const hasRole = await checkGroupRole(session, groupId, role);
```

## 実装済み Middleware

### 1. requirePlatformAdmin

```typescript
import { requirePlatformAdmin } from '@/lib/api/middleware/rbac';

app.delete('/admin/users/:id', requirePlatformAdmin, async (c) => {
  // platform_admin ロールが必要
});
```

### 2. requireGroupRole

```typescript
import { requireGroupRole } from '@/lib/api/middleware/rbac';

// グループリーダー権限が必要
app.patch('/groups/:groupId', requireGroupRole('leader'), async (c) => {
  // leader ロール以上が必要（階層的）
});

// サブリーダー権限が必要
app.patch('/groups/:groupId/members', requireGroupRole('sub_leader'), async (c) => {
  // sub_leader ロール以上が必要（leader も OK）
});
```

**階層チェック:**
- `leader` (3) > `sub_leader` (2) > `mediator` (1) > `member` (0)
- ユーザーが `leader` の場合、`sub_leader` 権限が必要な操作も可能

### 3. requireNationRole

```typescript
import { requireNationRole } from '@/lib/api/middleware/rbac';

// 国リーダー権限が必要
app.patch('/nations/:nationId', requireNationRole('leader'), async (c) => {
  // nation leader ロール以上が必要
});
```

**チェックロジック:**
1. ユーザーが属するグループを取得
2. そのグループが国に参加しているかチェック
3. 国内でのグループのロールを確認
4. 階層チェック（leader > sub_leader > mediator > member）

### 4. requireRelationship

```typescript
import { requireRelationship } from '@/lib/api/middleware/rbac';

// フレンド関係が必要
app.get('/users/:userId/posts', requireRelationship('friend'), async (c) => {
  // userId との friend 関係が必要
});
```

**注意点:**
- 関係は非対称（A → B の friend と B → A の friend は異なる）
- 自分自身への関係チェックは拒否

### 5. requireSelfOrAdmin

```typescript
import { requireSelfOrAdmin } from '@/lib/api/middleware/rbac';

// 自分自身または管理者のみアクセス可能
app.patch('/users/:userId', requireSelfOrAdmin(), async (c) => {
  // userId が自分自身、または platform_admin ならアクセス可能
});
```

## パラメータ名のカスタマイズ

デフォルトのパラメータ名と異なる場合は、第2引数で指定可能：

```typescript
// デフォルトは 'groupId'
app.patch('/groups/:groupId', requireGroupRole('leader'), async (c) => { ... });

// カスタムパ ラメータ名 'id' を使用
app.patch('/groups/:id', requireGroupRole('leader', 'id'), async (c) => { ... });
```

## エラーレスポンス

### 認証エラー (401 Unauthorized)

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

### 権限エラー (403 Forbidden)

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Group role 'leader' required",
    "details": {
      "requiredRole": "leader",
      "groupId": "group-123"
    }
  }
}
```

### パラメータエラー (400 Bad Request)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "groupId parameter is required"
  }
}
```

## パフォーマンス最適化

### 1. React cache() による同一リクエスト内キャッシュ

既存のRBACヘルパー関数は `React.cache()` を使用：

```typescript
// src/lib/auth/rbac-helper.ts
const _checkGroupRoleInternal = cache(
  async (userId, groupId, role) => {
    // DB クエリ
  }
);
```

**効果:**
- 同一リクエスト内で同じ権限チェックを複数回実行してもDBアクセスは1回のみ
- 例: `/api/groups/:groupId/members` で複数の操作が同じ権限をチェックする場合

### 2. platform_admin の早期リターン

```typescript
// platform_admin は全リソースへのアクセスが可能
if (session.user.role === 'platform_admin') return true;
```

DB クエリをスキップして即座に許可

## テスト戦略

### 1. Unit Test (middleware 単体)

```typescript
import { testClient } from 'hono/testing';
import { app } from '@/app/api/[[...route]]/route';

describe('RBAC Middleware', () => {
  it('requirePlatformAdmin - 非管理者で 403', async () => {
    const res = await testClient(app, {
      headers: { 'x-test-user-id': 'user-123', 'x-test-user-role': 'user' }
    }).admin.users.$get();

    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error.code).toBe('FORBIDDEN');
  });

  it('requireGroupRole - leader ロールで成功', async () => {
    // モックDB設定: user-123 は group-456 の leader
    const res = await testClient(app, {
      headers: { 'x-test-user-id': 'user-123' }
    }).groups[':groupId'].$patch({
      param: { groupId: 'group-456' },
      json: { name: 'Updated' }
    });

    expect(res.status).toBe(200);
  });
});
```

### 2. Integration Test（実際の DB を使用）

```typescript
describe('RBAC Integration', () => {
  beforeEach(async () => {
    // テストDB セットアップ
    await setupTestDatabase();
  });

  it('requireGroupRole - 階層的権限チェック', async () => {
    // leader ユーザーは sub_leader 権限が必要な操作も可能
    const res = await client.groups[':groupId'].members.$post({
      param: { groupId: testGroupId },
      json: { userId: 'new-member' }
    });

    expect(res.status).toBe(200);
  });
});
```

## セキュリティ考慮事項

### 1. Deny-by-default

明示的に許可されない限り拒否：

```typescript
// デフォルトは false
if (!hasRole) {
  throw createApiError('FORBIDDEN', ...);
}
```

### 2. 4層評価の順序

1. **platform_admin**: 全リソースへのアクセス許可
2. **Context role**: グループ/国ロールをチェック
3. **Relationship**: ユーザー間の関係をチェック
4. **Deny**: それ以外は拒否

### 3. セッション検証

- requireAuth middleware の後に配置（userId が Context に設定されている前提）
- セッションがない場合は 401 Unauthorized

### 4. パラメータ検証

```typescript
if (!groupId) {
  throw createApiError('VALIDATION_ERROR', 'groupId parameter is required');
}
```

## 既存ヘルパー関数との互換性

### 既存の Server Actions

```typescript
// Server Actions（既存）
export async function updateGroup(groupId: string, data: UpdateGroupInput) {
  const session = await auth.api.getSession({ headers: headers() });

  // 既存のヘルパー関数を使用
  const hasRole = await checkGroupRole(session, groupId, 'leader');
  if (!hasRole) throw new Error('Unauthorized');

  // ...
}
```

### Hono middleware（新規）

```typescript
// Hono middleware（新規）
app.patch('/groups/:groupId', requireGroupRole('leader'), async (c) => {
  // 同じロジック、異なるインターフェース
  // 既存のヘルパー関数を内部で呼び出し
});
```

**統一性:**
- 両方とも `checkGroupRole()` を使用
- ロジックは完全に同一
- テストも共有可能

## 将来の拡張

### 1. 複合権限チェック

```typescript
export function requireAnyOf(...middlewares: MiddlewareHandler[]): MiddlewareHandler {
  return async (c, next) => {
    for (const middleware of middlewares) {
      try {
        await middleware(c, async () => {});
        return await next(); // 1つでも成功したら次へ
      } catch (err) {
        // 失敗したら次の middleware を試す
      }
    }
    throw createApiError('FORBIDDEN', 'No sufficient permissions');
  };
}

// 使用例: リーダーまたは管理者のみ
app.patch('/groups/:groupId',
  requireAnyOf(
    requireGroupRole('leader'),
    requirePlatformAdmin
  ),
  async (c) => { ... }
);
```

### 2. カスタム権限チェック

```typescript
export function requireCustom(
  check: (c: Context) => Promise<boolean>,
  errorMessage: string
): MiddlewareHandler {
  return async (c, next) => {
    const result = await check(c);
    if (!result) {
      throw createApiError('FORBIDDEN', errorMessage);
    }
    await next();
  };
}

// 使用例: カスタムビジネスロジック
app.patch('/posts/:postId',
  requireCustom(
    async (c) => {
      const postId = c.req.param('postId');
      const userId = c.get('userId');
      return await isPostOwner(userId, postId);
    },
    'Only post owner can edit'
  ),
  async (c) => { ... }
);
```

## 関連ドキュメント

- [エラーレスポンス仕様](.agent/decisions/error-response-spec.md)
- [Better Auth 共存方法](.agent/decisions/better-auth-pattern.md)
- [RPC Client パターン](.agent/decisions/rpc-client-pattern.md)
- [既存 RBAC ヘルパー関数](../../../src/lib/auth/rbac-helper.ts)

## 変更履歴

- 2026-03-01: 初版作成、実装完了
