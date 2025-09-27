---
applyTo: "*.js,*.jsx,*.ts,*.tsx"
---

# Next.js 15 キャッシュ戦略指示書

## このファイルの役割
このファイルは、GitHub CopilotがNext.js 15でキャッシュを実装する際の具体的な指示を定義し、適切なレンダリング戦略を選択するためのガイドラインを提供します。

---

## キャッシュ戦略の基本原則

### 1. データの性質による戦略選択
- **リアルタイム性が重要**: SSR（Server-Side Rendering）
- **静的で変更頻度が低い**: SSG（Static Site Generation）
- **定期的に更新される**: ISR（Incremental Static Regeneration）

### 2. パフォーマンス vs フレッシュさのトレードオフ
- キャッシュ期間が長い → パフォーマンス向上、データの鮮度低下
- キャッシュ期間が短い → データの鮮度向上、パフォーマンス低下

---

## キャッシュオプション一覧

### SSR (Server-Side Rendering)
**用途**: リアルタイムデータ、ユーザー固有データ、頻繁に変更されるデータ

```typescript
const response = await fetch("https://api.example.com/data", {
  cache: "no-store"
});
```

**特徴**:
- 毎回サーバーでレンダリング
- 最新データを保証
- レスポンス時間が長い可能性

### SSG (Static Site Generation)
**用途**: 静的コンテンツ、変更頻度が低いデータ、パフォーマンス重視

```typescript
const response = await fetch("https://api.example.com/data", {
  cache: "force-cache"
});
```

**特徴**:
- ビルド時に生成
- 高速なレスポンス
- データが古い可能性

### ISR (Incremental Static Regeneration)
**用途**: 定期的に更新されるデータ、パフォーマンスと鮮度のバランス

```typescript
const response = await fetch("https://api.example.com/data", {
  next: { revalidate: 3600 } // 1時間ごとに再生成
});
```

**特徴**:
- 指定時間後に背景で再生成
- 初回は高速、更新タイミングで少し遅延
- パフォーマンスと鮮度のバランス

---

## 実装パターン

### ページコンポーネントでのデータフェッチ

```typescript
// SSR例: ユーザーダッシュボード
const UserDashboard = async ({ params }: { params: { userId: string } }) => {
  const userData = await fetch(`/api/users/${params.userId}`, {
    cache: "no-store" // ユーザー固有データのため毎回最新を取得
  });

  return <div>{/* ユーザーデータの表示 */}</div>;
};

// SSG例: 会社情報ページ
const AboutPage = async () => {
  const companyInfo = await fetch("/api/company/info", {
    cache: "force-cache" // 静的情報のためキャッシュを活用
  });

  return <div>{/* 会社情報の表示 */}</div>;
};

// ISR例: ブログ記事一覧
const BlogPage = async () => {
  const posts = await fetch("/api/blog/getAllBlogs", {
    next: { revalidate: 3600 } // 1時間ごとに記事データを更新
  });

  return <div>{/* ブログ記事の表示 */}</div>;
};
```

### Server Actionsでのキャッシュ制御

```typescript
"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function createPost(formData: FormData) {
  // データベースに投稿を作成
  await db.posts.create({
    title: formData.get("title") as string,
    content: formData.get("content") as string,
  });

  // 関連するページのキャッシュを無効化
  revalidatePath("/blog");
  revalidateTag("posts");
}
```

---

## タグベースキャッシュ管理

### キャッシュタグの設定

```typescript
// データフェッチ時にタグを設定
const posts = await fetch("/api/posts", {
  next: {
    revalidate: 3600,
    tags: ["posts", "blog"]
  }
});

// 特定のタグに関連するキャッシュを無効化
import { revalidateTag } from "next/cache";

export async function invalidatePostsCache() {
  revalidateTag("posts");
}
```

---

## ユースケース別キャッシュ戦略

