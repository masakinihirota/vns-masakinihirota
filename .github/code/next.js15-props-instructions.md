---
applyTo: "*.js,*.jsx,*.ts,*.tsx"
---

# Next.js 15 Props データ受け渡し指示書 (Supabase統合版)

## このファイルの役割
このファイルは、GitHub CopilotがNext.js 15のApp RouterでSupabaseと連携し、propsを通じてデータを受け渡しする際の具体的な指示を定義し、ルーティング層とコンポーネント層の責務分離を実現するためのガイドラインを提供します。

---

## 基本原則

### 1. 責務の分離とSupabase統合
- **`app/` フォルダ**: データフェッチ（Server Actions、API Routes、Supabaseクライアント）とルーティング処理
- **`components/` フォルダ**: UIの表示と状態管理
- **API Routes (`route.ts`)**: サーバーサイドのビジネスロジックとSupabase操作
- **Server Actions**: フォーム処理とデータ更新、Supabaseとの直接連携

### 2. Supabaseデータフローパターン
```
Pattern 1: Supabase Client (Direct) → Page Components → UI Components
Pattern 2: Supabase → API Routes → Page Components → UI Components
Pattern 3: Supabase → Server Actions → Page Components → UI Components
```

### 3. 型安全性の確保
- Supabaseの型生成機能を活用
- Zodを使用したデータバリデーション
- Database型とZodスキーマの組み合わせ

---

## Supabaseクライアント設定

### 基本設定とタイプ生成

```typescript
// filepath: lib/supabase/client.ts
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Server Component用クライアント
export const createServerClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
};
```

### Database型定義の例

```typescript
// filepath: types/database.types.ts
export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string;
          title: string;
          content: string;
          published_at: string;
          author_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          published_at?: string;
          author_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          published_at?: string;
          author_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          name: string;
          avatar_url?: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          avatar_url?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          avatar_url?: string;
          created_at?: string;
        };
      };
    };
  };
}

// 使いやすい型エイリアス
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
export type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
```

---

## パターン1: Supabaseクライアント直接利用

### Page ComponentでのSupabaseクライアント利用

```typescript
// filepath: app/blog/page.tsx
import * as Blog from "@/components/blog";
import { createServerClient } from "@/lib/supabase/client";
import { BlogPost } from "@/types/database.types";

interface BlogPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const BlogPage = async ({ searchParams }: BlogPageProps) => {
  const supabase = createServerClient();

  // 1. Supabaseから直接データを取得
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      profiles:author_id (
        name,
        avatar_url
      )
    `)
    .eq('published_at', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`ブログデータの取得に失敗しました: ${error.message}`);
  }

  // 2. 検索パラメータの処理
  const searchQuery = typeof searchParams.q === "string" ? searchParams.q : "";
  const filteredPosts = searchQuery
    ? posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

  // 3. コンポーネントにpropsとして渡す
  return (
    <div className="container mx-auto px-4 py-8">
      <Blog.BlogHeader title="ブログ記事一覧" />
      <Blog.BlogSearchForm initialQuery={searchQuery} />
      <Blog.BlogList
        posts={filteredPosts}
        isLoading={false}
        onPostClick={(postId) => console.log(`Post clicked: ${postId}`)}
      />
      <Blog.BlogPagination
        currentPage={1}
        totalPages={Math.ceil(filteredPosts.length / 10)}
      />
    </div>
  );
};

export default BlogPage;
```

### リアルタイムデータ対応のClient Component

```typescript
// filepath: components/blog/blog-realtime-list.tsx
"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { BlogPost } from "@/types/database.types";

interface BlogRealtimeListProps {
  initialPosts: BlogPost[];
  enableRealtime?: boolean;
}

