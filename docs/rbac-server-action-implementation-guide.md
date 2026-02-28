# RBAC Server Action권한 체크 헬퍼 - 구현 가이드

> **작성일**: 2026-02-28
> **대상**: チケット3: Server Action権限チェックヘルパー関数の実装

---

## 📋 개요

このドキュメントは、実装されたRBAC Server Action権限チェックヘルパー関数（`src/lib/auth/rbac-helper.ts`）の使用方法と、実装例を示しています。

---

## 🎯 主な機能

### 1. Platform Admin チェック

**関数**: `checkPlatformAdmin(session: AuthSession | null): Promise<boolean>`

```typescript
import { checkPlatformAdmin } from "@/lib/auth";

// Server Action内で使用
export const deleteUser = withAuth(async (session, userId: string) => {
  const isAdmin = await checkPlatformAdmin(session);
  if (!isAdmin) {
    throw new Error("Unauthorized: admin only");
  }

  // Admin-only operations
  await db.delete(users).where(eq(users.id, userId));
});
```

### 2. グループロール チェック

**関数**: `checkGroupRole(session: AuthSession | null, groupId: string, role: GroupRole): Promise<boolean>`

```typescript
import { checkGroupRole, withAuth } from "@/lib/auth";

// グループリーダーのみが更新可能
export const updateGroup = withAuth(async (session, groupId: string, data: any) => {
  const isLeader = await checkGroupRole(session, groupId, "leader");
  if (!isLeader) {
    throw new Error("Unauthorized: only group leaders can update");
  }

  // Update group logic
  await db.update(groups).set(data).where(eq(groups.id, groupId));
});
```

### 3. 国ロール チェック

**関数**: `checkNationRole(session: AuthSession | null, nationId: string, role: NationRole): Promise<boolean>`

```typescript
import { checkNationRole, withAuth } from "@/lib/auth";

// 国リーダーのみが国ポリシーを変更可能
export const updateNationPolicy = withAuth(
  async (session, nationId: string, policy: any) => {
    const isLeader = await checkNationRole(session, nationId, "leader");
    if (!isLeader) {
      throw new Error("Unauthorized: only nation leaders can set policy");
    }

    // Update nation policy
    await db
      .update(nations)
      .set({ policy: JSON.stringify(policy) })
      .where(eq(nations.id, nationId));
  },
);
```

### 4. ユーザー間関係 チェック

**関数**: `checkRelationship(session: AuthSession | null, targetUserId: string, relationship: RelationshipType): Promise<boolean>`

```typescript
import { checkRelationship, withAuth } from "@/lib/auth";

// 友達のみが、特定の情報にアクセス可能
export const getPrivateUserInfo = withAuth(async (session, targetUserId: string) => {
  const isFriend = await checkRelationship(session, targetUserId, "friend");
  if (!isFriend) {
    throw new Error("Unauthorized: only friends can access private info");
  }

  // Return private user info
  return await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.id, targetUserId));
});
```

### 5. 複数権限チェック（AND / OR）

**関数**: `checkMultiple(session: AuthSession | null, checks: AuthCheck[]): Promise<AuthCheckResult>`

```typescript
import { checkMultiple, withAuth } from "@/lib/auth";

// グループリーダー OR プラットフォーム管理者
export const manageGroupMembers = withAuth(async (session, groupId: string) => {
  const checks = [
    { type: "platformAdmin" as const },
    {
      type: "groupRole" as const,
      groupId,
      role: "leader" as const,
    },
  ];

  const result = await checkMultiple(session, checks);

  // any=true: 少なくとも1つ権限あり (OR)
  // all=true: すべての権限あり (AND)
  if (!result.any) {
    throw new Error("Unauthorized");
  }

  // Group member management logic
});
```

### 6. withAuth HOF（Higher-Order Function）

**関数**: `withAuth(handler: (session: AuthSession, ...args) => Promise<any>)`

全Server Actionに対する認証チェック:

```typescript
import { withAuth } from "@/lib/auth";

// すべてのServer Actionを認証でラップ
export const anyProtectedAction = withAuth(async (session, param1: string) => {
  // session は必ず存在（null でない）
  console.log("認証済みユーザー:", session.user.email);

  // ビジネスロジックを実装
  return { success: true, userId: session.user.id };
});

// 利用時にセッションを渡す
// (Server Action呼び出し側から)
const result = await anyProtectedAction(currentSession, "param");
```

---

## 🏗️ 実装パターン

### パターン1: 単一権限チェック

```typescript
export const createGroupPost = withAuth(async (session, groupId: string, content: string) => {
  // グループメンバーのみが投稿可能
  const isMember = await checkGroupRole(session, groupId, "member");
  if (!isMember) {
    throw new Error("Unauthorized: must be a group member");
  }

  // Create post
  return await db.insert(groupPosts).values({
    groupId,
    authorId: session.user.id,
    content,
  });
});
```

### パターン2: 多層権限チェック

```typescript
export const deleteGroupPost = withAuth(async (session, postId: string) => {
  // ステップ1: 投稿を取得
  const post = await db
    .select()
    .from(groupPosts)
    .where(eq(groupPosts.id, postId));

  if (!post) throw new Error("Post not found");

  // ステップ2: 削除権限チェック
  // (1) プラットフォーム管理者は全投稿削除可能
  const isAdmin = await checkPlatformAdmin(session);
  if (isAdmin) {
    await deletePost(postId);
    return;
  }

  // (2) グループリーダーは自グループの投稿削除可能
  const isLeader = await checkGroupRole(session, post.groupId, "leader");
  if (isLeader) {
    await deletePost(postId);
    return;
  }

  // (3) 投稿者自身のみ削除可能
  if (post.authorId === session.user.id) {
    await deletePost(postId);
    return;
  }

  // (4) 上記いずれにも該当しない場合は拒否
  throw new Error("Unauthorized: cannot delete this post");
});
```

### パターン3: コンテキスト検証（Deny-by-default）

```typescript
export const transferGroupLeadership = withAuth(
  async (session, groupId: string, newLeaderId: string) => {
    // 入力パラメータの検証（コンテキスト）
    if (!groupId || !newLeaderId) {
      throw new Error("Invalid parameters");
    }

    // 現在のリーダーか確認
    const isCurrentLeader = await checkGroupRole(session, groupId, "leader");
    if (!isCurrentLeader) {
      throw new Error("Unauthorized: only current leaders can transfer");
    }

    // 新しいリーダーがグループメンバーか確認
    const newLeaderExists = await db
      .select()
      .from(groupMembers)
      .where(and(
        eq(groupMembers.groupId, groupId),
        eq(groupMembers.userProfileId, newLeaderId),
      ));

    if (!newLeaderExists) {
      throw new Error("Invalid target: user is not a group member");
    }

    // リーダーシップ移譲
    await db
      .update(groupMembers)
      .set({ role: "member" })
      .where(
        and(
          eq(groupMembers.groupId, groupId),
          eq(groupMembers.userProfileId, session.user.id),
        ),
      );

    await db
      .update(groupMembers)
      .set({ role: "leader" })
      .where(
        and(
          eq(groupMembers.groupId, groupId),
          eq(groupMembers.userProfileId, newLeaderId),
        ),
      );
  },
);
```

---

## 🔐 セキュリティ設計

### Deny-by-default 原則

- **明示的な許可がない限り、すべてをを拒否する**
- デフォルト動作は `false` を返す
- 権限チェックに **失敗した場合は例外をthrow**

```typescript
// 例: チェック失敗時は明示的な例外
const isAuthorized = await checkGroupRole(session, groupId, "leader");
if (!isAuthorized) {
  throw new Error("Unauthorized"); // Deny-by-default
}
```

### 二重防御

1. **UI ガード** (`src/proxy.ts`)
   - ルートレベルの大まかなアクセス制御
   - `/admin` → `platform_admin` のみ