### EC サイト
```typescript
// 商品一覧: ISR（定期的に在庫状況更新）
const ProductList = async () => {
  const products = await fetch("/api/products", {
    next: { revalidate: 300 } // 5分ごと
  });
};

// 商品詳細: ISR（価格変動に対応）
const ProductDetail = async ({ params }: { params: { id: string } }) => {
  const product = await fetch(`/api/products/${params.id}`, {
    next: { revalidate: 600 } // 10分ごと
  });
};

// ユーザーのカート: SSR（リアルタイム性重視）
const Cart = async () => {
  const cartItems = await fetch("/api/cart", {
    cache: "no-store"
  });
};
```

### ニュースサイト
```typescript
// トップページ記事: ISR（頻繁な更新）
const HomePage = async () => {
  const articles = await fetch("/api/articles/latest", {
    next: { revalidate: 180 } // 3分ごと
  });
};

// 記事詳細: SSG（アクセス頻度高、内容変更少）
const ArticlePage = async ({ params }: { params: { slug: string } }) => {
  const article = await fetch(`/api/articles/${params.slug}`, {
    cache: "force-cache"
  });
};
```

---

## エラーハンドリング

### キャッシュ使用時のエラー処理

```typescript
const DataComponent = async () => {
  try {
    const data = await fetch("/api/data", {
      next: { revalidate: 3600 }
    });

    if (!data.ok) {
      throw new Error(`HTTP error! status: ${data.status}`);
    }

    const result = await data.json();
    return <div>{result.content}</div>;

  } catch (error) {
    console.error("データ取得エラー:", error);
    // フォールバック表示
    return <div>データの読み込みに失敗しました</div>;
  }
};
```

---

## パフォーマンス最適化のベストプラクティス

### 1. 適切なキャッシュ期間の設定
- **頻繁に変更**: 1-5分
- **日次更新**: 1-6時間
- **週次更新**: 1-7日
- **月次更新**: 7-30日

### 2. キャッシュタグの活用
```typescript
// 関連データをグループ化
const userPosts = await fetch("/api/posts/user/123", {
  next: {
    revalidate: 3600,
    tags: ["posts", "user-123"]
  }
});
```

### 3. 段階的キャッシュ戦略
```typescript
// 重要度に応じてキャッシュ期間を調整
const criticalData = await fetch("/api/critical", {
  next: { revalidate: 60 } // 1分
});

const normalData = await fetch("/api/normal", {
  next: { revalidate: 3600 } // 1時間
});

const staticData = await fetch("/api/static", {
  cache: "force-cache" // 永続キャッシュ
});
```

---

## 開発・デバッグ時の注意点

### 開発環境でのキャッシュ無効化
```typescript
// 開発環境では強制的にキャッシュを無効化
const isDev = process.env.NODE_ENV === "development";

const data = await fetch("/api/data", {
  cache: isDev ? "no-store" : "force-cache"
});
```

### キャッシュ状態の確認
```typescript
// レスポンスヘッダーでキャッシュ状態を確認
const response = await fetch("/api/data", {
  next: { revalidate: 3600 }
});

console.log("Cache status:", response.headers.get("x-vercel-cache"));
```

---

## Tips

### キャッシュ戦略選択のフローチャート
1. **データは頻繁に変更される？** → YES: SSR
2. **データは定期的に更新される？** → YES: ISR
3. **データは静的？** → YES: SSG

### パフォーマンス向上のポイント
- 可能な限りSSGまたはISRを使用
- 必要に応じてServer Actionsでキャッシュを無効化
- タグベースキャッシュで細かい制御を実現
- 開発環境と本番環境でキャッシュ戦略を使い分け

### 関連するアドバイス
- キャッシュの設定変更後は、必ず本番環境での動作確認を行ってください
- CDNキャッシュとNext.jsキャッシュの両方を考慮した設計を行いましょう
- ユーザー体験を優先し、古いデータでも表示する場合はISRを、最新データが必須の場合はSSRを選択してください

---

フェッチと props

