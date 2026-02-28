# Server Action 権限チェック仕様

> **作成日**: 2026-02-28
> **目的**: Server Actionでの4層権限評価ロジックとヘルパー関数の仕様を定義する

---

## 📋 概要

このドキュメントは、**Server Actionにおける権限チェックの統一仕様**を定義します。すべてのServer Actionは、この4層評価ロジックに基づいて権限をチェックする必要があります。

---

## 🛡️ 4層評価の原則

### 評価順序（上位層が優先）

1. **プラットフォーム管理権限（Platform Admin）**: `platform_admin` ロールは**すべてのリソースにアクセス可能**
2. **コンテキストロール（Context Role）**: 所属する組織/国内での役割（`group_leader`, `nation_leader` など）
3. **関係性権限（Relationship）**: ユーザー間の関係性（`friend`, `partner` など）に基づくアクセス権
4. **既定の拒否（Deny-by-default）**: 上記のいずれにも該当しない場合はアクセス拒否

### 評価フロー図

```
┌─────────────────────────────────────┐
│ Server Action 実行開始              │
└───────────┬─────────────────────────┘
            │
            ▼
┌─────────────────────────────────────┐
│ 1. セッション取得                   │
│    await getSession()               │
└───────────┬─────────────────────────┘
            │
            ▼
       ┌────────────┐
       │ 認証済み？ │
       └────┬───┬───┘
            │   │
         NO │   │ YES
            │   │
            ▼   ▼
         [拒否] ┌──────────────────────┐
                │ 2. Platform Admin?   │
                │    role = platform_  │
                │    admin             │
                └────┬───┬─────────────┘
                     │   │
                  YES│   │NO
                     │   │
                     ▼   ▼
                [許可] ┌──────────────────────┐
                       │ 3. Context Role?     │
                       │    checkGroupRole()  │
                       │    checkNationRole() │
                       └────┬───┬─────────────┘
                            │   │
                         YES│   │NO
                            │   │
                            ▼   ▼
                       [許可] ┌──────────────────────┐
                              │ 4. Relationship?     │
                              │    checkRelationship │
                              └────┬───┬─────────────┘
                                   │   │
                                YES│   │NO
                                   │   │
                                   ▼   ▼
                              [許可][拒否]
```

---

## 🔑 Deny-by-defaultの原則

### 原則

- **すべての権限チェックは「明示的に許可されない限り拒否」が基本**
- Server Actionの冒頭で必ず権限チェックを実行
- UIガード（Proxy）とServer Actionガードの**両方を実装**（二重防御）

### 実装例

```typescript
"use server";

import { getSession } from "@/lib/auth/helper";

export async function sensitiveAction() {
  const session = await getSession();

  // ❌ BAD: セッションがnullの場合、undefinedを返す
  if (!session) {
    return undefined; // これはNG！エラーをthrowすべき
  }

  // ✅ GOOD: セッションがnullの場合、エラーをthrow
  if (!session) {
    throw new Error("Unauthorized: Not authenticated");
  }

  // ... 以降の処理
}
```

---

## 🧩 コンテキスト検証の必要性

### コンテキストとは？

- **組織コンテキスト**: リソースがどの組織に属するか
- **国コンテキスト**: リソースがどの国に属するか
- **所有者コンテキスト**: リソースの所有者は誰か

### なぜコンテキスト検証が必要か？

例: 組織Aのリーダーが組織Bのリソースにアクセスしようとする場合

```typescript
// ❌ BAD: ロールだけチェック（どの組織のリーダーかを検証していない）
export async function updateGroupPolicy(groupId: string, policy: object) {
  const session = await getSession();

  if (session.user.role !== "group_leader") {
    throw new Error("Forbidden: Not a group leader");
  }

  // これでは、組織Aのリーダーが組織Bのポリシーを変更できてしまう！
  return db.groups.update({ id: groupId, policy });
}

// ✅ GOOD: コンテキストを検証（この組織のリーダーかをチェック）
export async function updateGroupPolicy(groupId: string, policy: object) {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized: Not authenticated");
  }

  // プラットフォーム管理者はすべて許可
  if (session.user.role === "platform_admin") {
    return db.groups.update({ id: groupId, policy });
  }

  // コンテキスト検証: この組織のリーダーか？
  const isLeader = await checkGroupRole(session, groupId, "group_leader");
  if (!isLeader) {
    throw new Error("Forbidden: You are not the leader of this group");
  }

  return db.groups.update({ id: groupId, policy });
}
```

---

## 🛠️ ヘルパー関数のシグネチャ定義

### ファイル構成

- **定義先**: `src/lib/auth/helper.ts`
- **テスト**: `src/lib/auth/__tests__/helper.test.ts`（システムテスト）
- **再エクスポート**: `src/lib/auth/index.ts`

### 1. `checkPlatformAdmin`

プラットフォーム管理者かどうかをチェックします。

