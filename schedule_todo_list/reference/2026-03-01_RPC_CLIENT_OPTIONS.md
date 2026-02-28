# RPC Client ジェネレーション選択肢分析

**作成日:** 2026-03-01
**ステータス:** 選択肢分析完了
**関連:** `2026-03-01_HONO_INTEGRATION_TODO.md`

---

## 📋 問題定義

**現状の課題:**
- Hono のエンドポイントとフロントエンドの型安全な連携方法が未確定
- ジェネレーション方法が「仮説段階」で、実際に動作するか未検証
- PoC（事前検証）なしで実装を進めると、フェーズ H（Client 統合）で致命的な問題発覚のリスク

**要求事項:**
- フロントエンドから型安全に API を呼び出し可能
- 自動完成（IDE サポート）が動作
- Request/Response の型がエンドポイント定義から自動推論
- メンテナンス性が高い

---

## 🎯 選択肢一覧

### オプション A: Hono RPC Client（公式） ⭐⭐⭐⭐⭐（推奨）

**概要:**
Hono 公式の `hono/client` パッケージを使用し、サーバー側の型定義からクライアントを自動生成。

**実装例:**

```typescript
// src/app/api/[[...route]]/route.ts
import { Hono } from 'hono';
import { handle } from 'hono/vercel';

export const runtime = 'node';

const app = new Hono().basePath('/api');

app.get('/users/:id', (c) => {
  const id = c.req.param('id');
  return c.json({ id, name: 'John' });
});

app.post('/groups', async (c) => {
  const body = await c.req.json();
  return c.json({ success: true, data: body });
});

export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
```

```typescript
// src/lib/api/client.ts
import { hc } from 'hono/client';
import type { AppType } from '@/app/api/[[...route]]/route';

export const client = hc<AppType>('/api');

// 使用例
const res = await client.users[':id'].$get({ param: { id: '123' } });
const data = await res.json(); // { id: string, name: string } 型推論される
```

**メリット:**
- ✅ **公式サポート**: Hono エコシステムの標準パターン
- ✅ **完全な型安全**: サーバー定義から自動推論、型不一致時にコンパイルエラー
- ✅ **ゼロ設定**: 追加の設定ファイル不要
- ✅ **IDE サポート**: VSCode で完璧な自動完成・型ヒント
- ✅ **メンテナンスフリー**: エンドポイント追加時、クライアントコード変更不要
- ✅ **実績豊富**: Hono 公式ドキュメントで推奨、多数の導入事例

**デメリット:**
- ⚠️ **学習コスト**: 独自の API 記法（`$get`, `$post`, `param`, `query`）
- ⚠️ **Next.js 統合の注意点**: `AppType` エクスポート時、サーバー専用コードの混入防止が必要

**実装コスト:** **0.5-1h**（PoC 作成 + 動作確認）

**PoC 必須項目:**
1. ✅ `AppType` エクスポートが Next.js でエラーにならないか確認
2. ✅ クライアント側で型推論が動作するか確認
3. ✅ パラメータ（param, query, body）の型推論確認
4. ✅ エラーハンドリング（404, 500）の型安全性確認

**推奨度:** ⭐⭐⭐⭐⭐ **100%**
**理由:** Hono の標準パターンで、最も実績があり、型安全性とメンテナンス性が最高。

---

### オプション B: 手動 fetch + Zod スキーマ検証 ⭐⭐（条件付き可）

**概要:**
通常の `fetch` API を使用し、Zod スキーマで Response を検証。

**実装例:**

```typescript
// src/lib/api/schemas.ts
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export type User = z.infer<typeof UserSchema>;
```

```typescript
// src/lib/api/client.ts
import { UserSchema } from './schemas';

export async function getUser(id: string) {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  const json = await res.json();
  return UserSchema.parse(json); // ランタイム検証
}
```

**メリット:**
- ✅ **シンプル**: 標準的な fetch API、学習コスト低い
- ✅ **ランタイム検証**: Zod で Response の型安全性を保証
- ✅ **柔軟性**: カスタムエラーハンドリング、リトライロジック追加可能

