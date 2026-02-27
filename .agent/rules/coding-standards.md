---
trigger: always_on
---

# Coding Standards

コード品質、型安全性、およびビルド安定性を保つための技術的基準です。

## 1. TypeScript Immutability (不変性)

コンパイル時の安全性とDXのバランスを考慮し、以下の基準で型定義を行ってください。

- **Level 2 (`as const`)**: 静的な定数、設定値、マスタデータには必ず `as const` を使用する。
  ```typescript
  export const NAV_ITEMS = [{ label: "Home", href: "/" }] as const;
  ```
- **Level 1 (`readonly`)**: コンポーネントのPropsやデータ受け渡しには `readonly` 修飾子を使用する。
- **禁止事項**: `Object.freeze` (実行時コスト) や `DeepReadonly` (複雑すぎ) は使用しない。

## 2. TypeScript Typing (`any` vs `unknown`)

TypeScriptの型安全性を最大限に高めるため、以下の原則を徹底してください。

- **`any` の原則禁止**: 型チェックを無効化する `any` 型の使用は原則として禁止します。
- **`unknown` の使用**: 任意の型を受け入れる必要がある場合は、代わりに `unknown` を使用してください。
- **型ガードと検証**: `unknown` 型の値を使用する場合は、必ず `typeof` などの **型ガード (Type Guard)** や **Zod** 等による型検証 (バリデーション) を実装し、安全性を担保してから使用してください。
- 例外: 複雑なジェネリクスや外部ライブラリの型定義の不備で型解決が極めて困難な場合にのみ、最終手段として `any` を許容しますが、必ず `// eslint-disable-next-line @typescript-eslint/no-explicit-any` などのコメントを残し、理由を明記してください。

## 2. Build Stability (ビルド安定性)

- **事前のファイル確認**: import文を追加する前に、対象ファイルが存在することを必ず確認する。
- **依存関係の先行実装**: 新機能（Actionsなど）が必要な場合、参照する側のコードを書く前に、依存先のファイルを先に作成する。
- **完了前のビルドチェック**: タスク完了やレビュー依頼の前に、`npm run build` または `next build` を実行し、モジュール不足や型エラーがないことを保証する。

## 3. General Coding Rules

- **変数名**: 英語で分かりやすく命名する（ローマ字不可）。
- **Barrel Export**: `index.ts` を活用し、公開すべきものだけをエクスポートする。

## 4. Next.js 16 Specific Rules

### 4.1 Proxy (旧 Middleware) の命名規則

**重要**: Next.js 16からミドルウェアの命名規則が変更されました。

- ✅ **正しいファイル名**: `src/proxy.ts` または `proxy.ts` (ルートディレクトリ)
- ✅ **正しい関数名**: `export async function proxy(request: NextRequest)`
- ❌ **誤り**: `middleware.ts` や `export function middleware()` は **Next.js 16では非推奨**

**理由**:
- Express.jsのミドルウェアとの混同を避けるため
- ネットワーク境界の役割を明確化するため
- Next.js 15以前の`middleware.ts`は非推奨（将来のバージョンで削除予定）

**実装例**:
```typescript
// src/proxy.ts
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  // 認証・リダイレクトロジック
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
```

**マイグレーション**:
- 既存プロジェクトの場合、公式codemodが利用可能:
  ```bash
  npx @next/codemod@canary middleware-to-proxy .
  ```

**参考**: [Next.js 16 公式ドキュメント - Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)

### 4.2 Async Request APIs（非同期API必須化）

**重要**: Next.js 16では、リクエスト関連のAPIがすべて非同期化されました。

#### params と searchParams の非同期化

- ✅ **正しい書き方**: `await params` / `await searchParams`
- ❌ **誤り**: 同期的アクセス `params.id` は **Next.js 16でエラー**

**実装例**:
```typescript
// app/blog/[slug]/page.tsx
export default async function BlogPost({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params; // ✅ awaitが必須
  const { tag } = await searchParams; // ✅ awaitが必須

  return <article>...</article>;
}
```

#### cookies(), headers(), draftMode() の非同期化

- ✅ **正しい書き方**: `await cookies()` / `await headers()` / `await draftMode()`
- ❌ **誤り**: 同期的アクセスは **Next.js 16でエラー**

**実装例**:
```typescript
import { cookies, headers, draftMode } from "next/headers";

export async function GET() {
  const cookieStore = await cookies(); // ✅ awaitが必須
  const headersList = await headers(); // ✅ awaitが必須
  const { isEnabled } = await draftMode(); // ✅ awaitが必須

  const token = cookieStore.get("token");
  const userAgent = headersList.get("user-agent");

  return Response.json({ token, userAgent, draftMode: isEnabled });
}
```

