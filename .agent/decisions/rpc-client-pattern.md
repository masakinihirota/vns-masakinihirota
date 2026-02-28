# RPC Client 選択：Hono RPC Client 採用決定

**決定日:** 2026-03-01  
**ステータス:** ✅ 確定  
**関連ドキュメント:** `schedule_todo_list/2026-03-01_RPC_CLIENT_OPTIONS.md`

---

## 📋 決定内容

**採用:** **Option A - Hono RPC Client（公式）** ⭐⭐⭐⭐⭐

**理由:**
1. **完全な型安全性**: サーバー定義から自動推論、型不一致時にコンパイルエラー
2. **公式サポート**: Hono エコシステムの標準パターン
3. **ゼロ設定**: 追加の設定ファイル不要、実装コスト最小（0.5-1h）
4. **メンテナンスフリー**: エンドポイント追加時、クライアントコード変更不要
5. **IDE サポート**: VSCode で完璧な自動完成・型ヒント

---

## 🏗️ アーキテクチャ決定

### サーバー側実装

```typescript
// src/app/api/[[...route]]/route.ts
import { Hono } from 'hono';
import { handle } from 'hono/vercel';

export const runtime = 'node';

const app = new Hono().basePath('/api');

// エンドポイント定義
app.get('/users/:id', (c) => {
  const id = c.req.param('id');
  return c.json({ id, name: `User ${id}` });
});

app.post('/groups', async (c) => {
  const body = await c.req.json<{ name: string; description?: string }>();
  // ... ロジック ...
  return c.json({ success: true, data: body });
});

// ✅ 型エクスポート（クライアント用）
export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
export const PUT = handle(app);
```

### クライアント側実装

```typescript
// src/lib/api/client.ts
import { hc } from 'hono/client';
import type { AppType } from '@/app/api/[[...route]]/route';

// ✅ 型安全なクライアントインスタンス生成
export const client = hc<AppType>('/api');

// 使用例
export async function getUser(id: string) {
  const res = await client.users[':id'].$get({ param: { id } });
  if (!res.ok) throw new Error('Failed to fetch user');
  return await res.json(); // { id: string, name: string } 型推論！
}

export async function createGroup(data: { name: string; description?: string }) {
  const res = await client.groups.$post({ json: data });
  if (!res.ok) throw new Error('Failed to create group');
  return await res.json(); // { success: boolean, data: {...} } 型推論！
}
```

### React コンポーネントでの使用

```typescript
// src/components/admin/user-panel.tsx
'use client';

import { client } from '@/lib/api/client';
import { useEffect, useState } from 'react';

export function UserPanel() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    client.admin.users.$get({ query: { limit: 10 } })
      .then(res => res.json())
      .then(data => setUsers(data.users));
  }, []);

  const handleDelete = async (id: string) => {
    await client.admin.users[':id'].$delete({ param: { id } });
    // ... 再取得 ...
  };

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          {user.name}
          <button onClick={() => handleDelete(user.id)}>削除</button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🚫 却下された選択肢

### ❌ Option B: 手動 fetch + Zod スキーマ検証

**却下理由:**
- 型推論なし（エンドポイント追加時に手動更新が必要）
- 重複定義（サーバーとクライアントで二重管理）
- メンテナンス困難（URL パス変更時に手動修正）
- IDE サポート限定（自動完成が効かない）

### ❌ Option C: tRPC への移行

**却下理由:**
- Hono 廃止（本タスクの目的と矛盾）
- 大規模リファクタリング（20-30h の追加作業）
- Better Auth 互換性の再調査が必要

### △ Option D: OpenAPI 生成 + Orval

**保留理由:**
- 現時点では不要（内部使用のみ）
- 将来的に外部 API 公開の要件が発生した場合のみ検討

---

## 🧪 Phase 0 PoC 完了基準

以下すべてを満たすことで Option A 採用を確定：

### タスク 1: 基本的な型推論確認（20分）

```typescript
// PoC エンドポイント作成
const pocApp = new Hono().basePath('/api/poc');
pocApp.get('/test', (c) => c.json({ message: 'Hello' }));
pocApp.post('/echo', async (c) => {
  const body = await c.req.json<{ text: string }>();
  return c.json({ echo: body.text });
});
export type PocAppType = typeof pocApp;
```

```typescript
// PoC クライアントテスト
import { hc } from 'hono/client';
import type { PocAppType } from '@/app/api/[[...route]]/poc';