**デメリット:**
- ❌ **型推論なし**: エンドポイント追加時、クライアントコードを手動更新
- ❌ **重複定義**: Request/Response スキーマをサーバーとクライアントで二重管理
- ❌ **メンテナンス困難**: URL パス、パラメータ名の変更時に手動修正が必要
- ❌ **型不一致リスク**: サーバーとクライアントのスキーマ不一致が発生しやすい
- ❌ **IDE サポート限定**: 自動完成が効かない

**実装コスト:** **2-3h**（各エンドポイント用のクライアント関数作成）

**推奨度:** ⭐⭐ **30%**
**理由:** 型安全性が低く、メンテナンスコストが高い。プロトタイピングには有効だが本番採用は非推奨。

---

### オプション C: tRPC への移行 ⭐（非推奨）

**概要:**
Hono を諦め、tRPC に完全移行。

**実装例:**

```typescript
// src/server/trpc/router.ts
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const appRouter = t.router({
  getUser: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return { id: input.id, name: 'John' };
    }),
});

export type AppRouter = typeof appRouter;
```

```typescript
// src/lib/api/client.ts
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/trpc/router';

export const trpc = createTRPCReact<AppRouter>();

// 使用例
const { data } = trpc.getUser.useQuery({ id: '123' });
```

**メリット:**
- ✅ **最高の型安全性**: tRPC は型推論のゴールドスタンダード
- ✅ **React Query 統合**: キャッシング、リトライ、楽観的更新が標準装備
- ✅ **バリデーション統合**: Zod スキーマが Input/Output 両方に適用

**デメリット:**
- ❌ **Hono 廃止**: 本タスクの目的（Hono 統一）と矛盾
- ❌ **大規模リファクタリング**: 既存の Server Actions、Better Auth との統合を再設計
- ❌ **実装コスト大**: 20-30h 以上の追加作業
- ❌ **Better Auth 互換性**: tRPC の認証パターンと Better Auth の統合に追加調査が必要
- ❌ **学習コスト**: チーム全体が tRPC パターンを習得する必要

**実装コスト:** **20-30h**（全面リファクタリング）

**推奨度:** ⭐ **10%**
**理由:** 本タスクの目的（Hono 統一）と根本的に矛盾。新規プロジェクトなら検討価値あり。

---

### オプション D: OpenAPI 生成 + Orval/OpenAPI Generator ⭐⭐⭐（条件付き推奨）

**概要:**
Hono から OpenAPI スキーマを生成し、クライアントコード自動生成ツール（Orval, OpenAPI Generator）を使用。

**実装例:**

```typescript
// src/app/api/[[...route]]/route.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { swaggerUI } from '@hono/swagger-ui';
import { openAPISpecs } from 'hono-openapi';

const app = new Hono().basePath('/api');

app.get(
  '/users/:id',
  zValidator('param', z.object({ id: z.string() })),
  (c) => {
    return c.json({ id: c.req.valid('param').id, name: 'John' });
  }
);

// OpenAPI ドキュメント生成
app.get('/swagger', swaggerUI({ url: '/api/openapi.json' }));
```

```bash
# orval.config.ts
module.exports = {
  api: {
    input: 'http://localhost:3000/api/openapi.json',
    output: {
      mode: 'tags-split',
      target: 'src/lib/api/generated.ts',
      client: 'react-query',
    },
  },
};

# クライアント生成
pnpm orval
```

**メリット:**
- ✅ **業界標準**: OpenAPI は REST API のデファクトスタンダード
- ✅ **外部連携容易**: Swagger UI で API ドキュメント公開可能
- ✅ **多様なクライアント**: React Query, Axios, fetch など選択可能
- ✅ **バリデーション統合**: Zod スキーマから OpenAPI スキーマ生成可能