**マイグレーション**:
```bash
# params/searchParamsの自動変換
npx @next/codemod@canary next-async-request-api .
```

### 4.3 revalidateTag() の第2引数必須化

**重要**: Next.js 16では、`revalidateTag()`に第2引数（cacheLifeプロファイル）が必須です。

- ✅ **正しい書き方**: `revalidateTag(tag, cacheLifeProfile)`
- ❌ **誤り**: `revalidateTag(tag)` のみは **非推奨**

**実装例**:
```typescript
import { revalidateTag } from "next/cache";

// ✅ 推奨: 組み込みプロファイル 'max' を使用（ほとんどのケースに最適）
revalidateTag("blog-posts", "max");

// ✅ その他の組み込みプロファイル
revalidateTag("news-feed", "hours");
revalidateTag("analytics", "days");

// ✅ カスタム有効期限（秒単位）
revalidateTag("products", { expire: 3600 });

// ❌ 非推奨: 第2引数なし
revalidateTag("blog-posts");
```

**新API `updateTag()` と `refresh()` の使い分け**:

- **`revalidateTag(tag, profile)`**: 静的コンテンツをバックグラウンドで再検証（stale-while-revalidate）
- **`updateTag(tag)`**: Server Actions専用。即座にキャッシュを破棄して最新データを取得（read-your-writes）
- **`refresh()`**: Server Actions専用。キャッシュされていないデータのみ更新

**実装例**:
```typescript
"use server";
import { updateTag, refresh } from "next/cache";

// updateTag: ユーザーが変更をすぐに見る必要がある場合
export async function updateUserProfile(userId: string, profile: Profile) {
  await db.users.update(userId, profile);
  updateTag(`user-${userId}`); // ✅ 即座に反映
}

// refresh: キャッシュされていない動的データの更新
export async function markNotificationAsRead(notificationId: string) {
  await db.notifications.markAsRead(notificationId);
  refresh(); // ✅ 通知カウントなど、キャッシュされていないデータを更新
}
```

### 4.4 next/image の破壊的変更

**localパターンのクエリ文字列制限**:
- ローカル画像にクエリ文字列を使用する場合、`images.localPatterns`設定が必須（列挙攻撃の防止）

**minimumCacheTTL のデフォルト変更**:
- 新デフォルト: **4時間（14400秒）**（旧: 60秒）
- Cache-Controlヘッダーがない画像の再検証コストを削減

**imageSizes のデフォルト変更**:
- `16` がデフォルトサイズから削除（利用率4.2%）
- srcsetのサイズを削減し、APIバリエーションを削減

**qualities のデフォルト変更**:
- 新デフォルト: `[75]` のみ（旧: 1～100）
- `quality`プロップは最も近い値に丸められる

**セキュリティ強化**:
- `dangerouslyAllowLocalIP`: デフォルトで`false`（プライベートネットワークでのみ`true`に設定）
- `maximumRedirects`: デフォルトで3回まで（旧: 無制限）

### 4.5 Parallel Routes の default.js 必須化

**重要**: すべてのパラレルルートスロットに明示的な`default.js`ファイルが必須になりました。

```
app/
├── @modal/
│   ├── default.tsx  ← ✅ 必須
│   └── login/
│       └── page.tsx
└── page.tsx
```

**実装例**:
```typescript
// app/@modal/default.tsx
import { notFound } from "next/navigation";

// 空のスロットを表示したくない場合
export default function Default() {
  return null;
}

// または404を表示する場合
export default function Default() {
  notFound();
}
```

**ビルドエラー**: `default.js`がない場合、ビルドが失敗します。

---

**参考**:
- [Next.js 16 公式アップグレードガイド](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Next.js 16 リリースノート](https://nextjs.org/blog/next-16)

## 5. Strict Review Standards

レビュー「現在のアプリを厳しくレビューしてください」で指摘された内容に基づくコーディングルールです。

詳細は [Strict Review Standards](./strict-review-standards.md) を参照:

- **環境変数検証**: OAuth credentials、本番環境設定の起動時検証
- **Database Schema Rules**: RLS、インデックス戦略、タイムスタンプ型、N+1 対策
- **Error Handling & Logging**: エラーメッセージ詳細化、セキュリティイベント記録
- **Testing & TDD**: クリティカル機能のテスト必須化

特に以下は **Critical** レベルの誤りです:

- OAuth credentials の空文字列フォールバック
- 本番環境でのダミー認証有効化
- RLS ポリシーなしでの個人情報テーブル公開
- エラー情報の無視