```typescript
/**
 * プラットフォーム管理者かどうかをチェック
 *
 * @param session - セッション情報
 * @returns プラットフォーム管理者の場合は true
 *
 * @example
 * const session = await getSession();
 * if (checkPlatformAdmin(session)) {
 *   // プラットフォーム管理者のみ実行可能な処理
 * }
 */
export function checkPlatformAdmin(session: Session | null): boolean {
  return session?.user?.role === "platform_admin";
}
```

### 2. `checkGroupRole`

指定された組織でのロールをチェックします。

```typescript
/**
 * 指定された組織でのロールをチェック
 *
 * @param session - セッション情報
 * @param groupId - 組織ID
 * @param role - 期待されるロール（`group_leader`, `group_member` など）
 * @returns 指定されたロールを持つ場合は true
 *
 * @description
 * - DBクエリで `group_members` テーブルを検索
 * - `user_id`, `group_id`, `role` の3つの条件でマッチング
 * - キャッシュ戦略: React `cache()` で同一リクエスト内はキャッシュ
 *
 * @example
 * const isLeader = await checkGroupRole(session, "group-123", "group_leader");
 * if (!isLeader) {
 *   throw new Error("Forbidden: You are not the leader of this group");
 * }
 */
export async function checkGroupRole(
  session: Session | null,
  groupId: string,
  role: RoleType
): Promise<boolean> {
  if (!session) return false;

  // プラットフォーム管理者は常に許可
  if (checkPlatformAdmin(session)) return true;

  // DBクエリで組織メンバーシップをチェック
  const membership = await db.query.groupMembers.findFirst({
    where: and(
      eq(groupMembers.userId, session.user.id),
      eq(groupMembers.groupId, groupId),
      eq(groupMembers.role, role)
    ),
  });

  return !!membership;
}
```

### 3. `checkNationRole`

指定された国でのロールをチェックします。

```typescript
/**
 * 指定された国でのロールをチェック
 *
 * @param session - セッション情報
 * @param nationId - 国ID
 * @param role - 期待されるロール（`nation_leader`, `nation_member` など）
 * @returns 指定されたロールを持つ場合は true
 *
 * @description
 * - DBクエリで `nation_members` テーブルを検索
 * - キャッシュ戦略: React `cache()` で同一リクエスト内はキャッシュ
 *
 * @example
 * const isNationLeader = await checkNationRole(session, "nation-456", "nation_leader");
 * if (!isNationLeader) {
 *   throw new Error("Forbidden: You are not the leader of this nation");
 * }
 */
export async function checkNationRole(
  session: Session | null,
  nationId: string,
  role: RoleType
): Promise<boolean> {
  if (!session) return false;

  // プラットフォーム管理者は常に許可
  if (checkPlatformAdmin(session)) return true;

  // DBクエリで国メンバーシップをチェック
  const membership = await db.query.nationMembers.findFirst({
    where: and(
      eq(nationMembers.groupId, session.user.groupId), // 注: nationはgroupの集合
      eq(nationMembers.nationId, nationId),
      eq(nationMembers.role, role)
    ),
  });

  return !!membership;
}
```

### 4. `checkRelationship`

ユーザー間の関係性をチェックします。

```typescript
/**
 * ユーザー間の関係性をチェック
 *
 * @param session - セッション情報
 * @param targetUserId - 対象ユーザーID
 * @param relationship - 期待される関係性（`friend`, `partner` など）
 * @returns 指定された関係性を持つ場合は true
 *
 * @description
 * - DBクエリで `relationships` テーブルを検索
 * - 関係性は双方向（AからB、BからA）の両方をチェック
 * - キャッシュ戦略: React `cache()` で同一リクエスト内はキャッシュ
 *
 * @example
 * const isFriend = await checkRelationship(session, "user-789", "friend");
 * if (!isFriend) {
 *   throw new Error("Forbidden: This content is only visible to friends");
 * }
 */
export async function checkRelationship(
  session: Session | null,
  targetUserId: string,
  relationship: RelationshipType
): Promise<boolean> {
  if (!session) return false;

  // プラットフォーム管理者は常に許可
  if (checkPlatformAdmin(session)) return true;

  // 自分自身へのアクセスは常に許可
  if (session.user.id === targetUserId) return true;

  // DBクエリで関係性をチェック（双方向）
  const rel = await db.query.relationships.findFirst({
    where: or(
      and(
        eq(relationships.userId, session.user.id),
        eq(relationships.targetUserId, targetUserId),
        eq(relationships.type, relationship)
      ),
      and(
        eq(relationships.userId, targetUserId),
        eq(relationships.targetUserId, session.user.id),
        eq(relationships.type, relationship)
      )
    ),
  });

  return !!rel;
}
```

### 5. `withAuth` (Higher-Order Function)

Server Actionを認証でラップするHOF（高階関数）です。