**デメリット:**
- ⚠️ **設定複雑**: Hono → OpenAPI 変換の設定が必要
- ⚠️ **ビルドステップ追加**: `pnpm generate:api` などの手動実行が必要
- ⚠️ **生成コードの管理**: Git に含めるか、.gitignore するか要検討
- ⚠️ **Hono の型推論活用不可**: OpenAPI 経由で一度変換されるため、Hono ネイティブの型推論が失われる
- ⚠️ **Zod Validator 依存**: すべてのエンドポイントで `zValidator` 使用が必須

**実装コスト:** **3-5h**（OpenAPI 生成設定 + Orval 設定 + 動作確認）

**推奨度:** ⭐⭐⭐ **60%**
**理由:** 外部 API 公開の予定がある場合は有効。内部使用のみなら Option A（Hono RPC）が優位。

---

## 📊 比較表

| 項目 | Hono RPC | 手動 fetch | tRPC | OpenAPI 生成 |
|------|----------|------------|------|-------------|
| **型安全性** | ✅ 完璧 | △ 部分的 | ✅ 完璧 | ✅ 良好 |
| **自動完成** | ✅ 完璧 | ❌ なし | ✅ 完璧 | ✅ 良好 |
| **メンテナンス性** | ✅ 自動 | ❌ 手動 | ✅ 自動 | ✅ 自動 |
| **実装コスト** | ✅ 0.5-1h | △ 2-3h | ❌ 20-30h | △ 3-5h |
| **学習コスト** | △ 中 | ✅ 低 | ⚠️ 高 | △ 中 |
| **Hono 統合** | ✅ ネイティブ | ✅ 可能 | ❌ 不可 | ✅ 可能 |
| **外部公開** | ❌ 不向き | △ 可能 | ❌ 不向き | ✅ 最適 |
| **推奨度** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐⭐⭐ |

---

## 🎯 結論

**推奨: オプション A（Hono RPC Client）を採用** ⭐⭐⭐⭐⭐

### 理由

1. **Hono ネイティブ統合**: 本タスクの目的（Hono 統一）と完全一致
2. **型安全性**: エンドポイント定義から完全自動推論、型不一致時にコンパイルエラー
3. **実装コスト最小**: PoC 含めて 1h 以内で完了
4. **メンテナンスフリー**: エンドポイント追加/変更時、クライアントコード変更不要
5. **公式推奨**: Hono ドキュメントで明示的に推奨されている標準パターン

### サブ推奨: オプション D（OpenAPI 生成）

将来的に以下の要件が発生した場合のみ検討：
- 🌐 **外部 API 公開**: サードパーティ連携、パートナー向け API 提供
- 📚 **API ドキュメント要件**: Swagger UI で公開ドキュメント必須
- 🔧 **マルチクライアント**: Web 以外（Mobile, CLI）からのアクセス

**現時点では内部使用のみのため、Option A（Hono RPC）で十分です。**

---

## 📝 Phase 0 PoC チェックリスト（Option A 採用時）

**目的:** Hono RPC Client が本プロジェクトで正常動作することを事前検証

### タスク 1: 基本的な型推論確認（20分）

```typescript
// src/app/api/[[...route]]/poc.ts
import { Hono } from 'hono';

const pocApp = new Hono().basePath('/api/poc');

pocApp.get('/test', (c) => {
  return c.json({ message: 'Hello from PoC', timestamp: Date.now() });
});

pocApp.post('/echo', async (c) => {
  const body = await c.req.json<{ text: string }>();
  return c.json({ echo: body.text });
});

export type PocAppType = typeof pocApp;
```

```typescript
// src/__tests__/poc-rpc-client.test.ts
import { hc } from 'hono/client';
import type { PocAppType } from '@/app/api/[[...route]]/poc';

test('Hono RPC Client 型推論確認', async () => {
  const client = hc<PocAppType>('/api/poc');

  // GET リクエスト
  const res = await client.test.$get();
  const data = await res.json();

  // 型推論確認（コンパイルエラーが出なければ成功）
  expect(data.message).toBe('Hello from PoC');
  expect(typeof data.timestamp).toBe('number');

  // POST リクエスト
  const echoRes = await client.echo.$post({
    json: { text: 'test' }
  });
  const echoData = await echoRes.json();
  expect(echoData.echo).toBe('test');
});
```

