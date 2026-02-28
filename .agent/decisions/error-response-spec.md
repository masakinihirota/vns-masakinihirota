# エラーレスポンス仕様

**作成日:** 2026-03-01
**ステータス:** ✅ 決定済み

## 概要

Hono API のエラーレスポンスフォーマットを統一し、クライアント側での型安全なエラーハンドリングを可能にします。

## レスポンス型定義

### 成功レスポンス

```typescript
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}
```

### エラーレスポンス

```typescript
interface ApiErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, any>;
  };
}

type ErrorCode =
  | 'VALIDATION_ERROR'        // 400: リクエストデータのバリデーションエラー
  | 'UNAUTHORIZED'            // 401: 認証が必要
  | 'FORBIDDEN'               // 403: 権限不足
  | 'NOT_FOUND'               // 404: リソースが見つからない
  | 'CONFLICT'                // 409: リソースの競合（例: 既に存在する）
  | 'INTERNAL_ERROR';         // 500: サーバー内部エラー
```

### Union型（型推論用）

```typescript
type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```

## 使用例

### サーバー側（Hono）

```typescript
// 成功レスポンス
app.get('/users/:id', async (c) => {
  const user = await getUserById(c.req.param('id'));
  return c.json({
    success: true,
    data: user
  } as ApiSuccessResponse<User>);
});

// エラーレスポンス - 認証エラー
app.get('/admin/users', async (c) => {
  const session = c.get('session');
  if (!session) {
    return c.json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      }
    } as ApiErrorResponse, 401);
  }
  // ...
});

// エラーレスポンス - 権限エラー
app.delete('/admin/users/:id', async (c) => {
  const hasPermission = await checkSystemRole(session, 'admin');
  if (!hasPermission) {
    return c.json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Admin role required',
        details: { requiredRole: 'admin' }
      }
    } as ApiErrorResponse, 403);
  }
  // ...
});

// エラーレスポンス - バリデーションエラー
app.post('/users', async (c) => {
  const body = await c.req.json();
  const validation = userSchema.safeParse(body);
  if (!validation.success) {
    return c.json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: validation.error.flatten()
      }
    } as ApiErrorResponse, 400);
  }
  // ...
});
```

### クライアント側（RPC Client）

```typescript
import { client } from '@/lib/api/client';

// 型推論が効く
const res = await client.users[':id'].$get({ param: { id: '123' } });
const data = await res.json();

if (data.success) {
  // ✅ data.data は User 型として推論される
  console.log(data.data.name);
} else {
  // ✅ data.error は ErrorResponse 型として推論される
  console.error(data.error.code, data.error.message);

  if (data.error.code === 'UNAUTHORIZED') {
    // 認証が必要 → ログイン画面へリダイレクト
    router.push('/signin');
  } else if (data.error.code === 'FORBIDDEN') {
    // 権限不足 → エラーメッセージ表示
    toast.error(data.error.message);
  }
}
```

## Error Handler Middleware

すべてのエラーを統一フォーマットでキャッチする middleware を実装：

```typescript
import type { ErrorHandler } from 'hono';

export const errorHandler: ErrorHandler = (err, c) => {
  console.error('[API Error]', err);

  // Zod バリデーションエラー
  if (err.name === 'ZodError') {
    return c.json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: err.flatten?.() || {}
      }
    } as ApiErrorResponse, 400);
  }

  // デフォルトエラー
  return c.json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : err.message
    }
  } as ApiErrorResponse, 500);
};
```

## HTTPステータスコードマッピング

| ErrorCode | HTTPステータス | 用途 |
|-----------|--------------|------|
| `VALIDATION_ERROR` | 400 | リクエストデータが不正 |
| `UNAUTHORIZED` | 401 | 認証が必要 |
| `FORBIDDEN` | 403 | 権限不足 |
| `NOT_FOUND` | 404 | リソースが見つからない |
| `CONFLICT` | 409 | リソースの競合 |
| `INTERNAL_ERROR` | 500 | サーバー内部エラー |

## セキュリティ考慮事項

### 1. エラーメッセージの内容

- ✅ **本番環境**: エラーの詳細を隠す（攻撃者に情報を与えない）
- ✅ **開発環境**: 詳細なエラーメッセージを表示（デバッグ用）

```typescript
error: {
  code: 'INTERNAL_ERROR',
  message: process.env.NODE_ENV === 'production'
    ? 'An unexpected error occurred'
    : err.message  // 開発環境のみ詳細表示
}
```

### 2. details フィールドの使用

- ✅ クライアントが必要とする最小限の情報のみ含める
- ❌ データベースのクエリ内容、スタックトレース、内部IDなどは含めない

```typescript
// ✅ Good
details: {
  requiredRole: 'admin',
  resourceType: 'user'
}

// ❌ Bad
details: {
  query: 'SELECT * FROM users WHERE id = ...',
  stackTrace: err.stack,
  internalUserId: 'db-uuid-...'
}
```

## 型定義ファイル配置

```
src/lib/api/
├── types/
│   ├── response.ts       # ApiResponse型定義
│   └── index.ts          # エクスポート
└── middleware/
    └── error-handler.ts  # Error Handler実装
```

## RPC Client での型推論

Hono RPC Client は自動的に型を推論するため、クライアント側で追加の型定義は不要：

```typescript
// サーバー側の定義から自動推論される
const res = await client.users[':id'].$get({ param: { id: '123' } });
const data = await res.json();

// data の型は自動的に ApiResponse<User> として推論される
if (data.success) {
  data.data.name;  // ✅ 型安全
} else {
  data.error.code;  // ✅ 型安全
}
```

## 関連ドキュメント

- [RPC Client パターン](.agent/decisions/rpc-client-pattern.md)
- [Better Auth 共存方法](.agent/decisions/better-auth-pattern.md)
- [RBAC Middleware 戦略](.agent/decisions/rbac-middleware-strategy.md)

## 変更履歴

- 2026-03-01: 初版作成
