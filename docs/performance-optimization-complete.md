# パフォーマンス最適化の実装ガイド

## 実装完了項目

### 1. ✅ React cache() によるセッションキャッシング

[src/lib/auth/helper.ts](src/lib/auth/helper.ts) の `getSession()` を React の `cache()` でラップしました。

**効果:**
- 同一リクエスト内でセッション取得（DB問い合わせ）を1回に制限
- 複数のコンポーネントで `getSession()` を呼び出しても、DB アクセスは1度
- サーバーサイドのみで動作（クライアントキャッシュなし）

**実装例:**
```typescript
import { cache } from 'react';

export const getSession = cache(async () => {
  // 同一リクエスト内では1度のみ実行
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
});

// コンポーネントA で getSession() 呼び出し
const session1 = await getSession();

// コンポーネントB でも getSession() 呼び出し
// -> DB には問い合わせない（cache() で記憶された値を返す）\nconst session2 = await getSession();
```

**計測方法:**
```bash
# パフォーマンス計測（開発環境）
PROXY_DEBUG=true pnpm dev
# -> DB クエリの実行回数がログに表示される
```

---

### 2. ✅ Drizzle ORM - コネクションプーリング

[drizzle.config.ts](drizzle.config.ts) に接続プーリング設定を追加しました。

**設定:**
```typescript
pool: {
  min: 2,  // 最小接続数: 2
  max: 10, // 最大接続数: 10
}
```

**効果:**
- **起動時:** 最小2つの接続を事前に確立（レスポンス時間短縮）
- **通常時:** 接続を再利用（接続確立オーバーヘッド削減）
- **ピーク時:** 最大10接続まで増加（スケーラビリティ向上）
- **本番環境:** サーバー負荷に応じて `max: 20` 程度に増やす検討

**スケーリング目安:**
- **小規模アプリ:** `min: 1, max: 5`
- **中規模アプリ:** `min: 2, max: 10`（現在の設定）
- **大規模アプリ:** `min: 5, max: 20`

---

### 3. ✅ Better Auth - レート制限

[src/lib/auth.ts](src/lib/auth.ts) に `rateLimit` プラグインを追加しました。

**設定:**
```typescript
rateLimit({
  storage: "database",  // DB にレート制限情報を保存
  rules: [
    {
      pathMatcher: "/api/auth/sign-in",
      limit: 5,          // 1時間に5回まで
      window: 60 * 60,
    },
    {
      pathMatcher: "/api/auth/sign-up",
      limit: 3,          // 24時間に3回まで
      window: 60 * 60 * 24,
    },
  ],
})
```

**保護対象:**
- **ログイン:** 1時間に5回まで（ブルートフォース攻撃対策）
- **登録:** 24時間に3回まで（アカウント登録スパム対策）

**クライアント側の対応:**
```typescript
// /api/auth/sign-in で 429 が返った場合
if (response.status === 429) {
  alert('ログイン試行が多すぎます。しばらく待ってからお試しください。');
  // UI に「X分後に再試行可能」を表示
}
```

---

## 今後の最適化案

### 4. 画像最適化（スキップし可能）

**現状:** 認証専用アプリのため、画像使用が少ない

**将来対応:**
```typescript
// next/image を使用
import Image from 'next/image';

export default function Component() {
  return (
    <Image
      src="/logo.png"
      alt="Logo"
      width={200}
      height={100}
      priority={false}
      quality={80}
    />
  );
}
```

### 5. コンポーネント遅延読み込み

大きなコンポーネント（管理者ダッシュボードなど）は `lazy()` で遅延読み込み:

```typescript
import { lazy, Suspense } from 'react';

const AdminUsers = lazy(() => import('@/components/admin/Users'));

export default function AdminPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AdminUsers />
    </Suspense>
  );
}
```

### 6. インデックス最適化

認証関連テーブルのインデックスを確認:

```sql
-- 確認コマンド
SELECT * FROM pg_indexes WHERE tablename IN ('users', 'sessions', 'userAuthMethods');

-- 推奨インデックス
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_user_auth_methods_user_id ON userAuthMethods(user_id);
CREATE INDEX idx_user_auth_methods_auth_type ON userAuthMethods(auth_type);
```

### 7. Database Query Optimization

複雑なクエリは事前にプリペア:

```typescript
// 推奨: 複雑なクエリは専用関数に
export const getUserWithAuthMethods = cache(async (userId: string) => {
  return await database.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      authMethods: {
        orderBy: desc(userAuthMethods.lastUsedAt),
      },
    },
  });
});
```

---

## パフォーマンスモニタリング

### 計測ツール

1. **Next.js Speed Insights（Vercel）**
   - 実際のユーザーデータ（RUM）をモニタリング
   - Core Web Vitals 監視

2. **Chrome DevTools Lighthouse**
   - Local パフォーマンス計測
   - 目標: Performance 90+, Accessibility 100

3. **React DevTools Profiler**
   - コンポーネントレンダリング時間計測
   - 不要な再レンダリング検出

### ベンチマーク目標

| メトリクス | 目標値 | 重要度 |
|-----------|-------|--------|
| First Contentful Paint (FCP) | < 1s | HIGH |
| Largest Contentful Paint (LCP) | < 2.5s | HIGH |
| Time to Interactive (TTI) | < 3s | MEDIUM |
| Cumulative Layout Shift (CLS) | < 0.1 | MEDIUM |
| DB クエリ時間（平均） | < 100ms | HIGH |
| API レスポンス時間 | < 200ms | MEDIUM |

### 実行コマンド

```bash
# パフォーマンスモニタリング有効化
PROXY_DEBUG=true pnpm dev

# ビルド最適化確認
pnpm build

# バンドル分析（オプション）
ANALYZE=true pnpm build
```

---

## チェックリスト

- [x] React cache() でセッションキャッシング実装
- [x] Drizzle ORM コネクションプーリング設定
- [x] Better Auth レート制限プラグイン設定
- [x] 開発時認証スキップ機能
- [x] パフォーマンス計測ドキュメント作成

**実装予定:**
- [ ] 画像最適化（next/image）
- [ ] コンポーネント遅延読み込み
- [ ] DB インデックス最適化
- [ ] CDN キャッシング設定
