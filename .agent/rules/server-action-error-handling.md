# Server Action エラーハンドリング実装ガイド

> **バージョン**: 1.0
> **更新日**: 2026-03-03
> **対象**: Next.js 16+ Server Actions + Better Auth

## 概要

すべての Server Actions は以下の原則に従ってエラーハンドリングを実装する必須です。

- **Deny-by-default**: 認証・認可は明示的に確認
- **構造化ログ**: すべてのエラーは logger で記録
- **セキュリティイベント**: 権限外アクセス等は明示的にマーク
- **ユーザーメッセージ**: エラーメッセージ辞書から取得

---

## 標準テンプレート

### パターン1: 認証不要なアクション

```typescript
"use server";

import { withErrorHandling } from "@/lib/errors";
import { logger } from "@/lib/logger";

/**
 * アクション説明
 *
 * @design
 * - 認証不要
 * - 入力バリデーション: Zod等で実施
 * - エラーハンドリング: withErrorHandling でラップ
 *
 * @security
 * - XSS対策: sanitize入力
 * - SQL インジェクション対策: Drizzle ORM 使用
 */

export async function searchPublicContent(query: string) {
    return withErrorHandling(async () => {
        logger.debug("Searching public content", { query });

        // バリデーション
        if (!query || query.length < 2) {
            throw new ValidationError("検索キーワードは2文字以上必須です");
        }

        // 処理
        const results = await db.query.publicContent.findMany({
            where: sql`LOWER(title) LIKE ${'%' + query.toLowerCase() + '%'}`,
        });

        logger.info("Search completed", { queryLength: query.length, resultCount: results.length });
        return results;
    }, {
        context: { action: "searchPublicContent" }
    });
}
```

---

### パターン2: 認証が必須なアクション

```typescript
"use server";

import { withAuth } from "@/lib/errors";

/**
 * ユーザープロフィール更新
 *
 * @design
 * - 認証必須（withAuth でラップ）
 * - 所有権検証を含む
 * - セキュリティイベント記録
 *
 * @security
 * - セッション検証: Better Auth
 * - 所有権検証: ユーザー本人のプロフィールのみ更新可能
 * - 入力バリデーション: Zod
 */

export async function updateUserProfile(input: UpdateProfileInput) {
    return withAuth(async (session) => {
        logger.debug("Updating profile", {
            userId: session.user.id,
            fields: Object.keys(input),
        });

        // バリデーション
        const validated = updateProfileSchema.safeParse(input);
        if (!validated.success) {
            throw new ValidationError("入力内容に誤りがあります");
        }

        // 処理
        const updated = await db
            .update(userProfiles)
            .set(validated.data)
            .where(eq(userProfiles.userId, session.user.id));

        logger.info("Profile updated successfully", {
            userId: session.user.id,
            timestamp: new Date().toISOString(),
        });

        return updated;
    }, {
        context: { action: "updateUserProfile" }
    });
}
```

---

### パターン3: ロール制御が必須なアクション

```typescript
"use server";

import { withAuth } from "@/lib/errors";

/**
 * グループ削除（管理者のみ）
 *
 * @design
 * - 認証必須 + admin ロール必須
 * - withAuth の requiredRole オプションを使用
 * - セキュリティイベント記録
 *
 * @security
 * - ロール検証: admin ロールの確認
 * - リソース存在確認
 * - セキュリティイベント: 削除操作を記録
 */

export async function deleteGroupForAdmin(groupId: string) {
    return withAuth(async (session) => {
        logger.debug("Deleting group", { groupId, userId: session.user.id });

        // リソース存在確認
        const group = await db.query.groups.findFirst({
            where: eq(groups.id, groupId),
        });

        if (!group) {
            throw new NotFoundError("グループ");
        }

        // 削除実行
        await db.delete(groups).where(eq(groups.id, groupId));

        // セキュリティイベント記録
        logger.info("[SECURITY_EVENT] Group deleted by admin", {
            event: "group_deleted",
            groupId,
            adminId: session.user.id,
            groupName: group.name,
            severity: "medium",
            timestamp: new Date().toISOString(),
        });

        return { deleted: true };
    }, {
        requiredRole: "platform_admin",
        context: { action: "deleteGroupForAdmin", groupId }
    });
}
```

---

### パターン4: リソース所有権検証