const client = hc<PocAppType>('/api/poc');
const res = await client.test.$get();
const data = await res.json(); // { message: string } 型推論確認
```

**期待結果:**
- ✅ VSCode で `data.message` の自動完成が動作
- ✅ `data.invalidProperty` にアクセスすると型エラー

### タスク 2: パラメータ型推論確認（15分）

```typescript
// Path parameter & Query parameter
pocApp.get('/users/:id', (c) => {
  const id = c.req.param('id');
  return c.json({ id, name: `User ${id}` });
});

pocApp.get('/search', (c) => {
  const q = c.req.query('q') || '';
  return c.json({ results: [q] });
});
```

```typescript
// クライアント側
const userRes = await client.users[':id'].$get({ param: { id: '123' } });
const searchRes = await client.search.$get({ query: { q: 'Hono' } });
```

**期待結果:**
- ✅ `param: { id: string }` が型推論される
- ✅ `query: { q?: string }` が型推論される

### タスク 3: エラーハンドリング確認（15分）

```typescript
pocApp.get('/error', (c) => c.json({ error: 'Test error' }, 500));
pocApp.get('/notfound', (c) => c.json({ error: 'Not found' }, 404));
```

```typescript
const errorRes = await client.error.$get();
expect(errorRes.status).toBe(500);
const errorData = await errorRes.json();
expect(errorData.error).toBe('Test error');
```

**期待結果:**
- ✅ ステータスコードが正しく取得できる
- ✅ エラーレスポンスも型推論される

### タスク 4: Next.js 統合確認（10分）

```typescript
// src/app/poc-client/page.tsx
'use client';

import { hc } from 'hono/client';
import type { PocAppType } from '@/app/api/[[...route]]/poc';
import { useEffect, useState } from 'react';

export default function PocClientPage() {
  const [data, setData] = useState<{ message: string } | null>(null);
  
  useEffect(() => {
    const client = hc<PocAppType>('/api/poc');
    client.test.$get().then(res => res.json()).then(setData);
  }, []);
  
  return <div>{data?.message || 'Loading...'}</div>;
}
```

**期待結果:**
- ✅ `pnpm build` が成功（型エラーなし）
- ✅ ブラウザで "Hello" が表示される
- ✅ Network タブで `/api/poc/test` へのリクエストが成功

---

## 📊 実装チェックリスト

### Phase 0-3: RPC Client PoC（1h）

- [ ] **タスク 1**: 基本的な型推論確認（20分）
  - [ ] PoC エンドポイント作成（GET, POST）
  - [ ] クライアント側で型推論確認
  - [ ] VSCode 自動完成確認
  
- [ ] **タスク 2**: パラメータ型推論確認（15分）
  - [ ] Path parameter エンドポイント作成
  - [ ] Query parameter エンドポイント作成
  - [ ] クライアント側で型推論確認
  
- [ ] **タスク 3**: エラーハンドリング確認（15分）
  - [ ] エラーエンドポイント作成（500, 404）
  - [ ] クライアント側でステータスコード取得確認
  - [ ] エラーレスポンスの型推論確認
  
- [ ] **タスク 4**: Next.js 統合確認（10分）
  - [ ] PoC ページ作成
  - [ ] `pnpm build` 成功確認
  - [ ] ブラウザで動作確認

### Phase 1: 本番実装（実装開始後）

- [ ] **Hono インストール**
  ```bash
  pnpm add hono
  ```

- [ ] **メインエンドポイント作成**
  ```typescript
  // src/app/api/[[...route]]/route.ts
  export const runtime = 'node';
  const app = new Hono().basePath('/api');
  // ... ルート定義 ...
  export type AppType = typeof app;
  ```

- [ ] **クライアント作成**
  ```typescript
  // src/lib/api/client.ts
  import { hc } from 'hono/client';
  import type { AppType } from '@/app/api/[[...route]]/route';
  export const client = hc<AppType>('/api');
  ```

- [ ] **既存 UI コンポーネント更新**
  - [ ] AdminGroupPanel → RPC クライアント使用
  - [ ] UserPanel → RPC クライアント使用
  - [ ] NationPanel → RPC クライアント使用

---

## 🔒 ベストプラクティス

### 1. 型エクスポートの分離

```typescript
// ❌ 悪い例：サーバーコードがクライアントに混入
export type AppType = typeof app;
export const db = drizzle(...); // ← これがクライアントに送られる危険性