export const BlogRealtimeList: React.FC<BlogRealtimeListProps> = ({
  initialPosts,
  enableRealtime = true,
}) => {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enableRealtime) return;

    // リアルタイム購読の設定
    const channel = supabase
      .channel('blog-posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blog_posts'
        },
        (payload) => {
          console.log('Change received!', payload);

          if (payload.eventType === 'INSERT') {
            setPosts(prev => [payload.new as BlogPost, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setPosts(prev =>
              prev.map(post =>
                post.id === payload.new.id ? payload.new as BlogPost : post
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setPosts(prev =>
              prev.filter(post => post.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enableRealtime]);

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
};
```

---

## パターン2: API Routes経由でのSupabase操作

### API RoutesでのSupabase統合

```typescript
// filepath: app/blog/api/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase/client";

// レスポンスデータの型定義（Zodスキーマ）
const BlogPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  published_at: z.string(),
  author_id: z.string(),
  profiles: z.object({
    name: z.string(),
    avatar_url: z.string().nullable(),
  }).nullable(),
});

export type BlogPostWithProfile = z.infer<typeof BlogPostSchema>;

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        profiles:author_id (
          name,
          avatar_url
        )
      `)
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    // 検索クエリがある場合
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    const { data: posts, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    // Zodでバリデーション
    const validatedPosts = posts?.map(post =>
      BlogPostSchema.parse(post)
    ) || [];

    return NextResponse.json({
      success: true,
      data: validatedPosts,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      }
    });
  } catch (error) {
    console.error('Blog posts API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "データ取得に失敗しました",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    const CreatePostSchema = z.object({
      title: z.string().min(1, "タイトルは必須です"),
      content: z.string().min(10, "本文は10文字以上で入力してください"),
      author_id: z.string().uuid("無効なユーザーIDです"),
    });

    const validatedData = CreatePostSchema.parse(body);

    const { data: newPost, error } = await supabase
      .from('blog_posts')
      .insert([validatedData])
      .select(`
        *,
        profiles:author_id (
          name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      data: newPost
    }, { status: 201 });
  } catch (error) {
    console.error('Create blog post error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "投稿の作成に失敗しました",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
```

---

## パターン3: Server Actionsを使用したSupabase操作

### Server ActionsでのSupabase統合

```typescript
// filepath: app/blog/create/actions.ts
"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase/client";

// フォームデータのバリデーションスキーマ
const CreatePostSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  content: z.string().min(10, "本文は10文字以上で入力してください"),
  tags: z.array(z.string()).optional(),
});

export async function createPost(formData: FormData) {
  try {
    const supabase = createServerClient();

    // フォームデータの検証
    const validatedFields = CreatePostSchema.parse({
      title: formData.get("title"),
      content: formData.get("content"),
      tags: formData.get("tags")?.toString().split(",").filter(Boolean) || [],
    });

    // 現在のユーザー情報を取得（認証が必要）
    const { data: { user }, error: authError } = await supabase.auth.getClaims();

    if (authError || !user) {
      return {
        success: false,
        error: "認証が必要です"
      };
    }

    // ブログ投稿をSupabaseに保存
    const { data: newPost, error: insertError } = await supabase
      .from('blog_posts')
      .insert([{
        ...validatedFields,
        author_id: user.id,
      }])
      .select(`
        *,
        profiles:author_id (
          name,
          avatar_url
        )
      `)
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    // タグがある場合は、タグテーブルにも追加
    if (validatedFields.tags && validatedFields.tags.length > 0) {
      const tagInserts = validatedFields.tags.map(tag => ({
        post_id: newPost.id,
        name: tag.trim(),
      }));

      const { error: tagError } = await supabase
        .from('post_tags')
        .insert(tagInserts);

      if (tagError) {
        console.error('Tag insertion error:', tagError);
        // タグエラーは致命的ではないので、投稿は成功として扱う
      }
    }

    // キャッシュを更新
    revalidatePath("/blog");
    revalidateTag("blog-posts");

    return {
      success: true,
      data: newPost
    };
  } catch (error) {
    console.error('Create post error:', error);
    return {
      success: false,
      error: "投稿の作成に失敗しました",
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function updatePost(postId: string, formData: FormData) {
  try {
    const supabase = createServerClient();

    const UpdatePostSchema = z.object({
      title: z.string().min(1, "タイトルは必須です").optional(),
      content: z.string().min(10, "本文は10文字以上で入力してください").optional(),
    });

    const validatedFields = UpdatePostSchema.parse({
      title: formData.get("title") || undefined,
      content: formData.get("content") || undefined,
    });

    // 現在のユーザー情報を取得
    const { data: { user }, error: authError } = await supabase.auth.getClaims();

    if (authError || !user) {
      return {
        success: false,
        error: "認証が必要です"
      };
    }

    // 投稿の所有者確認と更新
    const { data: updatedPost, error } = await supabase
      .from('blog_posts')
      .update({
        ...validatedFields,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId)
      .eq('author_id', user.id) // 所有者チェック
      .select(`
        *,
        profiles:author_id (
          name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return {
          success: false,
          error: "投稿が見つからないか、編集権限がありません"
        };
      }
      throw new Error(error.message);
    }

    // キャッシュを更新
    revalidatePath(`/blog/${postId}`);
    revalidatePath("/blog");
    revalidateTag("blog-posts");

    return {
      success: true,
      data: updatedPost
    };
  } catch (error) {
    console.error('Update post error:', error);
    return {
      success: false,
      error: "投稿の更新に失敗しました"
    };
  }
}

export async function deletePost(postId: string) {
  try {
    const supabase = createServerClient();

    // 現在のユーザー情報を取得
    const { data: { user }, error: authError } = await supabase.auth.getClaims();

    if (authError || !user) {
      return {
        success: false,
        error: "認証が必要です"
      };
    }

    // 投稿の削除（所有者チェック付き）
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', postId)
      .eq('author_id', user.id);

    if (error) {
      throw new Error(error.message);
    }

    // キャッシュを更新
    revalidatePath("/blog");
    revalidateTag("blog-posts");

    return { success: true };
  } catch (error) {
    console.error('Delete post error:', error);
    return {
      success: false,
      error: "投稿の削除に失敗しました"
    };
  }
}
```

### Server Actionsを使用したページコンポーネント

```typescript
// filepath: app/blog/create/page.tsx
import * as Blog from "@/components/blog";
import { createPost } from "./actions";

const CreatePostPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Blog.BlogCreateForm
        onSubmit={createPost}
        submitText="投稿を作成"
        cancelHref="/blog"
      />
    </div>
  );
};

export default CreatePostPage;
```

---

## 認証を考慮したデータ処理

### 認証状態を考慮したページコンポーネント

```typescript
// filepath: app/dashboard/page.tsx
import { redirect } from "next/navigation";
import * as Dashboard from "@/components/dashboard";
import { createServerClient } from "@/lib/supabase/client";

const DashboardPage = async () => {
  const supabase = createServerClient();

  // 認証チェック
  const { data: { user }, error: authError } = await supabase.auth.getClaims();

  if (authError || !user) {
    redirect('/login');
  }

  // ユーザー固有データの取得
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: userPosts, error: postsError } = await supabase
    .from('blog_posts')
    .select(`
      *,
      post_tags (
        name
      )
    `)
    .eq('author_id', user.id)
    .order('created_at', { ascending: false });

  if (profileError || postsError) {
    throw new Error('ユーザーデータの取得に失敗しました');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Dashboard.DashboardHeader user={user} profile={profile} />
      <Dashboard.PostsOverview posts={userPosts || []} />
      <Dashboard.QuickActions />
    </div>
  );
};

export default DashboardPage;
```

---

## UI Components での Props 受け取り

### Server Componentsでのデータ取得

```typescript
// filepath: app/blog/page.tsx
import * as Blog from "@/components/blog";
import { BlogPost } from "./api/route";

interface BlogPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const BlogPage = async ({ searchParams }: BlogPageProps) => {
  // 1. API Routeからデータを取得
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blog/api`, {
    next: { revalidate: 3600 } // ISR: 1時間ごとに更新
  });

  if (!response.ok) {
    throw new Error("ブログデータの取得に失敗しました");
  }

  const result = await response.json();
  const posts: BlogPost[] = result.data;

  // 2. 検索パラメータの処理
  const searchQuery = typeof searchParams.q === "string" ? searchParams.q : "";
  const filteredPosts = searchQuery
    ? posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

  // 3. コンポーネントにpropsとして渡す
  return (
    <div className="container mx-auto px-4 py-8">
      <Blog.BlogHeader title="ブログ記事一覧" />
      <Blog.BlogSearchForm initialQuery={searchQuery} />
      <Blog.BlogList
        posts={filteredPosts}
        isLoading={false}
        onPostClick={(postId) => console.log(`Post clicked: ${postId}`)}
      />
      <Blog.BlogPagination
        currentPage={1}
        totalPages={Math.ceil(filteredPosts.length / 10)}
      />
    </div>
  );
};

export default BlogPage;
```

### エラーハンドリングとローディング状態

```typescript
// filepath: app/blog/loading.tsx
import * as Blog from "@/components/blog";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Blog.BlogHeader title="ブログ記事一覧" />
      <Blog.BlogList posts={[]} isLoading={true} />
    </div>
  );
}

// filepath: app/blog/error.tsx
"use client";

import * as Blog from "@/components/blog";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Blog.BlogError
        message="ブログデータの読み込みに失敗しました"
        onRetry={reset}
      />
    </div>
  );
}
```

---

## UI Components での Props 受け取り

### Props型定義とコンポーネント実装

```typescript
// filepath: components/blog/blog-list.tsx
;
import { BlogPost } from "@/app/blog/api/route";

interface BlogListProps {
  posts: BlogPost[];
  isLoading: boolean;
  onPostClick?: (postId: string) => void;
  className?: string;
}

export const BlogList: React.FC<BlogListProps> = ({
  posts,
  isLoading,
  onPostClick,
  className = ""
}) => {
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 3 }).map((_, index) => (
          <BlogCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">記事が見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {posts.map((post) => (
        <BlogCard
          key={post.id}
          post={post}
          onClick={() => onPostClick?.(post.id)}
        />
      ))}
    </div>
  );
};