```typescript
"use server";

import { withAuth } from "@/lib/errors";

/**
 * ポスト削除（所有者のみ）
 *
 * @design
 * - 認証必須
 * - 所有権検証: `authorId === session.user.id`
 * - セキュリティイベント記録（権限外アクセス試行）
 *
 * @security
 * - セッション検証: Better Auth
 * - 所有権検証: 必須
 * - 権限外アクセス試行: SECURITY イベント
 */

export async function deletePost(postId: string) {
    return withAuth(async (session) => {
        logger.debug("Deleting post", { postId, userId: session.user.id });

        // リソース取得
        const post = await db.query.posts.findFirst({
            where: eq(posts.id, postId),
        });

        if (!post) {
            throw new NotFoundError("ポスト");
        }

        // 所有権検証
        if (post.authorId !== session.user.id) {
            logger.warn("[SECURITY_EVENT] Unauthorized deletion attempt", {
                event: "unauthorized_deletion",
                severity: "high",
                userId: session.user.id,
                resourceId: postId,
                resourceType: "post",
                ownerId: post.authorId,
                timestamp: new Date().toISOString(),
            });

            throw new AuthorizationError(
                "このポストを削除する権限がありません",
                ErrorCodes.AUTHZ_RESOURCE_FORBIDDEN,
                { postId, ownerId: post.authorId }
            );
        }

        // 削除実行
        await db.delete(posts).where(eq(posts.id, postId));

        logger.info("Post deleted", {
            postId,
            userId: session.user.id,
            timestamp: new Date().toISOString(),
        });

        return { deleted: true };
    }, {
        context: { action: "deletePost", postId }
    });
}
```

---

## エラーハンドリングの詳細

### ユーザーメッセージの取得

すべてのエラーハンドリング内で `getUserMessage()` を使用してプレーンテキストメッセージを取得してください。

```typescript
import { getUserMessage, ErrorCodes } from "@/lib/errors";

// エラーハンドリング内
throw new ValidationError(
    getUserMessage(ErrorCodes.VALIDATION_REQUIRED_FIELD),
    { field: "email" }
);
```

### セキュリティイベントの記録

権限外アクセス、認証失敗、不正な操作試行は常に記録する必須です。

```typescript
logger.warn("[SECURITY_EVENT] <イベント説明>", {
    event: "auth_failed | authorization_failed | unauthenticated_access | invalid_operation",
    severity: "low | medium | high | critical",
    userId: session.user.id,
    userEmail: session.user.email,
    requiredRole?: "admin",
    userRole?: "user",
    resourceId?: string,
    action?: "deletePost",
    timestamp: new Date().toISOString(),
});
```

### タイムアウト・リトライの区分

外部サービス（Better Auth 等）との通信でタイムアウト発生時は `ExternalServiceError` で処理：

```typescript
try {
    const result = await externalService.call();
} catch (error) {
    if (error instanceof AbortError || error?.code === "TIMEOUT") {
        throw new ExternalServiceError(
            "ServiceName",
            "処理に時間がかかっています",
            ErrorCodes.EXTERNAL_TIMEOUT,
            { originalError: error.message }
        );
    }

    throw new ExternalServiceError(
        "ServiceName",
        "サービスとの連携に失敗しました",
        ErrorCodes.EXTERNAL_API_ERROR,
        { originalError: error.message }
    );
}
```

---

## ログレベルの使い分け

| レベル | 用途 | 例 |
|--------|------|-----|
| `debug` | 開発デバッグ情報 | 関数の入出力、パラメータ値 |
| `info` | 正常な処理の進行 | アクション完了、リソース作成 |
| `warn` | 異常だが処理可能 | セッション有効期限切れ、バリデーション失敗 |
| `error` | エラーが発生（処理継続） | API エラー（リトライ可能）、DB接続失敗但し自動リカバリ |
| `fatal` | 致命的エラー（処理停止） | シークレット未設定、プロセスのクラッシュ |

---

## チェックリスト

すべての Server Action 実装で以下を確認してください：

- [ ] `"use server"` で宣言
- [ ] 認証・認可が `withAuth` / `withErrorHandling` でラップ
- [ ] エラーは `logger` で記録（`console.error` は使用禁止）
- [ ] セキュリティイベント（権限外アクセス等）は明示的に記録
- [ ] エラーメッセージは `getUserMessage()` で辞書から取得
- [ ] バリデーションエラーは `ValidationError` クラスで発生
- [ ] 外部サービス通信はタイムアウト・リトライを区分
- [ ] リソース所有権検証を含む場合は確実に実装

---

## 参考リンク

- エラークラス定義: [`src/lib/errors/app-error.ts`](src/lib/errors/app-error.ts)
- エラーメッセージ辞書: [`src/lib/errors/messages.ts`](src/lib/errors/messages.ts)
- Server Action ラッパー: [`src/lib/errors/server-action-handler.ts`](src/lib/errors/server-action-handler.ts)
- ロギング: [`src/lib/logger/logger.ts`](src/lib/logger/logger.ts)
- RBAC ヘルパー: [`src/lib/auth/rbac-helper.ts`](src/lib/auth/rbac-helper.ts)
