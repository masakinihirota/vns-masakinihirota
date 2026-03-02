# Hono API Implementation Skill

## 目的

このスキルは、プロジェクト内のすべてのAPI実装でHonoフレームワークの使用を強制し、一貫性のある型安全なAPIを構築するためのガイドラインを提供します。

## 背景

このプロジェクトでは、Phase 0-2でHonoインフラを完全構築済みです：

- ✅ Honoメインルーター（115行）
- ✅ 8つのMiddleware（auth, rbac, error, validation等）
- ✅ Admin API完全実装（906行）
- ✅ RPC Clientセットアップ
- ✅ テスト環境（vitest + hono/testing）

今後のAPI実装（Phase 3-5）でも、この既存インフラを活用して一貫した実装を行います。

## 主要ルール

### ✅ 必須事項

1. **Honoフレームワークを使用**
   - すべてのAPIは`src/lib/api/routes/`配下にHonoルーターとして実装
   - `src/app/api/[[...route]]/route.ts`にルート登録

2. **統一エラーフォーマット**
   - `ApiErrorResponse`/`ApiSuccessResponse`型を使用
   - `.agent/decisions/error-response-spec.md`に準拠

3. **RBAC Middleware適用**
   - 権限チェックは`requirePlatformAdmin`, `requireGroupRole`等を使用
   - `.agent/decisions/rbac-middleware-strategy.md`に準拠

4. **Zodバリデーション**
   - `@hono/zod-validator`でリクエストボディを検証
   - スキーマは`src/lib/api/schemas/`に配置

5. **RPC Client型安全性**
   - `AppType`を型エクスポート
   - クライアント側で完全な型推論を実現

6. **セキュリティ対策**
   - CSRF保護（POST/PATCH/DELETE）
   - レート制限（重要なエンドポイント）
   - Better Authセッション検証

### ❌ 禁止事項

1. **Next.js Route Handlerの直接使用**
   ```typescript
   // ❌ 禁止
   // src/app/api/my-endpoint/route.ts
   export async function GET(request: Request) { ... }
   ```

2. **Server ActionsでのREST API的使用**
   ```typescript
   // ❌ 禁止
   'use server';
   export async function getItems() { ... }
   ```

3. **手動エラーハンドリング**
   - Middlewareに任せる
   - `throw error`で統一

## 実装フロー

```
1. Zodスキーマ定義
   ↓
2. サービス層実装
   ↓
3. Honoルート実装
   ↓
4. ルーター登録
   ↓
5. テスト実装
```

## ファイル構成

```
src/
├── app/api/[[...route]]/route.ts    # Honoメインルーター
├── lib/api/
│   ├── middleware/                   # Middleware（8個実装済み）
│   ├── routes/                       # APIルート
│   │   ├── admin.ts                 # Admin API（906行、参考実装）
│   │   ├── users.ts                 # User API（部分実装）
│   │   └── [your-feature].ts        # 新規実装
│   ├── schemas/                      # Zodスキーマ
│   ├── services/                     # ビジネスロジック
│   ├── types/                        # 型定義
│   └── client.ts                     # RPC Client
└── __tests__/api/                    # APIテスト
```

## 使用例

### 最小限の実装

```typescript
// src/lib/api/routes/hello.ts
import { Hono } from 'hono';

const hello = new Hono();

hello.get('/', (c) => {
  return c.json({ success: true, data: { message: 'Hello' } });
});

export default hello;
```

### 完全な実装

詳細は`SKILL.md`の「実装手順」セクションを参照。

## 参考実装

1. **Admin API** (`src/lib/api/routes/admin.ts`, 906行)
   - User/Group/Nation CRUD完全実装
   - すべてのベストプラクティスを網羅

2. **PoC** (`src/lib/api/routes/poc.ts`, 181行)
   - RPC Client型推論の検証コード
   - エラーハンドリングのサンプル

3. **Users API** (`src/lib/api/routes/users.ts`, 65行)
   - シンプルなGET /me実装
   - 最小限の構成例

## テスト

```typescript
// src/__tests__/api/my-feature.test.ts
import { describe, it, expect } from 'vitest';
import { testClient } from 'hono/testing';
import { app } from '@/app/api/[[...route]]/route';

describe('My Feature API', () => {
  it('GET /api/my-feature - success', async () => {
    const res = await testClient(app)['my-feature'].$get();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });
});
```

## チェックリスト

新規API実装時：

- [ ] `src/lib/api/routes/`にHonoルーター作成
- [ ] Zodスキーマ定義（`src/lib/api/schemas/`）
- [ ] サービス層実装（`src/lib/api/services/`）
- [ ] RBAC middleware適用
- [ ] Zodバリデーション実装
- [ ] エラーレスポンス形式準拠
- [ ] CSRF保護適用（POST/PATCH/DELETE）
- [ ] レート制限設定
- [ ] `route.ts`にルート登録
- [ ] RPC Client型が利用可能か確認
- [ ] テスト実装（`src/__tests__/api/`）
- [ ] JSDOCでAPI仕様記載

## 関連ドキュメント

### 決定事項

- `.agent/decisions/node-runtime.md`
- `.agent/decisions/better-auth-pattern.md`
- `.agent/decisions/rpc-client-pattern.md`
- `.agent/decisions/error-response-spec.md`
- `.agent/decisions/rbac-middleware-strategy.md`
- `.agent/decisions/test-strategy.md`

### マスタープラン

- `schedule_todo_list/2026-03-01_HONO_MASTER_PLAN.md`

## 更新履歴

- **2026-03-02**: 初版作成（Phase 0-2完了後）