2. **Server Action ガード** (`rbac-helper.ts`)
   - ビジネスロジック内での細かい権限チェック
   - SQLインジェクション対策も含む

```typescript
// UI ガード（Proxy）
if (isAdmin) {
  // `/admin` へのアクセスを許可
} else {
  return redirect("/"); // Deny-by-default
}

// Server Action ガード
const isAdmin = await checkPlatformAdmin(session);
if (!isAdmin) {
  throw new Error("Unauthorized"); // Deny-by-default
}
```

### キャッシング戦略

React `cache()` により、同一リクエスト内での複数DB発行を最適化：

```typescript
// 同一要求内で複数回呼び出しても、DBは1回のみ実行
const check1 = await checkGroupRole(session, groupId, "leader"); // DB発行
const check2 = await checkGroupRole(session, groupId, "leader"); // キャッシュから取得
```

---

## 🧪 テストと検証

### テスト実行

```bash
# rbac-helperのテストを実行
pnpm test src/lib/auth/__tests__/rbac-helper.test.ts

# すべてのテストを実行
pnpm test

# テストUIで対話的に実行
pnpm test:ui
```

### テストカバレッジ

```bash
# テストカバレッジレポート
pnpm test:coverage
```

### 本番環境前のチェックリスト

- [ ] ローカル環境ですべてのテストがパス
- [ ] ESLintエラーがない
- [ ] TypeScriptコンパイラエラーがない
- [ ] 動作確認: `pnpm dev` で実際のアプリケーション動作
- [ ] Better Authスキーマ整合性確認: `pnpm db:auth:check`
- [ ] RLSポリシーが有効（本番DBで）

---

## 📚 関連ドキュメント

- [rbac-server-action-guard.md](../rbac-server-action-guard.md) - 権限チェック仕様
- [rbac-group-nation-separation.md](../rbac-group-nation-separation.md) - 組織・国の分離モデル
- [rbac-route-matrix.md](../rbac-route-matrix.md) - ルート別アクセスマトリクス
- [rbac-helper.ts](../../src/lib/auth/rbac-helper.ts) - 実装ソースコード

---

## 🚨 よくあるエラーと解決方法

### エラー1: `SESSION_REQUIRED`

```
Error: SESSION_REQUIRED: Authentication needed
```

**原因**: セッションが `null` または不完全

**解決**:
```typescript
// 正しい使用方法：Server Actionから呼び出し時にセッションを渡す
const session = await getCurrentSession(); // セッション取得
const result = await protectedAction(session, ...args);

// ❌ 不正：セッションを渡さない
const result = await protectedAction(null, ...args); // SESSION_REQUIRED エラー
```

### エラー2: `Unauthorized: admin only`

```
Error: Unauthorized: admin only
```

**原因**: 管理者権限がない

**解決**:
```typescript
// 権限昇格は `src/scripts/create-admin.ts` を使用
pnpm admin:create

// または Better Auth 管理画面から管理者を設定
```

### エラー3: `Database connection failed`

```
Error: DATABASE_URL is not set
```

**原因**: 環境変数 `DATABASE_URL` が未設定

**解決**:
```bash
# .env.local でDB接続設定
DATABASE_URL="postgres://user:password@localhost:5432/dbname"

# アプリケーション再起動
pnpm dev
```

---

## 💡 Tips & Best Practices

1. **Always validate input parameters** - コンテキストIDの検証は必須
2. **Use withAuth for all protected actions** - すべての保護されたアクションに使用
3. **Log authorization failures** - セキュリティ監査のためログを記録
4. **Test edge cases** - 権限譲渡やロール変更のテスト
5. **Cache results within request** - React `cache()` で最適化
6. **Fail fast, fail loudly** - エラーは可能な限り早期に例外をthrow

---

**GitHub Copilot より**: Server Action権限チェックの実装は、UIガードと組み合わせることで、強固なセキュリティを実現します。Deny-by-defaultの原則を常に念頭に置き、権限がない場合は常に拒否を選択してください。