// 個別のブログカードコンポーネント
interface BlogCardProps {
  post: BlogPost;
  onClick?: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onClick }) => {
  return (
    <article
      className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
      <div className="flex items-center gap-2">
        {post.author.avatar && (
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-8 h-8 rounded-full"
          />
        )}
        <span className="text-sm text-gray-500">{post.author.name}</span>
        <span className="text-sm text-gray-400">
          {new Date(post.publishedAt).toLocaleDateString("ja-JP")}
        </span>
      </div>
    </article>
  );
};
```

### インデックスファイルでの集約

```typescript
// filepath: components/blog/index.ts
export { BlogList } from "./blog-list";
export { BlogHeader } from "./blog-header";
export { BlogSearchForm } from "./blog-search-form";
export { BlogPagination } from "./blog-pagination";
export { BlogError } from "./blog-error";
export { BlogCard } from "./blog-card";
export { BlogCardSkeleton } from "./blog-card-skeleton";
```

---

## Dynamic Routes でのデータ渡し

### 動的ルートでのprops処理

```typescript
// filepath: app/blog/[slug]/page.tsx
import * as Blog from "@/components/blog";
import { BlogPost } from "../api/route";

interface BlogDetailPageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const BlogDetailPage = async ({ params }: BlogDetailPageProps) => {
  // 1. 特定の記事データを取得
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/blog/api/${params.slug}`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) {
    throw new Error("記事が見つかりませんでした");
  }

  const result = await response.json();
  const post: BlogPost = result.data;

  // 2. 関連記事データを取得
  const relatedResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/blog/api/related/${params.slug}`,
    { next: { revalidate: 3600 } }
  );

  const relatedPosts: BlogPost[] = relatedResponse.ok
    ? (await relatedResponse.json()).data
    : [];

  // 3. コンポーネントにpropsを渡す
  return (
    <div className="container mx-auto px-4 py-8">
      <Blog.BlogDetailHeader post={post} />
      <Blog.BlogDetailContent
        content={post.content}
        publishedAt={post.publishedAt}
        author={post.author}
      />
      <Blog.BlogRelatedPosts posts={relatedPosts} />
      <Blog.BlogCommentSection postId={post.id} />
    </div>
  );
};

