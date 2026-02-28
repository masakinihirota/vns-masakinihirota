# Hono API 実装ロードマップ - 実行計画書

**作成日**: 2026-03-01
**Status**: 🚀 実装開始準備完了
**総工数**: 約 20-25時間

---

## 🎯 実装の7段階フロー

### 📊 全体像 - 「型安全の三種の神器」統合

```
┌─ DB & 認証 (完了) ──────────────────────┐
│  Drizzle ORM + Better Auth             │
└──────────────────────────────────────────┘
          ↓
┌─ 第1段階: API通信の土台 ────────────────┐
│ Hono + RPC Client + Next.js連携       │
│ ⏱  2-3時間                             │
└──────────────────────────────────────────┘
          ↓
┌─ 第2段階: 認証の壁（セッション取得） ──┐
│ Better Auth × Hono ミドルウェア        │
│ ⏱  2-3時間                             │
└──────────────────────────────────────────┘
          ↓
┌─ 第3段階: 権限の壁（RBAC） ────────────┐
│ ロールベースアクセス制御               │
│ ⏱  2-3時間                             │
└──────────────────────────────────────────┘
          ↓
┌─ 第4段階: データの壁（Zod検証） ──────┐
│ バリデーション付きAPI設計             │
│ ⏱  2-3時間                             │
└──────────────────────────────────────────┘
          ↓
┌─ 第5段階: UX向上（nuqs） ──────────────┐
│ URL同期・検索条件管理                 │
│ ⏱  2-3時間                             │
└──────────────────────────────────────────┘
          ↓
┌─ 追加: フロント統合 ────────────────────┐
│ • TanStack Query（データフェッチング）│
│ • React Hook Form（フォーム管理）     │
│ • 「型安全三種の神器」完全統合        │
│ ⏱  5-7時間                             │
└──────────────────────────────────────────┘
```

---

## 🏗️ 第1段階: API通信の土台作り

### 目標
✅ Next.jsコンポーネントからHono APIへのRPC通信開通
✅ フロントエンドで型推論が効く相互運用性確認

### チェックリスト

```
□ 1.1 Next.jsサーバーコンポーネントでの RPC Client 使用例作成
□ 1.2 Next.jsクライアントコンポーネントでの RPC Client 使用例作成
□ 1.3 ブラウザで `/api/health` が動作確認できる
□ 1.4 RPC Client の型推論（VSCode 補完）が効いているか確認
□ 1.5 簡単なUI（ボタン→API呼び出し）でエンドツーエンド動作確認
```

### 実装内容

**1.1: サーバーコンポーネント例**
```typescript
// app/(protected)/dashboard/page.tsx
import { client } from '@/lib/api/client';

export default async function DashboardPage() {
  // サーバー側でのRPC呼び出し
  const healthRes = await client.api.health.$get();
  const healthData = await healthRes.json();

  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(healthData, null, 2)}</pre>
    </div>
  );
}
```

**1.2: クライアントコンポーネント例（TanStack Query導入前）**
```typescript
// components/api-test-button.tsx
'use client';

import { client } from '@/lib/api/client';
import { useState } from 'react';

export function ApiTestButton() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    const res = await client.api.health.$get();
    const result = await res.json();
    setData(result);
    setLoading(false);
  };

  return (
    <div>
      <button onClick={handleTest} disabled={loading}>
        {loading ? 'Loading...' : 'Test API'}
      </button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

**1.3: RPC Client の型推論確認**
```
✅ client.api.health.$get() で補完が効く
✅ await res.json() の戻り値が型推論される
✅ エラー時の型チェック可能
```

### 成功基準
- フロントエンド（Next.js）からバックエンド（Hono）への通信成功
- ブラウザで実際に動作確認
- VSCode の TypeScript 補完が効いている

### 推定工数: 2-3時間

---

## 🔐 第2段階: 認証の壁（Better Auth セッション取得）

### 目標
✅ Hono側で Better Auth のセッション情報を受け取る
✅ `GET /api/users/me` で現在のログインユーザー情報を返す

### チェックリスト

```
□ 2.1 Hono での Better Auth セッション取得ミドルウェア実装
□ 2.2 GET /api/users/me エンドポイント実装
□ 2.3 セッションがない時は 401 UNAUTHORIZED を返す確認
□ 2.4 RPC Client で `/api/users/me` を呼び出し、ユーザー情報取得確認
```

### 実装内容

**2.1: Better Auth セッション取得ミドルウェア**
```typescript
// src/lib/api/middleware/auth-session.ts
import { auth } from '@/lib/auth';

export async function getBetterAuthSession(headers: Headers) {
  const session = await auth.api.getSession({
    headers: Array.from(headers.entries()).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>),
  });
  return session;
}
```

**2.2: GET /api/users/me エンドポイント**
```typescript
// src/lib/api/routes/users.ts
import { usersRouter } from 'hono/tiny-router';

export const users = new Hono();

