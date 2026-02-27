# パフォーマンス最適化ガイド

## 現在の最適化状況

### ✅ 実装済み

1. **セッション管理の一元化**
   - `proxy.ts` で認証チェックを実施
   - `(protected)/layout.tsx` での重複チェックを削除
   - ダブルフェッチ問題を解消

2. **ログの環境制御**
   - `PROXY_DEBUG=true` で開発時のみ詳細ログ出力
   - 本番環境ではエラーログのみ (`level='error'`)
   - PII（個人識別情報）のログ出力を全廃

3. **ルート定数の集約**
   - Magic string を排除（`src/config/routes.ts`）
   - 文字列比較の最適化
   - バンドルサイズの削減

### ⚠️ 今後の最適化案

#### 1. セッションキャッシング

現在、各リクエストで DB からセッションを取得しています。
React の `cache()` を使用して、同一リクエスト内でセッション取得を1回に制限できます。

**Before:**
```typescript
// 各コンポーネントで毎回 DB アクセス
const session = await auth.api.getSession({ headers: await headers() });
```

**After:**
```typescript
import { cache } from 'react';

export const getSession = cache(async () => {
  // 同一リクエスト内では1回のみ実行される
  return await auth.api.getSession({ headers: await headers() });
});
```

**効果:**
- DB クエリ削減
- レスポンス時間短縮（推定 20-50ms/request）
- DB 負荷軽減

#### 2. 画像最適化

**現状:** 未使用（認証専用アプリのため）

**将来対応:**
- `next/image` の活用
- WebP/AVIF フォーマット対応
- CDN キャッシング (`minimumCacheTTL: 14400` - Next.js 16 default)

#### 3. コンポーネント遅延読み込み

大きなコンポーネントは `lazy()` + `Suspense` で遅延読み込み:

```typescript
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('@/components/admin/Dashboard'));

// 使用
<Suspense fallback={<Loading />}>
  <AdminDashboard />
</Suspense>
```

#### 4. Database Connection Pooling

Drizzle ORM の接続プーリング設定を最適化:

```typescript
// drizzle.config.ts
export default {
  pool: {
    min: 2,
    max: 10,
  },
};
```

#### 5. API レート制限

認証エンドポイントにレート制限を実装（Better Auth の機能使用）:

```typescript
// lib/auth.ts
import { rateLimit } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    rateLimit({
      storage: "database",
      rules: [
        {
          pathMatcher: "/api/auth/sign-in",
          limit: 5,
          window: 60, // 1分間に5回まで
        },
      ],
    }),
  ],
});
```

## パフォーマンス計測

### 推奨ツール

1. **Lighthouse** (Chrome DevTools)
   - Performance スコア目標: 90+
   - Accessibility スコア目標: 100
   - Best Practices スコア目標: 100

2. **React DevTools Profiler**
   - コンポーネントレンダリング時間測定
   - 不要な再レンダリング検出

3. **Next.js Speed Insights** (Vercel)
   - 実際のユーザー体験データ
   - Core Web Vitals 監視

### ベンチマーク目標

- **Initial Load**: < 2s
- **Time to Interactive**: < 3s
- **First Contentful Paint**: < 1s
- **Largest Contentful Paint**: < 2.5s

## モニタリング

```bash
# ビルドサイズ確認
pnpm build

# バンドル分析
pnpm analyze

# パフォーマンス計測（開発環境）
PROXY_DEBUG=false pnpm dev
```

## 参考リンク

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [React Cache](https://react.dev/reference/react/cache)
- [Web.dev Performance](https://web.dev/performance/)