// ✅ 良い例：型のみエクスポート
export type AppType = typeof app;
// db は別ファイルで管理
```

### 2. エラーハンドリングの統一

```typescript
// src/lib/api/client.ts
export async function apiCall<T>(fn: () => Promise<Response>): Promise<T> {
  try {
    const res = await fn();
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'API Error');
    }
    return await res.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// 使用例
const user = await apiCall(() => client.users[':id'].$get({ param: { id: '123' } }));
```

### 3. 認証トークンの自動付与

```typescript
// src/lib/api/client.ts
import { hc } from 'hono/client';
import type { AppType } from '@/app/api/[[...route]]/route';

export const createClient = () => {
  return hc<AppType>('/api', {
    headers: async () => {
      // Better Auth のセッショントークンは Cookie で自動送信されるため不要
      return {};
    },
  });
};

export const client = createClient();
```

---

## 📚 参考資料

### Hono RPC Client ドキュメント

- [Hono: RPC Client](https://hono.dev/docs/guides/rpc)
- [Hono: Type Safe Routes](https://hono.dev/docs/guides/best-practices#type-safe)

### 実装例

```typescript
// サーバー側のルート定義
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const createGroupSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

app.post('/groups', zValidator('json', createGroupSchema), async (c) => {
  const data = c.req.valid('json');
  // ... DB 処理 ...
  return c.json({ success: true, data });
});

// クライアント側
const result = await client.groups.$post({
  json: { name: 'New Group', description: 'Test' }
});
// result は { success: boolean, data: {...} } として型推論される
```

---

## 🎯 成功基準

以下すべてを満たすことで RPC Client 採用を完了：

- [x] **決定記録**: 本ドキュメントを作成 ✅
- [ ] **PoC 完了**: Phase 0-3 の4タスクすべて成功
- [ ] **ビルド成功**: `pnpm build` がエラーなく完了
- [ ] **型推論確認**: VSCode で自動完成が動作
- [ ] **実装完了**: 最初のエンドポイント（Admin API）が RPC Client で動作

---

## 📝 変更履歴

| 日付 | 変更内容 | 担当 |
|------|---------|------|
| 2026-03-01 | Hono RPC Client 採用決定、ドキュメント作成 | GitHub Copilot |

---

**承認者:** ユーザー決定（2026-03-01）  
**実装担当:** GitHub Copilot  
**レビュー状態:** ✅ 承認済み

---

## 💡 補足：なぜ Hono RPC Client が最適か

### 他のソリューションとの比較

| 特徴 | Hono RPC | 手動 fetch | tRPC | OpenAPI |
|------|----------|------------|------|---------|
| **型安全性** | ✅ 完璧 | △ 部分的 | ✅ 完璧 | ✅ 良好 |
| **自動完成** | ✅ 完璧 | ❌ なし | ✅ 完璧 | ✅ 良好 |
| **設定コスト** | ✅ ゼロ | ✅ 不要 | ⚠️ 高 | △ 中 |
| **実装時間** | ✅ 0.5-1h | △ 2-3h | ❌ 20-30h | △ 3-5h |
| **メンテナンス** | ✅ 自動 | ❌ 手動 | ✅ 自動 | ✅ 自動 |
| **Hono 統合** | ✅ ネイティブ | ✅ 可能 | ❌ 不可 | ✅ 可能 |

### 開発体験（DX）の観点

```typescript
// ✅ Hono RPC Client - IDE が完全サポート
const user = await client.users[':id'].$get({ param: { id } });
//                          ↑ 自動完成       ↑ 型推論
//                          users, groups, nations などが候補表示

// ❌ 手動 fetch - IDE サポートなし
const user = await fetch(`/api/users/${id}`).then(r => r.json());
//                       ↑ タイポの可能性   ↑ 型がany
```

### 型安全性の実例

```typescript
// サーバー側で定義
app.get('/users/:id', (c) => c.json({ id: '123', name: 'John' }));

// クライアント側
const res = await client.users[':id'].$get({ param: { id: '123' } });
const data = await res.json();

// ✅ OK
console.log(data.name); // "John"

// ❌ コンパイルエラー！
console.log(data.email); // Property 'email' does not exist on type '{ id: string; name: string; }'
```

この型安全性により、API 仕様変更時のバグを**コンパイル時に100%検出**できます。