export default BlogDetailPage;
```

---

## Server Actions との連携

### フォーム処理とデータ更新

```typescript
// filepath: app/blog/create/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const CreatePostSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  content: z.string().min(10, "本文は10文字以上で入力してください"),
  tags: z.array(z.string()).optional(),
});

export async function createPost(formData: FormData) {
  try {
    const validatedFields = CreatePostSchema.parse({
      title: formData.get("title"),
      content: formData.get("content"),
      tags: formData.get("tags")?.toString().split(",") || [],
    });

    // データベースに保存
    const newPost = await db.posts.create({
      data: {
        ...validatedFields,
        authorId: "current-user-id", // 実際の認証から取得
      },
    });

    // キャッシュを更新
    revalidatePath("/blog");

    return { success: true, postId: newPost.id };
  } catch (error) {
    return {
      success: false,
      error: "投稿の作成に失敗しました"
    };
  }
}

// filepath: app/blog/create/page.tsx
import * as Blog from "@/components/blog";
import { createPost } from "./actions";

const CreatePostPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Blog.BlogCreateForm
        onSubmit={createPost}
        submitText="投稿を作成"
        cancelHref="/blog"
      />
    </div>
  );
};
```

---

## Client Components でのデータ処理

### useState, useEffect を使用したクライアントサイドデータ処理

```typescript
// filepath: components/blog/blog-interactive-list.tsx
"use client";

import React, { useState, useEffect } from "react";
import { BlogPost } from "@/app/blog/api/route";