users.get('/me', async (c) => {
  const headers = c.req.raw.headers;
  const session = await getBetterAuthSession(headers);

  if (!session?.user) {
    return c.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Not logged in' } },
      401
    );
  }

  return c.json({
    success: true,
    data: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
    },
  });
});
```

### 成功基準
- ログイン済みユーザーで `/api/users/me` にアクセス → ユーザー情報取得
- 未ログイン状態で `/api/users/me` にアクセス → 401エラー

### 推定工数: 2-3時間

---

## 👑 第3段階: 権限の壁（RBAC）

### 目標
✅ 管理者のみアクセス可能なAPIエンドポイント作成
✅ RBAC ミドルウェアの実装・テスト

### チェックリスト

```
□ 3.1 RBAC ミドルウェア実装（requirePlatformAdmin, requireRole等）
□ 3.2 POST /api/admin/users - 管理者のみユーザー作成可能
□ 3.3 DELETE /api/admin/users/:id - 管理者のみユーザー削除可能
□ 3.4 non-admin ユーザーがアクセス → 403 FORBIDDEN 確認
```

### 実装内容
- ✅ 既に `src/lib/api/middleware/rbac.ts` で実装済み
- ✅ `requirePlatformAdmin`, `requireGroupRole` 等5個のミドルウェア関数有

### 成功基準
- 管理者: エンドポイントにアクセス可能
- 一般ユーザー: エンドポイントアクセス時 403 エラー

### 推定工数: 2-3時間

---

## 🔍 第4段階: データの壁（Zod バリデーション）

### 目標
✅ Zod スキーマベースの安全なAPI実装
✅ バリデーション済みデータのみDB保存

### チェックリスト

```
□ 4.1 Zod スキーマ定義の確認（既に admin.ts 存在）
□ 4.2 POST /api/admin/users で Zod validation 実装
□ 4.3 バリデーションエラー時は 400 を返す
□ 4.4 バリデーション成功時のみ DB 保存
```

### 実装内容
- ✅ 既に `src/lib/api/schemas/admin.ts` でZodスキーマ定義済み

### 成功基準
- 不正なメールアドレス形式でAPI呼び出し → 400 バリデーションエラー
- 正常なデータでAPI呼び出し → ユーザー作成・DB保存成功

### 推定工数: 2-3時間

---

## ✨ 第5段階: UX向上（nuqs）

### 目標
✅ 検索・フィルタ条件をURLに同期
✅ ブラウザ戻る/進むボタン機能

### チェックリスト

```
□ 5.1 nuqs インストール
□ 5.2 useQueryState で検索条件をURL化
□ 5.3 ページネーション情報（page, limit）のURL同期
□ 5.4 URL共有時に状態が復元されるか確認
```

### 実装内容
```typescript
// components/user-search.tsx
'use client';

import { useQueryState } from 'nuqs';

export function UserSearch() {
  const [search, setSearch] = useQueryState('q');
  const [page, setPage] = useQueryState('page', { defaultValue: '1' });

  return (
    <div>
      <input value={search ?? ''} onChange={e => setSearch(e.target.value)} />
      {/* page は自動的に URL に反映 */}
    </div>
  );
}
```

### 推定工数: 2-3時間

---

## 🎨 追加: フロント統合 - 「型安全三種の神器」

### Layer 1: TanStack Query（データフェッチング）

**インストール**
```bash
pnpm add @tanstack/react-query
```

**設定**
```typescript
// app/layout.tsx
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**使用例**
```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/api/client';

export function useUserProfile() {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const res = await client.api.users.me.$get();
      return res.json();
    },
  });
}
```

### Layer 2: React Hook Form（フォーム管理）

**インストール**
```bash
pnpm add react-hook-form
```

**使用例**
```typescript
// 既存の Zod スキーマを再利用
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserRequestSchema } from '@/lib/api/schemas/admin';

export function UserCreateForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(createUserRequestSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  );
}
```

### 推定工数: 5-7時間

---

## 📋 全体タイムライン

| 段階 | 内容 | 工数 | 累計 |
|------|------|------|------|
| **第1段階** | 通信土台(Hono+Next.js) | 2-3h | 2-3h |
| **第2段階** | 認証(Better Auth) | 2-3h | 4-6h |
| **第3段階** | 権限管理(RBAC) | 2-3h | 6-9h |
| **第4段階** | バリデーション(Zod) | 2-3h | 8-12h |
| **第5段階** | URL同期(nuqs) | 2-3h | 10-15h |
| **フロント統合** | TQ+RHF | 5-7h | 15-22h |
| **テスト・デバッグ** | 統合テスト | 3-5h | 18-27h |

---

## 🚀 即座に開始する項目

### **今すぐ実装開始: 第1段階**

```bash
# 1. Next.js サーバーコンポーネント例を作成
# 2. 簡単なクライアントコンポーネント例を作成
# 3. ブラウザで実際に動作確認
```

---

## 💡 「型安全の三種の神器」の最終形

```
┌────────────────────────────────────────────┐
│         TanStack Query                     │
│   （データの取得・キャッシュ・同期）        │
├────────────────────────────────────────────┤
│         Hono RPC Client                    │
│   （型安全な通信・エンドツーエンド型定義）  │
├────────────────────────────────────────────┤
│         Zod スキーマ                       │
│   （バリデーション・型推論・保守性）        │
└────────────────────────────────────────────┘
           ↓
   React Hook Form
   （フォーム状態・検証）
           ↓
       nuqs
   （URL同期・検索条件）
           ↓
  🎉 完全な型安全 Web サービス
```

---

**次のステップ**: 第1段階の実装を開始してください