**期待結果:**
- ✅ VSCode で `data.message` の自動完成が動作
- ✅ `data.invalidProperty` にアクセスすると型エラー
- ✅ テストが成功（`pnpm test -- poc-rpc-client`）

---

### タスク 2: パラメータ型推論確認（15分）

```typescript
// src/app/api/[[...route]]/poc.ts に追加
pocApp.get('/users/:id', (c) => {
  const id = c.req.param('id');
  return c.json({ id, name: `User ${id}` });
});

pocApp.get('/search', (c) => {
  const query = c.req.query('q') || '';
  return c.json({ results: [query] });
});
```

```typescript
// src/__tests__/poc-rpc-client.test.ts に追加
test('パラメータ型推論確認', async () => {
  const client = hc<PocAppType>('/api/poc');

  // Path parameter
  const userRes = await client.users[':id'].$get({
    param: { id: '123' }
  });
  const userData = await userRes.json();
  expect(userData.id).toBe('123');

  // Query parameter
  const searchRes = await client.search.$get({
    query: { q: 'Hono' }
  });
  const searchData = await searchRes.json();
  expect(searchData.results).toContain('Hono');
});
```

**期待結果:**
- ✅ `param: { id: string }` が型推論される
- ✅ `query: { q?: string }` が型推論される

---

### タスク 3: エラーハンドリング確認（15分）

```typescript
// src/app/api/[[...route]]/poc.ts に追加
pocApp.get('/error', (c) => {
  return c.json({ error: 'Test error' }, 500);
});

pocApp.get('/notfound', (c) => {
  return c.json({ error: 'Not found' }, 404);
});
```

```typescript
// src/__tests__/poc-rpc-client.test.ts に追加
test('エラーハンドリング確認', async () => {
  const client = hc<PocAppType>('/api/poc');

  // 500 エラー
  const errorRes = await client.error.$get();
  expect(errorRes.status).toBe(500);
  const errorData = await errorRes.json();
  expect(errorData.error).toBe('Test error');

  // 404 エラー
  const notFoundRes = await client.notfound.$get();
  expect(notFoundRes.status).toBe(404);
});
```

**期待結果:**
- ✅ ステータスコードが正しく取得できる
- ✅ エラーレスポンスも型推論される

---

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

```bash
# 動作確認
pnpm dev
# ブラウザで http://localhost:3000/poc-client にアクセス
```

**期待結果:**
- ✅ `pnpm build` が成功（型エラーなし）
- ✅ ブラウザで "Hello from PoC" が表示される
- ✅ Network タブで `/api/poc/test` へのリクエストが成功

---

## ✅ PoC 成功基準

以下すべてを満たした場合、Option A（Hono RPC Client）を正式採用：

- [x] タスク 1: 基本的な型推論が動作（GET, POST）
- [x] タスク 2: パラメータ型推論が動作（param, query）
- [x] タスク 3: エラーハンドリングが型安全
- [x] タスク 4: Next.js で `pnpm build` が成功

**所要時間:** 1時間

---

## 🚨 PoC 失敗時のフォールバック

万が一 PoC が失敗した場合：

1. **即座に Option D（OpenAPI 生成）に切り替え**
   - Hono + Zod Validator + Orval の組み合わせに変更
   - 追加実装時間: 3-5h

2. **一時的に Option B（手動 fetch）を使用**
   - フェーズ 1-2 の実装を進め、フェーズ 3 で再評価

---

## 📅 次のアクション

1. **Phase 0-3: RPC Client PoC 実施**（1h）
   - 上記チェックリストを実行
   - 成功 → Option A 正式採用、Phase 1 へ進む
   - 失敗 → Option D へ切り替え、再検証

2. **決定記録**
   - `.agent/decisions/rpc-client-pattern.md` に正式決定を記録

---

**作成者:** GitHub Copilot
**最終更新:** 2026-03-01