interface BlogInteractiveListProps {
  initialPosts: BlogPost[];
  enableSearch?: boolean;
  enablePagination?: boolean;
}

export const BlogInteractiveList: React.FC<BlogInteractiveListProps> = ({
  initialPosts,
  enableSearch = true,
  enablePagination = true,
}) => {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // クライアントサイドでの検索処理
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 追加データの読み込み
  const loadMorePosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/blog/api?page=${currentPage + 1}`);
      const result = await response.json();
      setPosts(prev => [...prev, ...result.data]);
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      console.error("追加データの読み込みに失敗:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {enableSearch && (
        <input
          type="text"
          placeholder="記事を検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
      )}

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {enablePagination && (
        <button
          onClick={loadMorePosts}
          disabled={isLoading}
          className="w-full p-3 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          {isLoading ? "読み込み中..." : "さらに読み込む"}
        </button>
      )}
    </div>
  );
};
```

---

## ベストプラクティス（Supabase統合版）

### 1. データフェッチパターンの選択指針

```typescript
// パターン選択の指針
export const DataFetchPatterns = {
  // 静的データ、頻繁に変更されない → Supabaseクライアント直接
  STATIC_DATA: 'supabase-direct',

  // 複雑なビジネスロジック、外部API統合 → API Routes
  COMPLEX_LOGIC: 'api-routes',

  // フォーム処理、データ更新、認証が必要 → Server Actions
  FORM_ACTIONS: 'server-actions',

  // リアルタイムデータ → Client Component + Supabase購読
  REALTIME: 'client-realtime'
} as const;
```

### 2. エラーハンドリングとキャッシュ戦略

```typescript
// 良い例: エラー状態とキャッシュを考慮したSupabaseクエリ
const fetchBlogPosts = async (searchParams: URLSearchParams) => {
  const supabase = createServerClient();

  try {
    const { data, error, count } = await supabase
      .from('blog_posts')
      .select(`
        *,
        profiles:author_id (
          name,
          avatar_url
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    return { data: data || [], count: count || 0, error: null };
  } catch (error) {
    console.error('Fetch blog posts error:', error);
    return {
      data: [],
      count: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
```

### 3. 型安全性の確保

```typescript
// 良い例: Database型とZodスキーマの組み合わせ
import { BlogPost } from "@/types/database.types";
import { z } from "zod";

// Supabaseの型をベースにしたZodスキーマ
export const BlogPostFormSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  content: z.string().min(10, "本文は10文字以上で入力してください"),
}) satisfies z.ZodType<Pick<BlogPost, 'title' | 'content'>>;
```

### 4. RLS（Row Level Security）を考慮した設計

```sql
-- Supabase RLSポリシーの例
-- ブログ投稿: 公開投稿は全員閲覧可能、編集は作成者のみ
CREATE POLICY "Public blog posts are viewable by everyone" ON blog_posts
  FOR SELECT USING (published_at IS NOT NULL);

CREATE POLICY "Users can insert their own blog posts" ON blog_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own blog posts" ON blog_posts
  FOR UPDATE USING (auth.uid() = author_id);
```

---

## Tips（Supabase統合版）

### データフローの設計指針
1. **認証が不要な読み取り**: Supabaseクライアント直接利用
2. **認証が必要な操作**: Server Actions推奨
3. **複雑な集計・変換**: API Routes経由
4. **リアルタイム更新**: Client Components + Supabase購読

### パフォーマンス向上のポイント
- Supabaseクエリの最適化（必要なカラムのみ選択）
- インデックスの活用
- リアルタイム購読の適切な管理（メモリリーク防止）
- キャッシュ戦略の適用（Next.js cache + Supabase）

### Supabase固有のアドバイス
- RLS（Row Level Security）を適切に設定し、データアクセスを制御しましょう
- Supabaseの型生成機能を活用し、型安全性を確保してください
- リアルタイム機能は必要な場合のみ使用し、購読の解除を忘れないようにしましょう
- Edge Functions（Deno）とServer Actions（Node.js）の使い分けを検討してください
- Supabase Authとの連携では、セッション管理を適切に行いましょう

### 関連するアドバイス
- Supabaseの型生成コマンド（`supabase gen types`）を定期的に実行し、データベーススキーマと型定義を同期させましょう
- リアルタイム購読を使用する場合は、コンポーネントのアンマウント時に必ず購読を解除してメモリリークを防いでください
- Server Actions内での認証チェックは必須です。ユーザーの権限確認を怠らないようにしてください