```typescript
/**
 * Server Actionを認証でラップするHOF
 *
 * @param handler - Server Action関数
 * @returns 認証チェック付きのServer Action
 *
 * @description
 * Server Actionの冒頭で認証チェックを自動的に実行します。
 * セッションがない場合はエラーをthrowします。
 *
 * @example
 * export const updateProfile = withAuth(async (session, data) => {
 *   // sessionは必ず存在する（型安全）
 *   return db.users.update({ id: session.user.id, ...data });
 * });
 */
export function withAuth<T extends unknown[], R>(
  handler: (session: Session, ...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    const session = await getSession();

    if (!session) {
      throw new Error("Unauthorized: Not authenticated");
    }

    return handler(session, ...args);
  };
}
```

---

## 🗂️ DBスキーマとの関連

### 必要なテーブル

1. **`group_members`**: 組織メンバーシップ
   - `user_id`, `group_id`, `role`, `joined_at`
2. **`nation_members`**: 国メンバーシップ
   - `group_id`, `nation_id`, `role`, `joined_at`
3. **`relationships`**: ユーザー間の関係性
   - `user_id`, `target_user_id`, `type`, `created_at`

### RLSポリシーとの統合

- RLSポリシーはPostgreSQLレベルでの防御
- Server Actionヘルパー関数はアプリケーションレベルでの防御
- **両方を実装することで多層防御を実現**

---

## 🔧 実装方針

### DBクエリ戦略

- **Drizzle ORM**を使用してクエリを実行
- `findFirst()` でメンバーシップをチェック（存在チェックのみ）
- `eq()`, `and()`, `or()` を活用して条件を組み立てる

### キャッシュ戦略

- **React `cache()`** を使用して同一リクエスト内はキャッシュ
- ヘルパー関数を `cache()` でラップ
- 同一リクエスト内で複数回呼び出されても、DB問い合わせは1回のみ

```typescript
import { cache } from "react";

export const checkGroupRole = cache(async (
  session: Session | null,
  groupId: string,
  role: RoleType
): Promise<boolean> => {
  // ... 実装
});
```

---

## 🌍 環境変数の確認

### Better Auth必須変数

以下の環境変数が `.env.local` に設定されていることを確認してください：

```bash
# Better Auth必須変数
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth関連
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# データベース
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

### 確認コマンド

```bash
# Better Auth スキーマ整合性確認
pnpm db:auth:check

# 不整合がある場合は修復
pnpm db:auth:fix-compat
```

---

## 🧪 テストケース例

### 4層評価のテスト

```typescript
import { describe, it, expect } from "vitest";
import { checkGroupRole } from "@/lib/auth/helper";

describe("checkGroupRole", () => {
  it("プラットフォーム管理者は常に許可", async () => {
    const session = {
      user: { id: "user-1", role: "platform_admin" },
    };

    const result = await checkGroupRole(session, "group-999", "group_leader");
    expect(result).toBe(true);
  });

  it("組織リーダーは自分の組織のみ許可", async () => {
    const session = {
      user: { id: "user-2", role: "group_leader" },
    };

    const resultOwn = await checkGroupRole(session, "group-1", "group_leader");
    expect(resultOwn).toBe(true);

    const resultOther = await checkGroupRole(session, "group-2", "group_leader");
    expect(resultOther).toBe(false);
  });

  it("一般メンバーはリーダー権限を持たない", async () => {
    const session = {
      user: { id: "user-3", role: "member" },
    };

    const result = await checkGroupRole(session, "group-1", "group_leader");
    expect(result).toBe(false);
  });
});
```

---

## 📚 関連ドキュメント

- [ルート・アクセスマトリクス](./rbac-route-matrix.md)（TODO#2で作成済み）
- [組織/国分離モデル](./rbac-group-nation-separation.md)（TODO#4で作成予定）
- [RBACテスト仕様](./test-specs/rbac-test-spec.md)（TODO#7で作成予定）
- [RoleType/RelationshipType型定義](../src/lib/auth/auth-types.ts)

---

## 💡 Tips

### Server Actionの冒頭で必ず認証チェック

```typescript
"use server";

export async function anyAction() {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized: Not authenticated");
  }

  // ... 以降の処理
}
```

### エラーメッセージは具体的に

```typescript
// ❌ BAD: エラーメッセージが曖昧
throw new Error("Access denied");

// ✅ GOOD: エラーメッセージが具体的
throw new Error("Forbidden: You are not the leader of this group");
```

### プラットフォーム管理者のチェックは最優先

```typescript
// プラットフォーム管理者は常に最初にチェック
if (checkPlatformAdmin(session)) {
  return true; // すぐに許可
}

// その後、コンテキストロール・関係性をチェック
```

---

**GitHub Copilot より**: Server Actionでの権限チェックは、「認証（Authentication）→ 認可（Authorization）→ コンテキスト検証」の順序で実施します。この順序を守ることで、セキュリティホールを防ぎ、パフォーマンスも向上します。
